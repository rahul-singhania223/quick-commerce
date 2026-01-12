import api from "@/config/api.config";
import { createStoreFormSchema } from "@/schema/store.schema";
import { ErrorResponse, Store } from "@/types/types";
import { AxiosError } from "axios";
import z from "zod";

class StoreQuery {
  async getStores() {
    try {
      const res = await api.get("/store");
      return res;
    } catch (error) {
      throw error;
    }
  }

  async getStore(id: string) {
    try {
      const res = await api.get(`/store/${id}`);
      return res;
    } catch (error) {
      const errorResponse = (error as AxiosError).response
        ?.data as ErrorResponse;

      throw errorResponse;
    }
  }

  async createStore(data: z.infer<typeof createStoreFormSchema>) {
    try {
      const res = await api.post("/store/create", data);
      return res;
    } catch (error) {
      throw error;
    }
  }
  async updateStore(storeId: string, data: Store) {
    try {
      const res = await api.put(`/store/update/${storeId}`, data);
      return res;
    } catch (error) {
      throw error;
    }
  }
  async deleteStore() {}
}

export const storeQuery = new StoreQuery();
