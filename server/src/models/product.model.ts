import db from "../configs/db.config.js";
import { Prisma, Product } from "../generated/prisma/client.js";

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
  category_id?: string;
  brand_id?: string;
  limit?: number;
  cursor?: string;
}
export const getAllProducts = async ({
  is_active,
  search,
  created_at = "desc",
  category_id = undefined,
  brand_id = undefined,
  limit = 20,
  cursor,
}: QueryParams) => {
  try {
    const where: Prisma.ProductWhereInput = {
      is_active,
      category_id,
      brand_id,
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
    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      created_at: created_at,
    };

    const products = await db.product.findMany({
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
        image: true,
        is_active: true,
        variants_count: true,
        store_products_count: true,
        brand: {
          select: { name: true, id: true },
        },
        category: {
          select: { name: true, id: true },
        },
      },
    });

    // detect next page
    let nextCursor: string | null = null;

    if (products.length > limit) {
      const nextItem = products.pop();
      nextCursor = nextItem!.id;
    }

    return {
      data: products,
      nextCursor,
      hasMore: !!nextCursor,
    };
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
    const where: Prisma.ProductWhereInput = {};

    if (slug) {
      delete where.id;
      where.slug = slug;
    }
    if (id) {
      delete where.slug;
      where.id = id;
    }

    return db.product.findFirst({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        is_active: true,
        variants_count: true,
        category_id: true,
        category: {
          select: { products_count: true },
        },
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

// create product
export const createProduct = async (data: Prisma.ProductCreateInput) => {
  try {
    const newProduct = await db.product.create({
      data,
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        is_active: true,
        variants_count: true,
        store_products_count: true,
        brand: {
          select: { name: true, id: true },
        },
        category: {
          select: { name: true, id: true },
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
export const updateProduct = async (
  id: string,
  data: Prisma.ProductUpdateInput,
) => {
  try {
    const updatedProduct = await db.product.update({
      where: { id },
      data: data,
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        is_active: true,
        variants_count: true,
        store_products_count: true,
        brand: {
          select: { name: true, id: true },
        },
        category: {
          select: { name: true, id: true },
        },
      },
    });
    return updatedProduct;
  } catch (error) {
    console.log(error);
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
