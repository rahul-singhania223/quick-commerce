import api from "@/config/api.config";
import { Inventory } from "@/types/types";
import debounce from "lodash.debounce";
import { toast } from "sonner";

class InventoryQuery {
  async getStoreInventory(storeId: string) {
    try {
      const res = await api.get(`/store-product/${storeId}`);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async updateInventory(
    storeId: string,
    inventoryid: string,
    data: any
  ) {
    try {
      const res = await api.put(`/inventory/${storeId}/${inventoryid}/`, data);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async getInventoryById(storeId: string, inventoryId: string) {
    try {
      const res = await api.get(`/inventory/${storeId}/${inventoryId}`);
      return res;
    } catch (error) {
      throw error;
    }
  }
}

export const inventoryQuery = new InventoryQuery();
