import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/async-handler.ts";
import { ApiError } from "../utils/api-error.ts";
import jwt, { JwtPayload } from "jsonwebtoken";
import redis from "../configs/redis.config.ts";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.util.ts";
import { getStore } from "../models/store.model.ts";
import { Store } from "../generated/prisma/client.ts";
import { getUserById } from "../models/user.model.ts";
import { validate as isValidUUID } from "uuid";

// AUTHRORIZE USER
export const authorizeUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.cookies;

    if (accessToken) {
      const isValidAccessToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as JwtPayload;
      if (isValidAccessToken) {
        const decodedAccessToken = jwt.decode(accessToken) as JwtPayload;
        req.user = { id: decodedAccessToken.userId };
        return next();
      }
    }

    if (!refreshToken)
      return next(new ApiError(401, "UNAUTHORIZED", "Unauthorized!"));

    const isValidRefreshToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayload;

    if (!isValidRefreshToken)
      return next(new ApiError(401, "UNAUTHORIZED", "Unauthorized!"));

    const decodedRefreshToken = jwt.decode(refreshToken) as JwtPayload;

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
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: Number(process.env.REFRESH_TOKEN_EXP!) * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: Number(process.env.ACCESS_TOKEN_EXP!) * 60 * 1000,
    });
    return next();
  }
);

// AUTHRORIZE STORE
export const authorizeStoreOwner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { id: storeId } = req.params;

    if (!user) return next(new ApiError(401, "UNAUTHORIZED", "Unauthorized!"));

    if (!storeId || !isValidUUID(storeId))
      return next(new ApiError(400, "INVALID_DATA", "Invalid store id!"));

    const store = await getStore(storeId);
    if (!store) return next(new ApiError(404, "NOT_FOUND", "Store not found!"));

    

    if (store.user_id !== user.id)
      return next(
        new ApiError(403, "FORBIDDEN", "You are not the store owner!")
      );

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
