import { Router } from "express";
import {
  authorizeAdmin,
  authorizeUser,
} from "../middleware/auth.middleware.js";
import { validateForm } from "../middleware/validate.middleware.js";
import {
  createZone,
  deleteZone,
  getAllZones,
  getZone,
  getZoneByPosition,
  updateZone,
} from "../controllers/zone.controller.js";

import { createZoneSchema } from "../schemas/zone.schema.js";

const router = Router();

// GET ZONE BY POSITION
router.get("/position", getZoneByPosition);

// GET ALL ZONES
router.get("/", getAllZones);

// GET ZONE
router.get("/:id", getZone);

// // CREATE ZONE
router.post(
  "/create",
  validateForm(createZoneSchema),
  authorizeUser,
  authorizeAdmin,
  createZone
);

// UPDATE ZONE
router.put(
  "/update/:id",
  validateForm(createZoneSchema),
  authorizeUser,
  authorizeAdmin,
  updateZone
);

// DELETE ZONE
router.delete("/:id", authorizeUser, authorizeAdmin, deleteZone);

export default router;
