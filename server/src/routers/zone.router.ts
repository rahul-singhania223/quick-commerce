import { Router } from "express";
import {
  createZone,
  deleteZone,
  getAllZones,
  getOverlappingZones,
  getZoneStats,
  updateZone,
} from "../controllers/zone.controller.js";
import {
  authorizeAdmin,
  authorizeUser,
} from "../middleware/auth.middleware.js";
import { validateForm } from "../middleware/validate.middleware.js";
import { createZoneSchema } from "../schemas/zone.schema.js";

const router = Router();

// GET OVERLAPPING ZONES
router.post(
  "/overlapping",
  // authorizeUser,
  //  authorizeAdmin,
  getOverlappingZones,
);

// GET ZONES STATS
router.get("/stats", getZoneStats);

// GET ALL ZONES
router.get("/", getAllZones);

// CREATE ZONE
router.post(
  "/",
  // authorizeUser,
  // authorizeAdmin,
  validateForm(createZoneSchema),
  createZone,
);

// UPDATE ZONE
router.put(
  "/:id",
  // authorizeUser,
  // authorizeAdmin,
  updateZone,
);

// DELETE ZONE
router.delete(
  "/:id",
  // authorizeUser,
  // authorizeAdmin,
  deleteZone,
);

export default router;
