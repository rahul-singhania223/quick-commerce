import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/async-handler.js";
import { APIResponse } from "../utils/api-response.util.js";
import { ApiError } from "../utils/api-error.js";
import { v4, validate as isValidUUID } from "uuid";
import { productFormSchema } from "../schemas/product.schema.js";
import z from "zod";
import { Category, Prisma, Product } from "../generated/prisma/client.js";
import slugify from "slugify";
import {
  createProduct as createDbProduct,
  getAllProducts as fetchAllProducts,
  getProduct as fetchProduct,
  updateProduct as updateDbProduct,
  deleteProduct as deleteDbProduct,
  searchProducts as searchDbProducts,
} from "../models/product.model.js";

import {
  getCategory as fetchCategory,
  updateCategory,
} from "../models/category.model.js";
import { getBrand as fetchBrand, updateBrand } from "../models/brand.model.js";
import {
  decreaseProductCount,
  fetchProductStats,
  increaseProductCount,
} from "../models/product_stats.model.js";
import db from "../configs/db.config.js";

// GET PRODUCT STATS
export const getProductStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await fetchProductStats();
    if (!stats)
      return next(
        new ApiError(404, "DB_ERROR", "Couldn't get products stats!"),
      );

    return res
      .status(200)
      .json(
        new APIResponse("success", "Products fetched successfully!", stats),
      );
  },
);

// SEARCH PRODUCTS
export const searchProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    if (!query || Object.keys(query).length === 0)
      return res
        .status(200)
        .json(new APIResponse("success", "Products fetched successfully!", []));

    const searchResults = await searchDbProducts(query);
    if (!searchResults)
      return next(new ApiError(404, "DB_ERROR", "Couldn't get products!"));

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Products fetched successfully!",
          searchResults,
        ),
      );
  },
);

// GET ALL PRODUCTS
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const queries = req.query;
    const is_active = queries.is_active
      ? Boolean(Number(queries.is_active))
      : undefined;

    const products = await fetchAllProducts({
      ...queries,
      is_active,
    });
    if (!products)
      return next(new ApiError(404, "DB_ERROR", "Couldn't get products!"));

    return res
      .status(200)
      .json(
        new APIResponse("success", "Products fetched successfully!", products),
      );
  },
);

// GET PRODUCT
export const getProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid product ID!"));

    const product = await fetchProduct({ id });
    if (!product)
      return next(new ApiError(404, "DB_ERROR", "Couldn't get product!"));

    return res
      .status(200)
      .json(
        new APIResponse("success", "Product fetched successfully!", product),
      );
  },
);

// CREATE PRODUCT
export const createProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as z.infer<typeof productFormSchema>;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!"),
      );

    const { name, description, category_id, brand_id, is_active, image } = data;

    // category and brand validation
    if (!category_id || !isValidUUID(category_id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid category ID!"));

    if (brand_id && !isValidUUID(brand_id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid brand ID!"));

    const newProductData: Prisma.ProductCreateInput = {
      id: v4(),
      name,
      image,
      description,
      category: {},
      brand: undefined,
      is_active,
      slug: "",
    };

    // @ts-ignore
    newProductData.slug = slugify.default(newProductData.name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: true,
      trim: true,
    });

    let newProduct = null;

    try {
      await db.$transaction(async (tx) => {
        // check if product exists
        const existingProduct = await tx.product.findUnique({
          where: { slug: newProductData.slug },
          select: { id: true },
        });
        if (existingProduct)
          throw new ApiError(400, "DB_ERROR", "Product already exists!");

        // check if category exists
        const existingCategory = await tx.category.findUnique({
          where: { id: category_id },
          select: { id: true },
        });
        if (!existingCategory)
          throw new ApiError(400, "DB_ERROR", "Category not found!");

        newProductData.category = { connect: { id: existingCategory.id } };

        // check if brand exists
        if (brand_id) {
          const existingBrand = await tx.brand.findUnique({
            where: { id: brand_id },
            select: { id: true },
          });
          if (!existingBrand)
            throw new ApiError(400, "DB_ERROR", "Brand not found!");

          newProductData.brand = { connect: { id: existingBrand.id } };
        }

        // create product
        newProduct = await tx.product.create({
          data: newProductData,
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            is_active: true,
            variants_count: true,
            store_products_count: true,
            brand: {
              select: { name: true, id: true },
            },
            category: {
              select: { name: true, id: true },
            },
          },
        });

        // increase products count (category)
        await tx.category.update({
          where: { id: existingCategory.id },
          data: { products_count: { increment: 1 } },
        });

        if (brand_id) {
          // increase products count (brand)
          await tx.brand.update({
            where: { id: brand_id },
            data: { products_count: { increment: 1 } },
          });
        }

        // stats update
        await tx.stats.update({
          where: { id: "GLOBAL" },
          data: { products_count: { increment: 1 } },
        });
      });
    } catch (error: any) {
      if (error instanceof ApiError) {
        return next(error);
      }
      console.log(error);
      return next(new ApiError(500, "DB_ERROR", "Couldn't create product!"));
    }

    if (!newProduct)
      return next(new ApiError(500, "DB_ERROR", "Couldn't create product!"));

    // return response
    return res
      .status(200)
      .json(
        new APIResponse("success", "Product created successfully!", newProduct),
      );
  },
);

