import { z } from "zod";

/**
 * Single coordinate: [longitude, latitude]
 */
const CoordinateSchema = z.tuple([
  z.number().min(-180).max(180), // lng
  z.number().min(-90).max(90), // lat
]);

/**
 * Linear ring:
 * - at least 4 points
 * - first === last
 */
const LinearRingSchema = z
  .array(CoordinateSchema)
  .min(4)
  .refine(
    (coords) => {
      const first = coords[0];
      const last = coords[coords.length - 1];
      return first[0] === last[0] && first[1] === last[1];
    },
    {
      message: "Polygon must be closed (first and last coordinates must match)",
    },
  );

/**
 * GeoJSON Polygon schema
 */
const GeoJSONPolygonSchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(LinearRingSchema).length(1, {
    message: "Only single-ring polygons are supported",
  }),
});

/**
 * Create Zone Form Schema
 */
export const createZoneSchema = z.object({
  name: z
    .string()
    .min(3, "Zone name is too short")
    .max(100, "Zone name is too long"),
  city: z
    .string()
    .min(3, "City name is too short")
    .max(100, "City name is too long"),

  is_active: z.boolean().optional().default(true),
  boundary: GeoJSONPolygonSchema,
});
