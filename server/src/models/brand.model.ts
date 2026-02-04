import db from "../configs/db.config.js";
import { Brand, Prisma } from "../generated/prisma/client.js";

// create brand
export const createBrand = async (data: Brand) => {
  try {
    const brand = await db.brand.create({
      data,
      include: { _count: { select: { products: true } } },
    });
    return brand;
  } catch (error) {
    return null;
  }
};

// GET BRANDS COUNT
export const getBrandsCount = async () => {
  try {
    const count = await db.brand.count();
    return count;
  } catch (error) {
    return null;
  }
};

// get all brands
type SortOrder = "asc" | "desc";

interface QueryParams {
  is_active?: boolean;
  sort_name?: SortOrder; // A–Z / Z–A
  created_at?: SortOrder;
  search?: string;
}

export const getAllBrands = async ({
  is_active,
  sort_name,
  created_at,
  search,
}: QueryParams = {}) => {
  try {
    // TODO: Add pagination

    const where: Prisma.BrandWhereInput = {};

    // filter: active / inactive
    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    // search: name OR slug
    if (search && search.trim() !== "") {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // sorting
    const orderBy: Prisma.BrandOrderByWithRelationInput = {
      created_at: created_at || "desc",
    };

    if (sort_name) {
      orderBy.name = sort_name;
    }

    const brands = await db.brand.findMany({
      where,
      orderBy,
      include: {
        _count: { select: { products: true } },
      },
    });

    return brands;
  } catch (error) {
    console.error(error);
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
    const brand = await db.brand.update({
      where: { id },
      data,
      include: { _count: { select: { products: true } } },
    });
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
