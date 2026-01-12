import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "../controllers/category.controller.ts";
import {
  authorizeAdmin,
  authorizeUser,
} from "../middleware/auth.middleware.ts";
import { categoryFormSchema } from "../schemas/category.schema.ts";
import { validateForm } from "../middleware/validate.middleware.ts";

const router = Router();

// GET ALL CATEGORIES
router.get("/", getAllCategories);

// GET CATEGORY
router.get("/:id", getCategory);

// CREATE CATEGORY
router.post(
  "/",
  authorizeUser,
  authorizeAdmin,
  validateForm(categoryFormSchema),
  createCategory
);

// UPDATE CATEGORY
router.put(
  "/:id",
  authorizeUser,
  authorizeAdmin,
  updateCategory
);

// DELETE CATEGORY
router.delete("/:id", authorizeUser, authorizeAdmin, deleteCategory);

export default router;
