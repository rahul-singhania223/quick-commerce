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
import db from "../configs/db.config.js";

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

    // @ts-ignore
    const slug = slugify.default(name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: true,
    });

    const newCategoryData: Prisma.CategoryCreateInput = {
      name,
      slug,
      level: 1,
      sort_order: 1,
      is_active,
    };

    let newCategory = null;

    try {
      await db.$transaction(async (tx) => {
        // check if category exists
        const existingCategory = await tx.category.findUnique({
          where: { slug },
          select: { id: true },
        });
        if (existingCategory)
          throw new ApiError(400, "DB_ERROR", "Category already exists!");

        // check if parent category exists
        if (parent_id) {
          const parentCategory = await tx.category.findUnique({
            where: { id: parent_id },
            select: { id: true, level: true, sort_order: true },
          });
          if (!parentCategory)
            throw new ApiError(404, "DB_ERROR", "Parent category not found!");

          const level = parentCategory.level + 1;
          if (level > 5)
            return next(
              new ApiError(
                400,
                "DB_ERROR",
                "This parent category can't have childrens!",
              ),
            );

          newCategoryData.level = level;
          newCategoryData.sort_order = parentCategory.sort_order + 1;
          newCategoryData.parent = { connect: { id: parentCategory.id } };
        }

        // create new category
        newCategory = await tx.category.create({
          data: newCategoryData,
          select: {
            id: true,
            name: true,
            is_active: true,
            products_count: true,
            brands_count: true,
            level: true,
            parent: {
              select: { id: true, name: true },
            },
          },
        });

        // update stats
        await tx.stats.update({
          where: { id: "GLOBAL" },
          data: { categories_count: { increment: 1 } },
        });
      });
    } catch (error: any) {
      if (error instanceof ApiError) return next(error);
      console.log(error);
      return next(new ApiError(500, "DB_ERROR", "Couldn't create category!"));
    }

    if (!newCategory)
      return next(new ApiError(500, "DB_ERROR", "Couldn't create category!"));

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

    if (name) {
      // @ts-ignore
      data.slug = slugify.default(name, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: true,
      });
    }

    let updatedCategory = null;

    try {
      await db.$transaction(async (tx) => {
        // check if category exists
        const existingCategory = await tx.category.findUnique({
          where: { id },
          select: { id: true, slug: true },
        });
        if (!existingCategory)
          throw new ApiError(404, "DB_ERROR", "Category not found!");

        // check name
        if (name && data.slug !== existingCategory.slug) {
          const existingCategoryWithNewName = await tx.category.findUnique({
            where: { slug: data.slug },
            select: { id: true },
          });
          if (existingCategoryWithNewName)
            throw new ApiError(400, "DB_ERROR", "Category already exists!");
        }

        // parent validation
        if (parent_id) {
          if (parent_id === id) {
            throw new ApiError(
              400,
              "DB_ERROR",
              "This category can't be a parent of itself!",
            );
          }

          const parentCategory = await tx.category.findUnique({
            where: { id: parent_id },
            select: {
              id: true,
              parent_id: true,
              level: true,
              sort_order: true,
            },
          });
          if (!parentCategory)
            throw new ApiError(404, "DB_ERROR", "Parent category not found!");

          if (parentCategory.parent_id === id)
            throw new ApiError(
              400,
              "DB_ERROR",
              "This category can't be a parent of it's children!",
            );

          const level = parentCategory.level + 1;
          if (level > 5)
            return next(
              new ApiError(
                400,
                "DB_ERROR",
                "This parent category can't have childrens!",
              ),
            );

          data.level = level;
          data.sort_order = parentCategory.sort_order + 1;
        }

        // update category
        updatedCategory = await tx.category.update({
          where: { id },
          data,
          select: {
            id: true,
            name: true,
            is_active: true,
            products_count: true,
            brands_count: true,
            level: true,
            parent: {
              select: { id: true, name: true },
            },
          },
        });

        if (!updatedCategory)
          throw new ApiError(500, "DB_ERROR", "Couldn't update category!");
      });
    } catch (error: any) {
      if (error instanceof ApiError) return next(error);
      console.log(error);
      return next(new ApiError(500, "DB_ERROR", "Couldn't update category!"));
    }

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
