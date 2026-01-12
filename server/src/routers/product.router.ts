import { Router } from "express";
import {
  authorizeAdmin,
  authorizeUser,
} from "../middleware/auth.middleware.ts";
import { validateForm } from "../middleware/validate.middleware.ts";
import { productFormSchema } from "../schemas/product.schema.ts";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  searchProducts,
  updateProduct,
} from "../controllers/product.controller.ts";

const router = Router();

// SEARCH PRODUCTS
router.get("/search", searchProducts);

// GET ALL PRODUCTS
router.get("/", getAllProducts);

// GET PRODUCT
router.get("/:id", getProduct);

// CREATE PRODUCT
router.post(
  "/",
  authorizeUser,
  authorizeAdmin,
  validateForm(productFormSchema),
  createProduct
);

// UPDATE PRODUCT
router.put("/:id", authorizeUser, authorizeAdmin, updateProduct);

// DELETE PRODUCT
router.delete("/:id", authorizeUser, authorizeAdmin, deleteProduct);

export default router;
