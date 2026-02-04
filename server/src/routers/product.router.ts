import { Router } from "express";
import {
  authorizeAdmin,
  authorizeUser,
} from "../middleware/auth.middleware.js";
import { validateForm } from "../middleware/validate.middleware.js";
import { productFormSchema } from "../schemas/product.schema.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  getProductsCount,
  searchProducts,
  updateProduct,
} from "../controllers/product.controller.js";

const router = Router();

// SEARCH PRODUCTS
router.get("/search", searchProducts);

// GET ALL PRODUCTS
router.get("/", getAllProducts);

// GET PRODUCT COUNT
router.get("/count", getProductsCount);

// GET PRODUCT
router.get("/:id", getProduct);

// CREATE PRODUCT
router.post(
  "/",
  // authorizeUser,
  // authorizeAdmin,
  validateForm(productFormSchema),
  createProduct,
);

// UPDATE PRODUCT
router.put(
  "/:id",
  // authorizeUser,
  //  authorizeAdmin,
  updateProduct,
);

// DELETE PRODUCT
router.delete(
  "/:id",
  // authorizeUser,
  // authorizeAdmin,
  deleteProduct,
);

export default router;
