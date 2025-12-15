import { Router } from "express";
import {
  authorizeAdmin,
  authorizeUser,
} from "../middleware/auth.middleware.ts";
import { validateForm } from "../middleware/validate.middleware.ts";
import { createZone, getAllZones } from "../controllers/zone.controller.ts";
import { getZone } from "../models/zone.model.ts";
import { createZoneSchema } from "../schemas/zone.schema.ts";

const router = Router();

// GET ALL ZONES
router.get("/", getAllZones);

// GET ZONE
router.get("/:id", getZone);

// // CREATE ZONE
router.post(
  "/",
  validateForm(createZoneSchema),
  authorizeUser,
  authorizeAdmin,
  createZone
);

// // UPDATE ZONE
// router.put(
//   "/update/:id",
//   validateForm(zoneFormSchema),
//   authorizeUser,
//   authorizeAdmin,
//   updateZone
// );

// // DELETE ZONE
// router.delete("/delete/:id", authorizeUser, authorizeAdmin, deleteZone);

export default router;
