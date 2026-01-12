import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import {
  getAllStoresByUserId,
  getAllStores as getAllDbStores,
  createStore as createDbStore,
  deleteStore as deleteDbStore,
  getStore as getDbStore,
  updateStore as updateDbStore,
} from "../models/store.model.js";
import { APIResponse } from "../utils/api-response.util.js";
import { createStoreSchema } from "../schemas/store.schema.js";
import z from "zod";
import { Store, User } from "../generated/prisma/client.js";
import { v4, validate as isValidUUID } from "uuid";
import { getUserById, updateUser } from "../models/user.model.js";
import { get } from "http";
import { Decimal } from "@prisma/client/runtime/client";

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

// GET STORE (USER  OR ADMIN)
export const getStore = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: storeId } = req.params;
    if (!storeId || !isValidUUID(storeId))
      return next(new ApiError(400, "INVALID_DATA", "Invalid store id!"));

    const user = req.user;
    if (!user) return next(new ApiError(401, "UNAUTHORIZED", "Unauthorized!"));

    const store = await getDbStore(storeId);
    if (!store) return next(new ApiError(404, "NOT_FOUND", "Store not found!"));

    const isStoreOwner = store.user_id === user.id;
    if (isStoreOwner) {
      return res
        .status(200)
        .json(new APIResponse("success", "Store fetched successfully!", store));
    }

    const dbUser = await getUserById(user.id as string);
    if (!dbUser) return next(new ApiError(404, "NOT_FOUND", "User not found!"));

    const isAdmin = dbUser.role === "ADMIN";
    if (!isAdmin)
      return next(
        new ApiError(403, "FORBIDDEN", "You are not the store owner nor admin!")
      );

    return res
      .status(200)
      .json(new APIResponse("success", "Store fetched successfully!", store));
  }
);

// GET ALL STORES (ADMIN)
export const getAllStores = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const stores = await getAllDbStores();
    if (!stores)
      return next(new ApiError(500, "DB_ERROR", "Couldn't get stores!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Stores fetched successfully!", stores));
  }
);

// CREATE STORE
export const createStore = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as z.infer<typeof createStoreSchema>;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!")
      );

    const user = req.user;
    if (!user) return next(new ApiError(401, "UNAUTHORIZED", "Unauthorized!"));

    const dbUser = await getUserById(user.id as string);
    if (!dbUser) return next(new ApiError(404, "NOT_FOUND", "User not found!"));

    const {
      name,
      logo,
      owner_name,
      zone_id,
      address,
      latitude,
      longitude,
      gst,
      fssai,
      adhaar,
      pan,
      inside_photo,
      front_photo,
    } = data;

    const newStoreData: Store = {
      id: v4(),
      user_id: req.user?.id as string,
      name,
      logo,
      owner_name,
      phone: dbUser.phone,
      zone_id,
      address,
      latitude: Decimal(latitude),
      longitude: Decimal(longitude),
      gst,
      fssai: fssai || null,
      adhaar,
      pan,
      inside_photo,
      front_photo,
      verified: false,
      status: "OPEN",
      created_at: new Date(),
      updated_at: new Date(),
    };

    const store = await createDbStore(newStoreData);
    if (!store)
      return next(new ApiError(500, "DB_ERROR", "Couldn't create store!"));

    const updatedUser = await updateUser(dbUser.id, {
      ...dbUser,
      role: "STORE_OWNER",
    });
    if (!updatedUser)
      return next(
        new ApiError(
          500,
          "DB_ERROR",
          "Couldn't update user after store creation!"
        )
      );

    return res
      .status(201)
      .json(new APIResponse("success", "Store created successfully!", store));
  }
);

// UPDATE STORE
export const updateStore = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as Partial<Store>;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!")
      );

    const user = req.user;
    if (!user) return next(new ApiError(401, "UNAUTHORIZED", "Unauthorized!"));

    const store = req.store;
    if (!store) return next(new ApiError(404, "NOT_FOUND", "Store not found!"));

    const dbUser = await getUserById(user.id as string);
    if (!dbUser) return next(new ApiError(404, "NOT_FOUND", "User not found!"));

    const storeData: Store = {
      ...store,
      ...data,
    };

    const updatedStore = await updateDbStore(store.id, storeData);
    if (!updatedStore)
      return next(new ApiError(500, "DB_ERROR", "Couldn't update store!"));

    return res
      .status(200)
      .json(
        new APIResponse("success", "Store Updated successfully!", updatedStore)
      );
  }
);

// DELETE STORE
export const deleteStore = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const store = req.store;
    if (!store) return next(new ApiError(404, "NOT_FOUND", "Store not found!"));

    const deletedStore = await deleteDbStore(store.id);
    if (!deletedStore)
      return next(new ApiError(500, "DB_ERROR", "Couldn't delete store!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Store deleted successfully!"));
  }
);
