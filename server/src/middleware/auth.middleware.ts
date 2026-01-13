import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import redis from "../configs/redis.config.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.util.js";
import { getStore } from "../models/store.model.js";
import { getUserById } from "../models/user.model.js";
import { validate as isValidUUID } from "uuid";

// AUTHRORIZE USER
export const authorizeUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { access_token: accessToken, refresh_token: refreshToken } =
      req.cookies;

    if (accessToken) {
      let decodedAccessToken: JwtPayload;

      try {
        decodedAccessToken = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET!
        ) as JwtPayload;
      } catch (err) {
        return next(new ApiError(401, "UNAUTHORIZED", "Unauthorized!"));
      }

      if (decodedAccessToken) {
        req.user = { id: decodedAccessToken.userId };
        return next();
      }
    }

    if (!refreshToken)
      return next(new ApiError(401, "UNAUTHORIZED", "Unauthorized!"));

    let decodedRefreshToken: JwtPayload;

    try {
      decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as JwtPayload;
    } catch (err) {
      return next(new ApiError(401, "UNAUTHORIZED", "Unauthorized!"));
    }

    const sessionId = `session:${decodedRefreshToken.userId}:${req.headers["user-agent"]}`;

    const session = await redis.get(sessionId);
    if (!session)
      return next(new ApiError(401, "UNAUTHORIZED", "Unauthorized!"));

    const sessionData = JSON.parse(session);

    const newAccessToken = generateAccessToken({ userId: sessionData.userId });
    const newRefreshToken = generateRefreshToken({
      userId: sessionData.userId,
    });

    await redis.set(
      sessionId,
      JSON.stringify({ userId: sessionData.userId }),
      "EX",
      Number(process.env.REFRESH_TOKEN_EXP!) * 60 * 60 * 24
    );

    req.user = sessionData;
    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: Number(process.env.REFRESH_TOKEN_EXP!) * 24 * 60 * 60 * 1000,
    });
    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: Number(process.env.ACCESS_TOKEN_EXP!) * 60 * 1000,
    });
    return next();
  }
);

// AUTHRORIZE STORE
export const authorizeStoreOwner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { storeId } = req.params;

    if (!user) return next(new ApiError(401, "UNAUTHORIZED", "Unauthorized!"));

    if (!storeId || !isValidUUID(storeId))
      return next(new ApiError(400, "INVALID_DATA", "Invalid store id!"));

    // check if store exists
    const store = await getStore(storeId);
    if (!store) return next(new ApiError(404, "NOT_FOUND", "Store not found!"));

    // check if user is the store owner
    if (store.user_id !== user.id) {
      const dbUser = await getUserById(user.id as string);
      if (!dbUser)
        return next(new ApiError(404, "NOT_FOUND", "User not found!"));

      // check if user is admin
      const isAdmin = dbUser.role === "ADMIN";
      if (!isAdmin)
        return next(
          new ApiError(
            403,
            "FORBIDDEN",
            "You are not the store owner nor admin!"
          )
        );
    }

    req.store = store;

    return next();
  }
);

// AUTHRORIZE ADMIN
export const authorizeAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return next(new ApiError(401, "UNAUTHORIZED", "Unauthorized!"));

    const dbUser = await getUserById(user.id as string);
    if (!dbUser) return next(new ApiError(404, "NOT_FOUND", "User not found!"));

    if (dbUser.role !== "ADMIN")
      return next(new ApiError(403, "FORBIDDEN", "You are not an admin!"));

    req.user = dbUser;
    return next();
  }
);
