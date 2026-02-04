import db from "../configs/db.config.js";
import { Prisma, Product } from "../generated/prisma/client.js";

// Get product count
export const fetchProductsCount = async () => {
  try {
    const count = await db.product.count();
    return count;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// searcch products
type SearchParams = {
  q?: string; // search text
  category_id?: string;
  brand_id?: string;
  limit?: number; // default 20
  cursor?: string; // pagination
};

export const searchProducts = async ({
  q,
  category_id,
  brand_id,
  limit,
}: SearchParams) => {
  try {
    const products = await db.product.findMany({
      where: {
        is_active: true,

        ...(q && {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
        }),

        ...(category_id && { category_id }),
        ...(brand_id && { brand_id }),

        variants: {
          some: {
            is_active: true,
          },
        },
      },

      select: {
        id: true,
        name: true,
        slug: true,

        brand: {
          select: { name: true },
        },

        category: {
          select: { name: true },
        },

        variants: {
          where: { is_active: true },
          select: {
            id: true,
            name: true,
            mrp: true,
          },
        },
      },

      take: limit ?? 20,
      orderBy: {
        name: "asc",
      },
    });

    return products;
  } catch (error) {
    return null;
  }
};

// get all products
type SortOrder = "asc" | "desc";

interface QueryParams {
  is_active?: boolean;
  created_at?: SortOrder;
  search?: string;
  category?: string;
  brand?: string;
}
export const getAllProducts = async ({
  is_active,
  search,
  created_at,
  category,
  brand,
}: QueryParams) => {
  try {
    // TODO: Add pagination

    const where: Prisma.ProductWhereInput = {};

    // filter: active / inactive
    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    // filter by brand (by name)
    if (brand && brand.trim() !== "") {
      where.brand = {
        is: {
          name: {
            equals: brand,
            mode: "insensitive",
          },
        },
      };
    }

    // filter by category (by name)
    if (category && category.trim() !== "") {
      where.category = {
        is: {
          name: {
            equals: category,
            mode: "insensitive",
          },
        },
      };
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

    const products = await db.product.findMany({
      where,
      orderBy,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            variants: true,
            storeProducts: true,
          },
        },
      },
    });
    return products;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// get product
export const getProduct = async ({
  id,
  slug,
}: {
  id?: string;
  slug?: string;
}) => {
  try {
    const constraints = [];

    if (id) constraints.push({ id });
    if (slug) constraints.push({ slug });

    if (constraints.length === 0) return null;

    return db.product.findFirst({
      where: {
        OR: constraints,
      },
    });
  } catch (error) {
    return null;
  }
};

// create product
export const createProduct = async (product: Product) => {
  try {
    // category id+name, brand id+name, slug, variants count, storeproducts count
    const newProduct = await db.product.create({
      data: product,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            variants: true,
            storeProducts: true,
          },
        },
      },
    });
    return newProduct;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// update product
export const updateProduct = async (id: string, product: Product) => {
  try {
    const updatedProduct = await db.product.update({
      where: { id },
      data: product,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            variants: true,
            storeProducts: true,
          },
        },
      },
    });
    return updatedProduct;
  } catch (error) {
    return null;
  }
};

// delete product
export const deleteProduct = async (id: string) => {
  try {
    const deletedProduct = await db.product.delete({ where: { id } });
    return deletedProduct;
  } catch (error) {
    return null;
  }
};
