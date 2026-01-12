import asyncHandler from "../utils/async-handler.ts";
import {
  getAllZones as fetchAllZones,
  getZone as fetchZone,
} from "../models/zone.model.ts";
import { APIResponse } from "../utils/api-response.util.ts";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.ts";
import z from "zod";
import { createZoneSchema } from "../schemas/zone.schema.ts";
import { Prisma, Zone } from "../generated/prisma/client.ts";
import { v4, validate as isValidUUID } from "uuid";
import {
  createZone as createDbZone,
  getZone as getDbZone,
  updateZone as updateDbZone,
  deleteZone as deleteDbZone,
} from "../models/zone.model.ts";
import { isPointInPolygon } from "../utils/location.util.ts";

// GET ZONE BY POSITION
export const getZoneByPosition = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const lng = Number(req.query.lng);
    const lat = Number(req.query.lat);

    if (Number.isNaN(lng) || Number.isNaN(lat)) {
      return next(
        new ApiError(400, "INVALID_DATA", "Valid lng and lat are required!")
      );
    }

    const zones = await fetchAllZones({ isActive: true });
    if (!zones || zones.length === 0) {
      return next(new ApiError(404, "DB_ERROR", "No zones found"));
    }

    const point: [number, number] = [lng, lat];

    const matchedZone = zones.find((zone: Zone) => {
      const boundary = zone.boundary as any;

      if (!boundary || boundary.type !== "Polygon") return false;

      const polygon = boundary.coordinates[0] as [number, number][];
      return isPointInPolygon(point, polygon);
    });

    console.log(matchedZone);

    if (!matchedZone) {
      return res.status(200).json(
        new APIResponse("success", "No zone identified", {
          success: false,
          message: "Currently we do not operate in your area!",
        })
      );
    }

    return res.status(200).json(
      new APIResponse("success", "Zone identified successfully", {
        success: true,
        zone: { id: matchedZone.id, name: matchedZone.name },
        message: "We are operating in your area!",
      })
    );
  }
);

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
    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid zone ID!"));

    const zone = await getDbZone(id);
    if (!zone) return next(new ApiError(404, "DB_ERROR", "Zone not found!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Zone fetched successfully!", zone));
  }
);

// CREATE ZONE
export const createZone = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as z.infer<typeof createZoneSchema>;

    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!")
      );

    const { name, boundary } = data;

    const newZoneData: Prisma.ZoneCreateInput = {
      name,
      boundary,
      isActive: true,
    };

    const newZone = await createDbZone(newZoneData);
    if (!newZone)
      return next(new ApiError(500, "DB_ERROR", "Couldn't create new zone!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Created new zone", newZone));
  }
);

// UPDATE ZONE
export const updateZone = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const zoneId = req.params.id;
    if (!zoneId || !isValidUUID(zoneId))
      return next(new ApiError(400, "INVALID_DATA", "Invalid zone ID!"));

    const data = req.body as z.infer<typeof createZoneSchema>;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!")
      );

    const existingZone = await getDbZone(zoneId);
    if (!existingZone)
      return next(new ApiError(404, "DB_ERROR", "Zone not found!"));

    const updatedZoneData: Prisma.ZoneUpdateInput = {
      ...existingZone,
      ...data,
    };

    const updatedZone = await updateDbZone(zoneId, updatedZoneData);
    if (!updatedZone)
      return next(new ApiError(500, "DB_ERROR", "Couldn't update zone!"));

    return res
      .status(200)
      .json(
        new APIResponse("success", "Zone updated successfully!", updatedZone)
      );
  }
);

// DELETE ZONE
export const deleteZone = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const zoneId = req.params.id;
    console.log(zoneId);
    if (!zoneId || !isValidUUID(zoneId))
      return next(new ApiError(400, "INVALID_DATA", "Invalid zone ID!"));

    const existingZone = await getDbZone(zoneId);
    if (!existingZone)
      return next(new ApiError(404, "DB_ERROR", "Zone not found!"));

    const deletedZone = await deleteDbZone(zoneId);
    if (!deletedZone)
      return next(new ApiError(500, "DB_ERROR", "Couldn't delete zone!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Zone deleted successfully!"));
  }
);
