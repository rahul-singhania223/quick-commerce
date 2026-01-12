import { Router } from "express";
import {
  authorizeAdmin,
  authorizeStoreOwner,
  authorizeUser,
} from "../middleware/auth.middleware.js";
import {
  createStore,
  deleteStore,
  getAllStores,
  getAllUserStores,
  getStore,
  updateStore,
} from "../controllers/store.controller.js";
import { validateForm } from "../middleware/validate.middleware.js";
import { createStoreSchema } from "../schemas/store.schema.js";

const router = Router();

// GET ALL STORES (USER)
router.get("/", authorizeUser, getAllUserStores);

// GET ALL STORES (ADMIN)
router.get("/all", authorizeUser, authorizeAdmin, getAllStores);

// GET STORE
router.get("/:id", authorizeUser, getStore);

// CREATE STORE
router.post(
  "/create",
  validateForm(createStoreSchema),
  authorizeUser,
  createStore
);

// UPDATE STORE
router.put(
  "/update/:id",
  // validateForm(createStoreSchema),
  authorizeUser,
  authorizeStoreOwner,
  updateStore
);

// DELETE STORE
router.delete("/delete/:id", authorizeUser, authorizeStoreOwner, deleteStore);

export default router;
