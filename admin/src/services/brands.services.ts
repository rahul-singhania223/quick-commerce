import { AxiosError } from "axios";
import { api } from "../config/axios.config";
import {
  Brand,
  CreateBrandPayload,
  ErrorResponse,
  SuccessResponse,
  UpdateBrandPayload,
} from "../lib/types";

export class BrandsServices {
  // ================================
  // GET ALL BRANDS
  // ================================

  static async getAllBrands(query?: {
    is_active?: string;
    name?: string;
    created_at?: string;
    search?: string;
  }): Promise<Brand[] | null> {
    try {
      let url = "/brands/?";

      if (query?.search) url += `&search=${query.search}`;
      if (query?.is_active) url += `&is_active=${query.is_active}`;
      if (query?.name) url += `&name=${query.name}`;
      if (query?.created_at) url += `&created_at=${query.created_at}`;

      const res = await api.get(url);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success") return null;

      return resData.data as Brand[];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // ================================
  // GET BRAND
  // ================================
  static async getBrand(brandId: string): Promise<Brand | null> {
    try {
      const res = await api.get("/brands" + brandId);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success") return null;

      return resData.data as Brand;
    } catch (error) {
      throw error;
    }
  }

  // ================================
  // CREATE BRAND
  // ================================
  static async createBrand(
    data: CreateBrandPayload,
  ): Promise<{ error: string | null; data: Brand | null }> {
    try {
      const res = await api.post("/brands", data);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success")
        return { error: resData.message, data: null };

      return { error: null, data: resData.data as Brand };
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      const errData = err.response?.data as ErrorResponse;
      return { error: errData.message || "Couldn't create brand!", data: null };
    }
  }

  // ================================
  // UPDATE BRAND
  // ================================
  static async updateBrand(
    brandId: string,
    data: UpdateBrandPayload,
  ): Promise<{ error: string | null; data: Brand | null }> {
    try {
      const res = await api.put("/brands/" + brandId, data);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success")
        return { error: resData.message, data: null };

      return { error: null, data: resData.data as Brand };
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      const errData = err.response?.data as ErrorResponse;
      return { error: errData.message || "Couldn't update brand!", data: null };
    }
  }

  // ================================
  // DELETE BRAND
  // ================================
  static async deleteBrand(brandId: string): Promise<{ error: string | null }> {
    try {
      const res = await api.delete("/brands/" + brandId);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success") return { error: resData.message };

      return { error: null };
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      const errData = err.response?.data as ErrorResponse;
      return { error: errData.message || "Couldn't delete brand!" };
    }
  }

  // ================================
  // GET BRANDS COUNT
  // ================================
  static async getBrandsCount(): Promise<{
    error: string | null;
    count: number | null;
  }> {
    try {
      const res = await api.get("/brands/count");
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success")
        return { error: resData.message, count: null };

      return { error: null, count: resData.data.count as number };
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      const errData = err.response?.data as ErrorResponse;
      return {
        error: errData.message || "Couldn't get brands count!",
        count: null,
      };
    }
  }
}
