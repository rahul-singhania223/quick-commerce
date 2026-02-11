import { AxiosError } from "axios";
import { api } from "../config/axios.config";
import {
  Brand,
  Category,
  CategoryStats,
  CreateBrandPayload,
  CreateCategoryPayload,
  ErrorResponse,
  SuccessResponse,
  UpdateBrandPayload,
  UpdateCategoryPayload,
} from "../lib/types";

interface CategoriesResponseData {
  data: Category[];
  nextCursor: string | null;
  hasMore: boolean;
}

export class CategoryServices {
  // ================================
  // GET ALL CATEGORIES
  // ================================

  static async getAllCategories(query?: {
    is_active?: "1" | "0";
    name?: string;
    created_at?: "asc" | "desc";
    search?: string;
    parent_id?: string;
    limit?: number;
    cursor?: string;
  }): Promise<CategoriesResponseData | null> {
    try {
      let url = "/categories";

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

      return resData.data as CategoriesResponseData;
    } catch (error) {
      const errData = error as AxiosError;
      console.log(errData.response);
      return null;
    }
  }

  // ================================
  // GET CATEGORY
  // ================================
  static async getCategory(categoryId: string): Promise<Category | null> {
    try {
      const res = await api.get("/categories" + categoryId);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success") return null;

      return resData.data as Category;
    } catch (error) {
      throw error;
    }
  }

  // ================================
  // CREATE CATEGORY
  // ================================
  static async createCategory(
    data: CreateCategoryPayload,
  ): Promise<{ error: string | null; data: Category | null }> {
    try {
      const res = await api.post("/categories", data);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success")
        return { error: resData.message, data: null };

      return { error: null, data: resData.data as Category };
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      const errData = err.response?.data as ErrorResponse;
      return {
        error: errData.message || "Couldn't create category!",
        data: null,
      };
    }
  }

  // ================================
  // UPDATE CATEGORY
  // ================================
  static async updateCategory(
    brandId: string,
    data: UpdateCategoryPayload,
  ): Promise<{ error: string | null; data: Category | null }> {
    try {
      const res = await api.put("/categories/" + brandId, data);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success")
        return { error: resData.message, data: null };

      return { error: null, data: resData.data as Category };
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      const errData = err.response?.data as ErrorResponse;
      return {
        error: errData.message || "Couldn't update category!",
        data: null,
      };
    }
  }

  // ================================
  // DELETE CATEGORY
  // ================================
  static async deleteCategory(
    categoryId: string,
  ): Promise<{ error: string | null }> {
    try {
      const res = await api.delete("/categories/" + categoryId);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success") return { error: resData.message };

      return { error: null };
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      const errData = err.response?.data as ErrorResponse;
      return { error: errData.message || "Couldn't delete category!" };
    }
  }

  // ================================
  // GET CATEGORIES STATS
  // ================================
  static async getCategoryStats(): Promise<{
    error: string | null;
    stats: CategoryStats | null;
  }> {
    try {
      const res = await api.get("/categories/stats");
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success")
        return { error: resData.message, stats: null };

      return { error: null, stats: resData.data as CategoryStats };
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      const errData = err.response?.data as ErrorResponse;
      return {
        error: errData.message || "Couldn't get brands count!",
        stats: null,
      };
    }
  }
}
