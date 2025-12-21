import { config } from "dotenv";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/async-handler.ts";
import { ApiError } from "../utils/api-error.ts";
import { generateOTP } from "../utils/otp.util.ts";
import { v4, validate as isValidUUID } from "uuid";
import redis from "../configs/redis.config.ts";
import sendOTP from "../utils/send-otp.ts";
import bcrypt from "bcrypt";
import { createUser, getUserByPhone } from "../models/user.model.ts";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.util.ts";
import { APIResponse } from "../utils/api-response.util.ts";
import { User } from "../generated/prisma/client.ts";
import z from "zod";
import { otpFormSchema } from "../schemas/auth.schema.ts";

config();

// GET OTP
export const getOTP = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone } = req.body;
    if (!phone)
      return next(
        new ApiError(400, "INVALID_DATA", "Phone number is required")
      );

    const OTP_TTL = 5 * 60; // seconds
    const OTP_ATTEMPTS = 5;
    const RESEND_WINDOW_SEC = 3600; // 1 hour
    const RESEND_LIMIT_PER_HOUR = 5;
    const RESEND_WAIT_SEC = 60;

    // rate limit ( 5 resends per hour )
    const phoneReqKey = `otp:requests:${phone}:${Math.floor(
      Date.now() / (RESEND_WINDOW_SEC * 1000)
    )}`;
    const reqCount = await redis.incr(phoneReqKey);
    if (reqCount === 1) await redis.expire(phoneReqKey, RESEND_WINDOW_SEC);
    if (reqCount > RESEND_LIMIT_PER_HOUR)
      return next(
        new ApiError(
          400,
          "OTP_LIMIT_EXCEEDED",
          "OTP limit exceeded try after 1 hour!"
        )
      );

    // limit resend (30 sec wait)
    const lastSendKey = `otp:lastsend:${phone}`;
    const last = await redis.get(lastSendKey);
    if (last && Date.now() - Number(last) < RESEND_WAIT_SEC * 1000)
      return next(
        new ApiError(
          400,
          "OTP_RESEND_TOO_SOON",
          "Wait for 30 seconds before resending!"
        )
      );

    // Generate and store
    const sessionId = v4();
    const OTP = generateOTP(6);
    const otpHash = await bcrypt.hash(OTP, 8);
    const otpKey = `otp:pending:${sessionId}:${phone}`;

    // TODO: send otp
    console.log(OTP);
    // ==============

    await redis
      .multi()
      .hmset(otpKey, {
        phone,
        otp_hash: otpHash,
        attempts_left: OTP_ATTEMPTS,
        resend_at: Date.now() + RESEND_WAIT_SEC * 1000,
        created_at: Date.now(),
      })
      .expire(otpKey, OTP_TTL)
      .set(lastSendKey, Date.now(), "EX", RESEND_WAIT_SEC) // prevents resend for 30s
      .exec();

    return res.status(200).json(
      new APIResponse("SUCCESS", "OTP sent!", {
        session_id: sessionId,
        phone,
      })
    );
  }
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
          "Phone & OTP & Session ID are required!"
        )
      );

    const otpKey = `otp:pending:${session_id}:${phone}`;

    const data = await redis.hgetall(otpKey);
    if (!data || !data.otp_hash)
      return next(
        new ApiError(
          400,
          "INVALID_DATA",
          "OTP is either expired or not assigned!"
        )
      );

    if (Number(data.attempts_left) <= 0) {
      await redis.del(otpKey);
      return next(
        new ApiError(
          400,
          "REACHED_OTP_ATTEMPTS_LIMIT",
          "Max attempts reached. Try resend OTP!"
        )
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
        Number(process.env.REFRESH_TOKEN_EXP!) * 60 * 60 * 24
      );

      return res
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: false,
          // secure: true,
          // sameSite: "none",
          maxAge: Number(process.env.REFRESH_TOKEN_EXP!) * 24 * 60 * 60 * 1000,
        })
        .cookie("access_token", accessToken, {
          httpOnly: true,
          secure: false,
          // secure: true,
          // sameSite: "none",
          maxAge: Number(process.env.ACCESS_TOKEN_EXP!) * 60 * 1000,
        })
        .json(
          new APIResponse(
            "SUCCESS",
            "You are authenticated successfully!",
            user
          )
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
      Number(process.env.REFRESH_TOKEN_EXP!) * 24 * 60 * 60
    );

    return res
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: Number(process.env.REFRESH_TOKEN_EXP!) * 24 * 60 * 60 * 1000,
      })
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: Number(process.env.ACCESS_TOKEN_EXP!) * 60 * 1000,
      })
      .json(
        new APIResponse("SUCCESS", "You are authenticated successfully!", user)
      );
  }
);

// GET OTP STATUS
export const getOTPStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { session_id, phone } = req.query;

    if (!session_id || !phone)
      return next(
        new ApiError(400, "INVALID_DATA", "Session ID & Phone are required!")
      );

    if (isValidUUID(session_id) === false)
      return next(
        new ApiError(400, "INVALID_SESSION_ID", "Session ID is invalid!")
      );

    if (/^[6-9]\d{9}$/.test(phone as string) === false)
      return next(
        new ApiError(400, "INVALID_PHONE", "Phone number is invalid!")
      );

    const otpKey = `otp:pending:${session_id}:${phone}`;

    const data = await redis.hgetall(otpKey);

    if (!data || !data.otp_hash)
      return next(
        new ApiError(
          400,
          "INVALID_DATA",
          "OTP is either expired or not assigned!"
        )
      );

    return res.status(200).json(
      new APIResponse("SUCCESS", "OTP status fetched successfully!", {
        session_id,
        phone: data.phone,
        attempts_left: data.attempts_left,
        resend_at: data.resend_at,
        created_at: data.created_at,
      })
    );
  }
);
