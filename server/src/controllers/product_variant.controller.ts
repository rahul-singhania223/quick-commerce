import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/async-handler.js";
import { APIResponse } from "../utils/api-response.util.js";
import { ApiError } from "../utils/api-error.js";
import z from "zod";
import { createProductVariantSchema } from "../schemas/product_variant.schema.js";
import { v4, validate as isValidUUID } from "uuid";
import { Prisma, ProductVariant } from "../generated/prisma/client.js";
import {
  getAllProductVariants as fetchAllProductVariants,
  getProductVariant as fetchProductVariant,
  createProductVariant as createDbProductVariant,
  updateProductVariant as updateDbProductVariant,
  deleteProductVariant as deleteDbProductVariant,
} from "../models/product_variant.model.js";
import {
  getProduct as fetchProduct,
  updateProduct,
} from "../models/product.model.js";
import slugify from "slugify";
import db from "../configs/db.config.js";

// GET ALL PRODUCT VARIANTS
export const getAllProductVariants = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const productVariants = await fetchAllProductVariants(query);
    if (!productVariants)
      return next(
        new ApiError(404, "DB_ERROR", "Couldn't get product variants!"),
      );

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Product variants fetched successfully!",
          productVariants,
        ),
      );
  },
);

// GET PRODUCT VARIANT
export const getProductVariant = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(
        new ApiError(400, "INVALID_DATA", "Invalid product variant ID!"),
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
          productVariant,
        ),
      );
  },
);

// CREATE PRODUCT VARIANT
export const createProductVariant = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as z.infer<typeof createProductVariantSchema>;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!"),
      );

    // @ts-ignore
    const sku = slugify.default(data.name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: true,
      trim: true,
    });

    const { product_id, name, mrp, unit, image, weight, is_active } = data;

    // data validation
    if (!product_id || !isValidUUID(product_id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid product ID!"));

    const newProductVariantData: Prisma.ProductVariantCreateInput = {
      product: {},
      name,
      slug: sku,
      mrp: new Prisma.Decimal(mrp),
      unit,
      weight: weight ? new Prisma.Decimal(weight) : null,
      image,
      is_active,
    };

    let newProductVariant = null;

    try {
      await db.$transaction(async (tx) => {
        // check if product exists
        const existingProduct = await tx.product.findUnique({
          where: { id: data.product_id },
          select: { id: true },
        });
        if (!existingProduct)
          throw new ApiError(400, "DB_ERROR", "Product not found!");

        newProductVariantData.product = { connect: { id: data.product_id } };

        // check if product variant exists
        const existingProductVariant = await tx.productVariant.findUnique({
          where: { slug: sku, product_id: data.product_id },
          select: { id: true },
        });
        if (existingProductVariant)
          throw new ApiError(
            400,
            "DB_ERROR",
            "Product variant already exists!",
          );

        // creae product variant
        newProductVariant = await tx.productVariant.create({
          data: newProductVariantData,
        });

        await tx.product.update({
          where: { id: data.product_id },
          data: { variants_count: { increment: 1 } },
        });
      });
    } catch (error: any) {
      if (error instanceof ApiError) return next(error);
      console.log(error);
      return next(
        new ApiError(500, "DB_ERROR", "Couldn't create product variant!"),
      );
    }

    if (!newProductVariant)
      return next(new ApiError(500, "DB_ERROR", "Couldn't create product!"));

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Product variant created successfully!",
          newProductVariant,
        ),
      );
  },
);

// UPDATE PRODUCT VARIANT
export const updateProductVariant = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(
        new ApiError(400, "INVALID_DATA", "Invalid product variant ID!"),
      );

    const data = req.body as Partial<ProductVariant>;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!"),
      );

    // @ts-ignore
    const slug = slugify.default(data.name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: true,
      trim: true,
    });

    const [
      existingProductVariant,
      existingProduct,
      existingProductVariantName,
    ] = await Promise.all([
      fetchProductVariant({ id }),
      fetchProduct({ id: data.product_id }),
      data.name ? fetchProductVariant({ slug }) : null,
    ]);

    if (!existingProductVariant)
      return next(new ApiError(404, "DB_ERROR", "Product variant not found!"));

    if (data.product_id) {
      if (!existingProduct)
        return next(new ApiError(400, "DB_ERROR", "Product not found!"));
    }

    if (data.name) {
      if (existingProductVariantName)
        return next(
          new ApiError(
            400,
            "DB_ERROR",
            "Product variant with this name already exists!",
          ),
        );
    }

    const updateProductVariantData: Prisma.ProductVariantUpdateInput = {
      ...data,
    };

    const updatedProductVariant = await updateDbProductVariant(
      existingProductVariant.id,
      updateProductVariantData,
    );
    if (!updatedProductVariant)
      return next(
        new ApiError(500, "DB_ERROR", "Couldn't update product variant!"),
      );

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Product variant updated successfully!",
          updatedProductVariant,
        ),
      );
  },
);

// DELETE PRODUCT VARIANT
export const deleteProductVariant = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(
        new ApiError(400, "INVALID_DATA", "Invalid product variant ID!"),
      );

    try {
      await db.$transaction(async (tx) => {
        // check if product variant exists
        const existingProductVariant = await tx.productVariant.findUnique({
          where: { id },
          select: { id: true, product_id: true },
        });
        if (!existingProductVariant)
          throw new ApiError(404, "DB_ERROR", "Product variant not found!");

        await tx.product.update({
          where: { id: existingProductVariant.product_id },
          data: { variants_count: { decrement: 1 } },
        });

        // delete product variant
        const deletedProductVariant = await tx.productVariant.delete({
          where: { id },
        });
      });
    } catch (error: any) {
      if (error instanceof ApiError) return next(error);
      console.log(error);
      return next(
        new ApiError(500, "DB_ERROR", "Couldn't delete product variant!"),
      );
    }

    return res
      .status(200)
      .json(
        new APIResponse("success", "Product variant deleted successfully!"),
      );
  },
);
