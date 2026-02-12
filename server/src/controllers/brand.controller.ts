import { NextFunction, Request, Response } from "express";
import { brandFormSchema } from "../schemas/brand.schema.js";
import z from "zod";
import { ApiError } from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import { v4, validate as isValidUUID } from "uuid";
import { Brand, Prisma } from "../generated/prisma/client.js";
import { APIResponse } from "../utils/api-response.util.js";
import {
  createBrand as createDbBrand,
  getAllBrands as fetchAllBrands,
  getBrand as fetchBrand,
  updateBrand as updateDbBrand,
  deleteBrand as deleteDbBrand,
  getBrandStats as fetchBrandsStats,
  increaseBrandCount,
  decreaseBrandCount,
} from "../models/brand.model.js";
import slugify from "slugify";
import db from "../configs/db.config.js";

// GET BRANDS STATS
export const getBrandStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await fetchBrandsStats();

    return res
      .status(200)
      .json(
        new APIResponse("success", "Brands count fetched successfully!", stats),
      );
  },
);

// GET ALL BRANDS
export const getAllBrands = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // query
    const query = req.query;
    const is_active = query.is_active
      ? Boolean(Number(query.is_active))
      : undefined;

    const brands = await fetchAllBrands({
      ...query,
      is_active,
    });

    if (!brands)
      return next(new ApiError(404, "DB_ERROR", "Couldn't get brands!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Brands fetched successfully!", brands));
  },
);

// GET BRAND
export const getBrand = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid brand ID!"));

    const brand = await fetchBrand({ id });
    if (!brand) return next(new ApiError(404, "DB_ERROR", "Brand not found!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Brand fetched successfully!", brand));
  },
);

// CREATE BRAND
export const createBrand = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as z.infer<typeof brandFormSchema>;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!"),
      );

    const { name, logo, is_active } = data;

    // @ts-ignore
    const slug = slugify.default(name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: true,
    });

    const newBrandData: Prisma.BrandCreateInput = {
      id: v4(),
      name,
      slug,
      logo: logo,
      is_active,
    };

    let newBrand = null;

    try {
      newBrand = await db.$transaction(async (tx) => {
        // check duplicate
        const existingBrand = await tx.brand.findUnique({
          where: { name },
          select: { id: true },
        });
        if (existingBrand)
          throw new ApiError(400, "DB_ERROR", "Brand already exists!");

        // create brand
        const createdBrand = await tx.brand.create({
          data: newBrandData,
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            is_active: true,
            products_count: true,
          },
        });

        // update stats
        await tx.stats.update({
          where: { id: "GLOBAL" },
          data: { brands_count: { increment: 1 } },
        });

        return createdBrand;
      });
    } catch (error: any) {
      if (error instanceof ApiError) return next(error);
      console.log(error);
      return next(new ApiError(500, "DB_ERROR", "Couldn't create brand!"));
    }

    if (!newBrand)
      return next(new ApiError(500, "DB_ERROR", "Couldn't create brand!"));

    return res
      .status(200)
      .json(
        new APIResponse("success", "Brand created successfully!", newBrand),
      );
  },
);

// UPDATE BRAND
export const updateBrand = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as Partial<Brand>;
    const id = req.params.id;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!"),
      );

    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid brand ID!"));

    const { name } = data;

    if (data.name) {
      // @ts-ignore
      data.slug = slugify.default(name, {
        replacement: "-", // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: true, // strip special characters except replacement, defaults to `false`
      });
    }

    let updatedBrand = null;

    try {
      await db.$transaction(async (tx) => {
        const existingBrand = await tx.brand.findUnique({
          where: { id },
          select: { id: true, name: true },
        });
        if (!existingBrand)
          throw new ApiError(404, "DB_ERROR", "Brand not found!");

        const existingBrandWithNewName = name
          ? await tx.brand.findUnique({
              where: { slug: data.slug },
              select: { id: true },
            })
          : null;

        if (name && name !== existingBrand.name) {
          if (existingBrandWithNewName)
            throw new ApiError(400, "DB_ERROR", "Brand already exists!");
        }

        updatedBrand = await tx.brand.update({
          where: { id },
          data,
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            is_active: true,
            products_count: true,
          },
        });
      });
    } catch (error: any) {
      if (error instanceof ApiError) return next(error);
      console.log(error);
      return next(new ApiError(500, "DB_ERROR", "Couldn't update brand!"));
    }

    if (!updatedBrand)
      return next(new ApiError(500, "DB_ERROR", "Couldn't update brand!"));

    return res
      .status(200)
      .json(
        new APIResponse("success", "Brand updated successfully!", updatedBrand),
      );
  },
);

// DELETE BRAND
export const deleteBrand = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid brand ID!"));

    try {
      await db.$transaction(async (tx) => {
        // check if brand exists
        const existingBrand = await tx.brand.findUnique({
          where: { id },
          select: { id: true },
        });
        if (!existingBrand)
          throw new ApiError(404, "DB_ERROR", "Brand not found!");

        // delete brand
        const deletedBrand = await tx.brand.delete({
          where: { id },
        });

        // update stats
        await tx.stats.update({
          where: { id: "GLOBAL" },
          data: { brands_count: { decrement: 1 } },
        });
      });
    } catch (error: any) {
      if (error instanceof ApiError) return next(error);
      console.log(error);
      return next(new ApiError(500, "DB_ERROR", "Couldn't delete brand!"));
    }

    return res
      .status(200)
      .json(new APIResponse("success", "Brand deleted successfully!"));
  },
);
