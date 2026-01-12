import { Router } from "express";
import {
  authorizeAdmin,
  authorizeStoreOwner,
  authorizeUser,
} from "../middleware/auth.middleware.ts";
import {
  createStore,
  deleteStore,
  getAllStores,
  getAllUserStores,
  getStore,
  updateStore,
} from "../controllers/store.controller.ts";
import { validateForm } from "../middleware/validate.middleware.ts";
import { createStoreSchema } from "../schemas/store.schema.ts";

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
