import api from "@/config/api.config";
import { createStoreProductSchema } from "@/schema/product.schema";
import z from "zod";

class ProductQuery {
  async searchProducts(query: string) {
    try {
      const res = await api.get(`/product/search?q=${query}`);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async createInventory(
    storeId: string,
    data: z.infer<typeof createStoreProductSchema>
  ) {
    try {
      const res = await api.post(`/store-product/${storeId}`, data);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async updateInventory(
    storeId: string,
    storeProductId: string,
    inventoryId: string,
    data: z.infer<typeof createStoreProductSchema>
  ) {
    try {
      const res = await api.put(
        `/store-product/${storeId}/${storeProductId}/${inventoryId}`,
        data
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  async deleteInventory(storeId: string, storeProductId: string) {
    try {
      const res = await api.delete(
        `/store-product/${storeId}/${storeProductId}`
      );
      return res;
    } catch (error) {
      throw error;
    }
  }
}

export const productQuery = new ProductQuery();
