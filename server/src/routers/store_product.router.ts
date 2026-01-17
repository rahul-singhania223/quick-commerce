import { Router } from "express";
import {
  authorizeStoreOwner,
  authorizeUser,
} from "../middleware/auth.middleware.js";
import { validateForm } from "../middleware/validate.middleware.js";
import { createStoreProductSchema } from "../schemas/store_product.schema.js";
import {
  createStoreProduct,
  deleteStoreProduct,
  getAllStoreProducts,
  getAllStoreProductsByStore,
  getStoreProduct,
  updateStoreProduct,
} from "../controllers/store_product.controller.js";

const router = Router();

// GET ALL STORE PRODUCTS
router.get("/", getAllStoreProducts);

// GET ALL STORE PRODUCTS + INVENTORY BY STORE ID
router.get(
  "/:storeId",
  authorizeUser,
  authorizeStoreOwner,
  getAllStoreProductsByStore
);

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
