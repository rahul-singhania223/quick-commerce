import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error.js";
import { APIResponse } from "../utils/api-response.util.js";
import asyncHandler from "../utils/async-handler.js";
import {
  getInventory as fetchInventory,
  getStoreInventory as fetchStoreInventory,
  updateInventory as updateDbInventory,
} from "../models/inventory.model.js";
import { validate as isValidUUID } from "uuid";
import { Inventory, Prisma } from "../generated/prisma/client.js";

// GET INVENTORY BY ID
export const getInventoryById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.params.storeId;
    const inventoryId = req.params.inventoryId;

    if (!inventoryId || !isValidUUID(inventoryId))
      return next(new ApiError(400, "INVALID_DATA", "Invalid inventory ID!"));

    const inventory: Inventory | null = await fetchInventory(inventoryId);
    if (!inventory)
      return next(new ApiError(404, "DB_ERROR", "Inventory not found!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Inventory found!", inventory));
  }
);

// UPDATE INVENTORY
export const updateInventory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.params.storeId;
    const inventoryId = req.params.inventoryId;

    if (!inventoryId || !isValidUUID(inventoryId))
      return next(new ApiError(400, "INVALID_DATA", "Invalid inventory ID!"));

    const inventory: Inventory | null = await fetchInventory(inventoryId);
    if (!inventory)
      return next(new ApiError(404, "DB_ERROR", "Inventory not found!"));

    const data = req.body as Prisma.InventoryUpdateInput;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!")
      );

    const updatedInventory = await updateDbInventory(inventoryId, data);
    if (!updatedInventory)
      return next(new ApiError(500, "DB_ERROR", "Couldn't update inventory!"));

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Inventory updated successfully!",
          updatedInventory
        )
      );
  }
);

// GET ALL STORE INVENTORY
export const getAllStoreInventory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.params.id;

    const storeInventory = await fetchStoreInventory(storeId);
    if (!storeInventory)
      return next(
        new ApiError(404, "DB_ERROR", "Couldn't get store inventory!")
      );

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Store inventory fetched successfully!",
          storeInventory
        )
      );
  }
);
