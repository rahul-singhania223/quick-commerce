import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/async-handler.ts";
import { APIResponse } from "../utils/api-response.util.ts";
import { ApiError } from "../utils/api-error.ts";
import { v4, validate as isValidUUID } from "uuid";
import { productFormSchema } from "../schemas/product.schema.ts";
import z from "zod";
import { Category, Product } from "../generated/prisma/client.ts";
import slugify from "slugify";
import {
  createProduct as createDbProduct,
  getAllProducts as fetchAllProducts,
  getProduct as fetchProduct,
  updateProduct as updateDbProduct,
  deleteProduct as deleteDbProduct,
  searchProducts as searchDbProducts,
} from "../models/product.model.ts";

import { getCategory as fetchCategory } from "../models/category.model.ts";
import { getBrand as fetchBrand } from "../models/brand.model.ts";

// SEARCH PRODUCTS
export const searchProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    console.log(query);

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
          searchResults
        )
      );
  }
);

// GET ALL PRODUCTS
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Add pagination

    const products = await fetchAllProducts();
    if (!products)
      return next(new ApiError(404, "DB_ERROR", "Couldn't get products!"));

    return res
      .status(200)
      .json(
        new APIResponse("success", "Products fetched successfully!", products)
      );
  }
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
        new APIResponse("success", "Product fetched successfully!", product)
      );
  }
);

// CREATE PRODUCT
export const createProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as z.infer<typeof productFormSchema>;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!")
      );

    const { name, description, category_id, brand_id, is_active } = data;

    // check if category exists
    const existingCategory: Category | null = await fetchCategory({ id: category_id });
    if (!existingCategory)
      return next(new ApiError(400, "DB_ERROR", "Category not found!"));

    // check if brand exists
    if (brand_id) {
      const existingBrand = await fetchBrand({ id: brand_id });
      if (!existingBrand)
        return next(new ApiError(400, "DB_ERROR", "Brand not found!"));
    }

    const newProductData: Product = {
      id: v4(),
      name,
      description,
      category_id,
      brand_id,
      is_active,
      slug: "",
      created_at: new Date(),
      updated_at: new Date(),
    };

    // create slug
    // @ts-ignore
    newProductData.slug = slugify.default(newProductData.name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: true,
      trim: true,
    });

    // create new product
    const newProduct = await createDbProduct(newProductData);
    if (!newProduct)
      return next(new ApiError(400, "DB_ERROR", "Couldn't create product!"));

    // return response
    return res
      .status(200)
      .json(
        new APIResponse("success", "Product created successfully!", newProduct)
      );
  }
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
        new ApiError(400, "INVALID_DATA", "All input fields are required!")
      );

    // check if product exists
    const existingProduct = await fetchProduct({ id });
    if (!existingProduct)
      return next(new ApiError(404, "DB_ERROR", "Product not found!"));

    // check if category exists
    if (data.category_id) {
      const existingCategory: Category | null = await fetchCategory({
        id: data.category_id,
      });
      if (!existingCategory)
        return next(new ApiError(400, "DB_ERROR", "Category not found!"));
    }

    // check if brand exists
    if (data.brand_id) {
      const existingBrand = await fetchBrand({ id: data.brand_id });
      if (!existingBrand)
        return next(new ApiError(400, "DB_ERROR", "Brand not found!"));
    }

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

    const updatedProductData: Product = {
      ...existingProduct,
      ...data,
      updated_at: new Date(),
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
          updatedProduct
        )
      );
  }
);

// DELETE PRODUCT
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid product ID!"));

    const existingProduct: Product | null = await fetchProduct({ id });
    if (!existingProduct)
      return next(new ApiError(404, "DB_ERROR", "Product not found!"));

    const deletedProduct = await deleteDbProduct(existingProduct.id);
    if (!deletedProduct)
      return next(new ApiError(500, "DB_ERROR", "Couldn't delete product!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Product deleted successfully!"));
  }
);
