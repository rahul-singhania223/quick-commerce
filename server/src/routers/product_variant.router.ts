import { Router } from "express";
import {
  createProductVariant,
  deleteProductVariant,
  getAllProductVariants,
  getProductVariant,
  updateProductVariant,
} from "../controllers/product_variant.controller.ts";
import {
  authorizeAdmin,
  authorizeUser,
} from "../middleware/auth.middleware.ts";
import { validateForm } from "../middleware/validate.middleware.ts";
import { createProductVariantSchema } from "../schemas/product_variant.schema.ts";

const router = Router();

// GET ALL PRODUCT VARIANTS
router.get("/", getAllProductVariants);

// GET PRODUCT VARIANT
router.get("/:id", getProductVariant);

// CREATE PRODUCT VARIANT
router.post(
  "/",
  authorizeUser,
  authorizeAdmin,
  validateForm(createProductVariantSchema),
  createProductVariant
);

// UPDATE PRODUCT VARIANT
router.put("/:id", authorizeUser, authorizeAdmin, updateProductVariant);

// DELETE PRODUCT VARIANT
router.delete("/:id", authorizeUser, authorizeAdmin, deleteProductVariant);

export default router;
