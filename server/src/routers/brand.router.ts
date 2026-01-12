import { Router } from "express";
import {
  authorizeAdmin,
  authorizeUser,
} from "../middleware/auth.middleware.ts";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrand,
  updateBrand,
} from "../controllers/brand.controller.ts";
import { validateForm } from "../middleware/validate.middleware.ts";
import { brandFormSchema } from "../schemas/brand.schema.ts";

const router = Router();

// GET ALL BRANDS
router.get("/", getAllBrands);

// GET BRAND
router.get("/:id", getBrand);

// CREATE BRAND
router.post(
  "/",
  authorizeUser,
  authorizeAdmin,
  validateForm(brandFormSchema),
  createBrand
);

// UPDATE BRAND
router.put("/:id", authorizeUser, authorizeAdmin, updateBrand);

// DELETE BRAND
router.delete("/:id", authorizeUser, authorizeAdmin, deleteBrand);

export default router;
