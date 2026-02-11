import db from "../configs/db.config.js";
import { Category, Prisma } from "../generated/prisma/client.js";

// get all categories

type SortOrder = "asc" | "desc";

interface QueryParams {
  is_active?: boolean;
  sort_name?: SortOrder; // A–Z / Z–A
  created_at?: SortOrder;
  search?: string;
  parent_id?: string;
  limit?: number;
  cursor?: string;
}
export const getAllCategories = async ({
  is_active,
  sort_name,
  created_at = "desc",
  search,
  parent_id,
  limit = 20,
  cursor,
}: QueryParams) => {
  try {
    const where: Prisma.CategoryWhereInput = {
      is_active,
      parent_id,
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

    // stable ordering
    const orderBy: Prisma.CategoryOrderByWithRelationInput[] = [
      { created_at },
      { id: "desc" }, // tie breaker (CRITICAL)
    ];

    if (sort_name) {
      orderBy.unshift({ name: sort_name });
    }

    const categories = await db.category.findMany({
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
        is_active: true,
        products_count: true,
        brands_count: true,
        level: true,
        parent: {
          select: { id: true, name: true },
        },
      },
    });

    // detect next page
    let nextCursor: string | null = null;

    if (categories.length > limit) {
      const nextItem = categories.pop();
      nextCursor = nextItem!.id;
    }

    return {
      data: categories,
      nextCursor,
      hasMore: !!nextCursor,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

// get category
export const getCategory = async ({
  id,
  slug,
  name,
}: {
  id?: string;
  slug?: string;
  name?: string;
}) => {
  const where: Prisma.CategoryWhereInput = {
    id,
    slug,
    name,
  };

  return db.category.findFirst({
    where,
    select: {
      id: true,
      name: true,
      level: true,
      products_count: true,
      brands_count: true,
      sort_order: true,
    },
  });
};

// create category
export const createCategory = async (data: Prisma.CategoryCreateInput) => {
  try {
    const category = await db.category.create({
      data,
      select: {
        id: true,
        name: true,
        is_active: true,
        products_count: true,
        brands_count: true,
        level: true,
        parent: {
          select: { id: true, name: true },
        },
      },
    });
    return category;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// update category
export const updateCategory = async (
  id: string,
  data: Prisma.CategoryUpdateInput,
) => {
  try {
    const category = await db.category.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        is_active: true,
        products_count: true,
        brands_count: true,
        level: true,
        parent: {
          select: { id: true, name: true },
        },
      },
    });
    return category;
  } catch (error) {
    return null;
  }
};

// delete category
export const deleteCategory = async (id: string) => {
  try {
    const category = await db.category.delete({ where: { id } });
    return category;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// get categories stats
export const getCategoryStats = async () => {
  try {
    const categoryStats = await db.stats.findFirst({
      select: { categories_count: true },
    });
    return categoryStats;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Increase category counts
export const increaseCategoryCount = async () => {
  try {
    const stats = await db.stats.findFirst();
    const updatedStats = await db.stats.update({
      where: { id: stats?.id },
      data: stats
        ? { categories_count: stats.categories_count + 1 }
        : { categories_count: 1 },
      select: { categories_count: true },
    });
    return updatedStats;
  } catch (error) {
    console.log(error);
    return null;
  }
};


// Decrease category counts
export const decreaseCategoryCount = async () => {
  try {
    const stats = await db.stats.findFirst();
    const updatedStats = await db.stats.update({
      where: { id: stats?.id },
      data: stats
        ? { categories_count: stats.categories_count - 1 }
        : { categories_count: 0 },
      select: { categories_count: true },
    });
    return updatedStats;
  } catch (error) {
    console.log(error);
    return null;
  }
};