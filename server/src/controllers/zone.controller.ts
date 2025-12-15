import asyncHandler from "../utils/async-handler.ts";
import {
  getAllZones as fetchAllZones,
  getZone as fetchZone,
} from "../models/zone.model.ts";
import { APIResponse } from "../utils/api-response.util.ts";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.ts";

// GET ALL ZONES
export const getAllZones = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const zones = await fetchAllZones();
    if (!zones)
      return next(new ApiError(404, "DB_ERROR", "Couldn't get zones!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Zones fetched successfully!", zones));
  }
);

// GET ZONE
export const getZone = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const zone = await fetchZone(id);
    if (!zone) return next(new ApiError(404, "DB_ERROR", "Zone not found!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Zone fetched successfully!", zone));
  }
);

// CREATE ZONE
export const createZone = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    if (!data)
      return next(new ApiError(400, "INVALID_DATA", "All input fields are required!"));
  }
)