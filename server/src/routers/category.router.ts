import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryStats,
  getCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import {
  authorizeAdmin,
  authorizeUser,
} from "../middleware/auth.middleware.js";
import { categoryFormSchema } from "../schemas/category.schema.js";
import { validateForm } from "../middleware/validate.middleware.js";

const router = Router();

// GET CATEGORY STATS
router.get(
  "/stats",
  //  authorizeUser,
  // authorizeAdmin
  getCategoryStats,
);

// GET ALL CATEGORIES
router.get("/", getAllCategories);

// GET CATEGORY
// router.get("/:id", getCategory);

// CREATE CATEGORY
router.post(
  "/",
  // authorizeUser,
  // authorizeAdmin,
  validateForm(categoryFormSchema),
  createCategory,
);

// UPDATE CATEGORY
router.put(
  "/:id",
  // authorizeUser,
  // authorizeAdmin,
  updateCategory,
);

// DELETE CATEGORY
router.delete(
  "/:id",
  //  authorizeUser,
  // authorizeAdmin,
  deleteCategory,
);

export default router;
