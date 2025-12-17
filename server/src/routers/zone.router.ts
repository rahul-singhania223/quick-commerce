import { Router } from "express";
import {
  authorizeAdmin,
  authorizeUser,
} from "../middleware/auth.middleware.ts";
import { validateForm } from "../middleware/validate.middleware.ts";
import {
  createZone,
  deleteZone,
  getAllZones,
  getZone,
  updateZone,
} from "../controllers/zone.controller.ts";

import { createZoneSchema } from "../schemas/zone.schema.ts";

const router = Router();

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
