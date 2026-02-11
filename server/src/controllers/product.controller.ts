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
import { getBrand as fetchBrand } from "../models/brand.model.js";
import {
  decreaseProductCount,
  fetchProductStats,
  increaseProductCount,
} from "../models/product_stats.model.js";

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

    const [existingCategory, existingBrand] = await Promise.all([
      fetchCategory({ id: category_id }),
      brand_id ? fetchBrand({ id: brand_id }) : null,
    ]);

    if (!existingCategory)
      return next(new ApiError(400, "DB_ERROR", "Category not found!"));

    // // check if brand exists
    if (brand_id) {
      if (!existingBrand)
        return next(new ApiError(400, "DB_ERROR", "Brand not found!"));
    }

    const newProductData: Prisma.ProductCreateInput = {
      id: v4(),
      name,
      image,
      description,
      category: {
        connect: { id: existingCategory.id },
      },
      brand:
        brand_id && existingBrand
          ? { connect: { id: existingBrand.id } }
          : undefined,
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

    // create new product
    const [newProduct, updatedCategory, updatedStats] = await Promise.all([
      createDbProduct(newProductData),
      updateCategory(existingCategory.id, {
        products_count: existingCategory.products_count
          ? existingCategory.products_count + 1
          : 1,
      }),
      increaseProductCount(),
    ]);

    if (!newProduct)
      return next(new ApiError(400, "DB_ERROR", "Couldn't create product!"));

    if (!updatedCategory)
      return next(new ApiError(500, "DB_ERROR", "Couldn't update category!"));

    if (!updatedStats)
      return next(new ApiError(500, "DB_ERROR", "Couldn't update stats!"));

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

    const [existingProduct, existingCategory, existingBrand] =
      await Promise.all([
        fetchProduct({ id }),
        category_id ? fetchCategory({ id: category_id }) : null,
        brand_id ? fetchBrand({ id: brand_id }) : null,
      ]);

    if (!existingProduct)
      return next(new ApiError(404, "DB_ERROR", "Product not found!"));
    if (category_id && !existingCategory)
      return next(new ApiError(400, "DB_ERROR", "Category not found!"));
    if (brand_id && !existingBrand)
      return next(new ApiError(400, "DB_ERROR", "Brand not found!"));

    // update slug
    if (data.name && data.name !== existingProduct.name) {
      // @ts-ignore
      data.slug = slugify.default(data.name, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: true,
        trim: true,
      });
    }

    const updatedProductData: Prisma.ProductUpdateInput = {
      ...data,
    };

    const updatedProduct = await updateDbProduct(id, updatedProductData);
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

    const existingProduct = await fetchProduct({ id });
    if (!existingProduct)
      return next(new ApiError(404, "DB_ERROR", "Product not found!"));

    const [deletedProduct, updatedCategory, updatedStats] = await Promise.all([
      deleteDbProduct(existingProduct.id),
      updateCategory(existingProduct.category_id, {
        products_count: existingProduct.category.products_count
          ? existingProduct.category.products_count - 1
          : 0,
      }),
      decreaseProductCount(),
    ]);

    if (!deletedProduct)
      return next(new ApiError(500, "DB_ERROR", "Couldn't delete product!"));
    if (!updatedCategory)
      return next(new ApiError(500, "DB_ERROR", "Couldn't update category!"));
    if (!updatedStats)
      return next(new ApiError(500, "DB_ERROR", "Couldn't update stats!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Product deleted successfully!"));
  },
);
