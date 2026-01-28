import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/async-handler.js";
import {
  CreateAddressSchema,
} from "../schemas/address.schema.js";
import { ApiError } from "../utils/api-error.js";
import db from "../configs/db.config.js";
import {
  createAddress as createDbAddress,
  getAddressById as fetchAddress,
  getAddressByUserAndId as fetchAddressByUserAndId,
  deleteAddress as deleteDbAddress,
  getAllAddressesByUser as fetchAllAddressesByUserId,
} from "../models/address.model.js";
import { APIResponse } from "../utils/api-response.util.js";
import { validate as isValidUUID } from "uuid";
import { Address } from "../generated/prisma/client.js";
import { getUserById } from "../models/user.model.js";

// CREATE ADDRESS
export const createAddress = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Auth check (DO NOT trust body for userId)
    const userId = req.user?.id;
    if (!userId) {
      return next(new ApiError(401, "UNAUTHORIZED", "User not authenticated"));
    }

    // If user has reached max limit
    const MAX_ADDRESSES_LIMIT = 5;
    const addressCount = await db.address.count({
      where: { userId },
    });

    if (addressCount >= MAX_ADDRESSES_LIMIT) {
      return next(
        new ApiError(
          400,
          "MAX_ADDRESSES_LIMIT",
          "Max addresses limit reached!",
        ),
      );
    }

    // validate body
    const addressData = req.body as CreateAddressSchema;
    if (!addressData)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!"),
      );

    // If new address is default → unset existing default
    if (addressData.isDefault) {
      await db.address.updateMany({
        where: {
          userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Create address
    const address = await createDbAddress({
      user: { connect: { id: userId } },
      ...addressData,
    });

    if (!address) {
      return next(
        new ApiError(500, "SERVER_ERROR", "Failed to create address"),
      );
    }

    // Respond
    return res.json(
      new APIResponse("success", "Address created successfully!", address),
    );
  },
);

// DELETE ADDRESS
export const deleteAddress = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // check auth
    const userId = req.user?.id;
    if (!userId)
      return next(new ApiError(401, "UNAUTHORIZED", "Unauthorized!"));

    // validate address id
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid address ID!"));

    // check if address exists
    const existingAddress: Address | null = await fetchAddressByUserAndId({
      userId: userId,
      id,
    });
    if (!existingAddress)
      return next(new ApiError(404, "DB_ERROR", "Address not found!"));

    // delete address
    const deletedAddress = await deleteDbAddress(existingAddress.id);
    if (!deletedAddress)
      return next(new ApiError(500, "DB_ERROR", "Couldn't delete address!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Address deleted successfully!"));
  },
);

// GET ALL ADDRESS BY USER
export const getAllAddressesByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // check auth
    const userId = req.user?.id;
    if (!userId)
      return next(new ApiError(401, "UNAUTHORIZED", "Unauthorized!"));

    // get addresses
    const addresses = await fetchAllAddressesByUserId(userId);
    if (!addresses)
      return next(new ApiError(500, "DB_ERROR", "Couldn't fetch addresses!"));

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Addresses fetched successfully!",
          addresses,
        ),
      );
  },
);


//  GET ADDRESS BY ID
export const getAddressById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // check auth
    const userId = req.user?.id;
    if (!userId)
      return next(new ApiError(401, "UNAUTHORIZED", "Unauthorized!"));

    // validate address id
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid address ID!"));

    // check if address exists
    const existingAddress: Address | null = await fetchAddressByUserAndId({
      userId: userId,
      id,
    });
    if (!existingAddress)
      return next(new ApiError(404, "DB_ERROR", "Address not found!"));

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Address fetched successfully!",
          existingAddress,
        ),
      );
  },
);