import { config } from "dotenv";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { generateOTP } from "../utils/otp.util.js";
import { v4, validate as isValidUUID } from "uuid";
import redis from "../configs/redis.config.js";
import sendOTP from "../utils/send-otp.js";
import bcrypt from "bcrypt";
import {
  createUser,
  getUserById,
  getUserByPhone,
} from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.util.js";
import { APIResponse } from "../utils/api-response.util.js";
import { User } from "../generated/prisma/client.js";
import z from "zod";
import { otpFormSchema } from "../schemas/auth.schema.js";

config();

// GET OTP
export const getOTP = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone } = req.body;
    if (!phone)
      return next(
        new ApiError(400, "INVALID_DATA", "Phone number is required"),
      );

    const OTP_TTL = 5 * 60; // seconds
    const OTP_ATTEMPTS = 5;
    const RESEND_WINDOW_SEC = 3600; // 1 hour
    const RESEND_LIMIT_PER_HOUR = 50;
    const RESEND_WAIT_SEC = 30;

    // rate limit ( 5 resends per hour )
    const phoneReqKey = `otp:requests:${phone}:${Math.floor(
      Date.now() / (RESEND_WINDOW_SEC * 1000),
    )}`;
    const reqCount = await redis.incr(phoneReqKey);
    if (reqCount === 1) await redis.expire(phoneReqKey, RESEND_WINDOW_SEC);
    if (reqCount > RESEND_LIMIT_PER_HOUR)
      return next(
        new ApiError(
          400,
          "OTP_LIMIT_EXCEEDED",
          "OTP limit exceeded try after 1 hour!",
        ),
      );

    // limit resend (30 sec wait)
    const lastSendKey = `otp:lastsend:${phone}`;
    const last = await redis.get(lastSendKey);
    if (last && Date.now() - Number(last) < RESEND_WAIT_SEC * 1000)
      return next(
        new ApiError(
          400,
          "OTP_RESEND_TOO_SOON",
          "Wait for 30 seconds before resending!",
        ),
      );

    // Generate and store
    const sessionId = v4();
    const OTP = generateOTP(4);
    const otpHash = await bcrypt.hash(OTP, 8);
    const otpKey = `otp:pending:${sessionId}:${phone}`;
    const now = Date.now();
    const resend_at = now + RESEND_WAIT_SEC * 1000;

    // TODO: send otp
    console.log(OTP);
    console.log(Math.ceil((resend_at - Date.now()) / 1000));
    // ==============

    await redis
      .multi()
      .hmset(otpKey, {
        phone,
        otp_hash: otpHash,
        attempts_left: OTP_ATTEMPTS,
        resend_at: resend_at,
        created_at: Date.now(),
      })
      .expire(otpKey, OTP_TTL)
      .set(lastSendKey, Date.now(), "EX", RESEND_WAIT_SEC) // prevents resend for 30s
      .exec();

    return res.status(200).json(
      new APIResponse("SUCCESS", "OTP sent!", {
        session_id: sessionId,
        phone,
      }),
    );
  },
);

