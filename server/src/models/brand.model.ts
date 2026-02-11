import { name } from "ejs";
import db from "../configs/db.config.js";
import { Brand, Prisma } from "../generated/prisma/client.js";

// create brand
export const createBrand = async (data: Prisma.BrandCreateInput) => {
  try {
    const brand = await db.brand.create({
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
    return brand;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// GET BRANDS COUNT
export const getBrandStats = async () => {
  try {
    const count = await db.stats.findFirst({ select: { brands_count: true } });
    return count;
  } catch (error) {
    console.log(error);
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
  limit?: number;
  cursor?: string;
}

export const getAllBrands = async ({
  is_active,
  sort_name,
  created_at,
  search,
  limit = 20,
  cursor,
}: QueryParams = {}) => {
  try {
    const where: Prisma.BrandWhereInput = {
      is_active,
    };

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
      take: Number(limit) + 1, // Fetch extra to detect next page
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        is_active: true,
        products_count: true,
      },
    });

    // detect next page
    let nextCursor: string | null = null;

    if (brands.length > limit) {
      const nextItem = brands.pop();
      nextCursor = nextItem!.id;
    }

    return {
      data: brands,
      nextCursor,
      hasMore: !!nextCursor,
    };
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
  const where: Prisma.BrandWhereInput = {
    id,
    slug,
    name,
  };

  return db.brand.findFirst({
    where,
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      is_active: true,
      products_count: true,
    },
  });
};

// update brand
export const updateBrand = async (
  id: string,
  data: Prisma.BrandUpdateInput,
) => {
  try {
    const brand = await db.brand.update({
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
    return brand;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// delete brand
export const deleteBrand = async (id: string) => {
  try {
    const brand = await db.brand.delete({ where: { id } });
    return brand;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const increaseBrandCount = async () => {
  try {
    const stats = await db.stats.findFirst();

    const updatedStats = await db.stats.update({
      where: { id: stats?.id },
      data: stats
        ? { brands_count: stats.brands_count + 1 }
        : { brands_count: 1 },
      select: { brands_count: true },
    });

    return updatedStats;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// decrease product count
export const decreaseBrandCount = async () => {
  try {
    const stats = await db.stats.findFirst();

    const updatedStats = await db.stats.update({
      where: { id: stats?.id },
      data: stats
        ? { brands_count: stats.brands_count - 1 }
        : { brands_count: 0 },
      select: { brands_count: true },
    });

    return updatedStats;
  } catch (error) {
    console.log(error);
    return null;
  }
};
