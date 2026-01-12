import db from "../configs/db.config.js";
import { ProductVariant } from "../generated/prisma/client.js";

// GET ALL PRODUCT VARIANTS
export const getAllProductVariants = async () => {
  try {
    // TODO: Add pagination

    const productVariants = await db.productVariant.findMany({});
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
    const deletedProductVariant = await db.productVariant.delete({ where: { id } });
    return deletedProductVariant;
  } catch (error) {
    return null;
  }
};


// CREATE PRODUCT VARIANT
export const createProductVariant = async (productVariant: ProductVariant) => {
  try {
    const newProductVariant = await db.productVariant.create({ data: productVariant });
    return newProductVariant;
  } catch (error) {
    return null;
  }
};


// UPDATE PRODUCT VARIANT
export const updateProductVariant = async (id: string, productVariant: ProductVariant) => {
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