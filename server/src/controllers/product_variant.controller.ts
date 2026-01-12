import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/async-handler.ts";
import { APIResponse } from "../utils/api-response.util.ts";
import { ApiError } from "../utils/api-error.ts";
import z from "zod";
import { createProductVariantSchema } from "../schemas/product_variant.schema.ts";
import { v4, validate as isValidUUID } from "uuid";
import { Prisma, ProductVariant } from "../generated/prisma/client.ts";
import {
  getAllProductVariants as fetchAllProductVariants,
  getProductVariant as fetchProductVariant,
  createProductVariant as createDbProductVariant,
  updateProductVariant as updateDbProductVariant,
  deleteProductVariant as deleteDbProductVariant,
} from "../models/product_variant.model.ts";
import { getProduct as fetchProduct } from "../models/product.model.ts";

// GET ALL PRODUCT VARIANTS
export const getAllProductVariants = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Add pagination

    const productVariants = await fetchAllProductVariants();
    if (!productVariants)
      return next(
        new ApiError(404, "DB_ERROR", "Couldn't get product variants!")
      );

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Product variants fetched successfully!",
          productVariants
        )
      );
  }
);

// GET PRODUCT VARIANT
export const getProductVariant = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(
        new ApiError(400, "INVALID_DATA", "Invalid product variant ID!")
      );

    const productVariant = await fetchProductVariant({ id });
    if (!productVariant)
      return next(new ApiError(404, "DB_ERROR", "Product variant not found!"));

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Product variant fetched successfully!",
          productVariant
        )
      );
  }
);

// CREATE PRODUCT VARIANT
export const createProductVariant = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as z.infer<typeof createProductVariantSchema>;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!")
      );

    // check if product variant exists
    const existingProductVariant = await fetchProductVariant({ sku: data.sku });
    if (existingProductVariant)
      return next(new ApiError(400, "DB_ERROR", "Product variant exists!"));

    // check if product exists
    const existingProduct = await fetchProduct({ id: data.product_id });
    if (!existingProduct)
      return next(new ApiError(400, "DB_ERROR", "Product not found!"));

    const { product_id, name, sku, mrp, unit, image, weight, is_active } = data;

    const newProductVariantData: ProductVariant = {
      id: v4(),
      product_id,
      name,
      sku,
      mrp: new Prisma.Decimal(mrp),
      unit,
      weight: weight ? new Prisma.Decimal(weight) : null,
      image,
      is_active,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const productVariant = await createDbProductVariant(newProductVariantData);
    if (!productVariant)
      return next(new ApiError(500, "DB_ERROR", "Couldn't create product!"));

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Product variant created successfully!",
          productVariant
        )
      );
  }
);

// UPDATE PRODUCT VARIANT
export const updateProductVariant = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(
        new ApiError(400, "INVALID_DATA", "Invalid product variant ID!")
      );

    const data = req.body as Partial<ProductVariant>;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!")
      );

    const existingProductVariant = await fetchProductVariant({ id });
    if (!existingProductVariant)
      return next(new ApiError(404, "DB_ERROR", "Product variant not found!"));

    if (data.product_id) {
      const existingProduct = await fetchProduct({ id: data.product_id });
      if (!existingProduct)
        return next(new ApiError(400, "DB_ERROR", "Product not found!"));
    }

    if (data.sku) {
      const existingProductVariant = await fetchProductVariant({
        sku: data.sku,
      });
      if (existingProductVariant)
        return next(new ApiError(400, "DB_ERROR", "Product variant exists!"));
    }

    const updateProductVariantData: ProductVariant = {
      ...existingProductVariant,
      ...data,
      updated_at: new Date(),
    };

    const updatedProductVariant = await updateDbProductVariant(
      existingProductVariant.id,
      updateProductVariantData
    );
    if (!updatedProductVariant)
      return next(
        new ApiError(500, "DB_ERROR", "Couldn't update product variant!")
      );

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Product variant updated successfully!",
          updatedProductVariant
        )
      );
  }
);

// DELETE PRODUCT VARIANT
export const deleteProductVariant = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(
        new ApiError(400, "INVALID_DATA", "Invalid product variant ID!")
      );

    const existingProductVariant: ProductVariant | null = await fetchProductVariant({
      id,
    });
    if (!existingProductVariant)
      return next(new ApiError(404, "DB_ERROR", "Product variant not found!"));

    const deletedProductVariant = await deleteDbProductVariant(
      existingProductVariant.id
    );
    if (!deletedProductVariant)
      return next(
        new ApiError(500, "DB_ERROR", "Couldn't delete product variant!")
      );

    return res
      .status(200)
      .json(
        new APIResponse("success", "Product variant deleted successfully!")
      );
  }
);
