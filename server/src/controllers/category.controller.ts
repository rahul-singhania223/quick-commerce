import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/async-handler.js";
import { APIResponse } from "../utils/api-response.util.js";
import { ApiError } from "../utils/api-error.js";
import { categoryFormSchema } from "../schemas/category.schema.js";
import z from "zod";
import slugify from "slugify";
import { v4, validate as isValidUUID } from "uuid";
import { Category } from "../generated/prisma/client.js";
import {
  getAllCategories as fetchAllCategories,
  getCategory as fetchCategory,
  createCategory as createDbCategory,
  updateCategory as updateDbCategory,
  deleteCategory as deleteDbCategory,
} from "../models/category.model.js";

// GET ALL CATEGORIES
export const getAllCategories = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Add pagination

    const categories = await fetchAllCategories();
    if (!categories)
      return next(new ApiError(404, "DB_ERROR", "Couldn't get categories!"));

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Categories fetched successfully!",
          categories
        )
      );
  }
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
        new APIResponse("success", "Category fetched successfully!", category)
      );
  }
);

// CREATE CATEGORY
export const createCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as z.infer<typeof categoryFormSchema>;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!")
      );

    const { name, parent_id, image, description, sort_order, is_active } = data;

    // check if category name already exists
    const existingCategory: Category | null = await fetchCategory({ name });
    if (existingCategory)
      return next(new ApiError(400, "DB_ERROR", "Category already exists!"));

    // create slug
    // @ts-ignore
    const slug = slugify.default(name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: true,
    });

    // create new category
    const newCategoryData: Category = {
      id: v4(),
      name,
      slug,
      parent_id,
      level: 0,
      image,
      description,
      sort_order,
      is_active,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // check if parent category exists
    if (parent_id) {
      const parent = await fetchCategory({ id: parent_id });
      if (!parent)
        return next(new ApiError(404, "DB_ERROR", "Parent not found!"));

      const level = parent.level + 1;
      if (level > 5)
        return next(
          new ApiError(400, "DB_ERROR", "This category can't have childrens!")
        );

      newCategoryData.level = level;
    }

    const newCategory = await createDbCategory(newCategoryData);
    if (!newCategory)
      return next(new ApiError(500, "DB_ERROR", "Couldn't create category!"));

    // return response
    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Category created successfully!",
          newCategory
        )
      );
  }
);

// UPDATE CATEGORY
export const updateCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid category ID!"));

    const data = req.body as Partial<Category>;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!")
      );

    const existingCategory: Category | null = await fetchCategory({ id });
    if (!existingCategory)
      return next(new ApiError(404, "DB_ERROR", "Category not found!"));

    const { name } = data;

    if (name && name !== existingCategory.name) {
      const existingCategoryWithNewName: Category | null = await fetchCategory({
        name,
      });
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
              "Root categories must have no parent!"
            )
          );
        data.parent_id = null;
      }

      if (data.level > 0 && !data.parent_id)
        return next(
          new ApiError(400, "INVALID_DATA", "Subcategories must have a parent!")
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
              "Category level must be parent level + 1"
            )
          );
      }
    }

    if (data.parent_id) {
      const parent = await fetchCategory({ id: data.parent_id });
      if (!parent)
        return next(new ApiError(404, "DB_ERROR", "Parent not found!"));
    }

    const updatedCategoryData: Category = {
      ...existingCategory,
      ...data,
      updated_at: new Date(),
    };

    const updatedCategory = await updateDbCategory(
      existingCategory.id,
      updatedCategoryData
    );
    if (!updatedCategory)
      return next(new ApiError(500, "DB_ERROR", "Couldn't update category!"));

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Category updated successfully!",
          updatedCategory
        )
      );
  }
);

// DELETE CATEGORY
export const deleteCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid category ID!"));

    const existingCategory: Category | null = await fetchCategory({ id });
    if (!existingCategory)
      return next(new ApiError(404, "DB_ERROR", "Category not found!"));

    const deletedCategory = await deleteDbCategory(existingCategory.id);
    if (!deletedCategory)
      return next(new ApiError(500, "DB_ERROR", "Couldn't delete category!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Category deleted successfully!"));
  }
);
