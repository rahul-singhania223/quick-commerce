import db from "../configs/db.config.js";
import { Prisma, Zone } from "../generated/prisma/client.js";

// CREATE ZONE
export const createZone = async (data: Prisma.ZoneCreateInput) => {
  try {
    const zone = await db.zone.create({ data: data });
    return zone;
  } catch (error) {
    return null;
  }
};

// GET ZONE
export const getZone = async (id: string) => {
  try {
    const zone = await db.zone.findUnique({ where: { id } });
    return zone;
  } catch (error) {
    return null;
  }
};

// GET ALL ZONES
interface QueryParams {
  city?: string;
  is_active?: boolean;
}
export const getAllZones = async ({ city, is_active }: QueryParams) => {
  try {
    const where: Prisma.ZoneWhereInput = {};
    const orderBy: Prisma.ZoneOrderByWithRelationInput = { created_at: "desc" };

    if (city) where.city = city;
    if (is_active !== undefined) where.is_active = is_active;

    const zones = await db.zone.findMany({
      where,
      orderBy,
      include: { _count: { select: { stores: true } }, stats: true },
    });
    return zones;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// UPDATE ZONE
export const updateZone = async (id: string, data: Prisma.ZoneUpdateInput) => {
  try {
    const zone = await db.zone.update({ where: { id }, data });
    return zone;
  } catch (error) {
    return null;
  }
};

// DELETE ZONE
export const deleteZone = async (id: string) => {
  try {
    const zone = await db.zone.delete({ where: { id } });
    return true;
  } catch (error) {
    return false;
  }
};

// GET ZONE BY NAME
export const getZoneByName = async (name: string) => {
  try {
    const zone = await db.zone.findUnique({ where: { name } });
    return zone;
  } catch (error) {
    return null;
  }
};

// GET ZONES COUNT
interface CountQueryParams {
  is_active?: boolean;
  without_stores?: boolean;
}
export const getZonesCount = async ({
  is_active,
  without_stores,
}: CountQueryParams) => {
  try {
    const where: Prisma.ZoneWhereInput = {};

    if (is_active !== undefined) where.is_active = is_active;
    if (without_stores) where.stores = { none: {} };

    const count = await db.zone.count({ where });

    return count;
  } catch (error) {
    console.log(error);
    return null;
  }
};
