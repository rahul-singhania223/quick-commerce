import { AxiosError } from "axios";
import { api } from "../config/axios.config";
import {
  Brand,
  BrandStats,
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
    cursor?: string;
    limit?: number;
  }): Promise<{
    data: Brand[];
    nextCursor: string | null;
    hasMore: boolean;
  } | null> {
    try {
      let url = "/brands/";

      if (query) {
        const params = new URLSearchParams();

        Object.entries(query).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });

        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;
      }

      const res = await api.get(url);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success") return null;

      return resData.data as {
        data: Brand[];
        nextCursor: string | null;
        hasMore: boolean;
      };
    } catch (error) {
      const errData = error as AxiosError;
      console.log(errData.response);
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
  // GET BRANDS STATS
  // ================================
  static async getBrandStats(): Promise<{
    error: string | null;
    stats: BrandStats | null;
  }> {
    try {
      const res = await api.get("/brands/stats");
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success")
        return { error: resData.message, stats: null };

      return { error: null, stats: resData.data as BrandStats };
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      const errData = err.response?.data as ErrorResponse;
      return {
        error: errData.message || "Couldn't get brands stats!",
        stats: null,
      };
    }
  }
}
