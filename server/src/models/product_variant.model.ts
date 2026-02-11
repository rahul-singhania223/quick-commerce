import db from "../configs/db.config.js";
import { Prisma, ProductVariant } from "../generated/prisma/client.js";

// GET ALL PRODUCT VARIANTS

interface QueryParams {
  product_id?: string;
}

export const getAllProductVariants = async ({ product_id }: QueryParams) => {
  try {
    const where: Prisma.ProductVariantWhereInput = {
      product_id,
    };
    const orderBy: Prisma.ProductVariantOrderByWithRelationInput = {
      created_at: "desc",
    };

    const productVariants = await db.productVariant.findMany({
      where,
      orderBy,
    });
    return productVariants;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// GET PRODUCT VARIANT
export const getProductVariant = async ({
  id,
  slug,
}: {
  id?: string;
  slug?: string;
}) => {
  try {
    return db.productVariant.findUnique({
      where: { id, slug },
    });
  } catch (error) {
    console.log(error);
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
    console.log(error);
    return null;
  }
};

// CREATE PRODUCT VARIANT
export const createProductVariant = async (
  data: Prisma.ProductVariantCreateInput,
) => {
  try {
    const newProductVariant = await db.productVariant.create({
      data,
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
  data: Prisma.ProductVariantUpdateInput,
) => {
  try {
    const updatedProductVariant = await db.productVariant.update({
      where: { id },
      data,
    });
    return updatedProductVariant;
  } catch (error) {
    console.log(error);
    return null;
  }
};
