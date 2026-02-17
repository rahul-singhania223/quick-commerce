import db from "../configs/db.config.js";
import { Prisma, Zone } from "../generated/prisma/client.js";

export const getZoneStats = async () => {
  return db.zoneStats.findUnique({
    where: { id: "GLOBAL" },
    select: {
      zones_count: true,
      no_stores_count: true,
      avg_delivery_time: true,
      low_riders_count: true,
      active_zones_count: true,
    },
  });
};

interface GetZonesOptions {
  search?: string;
  city?: string;
  is_active?: boolean;
  orderByPriority?: boolean;
  created_at?: "asc" | "desc";
}

export const getAllZones = async (options: GetZonesOptions = {}) => {
  const {
    search,
    city,
    is_active,
    created_at = "desc",
    orderByPriority = true,
  } = options;

  const where: Prisma.ZoneWhereInput = {};

  if (city) where.city = city;
  if (typeof is_active === "boolean") where.is_active = is_active;

  // search: name OR slug
  if (search && search.trim() !== "") {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  return db.zone.findMany({
    where,
    orderBy: orderByPriority
      ? [{ priority: "desc" }, { created_at }]
      : undefined,

    select: {
      id: true,
      name: true,
      city: true,
      is_active: true,
      priority: true,
      base_fee: true,
      per_km_fee: true,
      avg_prep_time: true,
      boundary: true,
      stores_count: true,
      riders_count: true,
      orders_count: true,
    },
  });
};

export const getZoneById = async (id: string) => {
  return db.zone.findUnique({ where: { id } });
};

export const getZoneByName = async (name: string) => {
  return db.zone.findUnique({ where: { name } });
};

export const getZoneByPoint = async (
  lat: number,
  lng: number,
  city?: string,
) => {
  const result = (await db.$queryRawUnsafe(
    `
    SELECT *
    FROM "Zone"
    WHERE is_active = true
      ${city ? `AND city = $3` : ``}
      AND ST_Contains(
        boundary_geom,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)
      )
    ORDER BY priority DESC, created_at ASC
    LIMIT 1;
  `,
    lng,
    lat,
    city,
  )) as Zone[];

  return result[0] || null;
};

export const getOverlappingZones = async (boundary: object, city?: string) => {
  try {
    const boundaryJSON = JSON.stringify(boundary);

    if (city) {
      return db.$queryRawUnsafe(
        `
      SELECT id, name, priority
      FROM "Zone"
      WHERE is_active = true
        AND city = $2
        AND ST_Intersects(
          boundary_geom,
          ST_SetSRID(ST_GeomFromGeoJSON($1), 4326)
        );
    `,
        boundaryJSON,
        city,
      );
    }

    return db.$queryRawUnsafe(
      `
    SELECT id, name, priority
    FROM "Zone"
    WHERE is_active = true
      AND ST_Intersects(
        boundary_geom,
        ST_SetSRID(ST_GeomFromGeoJSON($1), 4326)
      );
  `,
      boundaryJSON,
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createZone = async (data: Prisma.ZoneCreateInput) => {
  try {
    const {
      name,
      city,
      boundary,
      priority,
      base_fee,
      per_km_fee,
      avg_prep_time,
    } = data;

    const result = (await db.$queryRawUnsafe(
      `
    INSERT INTO "Zone" (
      id,
      name,
      city,
      boundary,
      priority,
      base_fee,
      per_km_fee,
      avg_prep_time,
      boundary_geom,
      "created_at",
      "updated_at",
      "is_active"
    )
    VALUES (
      gen_random_uuid(),
      $1,
      $2,
      $3::jsonb,
      $4,
      $5,
      $6,
      $7,
      ST_SetSRID(ST_GeomFromGeoJSON($3), 4326),
      NOW(),
      NOW(),
      true
    )
    RETURNING *;
  `,
      name,
      city,
      JSON.stringify(boundary),
      priority,
      base_fee,
      per_km_fee,
      avg_prep_time,
    )) as Zone[];

    return result[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

// delete zone
export const deleteZone = async (id: string) => {
  try {
    return db.zone.delete({ where: { id } });
  } catch (error) {
    console.log(error);
    return null;
  }
};
