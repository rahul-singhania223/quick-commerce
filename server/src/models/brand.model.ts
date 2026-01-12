import db from "../configs/db.config.ts";
import { Brand } from "../generated/prisma/client.ts";

// create brand
export const createBrand = async (data: Brand) => {
  try {
    const brand = await db.brand.create({ data });
    return brand;
  } catch (error) {
    return null;
  }
};

// get all brands
export const getAllBrands = async () => {
  try {
    // TODO: Add pagination

    const brands = await db.brand.findMany({});
    return brands;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// get brand
export const getBrand = async ({
  id,
  slug,
  name,
}: {
  id?: string;
  slug?: string;
  name?: string;
}) => {
  const constraints = [];

  if (id) constraints.push({ id });
  if (slug) constraints.push({ slug });
  if (name) constraints.push({ name });

  if (constraints.length === 0) return null;

  return db.brand.findFirst({
    where: {
      OR: constraints,
    },
  });
};

// update brand
export const updateBrand = async (id: string, data: Brand) => {
  try {
    const brand = await db.brand.update({ where: { id }, data });
    return brand;
  } catch (error) {
    return null;
  }
};

// delete brand
export const deleteBrand = async (id: string) => {
  try {
    const brand = await db.brand.delete({ where: { id } });
    return brand;
  } catch (error) {
    return null;
  }
};
