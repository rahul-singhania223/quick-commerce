import db from "../configs/db.config.ts";
import { Product } from "../generated/prisma/client.ts";

// searcch products
type QueryParams = {
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
}: QueryParams) => {
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
export const getAllProducts = async () => {
  try {
    // TODO: Add pagination

    const products = await db.product.findMany({});
    return products;
  } catch (error) {
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
    const newProduct = await db.product.create({ data: product });
    return newProduct;
  } catch (error) {
    return null;
  }
};

// update product
export const updateProduct = async (id: string, product: Product) => {
  try {
    const updatedProduct = await db.product.update({
      where: { id },
      data: product,
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
