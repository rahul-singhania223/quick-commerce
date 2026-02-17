import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { APIResponse } from "../utils/api-response.util.js";
import {
  getAllZones as fetchAllZones,
  getZoneStats as fetchZoneStats,
  getZoneByName,
  createZone as createDbZone,
  getOverlappingZones as fetchOverlappingZones,
  deleteZone as deleteDbZone,
} from "../models/zone.model.js";
import z from "zod";
import { createZoneSchema } from "../schemas/zone.schema.js";
import db from "../configs/db.config.js";
import { validate as isValidUUID } from "uuid";
import { Prisma } from "../generated/prisma/client.js";

// GET ZONES STATS
export const getZoneStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await fetchZoneStats();
    if (!stats)
      return next(new ApiError(404, "DB_ERROR", "Couldn't get zones stats!"));

    return res
      .status(200)
      .json(
        new APIResponse("success", "Zones stats fetched successfully!", stats),
      );
  },
);

// GET ZONES
export const getAllZones = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const zones = await fetchAllZones();
    if (!zones)
      return next(new ApiError(404, "DB_ERROR", "Couldn't get zones!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Zones fetched successfully!", zones));
  },
);

// CREATE ZONE
export const createZone = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as z.infer<typeof createZoneSchema>;
    if (!data)
      return next(new ApiError(400, "INVALID_DATA", "Invalid zone data!"));

    const {
      name,
      city,
      boundary,
      priority,
      is_active,
      base_fee,
      per_km_fee,
      avg_prep_time,
    } = data;

    // Validate GeoJSON
    if (
      boundary.type !== "Polygon" ||
      !Array.isArray(boundary.coordinates) ||
      boundary.coordinates.length === 0
    ) {
      return next(new ApiError(400, "INVALID_DATA", "Invalid GeoJSON Polygon"));
    }
    const ring = boundary.coordinates[0];

    if (!Array.isArray(ring) || ring.length < 4) {
      return next(
        new ApiError(
          400,
          "INVALID_DATA",
          "Polygon must have at least 4 points",
        ),
      );
    }

    const first = ring[0];
    const last = ring[ring.length - 1];

    if (first[0] !== last[0] || first[1] !== last[1]) {
      return next(new ApiError(400, "INVALID_DATA", "Polygon must be closed"));
    }

    // Duplicate check
    const existing = await getZoneByName(name);
    if (existing) {
      return next(new ApiError(400, "ZONE_EXISTS", "Zone already exists!"));
    }

    // create zone
    const newZone = await createDbZone({
      name,
      city,
      boundary,
      priority,
      base_fee,
      is_active,
      per_km_fee,
      avg_prep_time,
    });

    // update zone stats
    const updatedStats = await db.zoneStats.update({
      where: { id: "GLOBAL" },
      data: {
        zones_count: { increment: 1 },
        no_stores_count: { increment: 1 },
        low_riders_count: { increment: 1 },
        active_zones_count: { increment: is_active ? 1 : 0 },
      },
    });

    if (!updatedStats)
      return next(new ApiError(500, "DB_ERROR", "Couldn't update zone stats!"));

    if (!newZone)
      return next(new ApiError(500, "DB_ERROR", "Couldn't create zone!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Zone created successfully!", newZone));
  },
);

// GET OVERLAPPING ZONES
export const getOverlappingZones = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const boundary = req.body as z.infer<typeof createZoneSchema>["boundary"];
    if (!boundary)
      return next(new ApiError(400, "INVALID_DATA", "Invalid boundary data!"));

    const zones = await fetchOverlappingZones(boundary);
    if (!zones)
      return next(new ApiError(404, "DB_ERROR", "Couldn't get zones!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Zones fetched successfully!", zones));
  },
);

// UPDATE ZONE
export const updateZone = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid zone ID!"));

    const data = req.body as z.infer<typeof createZoneSchema>;
    if (!data)
      return next(new ApiError(400, "INVALID_DATA", "Invalid zone data!"));

    const {
      name,
      city,
      boundary,
      priority,
      is_active,
      base_fee,
      per_km_fee,
      avg_prep_time,
    } = data;

    // Validate GeoJSON
    if (boundary) {
      if (
        boundary.type !== "Polygon" ||
        !Array.isArray(boundary.coordinates) ||
        boundary.coordinates.length === 0
      ) {
        return next(
          new ApiError(400, "INVALID_DATA", "Invalid GeoJSON Polygon"),
        );
      }
      const ring = boundary.coordinates[0];

      if (!Array.isArray(ring) || ring.length < 4) {
        return next(
          new ApiError(
            400,
            "INVALID_DATA",
            "Polygon must have at least 4 points",
          ),
        );
      }

      const first = ring[0];
      const last = ring[ring.length - 1];

      if (first[0] !== last[0] || first[1] !== last[1]) {
        return next(
          new ApiError(400, "INVALID_DATA", "Polygon must be closed"),
        );
      }
    }

    // Duplicate check
    try {
      await db.$transaction(async (tx) => {
        // check existing zone
        const existing = await tx.zone.findUnique({
          where: { id },
          select: { id: true, name: true },
        });
        if (!existing)
          throw new ApiError(400, "ZONE_NOT_FOUND", "Zone not found!");

        // check duplicate
        if (name && name !== existing.name) {
          const existingZone = await tx.zone.findUnique({
            where: { name },
            select: { id: true },
          });
          if (existingZone)
            throw new ApiError(
              400,
              "ZONE_EXISTS",
              "Zone with this name already exists!",
            );
        }
      });
    } catch (error) {
      if (error instanceof ApiError) {
        return next(error);
      }

      console.log(error);
      return next(new ApiError(500, "DB_ERROR", "Couldn't update zone!"));
    }

    const updateData: Prisma.ZoneUpdateInput = {};

    if (name !== undefined) updateData.name = name;
    if (city !== undefined) updateData.city = city;
    if (priority !== undefined) updateData.priority = priority;
    if (base_fee !== undefined) updateData.base_fee = base_fee;
    if (per_km_fee !== undefined) updateData.per_km_fee = per_km_fee;
    if (avg_prep_time !== undefined) updateData.avg_prep_time = avg_prep_time;
    if (is_active !== undefined) updateData.is_active = is_active;

    // update zone

    // If boundary updated → must use raw SQL to update geometry
    if (boundary) {
      const boundaryJSON = JSON.stringify(boundary);

      const updatedBoundary = await db.$executeRaw`
        UPDATE "Zone"
        SET
          boundary = ${boundaryJSON}::jsonb,
          boundary_geom = ST_SetSRID(
            ST_GeomFromGeoJSON(${boundaryJSON}),
            4326
          ),
          "updated_at" = NOW()
        WHERE id = ${id};
      `;

      if (!updatedBoundary)
        return next(new ApiError(500, "DB_ERROR", "Couldn't update zone!"));
    }

    // Update non-geometry fields via Prisma
    let updatedZone = null;
    if (Object.keys(updateData).length > 0) {
      updatedZone = await db.zone.update({
        where: { id },
        data: updateData,
      });
    }

    if (!updatedZone)
      return next(new ApiError(500, "DB_ERROR", "Couldn't update zone!"));

    return res
      .status(200)
      .json(
        new APIResponse("success", "Zone updated successfully!", updatedZone),
      );
  },
);

// DELELETE ZONE
export const deleteZone = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid zone ID!"));

    const deletedZone = await deleteDbZone(id);
    if (!deletedZone)
      return next(new ApiError(500, "DB_ERROR", "Couldn't delete zone!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Zone deleted successfully!"));
  },
);
