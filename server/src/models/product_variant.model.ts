import db from "../configs/db.config.js";
import { Prisma, ProductVariant } from "../generated/prisma/client.js";

// GET ALL PRODUCT VARIANTS

interface QueryParams {
  product_id?: string;
}

export const getAllProductVariants = async ({ product_id }: QueryParams) => {
  try {
    // TODO: Add pagination

    const where: Prisma.ProductVariantWhereInput = {};
    const orderBy: Prisma.ProductVariantOrderByWithRelationInput = {
      created_at: "desc",
    };

    if (product_id) where.product_id = product_id;

    const productVariants = await db.productVariant.findMany({
      where,
      orderBy,
    });
    return productVariants;
  } catch (error) {
    return null;
  }
};

// GET PRODUCT VARIANT
export const getProductVariant = async ({
  id,
  sku,
}: {
  id?: string;
  sku?: string;
}) => {
  try {
    const constraints = [];

    if (id) constraints.push({ id });
    if (sku) constraints.push({ sku });

    if (constraints.length === 0) return null;

    return db.productVariant.findFirst({
      where: {
        OR: constraints,
      },
    });
  } catch (error) {
    return null;
  }
};

// DELETE PRODUCT VARIANT
export const deleteProductVariant = async (id: string) => {
  try {
    const deletedProductVariant = await db.productVariant.delete({
      where: { id },
    });
    return deletedProductVariant;
  } catch (error) {
    return null;
  }
};

// CREATE PRODUCT VARIANT
export const createProductVariant = async (productVariant: ProductVariant) => {
  try {
    const newProductVariant = await db.productVariant.create({
      data: productVariant,
    });
    return newProductVariant;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// UPDATE PRODUCT VARIANT
export const updateProductVariant = async (
  id: string,
  productVariant: ProductVariant,
) => {
  try {
    const updatedProductVariant = await db.productVariant.update({
      where: { id },
      data: productVariant,
    });
    return updatedProductVariant;
  } catch (error) {
    return null;
  }
};
