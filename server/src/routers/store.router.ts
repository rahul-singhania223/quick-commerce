import { Router } from "express";
import { authorizeUser } from "../middleware/auth.middleware.ts";
import { getAllUserStores } from "../controllers/store.controller.ts";
import { validateForm } from "../middleware/validate.middleware.ts";
import { storeFormSchema } from "../schemas/store.schema.ts";
import { createStore } from "../models/store.model.ts";
// import { validateForm } from "../middleware/validate.middleware.ts";

const router = Router();

// GET ALL STORES (USER)
router.get("/", authorizeUser, getAllUserStores);

// GET ALL STORES (ADMIN)
// router.get("/all", authorizeUser, authorizeAdmin, getAllStores);

// // GET STORE
// router.get("/:id", authorizeUser, authorizeOwner, getStore);

// CREATE STORE
router.post(
  "/create",
  validateForm(storeFormSchema),
  authorizeUser,
  createStore
);

// // UPDATE STORE
// router.put("/update/:id", validateForm(storeSchema), authorizeUser, authorizeOwner, updateStore);

// // DELETE STORE
// router.delete("/delete/:id", authorizeUser, authorizeOwner, deleteStore);

export default router;