// VERIFY OTP + AUTHENTICATION
export const verifyOTP = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { OTP, phone, session_id } = req.body as z.infer<
      typeof otpFormSchema
    >;

    if (!phone || !OTP || !session_id)
      return next(
        new ApiError(
          400,
          "INVALID_DATA",
          "Phone & OTP & Session ID are required!",
        ),
      );

    const otpKey = `otp:pending:${session_id}:${phone}`;

    const data = await redis.hgetall(otpKey);
    if (!data || !data.otp_hash)
      return next(
        new ApiError(
          400,
          "INVALID_DATA",
          "OTP is either expired or not assigned!",
        ),
      );

    if (Number(data.attempts_left) <= 0) {
      await redis.del(otpKey);
      return next(
        new ApiError(
          400,
          "REACHED_OTP_ATTEMPTS_LIMIT",
          "Max attempts reached. Try resend OTP!",
        ),
      );
    }

    const isValidOTP = await bcrypt.compare(OTP, data.otp_hash);
    if (!isValidOTP) {
      await redis.hincrby(otpKey, "attempts_left", -1);
      return next(new ApiError(400, "INVALID_OTP", "Invalid OTP!"));
    }

    await redis.del(otpKey);

    // authentication
    const user = await getUserByPhone(phone as string);
    if (user) {
      const accessToken = generateAccessToken({ userId: user.id });
      const refreshToken = generateRefreshToken({ userId: user.id });

      const sessionId = `session:${user.id}:${req.headers["user-agent"]}`;

      await redis.set(
        sessionId,
        JSON.stringify({ userId: user.id }),
        "EX",
        Number(process.env.REFRESH_TOKEN_EXP!) * 60 * 60 * 24,
      );

      return res
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          // sameSite: process.env.NODE_ENV === "production" ? "none" : undefined,
          maxAge: Number(process.env.REFRESH_TOKEN_EXP!) * 24 * 60 * 60 * 1000,
        })
        .cookie("access_token", accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          // sameSite: process.env.NODE_ENV === "production" ? "none" : undefined,
          maxAge: Number(process.env.ACCESS_TOKEN_EXP!) * 60 * 1000,
        })
        .json(
          new APIResponse("SUCCESS", "You are authenticated successfully!", {
            user,
            access_token: accessToken,
            refresh_token: refreshToken,
          }),
        );
    }

    const id = v4();
    const sessionId = `session:${id}:${req.headers["user-agent"]}`;
    const accessToken = generateAccessToken({ userId: id });
    const refreshToken = generateRefreshToken({ userId: id });

    const newUserData: User = {
      id,
      phone: String(phone),
      email: null,
      role: "CUSTOMER",
      status: "ACTIVE",
      created_at: new Date(),
      updated_at: new Date(),
    };

    const newUser = await createUser(newUserData);

    await redis.set(
      sessionId,
      JSON.stringify({ userId: newUser.id }),
      "EX",
      Number(process.env.REFRESH_TOKEN_EXP!) * 24 * 60 * 60,
    );

    return res
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        // sameSite: process.env.NODE_ENV === "production" ? "none" : undefined,
        maxAge: Number(process.env.REFRESH_TOKEN_EXP!) * 24 * 60 * 60 * 1000,
      })
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        // sameSite: process.env.NODE_ENV === "production" ? "none" : undefined,
        maxAge: Number(process.env.ACCESS_TOKEN_EXP!) * 60 * 1000,
      })
      .json(
        new APIResponse("SUCCESS", "You are authenticated successfully!", {user: newUser, access_token: accessToken, refresh_token: refreshToken}),
      );
  },
);

// GET OTP STATUS
export const getOTPStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { session_id, phone } = req.query;

    if (!session_id || !phone)
      return next(
        new ApiError(400, "INVALID_DATA", "Session ID & Phone are required!"),
      );

    if (isValidUUID(session_id) === false)
      return next(
        new ApiError(400, "INVALID_SESSION_ID", "Session ID is invalid!"),
      );

    if (/^[6-9]\d{9}$/.test(phone as string) === false)
      return next(
        new ApiError(400, "INVALID_PHONE", "Phone number is invalid!"),
      );

    const otpKey = `otp:pending:${session_id}:${phone}`;

    const data = await redis.hgetall(otpKey);

    if (!data || !data.otp_hash)
      return next(
        new ApiError(
          400,
          "INVALID_DATA",
          "OTP is either expired or not assigned!",
        ),
      );

    const timeLeft = data.resend_at
      ? Math.max(Math.ceil((Number(data.resend_at) - Date.now()) / 1000), 0)
      : 0;

    return res.status(200).json(
      new APIResponse("SUCCESS", "OTP status fetched successfully!", {
        session_id,
        phone: data.phone,
        attempts_left: data.attempts_left,
        resend_at: data.resend_at,
        time_left: timeLeft,
        created_at: data.created_at,
      }),
    );
  },
);

// LOG OUT
export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return next(new ApiError(401, "UNAUTHORIZED", "Unauthorized!"));

    const sessionId = `session:${user.id}:${req.headers["user-agent"]}`;

    await redis.del(sessionId);

    return res
      .clearCookie("refresh_token")
      .clearCookie("access_token")
      .json(new APIResponse("SUCCESS", "You are logged out successfully!"));
  },
);

// GET AUTH USER
export const getAuthUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return next(new ApiError(401, "UNAUTHORIZED", "Unauthorized!"));

    const dbUser = await getUserById(user.id as string);
    if (!dbUser) return next(new ApiError(404, "NOT_FOUND", "User not found!"));

    return res.status(200).json(
      new APIResponse("SUCCESS", "Auth user fetched successfully!", {
        user: dbUser,
      }),
    );
  },
);
