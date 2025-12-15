import db from "../configs/db.config.ts";
import { Zone } from "../generated/prisma/client.ts";

// CREATE ZONE
export const createZone = async (data: Zone) => {
  try {
    const zone = db.zone.create({ data });
    return zone;
  } catch (error) {
    return null;
  }
};

// GET ZONE
export const getZone = async (id: string) => {
  try {
    const zone = db.zone.findUnique({ where: { id } });
    return zone;
  } catch (error) {
    return null;
  }
};

// GET ALL ZONES
export const getAllZones = async () => {
  try {
    const zones = db.zone.findMany({});
    return zones;
  } catch (error) {
    return null;
  }
};

// UPDATE ZONE
export const updateZone = async (id: string, data: Zone) => {
  try {
    const zone = db.zone.update({ where: { id }, data });
    return zone;
  } catch (error) {
    return null;
  }
};

// DELETE ZONE
export const deleteZone = async (id: string) => {
  try {
    const zone = db.zone.delete({ where: { id } });
    return zone;
  } catch (error) {
    return null;
  }
};