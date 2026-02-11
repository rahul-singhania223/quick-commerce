import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/async-handler.js";
import { APIResponse } from "../utils/api-response.util.js";
import { ApiError } from "../utils/api-error.js";
import { categoryFormSchema } from "../schemas/category.schema.js";
import z from "zod";
import slugify from "slugify";
import { v4, validate as isValidUUID } from "uuid";
import { Category, Prisma } from "../generated/prisma/client.js";
import {
  getAllCategories as fetchAllCategories,
  getCategory as fetchCategory,
  createCategory as createDbCategory,
  updateCategory as updateDbCategory,
  deleteCategory as deleteDbCategory,
  getCategoryStats as fetchCategoryStats,
  increaseCategoryCount,
  decreaseCategoryCount,
} from "../models/category.model.js";

// GET CATEGORIES COUNT
export const getCategoryStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await fetchCategoryStats();

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Categories stats fetched successfully!",
          stats,
        ),
      );
  },
);

// GET ALL CATEGORIES
export const getAllCategories = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const queries = req.query;
    const is_active = queries.is_active
      ? Boolean(Number(queries.is_active))
      : undefined;

    const categories = await fetchAllCategories({
      ...queries,
      is_active,
    });
    if (!categories)
      return next(new ApiError(404, "DB_ERROR", "Couldn't get categories!"));

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Categories fetched successfully!",
          categories,
        ),
      );
  },
);

// GET CATEGORY
export const getCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid category ID!"));

    const category = await fetchCategory({ id });
    if (!category)
      return next(new ApiError(404, "DB_ERROR", "Category not found!"));

    return res
      .status(200)
      .json(
        new APIResponse("success", "Category fetched successfully!", category),
      );
  },
);

/* ========================================================
   ================ CREATE CATEGORY
   ======================================================== */
export const createCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as z.infer<typeof categoryFormSchema>;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!"),
      );

    const { name, parent_id, is_active } = data;

    if (parent_id && !isValidUUID(parent_id))
      return next(
        new ApiError(400, "INVALID_DATA", "Invalid parent category ID!"),
      );

    const [existingCategory, parentCategory] = await Promise.all([
      fetchCategory({ name }),
      parent_id ? fetchCategory({ id: parent_id || undefined }) : null,
    ]);

    if (existingCategory)
      return next(new ApiError(400, "DB_ERROR", "Category already exists!"));

    if (parent_id && !parentCategory)
      return next(new ApiError(404, "DB_ERROR", "Parent category not found!"));

    // @ts-ignore
    const slug = slugify.default(name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: true,
    });

    // create new category
    const newCategoryData: Prisma.CategoryCreateInput = {
      id: v4(),
      name,
      slug,
      parent: { connect: { id: parent_id || undefined } },
      level: 1,
      sort_order: 1,
      is_active,
    };

    if (parent_id && parentCategory) {
      const level = parentCategory.level + 1;
      if (level > 5)
        return next(
          new ApiError(400, "DB_ERROR", "This category can't have childrens!"),
        );

      newCategoryData.level = level;
      newCategoryData.sort_order = parentCategory.sort_order + 1;
    }

    const [newCategory, updatedStats] = await Promise.all([
      createDbCategory(newCategoryData),
      increaseCategoryCount(),
    ]);

    if (!newCategory)
      return next(new ApiError(500, "DB_ERROR", "Couldn't create category!"));

    if (!updatedStats)
      return next(new ApiError(500, "DB_ERROR", "Couldn't update stats!"));

    // return response
    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Category created successfully!",
          newCategory,
        ),
      );
  },
);

// UPDATE CATEGORY
export const updateCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid category ID!"));

    const data = req.body as Partial<Category>;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!"),
      );

    const { name, parent_id } = data;

    if (parent_id && !isValidUUID(parent_id))
      return next(
        new ApiError(400, "INVALID_DATA", "Invalid parent category ID!"),
      );

    const existingCategory = await fetchCategory({ id });
    if (!existingCategory)
      return next(new ApiError(404, "DB_ERROR", "Category not found!"));

    const newName = name && name !== existingCategory.name;

    const [existingCategoryWithNewName] = await Promise.all([
      newName ? fetchCategory({ name }) : null,
    ]);

    if (newName) {
      if (existingCategoryWithNewName)
        return next(new ApiError(400, "DB_ERROR", "Category already exists!"));

      // @ts-ignore
      data.slug = slugify.default(name, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: true,
      });
    }

    // check if category level is valid
    if (data.level) {
      if (data.level === 0) {
        if (data.parent_id)
          return next(
            new ApiError(
              400,
              "INVALID_DATA",
              "Root categories must have no parent!",
            ),
          );
        data.parent_id = null;
      }

      if (data.level > 0 && !data.parent_id)
        return next(
          new ApiError(
            400,
            "INVALID_DATA",
            "Subcategories must have a parent!",
          ),
        );

      if (data.parent_id) {
        const parent = await fetchCategory({ id: data.parent_id });
        if (!parent)
          return next(new ApiError(404, "DB_ERROR", "Parent not found!"));

        if (data.level !== parent.level + 1)
          return next(
            new ApiError(
              400,
              "INVALID_DATA",
              "Category level must be parent level + 1",
            ),
          );
      }
    }

    if (data.parent_id) {
      const parent = await fetchCategory({ id: data.parent_id });
      if (!parent)
        return next(new ApiError(404, "DB_ERROR", "Parent not found!"));
    }

    const updatedCategoryData: Prisma.CategoryUpdateInput = {
      ...data,
    };

    const updatedCategory = await updateDbCategory(
      existingCategory.id,
      updatedCategoryData,
    );
    if (!updatedCategory)
      return next(new ApiError(500, "DB_ERROR", "Couldn't update category!"));

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Category updated successfully!",
          updatedCategory,
        ),
      );
  },
);

// DELETE CATEGORY
export const deleteCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid category ID!"));

    const existingCategory = await fetchCategory({ id });

    if (!existingCategory)
      return next(new ApiError(404, "DB_ERROR", "Category not found!"));
    
    const [deletedCategory, updatedStats] = await Promise.all([
      deleteDbCategory(id),
      decreaseCategoryCount(),
    ]);

    if (!deletedCategory)
      return next(new ApiError(500, "DB_ERROR", "Couldn't delete category!"));

    if (!updatedStats)
      return next(new ApiError(500, "DB_ERROR", "Couldn't update stats!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Category deleted successfully!"));
  },
);
