import { Router } from "express";
import {
  authorizeStoreOwner,
  authorizeUser,
} from "../middleware/auth.middleware.js";
import {
  getAllStoreInventory,
  getInventoryById,
  updateInventory,
} from "../controllers/inventory.controller.js";

const router = Router();

// GET ALL STORE INVENTORY
router.get(
  "/:storeId",
  authorizeUser,
  authorizeStoreOwner,
  getAllStoreInventory
);

// GET INVENTORY BY ID
router.get(
  "/:storeId/:inventoryId",
  authorizeUser,
  authorizeStoreOwner,
  getInventoryById
);

// UPDATE INVENTORY
router.put(
  "/:storeId/:inventoryId",
  authorizeUser,
  authorizeStoreOwner,
  updateInventory
);

// DELETE INVENTORY
// router.delete("/:id", authorizeUser, authorizeStoreOwner, decreaseInventory);

export default router;
