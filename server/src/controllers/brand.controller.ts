import { NextFunction, Request, Response } from "express";
import { brandFormSchema } from "../schemas/brand.schema.js";
import z from "zod";
import { ApiError } from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import { v4, validate as isValidUUID } from "uuid";
import { Brand } from "../generated/prisma/client.js";
import { APIResponse } from "../utils/api-response.util.js";
import {
  createBrand as createDbBrand,
  getAllBrands as fetchAllBrands,
  getBrand as fetchBrand,
  updateBrand as updateDbBrand,
  deleteBrand as deleteDbBrand,
  getBrandsCount as fetchBrandsCount,
} from "../models/brand.model.js";

import slugify from "slugify";

// GET BRANDS COUNT
export const getBrandsCount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const count = await fetchBrandsCount();

    return res.status(200).json(
      new APIResponse("success", "Brands count fetched successfully!", {
        count: count,
      }),
    );
  },
);

// GET ALL BRANDS
export const getAllBrands = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Add pagination

    // query
    const query = req.query as any;
    const params: { is_active?: boolean } = { is_active: undefined };
    if (query.is_active) {
      params.is_active =
        query.is_active === "true"
          ? true
          : query.is_active === "false"
            ? false
            : undefined;
    }

    const brands = await fetchAllBrands({
      is_active: params.is_active,
      sort_name: query.name,
      created_at: query.created_at,
      search: query.search,
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

    const existingBrand: Brand | null = await fetchBrand({ name });
    if (existingBrand)
      return next(new ApiError(400, "DB_ERROR", "Brand already exists!"));

    const newBrandData: Brand = {
      id: v4(),
      name,
      slug,
      logo: logo,
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

    const existingBrand: Brand | null = await fetchBrand({ id });
    if (!existingBrand)
      return next(new ApiError(404, "DB_ERROR", "Brand not found!"));

    const deletedBrand = await deleteDbBrand(existingBrand.id);
    if (!deletedBrand)
      return next(new ApiError(500, "DB_ERROR", "Couldn't delete brand!"));

    return res
      .status(200)
      .json(new APIResponse("success", "Brand deleted successfully!"));
  },
);
