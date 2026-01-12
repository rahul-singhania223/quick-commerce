import { includes } from "zod/v4";
import db from "../configs/db.config.js";
import { Prisma, StoreProduct } from "../generated/prisma/client.js";

// get all store products
export const getAllStoreProducts = async () => {
  try {
    // TODO: Add pagination

    const storeProducts = await db.storeProduct.findMany({});
    return storeProducts;
  } catch (error) {
    return null;
  }
};

// get store product
export const getStoreProduct = async (id: string) => {
  try {
    const storeProduct = await db.storeProduct.findUnique({
      where: { id },
    });
    return storeProduct;
  } catch (error) {
    console.log(error)
    return null;
  }
};

// create store product
export const createStoreProduct = async (data: StoreProduct) => {
  try {
    const storeProduct = await db.storeProduct.create({ data });
    return storeProduct;
  } catch (error) {
    return null;
  }
};

// update store product
export const updateStoreProduct = async (
  id: string,
  data: Prisma.StoreProductUpdateInput
) => {
  try {
    const storeProduct = await db.storeProduct.update({
      where: { id },
      data,
    });
    return storeProduct;
  } catch (error) {
    return null;
  }
};

// delete store product
export const deleteStoreProduct = async (id: string) => {
  try {
    const storeProduct = await db.storeProduct.delete({ where: { id } });
    return storeProduct;
  } catch (error) {
    console.log(error)
    return null;
  }
};

// get store product with product variant and store
export const getStoreProductWithVariantAndStore = async (data: {
  variant_id: string;
  store_id: string;
}) => {
  try {
    const storeProduct = await db.storeProduct.findFirst({
      where: {
        variant_id: data.variant_id,
        store_id: data.store_id,
      },
    });
    return storeProduct;
  } catch (error) {
    return null;
  }
};
