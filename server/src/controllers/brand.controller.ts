import { NextFunction, Request, Response } from "express";
import { brandFormSchema } from "../schemas/brand.schema.ts";
import z from "zod";
import { ApiError } from "../utils/api-error.ts";
import asyncHandler from "../utils/async-handler.ts";
import { v4, validate as isValidUUID } from "uuid";
import { Brand } from "../generated/prisma/client.ts";
import { APIResponse } from "../utils/api-response.util.ts";
import {
  createBrand as createDbBrand,
  getAllBrands as fetchAllBrands,
  getBrand as fetchBrand,
  updateBrand as updateDbBrand,
  deleteBrand as deleteDbBrand,
} from "../models/brand.model.ts";

import slugify from "slugify";

// GET ALL BRANDS
export const getAllBrands = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Add pagination

    const brands = await fetchAllBrands();
    if (!brands)
      return next(new ApiError(404, "DB_ERROR", "Couldn't get brands!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Brands fetched successfully!", brands));
  }
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
  }
);

// CREATE BRAND
export const createBrand = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as z.infer<typeof brandFormSchema>;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!")
      );

    const { name, logo, description, is_active } = data;

    // @ts-ignore
    const slug = slugify.default(name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: true,
    });

    const existingBrand: Brand  | null = await fetchBrand({ name });
    if (existingBrand)
      return next(new ApiError(400, "DB_ERROR", "Brand already exists!"));

    const newBrandData: Brand = {
      id: v4(),
      name,
      slug,
      logo: logo,
      description: description,
      is_active,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const newBrand = await createDbBrand(newBrandData);
    if (!newBrand)
      return next(new ApiError(500, "DB_ERROR", "Couldn't create brand!"));

    return res
      .status(200)
      .json(
        new APIResponse("success", "Brand created successfully!", newBrand)
      );
  }
);

// UPDATE BRAND
export const updateBrand = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as Partial<Brand>;
    const id = req.params.id;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!")
      );

    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid brand ID!"));

    const existingBrand: Brand | null = await fetchBrand({ id });
    if (!existingBrand)
      return next(new ApiError(404, "DB_ERROR", "Brand not found!"));

    const { name } = data;

    if (name && name !== existingBrand.name) {
      const existingBrandWithNewName: Brand | null = await fetchBrand({ name });
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

    const updatedBrandData: Brand = {
      ...existingBrand,
      ...data,
      updated_at: new Date(),
    };

    const updatedBrand = await updateDbBrand(
      existingBrand.id,
      updatedBrandData
    );
    if (!updatedBrand)
      return next(new ApiError(500, "DB_ERROR", "Couldn't update brand!"));

    return res
      .status(200)
      .json(
        new APIResponse("success", "Brand updated successfully!", updatedBrand)
      );
  }
);

// DELETE BRAND
export const deleteBrand = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid brand ID!"));

    const existingBrand: Brand | null = await fetchBrand({ id });
    if (!existingBrand)
      return next(new ApiError(404, "DB_ERROR", "Brand not found!"));

    const deletedBrand = await deleteDbBrand(existingBrand.id);
    if (!deletedBrand)
      return next(new ApiError(500, "DB_ERROR", "Couldn't delete brand!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Brand deleted successfully!"));
  }
);
