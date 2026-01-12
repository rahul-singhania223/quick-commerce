import { Router } from "express";
import {
  authorizeStoreOwner,
  authorizeUser,
} from "../middleware/auth.middleware.ts";
import { validateForm } from "../middleware/validate.middleware.ts";
import { createStoreProductSchema } from "../schemas/store_product.schema.ts";
import {
  createStoreProduct,
  deleteStoreProduct,
  getAllStoreProducts,
  getStoreProduct,
  updateStoreProduct,
} from "../controllers/store_product.controller.ts";

const router = Router();

// GET ALL STORE PRODUCTS
router.get("/", getAllStoreProducts);

// GET STORE PRODUCT
router.get("/:id", getStoreProduct);

// CREATE STORE PRODUCT
router.post(
  "/:storeId",
  authorizeUser,
  authorizeStoreOwner,
  validateForm(createStoreProductSchema),
  createStoreProduct
);

// UPDATE STORE PRODUCT
router.put(
  "/:storeId/:storeProductId/:inventoryId",
  authorizeUser,
  authorizeStoreOwner,
  updateStoreProduct
);

// DELETE STORE PRODUCT
router.delete(
  "/:storeId/:storeProductId",
  authorizeUser,
  authorizeStoreOwner,
  deleteStoreProduct
);

export default router;
