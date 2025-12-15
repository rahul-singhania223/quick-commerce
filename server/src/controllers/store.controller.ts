import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/async-handler.ts";
import { ApiError } from "../utils/api-error.ts";
import {
  getAllStoresByUserId,
  createStore as createDbStore,
} from "../models/store.model.ts";
import { APIResponse } from "../utils/api-response.util.ts";
import { storeFormSchema } from "../schemas/store.schema.ts";
import z from "zod";
import { Store, User } from "../generated/prisma/client.ts";
import { v4 } from "uuid";
import { getUserById, updateUser } from "../models/user.model.ts";

// GET ALL STORES (USER)
export const getAllUserStores = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return next(new ApiError(401, "UNAUTHORIZED", "Unauthorized!"));

    const stores = await getAllStoresByUserId(user.id as string);
    if (!stores)
      return next(new ApiError(404, "DB_ERROR", "Couldn't get stores!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Stores fetched successfully!", stores));
  }
);

// CREATE STORE
export const createStore = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return next(new ApiError(401, "UNAUTHORIZED", "Unauthorized!"));

    const {
      name,
      owner_name,
      gst_number,
      address,
      city,
      zip_code,
      lattitude,
      longitude,
    } = req.body as z.infer<typeof storeFormSchema>;

    if (
      !name ||
      !owner_name ||
      !gst_number ||
      !address ||
      !city ||
      !zip_code ||
      !lattitude ||
      !longitude
    )
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!")
      );

    const dbUser: User = await getUserById(user.id as string);
    if (!dbUser) return next(new ApiError(404, "NOT_FOUND", "User not found!"));

    const storeData: Store = {
      id: v4(),
      name,
      owner_name,
      gst_number,
      address,
      city,
      zip_code,
      lattitude: parseFloat(lattitude),
      longitude: parseFloat(longitude),
      user_id: user.id as string,
      phone: dbUser.phone,
      status: "OPEN",
      created_at: new Date(),
      updated_at: new Date(),
    };

    const newStore = await createDbStore(storeData);
    if (!newStore)
      return next(new ApiError(500, "DB_ERROR", "Couldn't create store!"));

    const updatedUser = await updateUser(dbUser.id as string, {
      ...dbUser,
      role: "STORE_OWNER",
    });

    return res
      .status(201)
      .json(new APIResponse("success", "Store created!", newStore));
  }
);
