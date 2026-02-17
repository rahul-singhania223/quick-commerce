import { z } from "zod";

const EPS = 1e-6;
const eq = (a: number, b: number) => Math.abs(a - b) < EPS;

/**
 * [lng, lat]
 */
const CoordinateSchema = z.tuple([
  z.number().min(-180).max(180),
  z.number().min(-90).max(90),
]);

/**
 * Remove duplicate consecutive points
 */
function dedupe(coords: [number, number][]) {
  const out: [number, number][] = [];

  for (const pt of coords) {
    const last = out[out.length - 1];
    if (!last || !eq(last[0], pt[0]) || !eq(last[1], pt[1])) {
      out.push(pt);
    }
  }
  return out;
}

/**
 * Segment intersection test (2D orientation)
 */
function intersects(a: any, b: any, c: any, d: any) {
  const cross = (p: any, q: any, r: any) =>
    (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);

  const o1 = cross(a, b, c);
  const o2 = cross(a, b, d);
  const o3 = cross(c, d, a);
  const o4 = cross(c, d, b);

  return o1 * o2 < 0 && o3 * o4 < 0;
}

/**
 * Prevent bow-tie / self-cross polygon
 */
function hasSelfIntersection(ring: [number, number][]) {
  for (let i = 0; i < ring.length - 1; i++) {
    for (let j = i + 2; j < ring.length - 1; j++) {
      if (i === 0 && j === ring.length - 2) continue;
      if (intersects(ring[i], ring[i + 1], ring[j], ring[j + 1])) return true;
    }
  }
  return false;
}

/**
 * Linear ring validator
 */
const LinearRingSchema = z
  .array(CoordinateSchema)
  .min(4)
  .transform((coords) => dedupe(coords))
  .refine((coords) => {
    const first = coords[0];
    const last = coords[coords.length - 1];
    return eq(first[0], last[0]) && eq(first[1], last[1]);
  }, "Polygon must be closed")
  .refine(
    (coords) => !hasSelfIntersection(coords),
    "Polygon cannot self-intersect",
  );

/**
 * GeoJSON Polygon
 */
const GeoJSONPolygonSchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(LinearRingSchema).length(1),
});

export const createZoneSchema = z.object({
  // Required fields
  name: z.string().trim().min(2, "Zone name is too short").max(100),
  city: z.string().trim().min(2, "City name is too short"),
  boundary: GeoJSONPolygonSchema,

  // Optional fields with defaults (aligning with Prisma @default)
  is_active: z.boolean(),
  priority: z
    .number()
    .int()
    .min(0)
    .max(10000, { message: "Priority must be between 0 and 10000" }),
  base_fee: z
    .number()
    .min(0, { message: "Base fee must be between 0 and 10000" })
    .max(10000, { message: "Base fee must be between 0 and 10000" }),
  per_km_fee: z
    .number()
    .min(0, { message: "Per KM fee must be between 0 and 10000" })
    .max(10000, { message: "Per KM fee must be between 0 and 10000" }),
  avg_prep_time: z
    .number()
    .int()
    .min(0, { message: "Average preparation time must be between 0 and 10000" })
    .max(10000, {
      message: "Average preparation time must be between 0 and 10000",
    }),
});

// Type inference
export type CreateZoneInput = z.infer<typeof createZoneSchema>;