// UPDATE PRODUCT
export const updateProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid product ID!"));

    const data = req.body as Partial<Product>;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!"),
      );

    const { brand_id, category_id } = data;

    if (brand_id && !isValidUUID(brand_id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid brand ID!"));

    if (category_id && !isValidUUID(category_id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid category ID!"));

    // @ts-ignore
    data.slug = slugify.default(data.name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: true,
      trim: true,
    });

    const updatedProductData: Prisma.ProductUpdateInput = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      image: data.image,
      is_active: data.is_active,
    };

    let updatedProduct = null;

    try {
      await db.$transaction(async (tx) => {
        // check if product exists
        const existingProduct = await tx.product.findUnique({
          where: { id },
          select: { id: true, category_id: true, brand_id: true, name: true },
        });
        if (!existingProduct)
          throw new ApiError(404, "DB_ERROR", "Product not found!");

        // name validation
        if (data.name && data.name !== existingProduct.name) {
          const existingProductWithName = await tx.product.findUnique({
            where: { slug: data.slug },
            select: { id: true },
          });
          if (existingProductWithName)
            throw new ApiError(400, "DB_ERROR", "Product already exists!");
        }

        // category validation
        if (category_id && category_id !== existingProduct.category_id) {
          const existingCategory = await tx.category.findUnique({
            where: { id: category_id },
            select: { id: true },
          });
          if (!existingCategory)
            throw new ApiError(400, "DB_ERROR", "Category not found!");

          await tx.category.update({
            where: { id: existingProduct.category_id },
            data: { products_count: { decrement: 1 } },
          });

          await tx.category.update({
            where: { id: category_id },
            data: { products_count: { increment: 1 } },
          });

          updatedProductData.category = { connect: { id: category_id } };
        }

        // brand validation
        if (brand_id && brand_id !== existingProduct.brand_id) {
          const existingBrand = await tx.brand.findUnique({
            where: { id: brand_id },
            select: { id: true },
          });
          if (!existingBrand)
            throw new ApiError(400, "DB_ERROR", "Brand not found!");

          if (existingProduct.brand_id) {
            await tx.brand.update({
              where: { id: existingProduct.brand_id },
              data: { products_count: { decrement: 1 } },
            });
          }

          await tx.brand.update({
            where: { id: brand_id },
            data: { products_count: { increment: 1 } },
          });

          updatedProductData.brand = { connect: { id: brand_id } };
        }

        // update product
        updatedProduct = await tx.product.update({
          where: { id },
          data: updatedProductData,
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            is_active: true,
            variants_count: true,
            store_products_count: true,
            brand: {
              select: { name: true, id: true },
            },
            category: {
              select: { name: true, id: true },
            },
          },
        });
      });
    } catch (error) {
      if (error instanceof ApiError) return next(error);
      console.log(error);
      return next(new ApiError(500, "DB_ERROR", "Couldn't update product!"));
    }

    if (!updatedProduct)
      return next(new ApiError(500, "DB_ERROR", "Couldn't update product!"));

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Product updated successfully!",
          updatedProduct,
        ),
      );
  },
);

// DELETE PRODUCT
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid product ID!"));

    try {
      await db.$transaction(async (tx) => {
        // check if product exists
        const existingProduct = await tx.product.findUnique({
          where: { id },
          select: { id: true, category_id: true, brand_id: true },
        });
        if (!existingProduct)
          throw new ApiError(404, "DB_ERROR", "Product not found!");

        // delete product
        await tx.product.delete({ where: { id: existingProduct.id } });

        // update category
        await tx.category.update({
          where: { id: existingProduct.category_id },
          data: { products_count: { decrement: 1 } },
        });

        // update brand
        existingProduct.brand_id &&
          (await tx.brand.update({
            where: { id: existingProduct.brand_id },
            data: { products_count: { decrement: 1 } },
          }));

        // update stats
        await tx.stats.update({
          where: { id: "GLOBAL" },
          data: { products_count: { decrement: 1 } },
        });
      });
    } catch (error: any) {
      console.log(error);
      return next(new ApiError(500, "DB_ERROR", "Couldn't delete product!"));
    }

    return res
      .status(200)
      .json(new APIResponse("success", "Product deleted successfully!"));
  },
);
