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

    const existingBrand = await fetchBrand({ name });
    if (existingBrand)
      return next(new ApiError(400, "DB_ERROR", "Brand already exists!"));

    const newBrandData: Prisma.BrandCreateInput = {
      id: v4(),
      name,
      slug,
      logo: logo,
      is_active,
    };

    const [newBrand, updatedStats] = await Promise.all([
      createDbBrand(newBrandData),
      increaseBrandCount(),
    ]);

    if (!newBrand)
      return next(new ApiError(500, "DB_ERROR", "Couldn't create brand!"));

    if (!updatedStats)
      return next(new ApiError(500, "DB_ERROR", "Couldn't update stats!"));

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

    const [existingBrand, existingBrandWithNewName] = await Promise.all([
      fetchBrand({ id }),
      name ? fetchBrand({ name }) : null,
    ]);

    if (!existingBrand)
      return next(new ApiError(404, "DB_ERROR", "Brand not found!"));

    if (name && name !== existingBrand.name) {
      if (existingBrandWithNewName)
        return next(new ApiError(400, "DB_ERROR", "Brand already exists!"));

      // @ts-ignore
      data.slug = slugify.default(name, {
        replacement: "-", // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: true, // strip special characters except replacement, defaults to `false`
      });
    }

    const updatedBrandData: Prisma.BrandUpdateInput = {
      ...data,
    };

    const updatedBrand = await updateDbBrand(
      existingBrand.id,
      updatedBrandData,
    );
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

    const existingBrand = await fetchBrand({ id });

    if (!existingBrand)
      return next(new ApiError(404, "DB_ERROR", "Brand not found!"));

    const [deletedBrand, updatedStats] = await Promise.all([
      deleteDbBrand(id),
      decreaseBrandCount(),
    ]);

    if (!deletedBrand)
      return next(new ApiError(500, "DB_ERROR", "Couldn't delete brand!"));

    if (!updatedStats)
      return next(new ApiError(500, "DB_ERROR", "Couldn't update stats!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Brand deleted successfully!"));
  },
);
