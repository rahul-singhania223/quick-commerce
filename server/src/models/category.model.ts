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
}
export const getAllCategories = async ({
  is_active,
  sort_name,
  created_at,
  search,
  parent_id,
}: QueryParams) => {
  try {
    // TODO: Add pagination

    const where: Prisma.CategoryWhereInput = {};

    // filter: active / inactive
    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    // by parent id
    if (parent_id) {
      where.parent_id = parent_id;
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
    const orderBy: Prisma.CategoryOrderByWithRelationInput = {
      created_at: created_at || "desc",
    };

    if (sort_name) {
      orderBy.name = sort_name;
    }

    const categories = await db.category.findMany({
      where,
      orderBy,
      include: {
        parent: {
          select: {
            name: true,
          },
        },
        _count: { select: { products: true, children: true } },
      },
    });
    return categories;
  } catch (error) {
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
  const constraints = [];

  if (id) constraints.push({ id });
  if (slug) constraints.push({ slug });
  if (name) constraints.push({ name });

  if (constraints.length === 0) return null;

  return db.category.findFirst({
    where: {
      OR: constraints,
    },
  });
};

// create category
export const createCategory = async (data: Category) => {
  try {
    const category = await db.category.create({
      data,
      include: {
        parent: { select: { name: true } },
        _count: { select: { products: true, children: true } },
      },
    });
    return category;
  } catch (error) {
    return null;
  }
};

// update category
export const updateCategory = async (id: string, data: Category) => {
  try {
    const category = await db.category.update({
      where: { id },
      data,
      include: {
        parent: { select: { name: true } },
        _count: { select: { products: true, children: true } },
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
    return null;
  }
};

// get categories count
export const getCategoriesCount = async () => {
  try {
    const count = await db.category.count();
    return count;
  } catch (error) {
    console.log(error);
    return null;
  }
};
