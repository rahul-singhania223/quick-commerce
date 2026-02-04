import { AxiosError } from "axios";
import { api } from "../config/axios.config";
import {
  Brand,
  Category,
  CreateBrandPayload,
  CreateCategoryPayload,
  ErrorResponse,
  SuccessResponse,
  UpdateBrandPayload,
  UpdateCategoryPayload,
} from "../lib/types";

export class CategoryServices {
  // ================================
  // GET ALL CATEGORIES
  // ================================

  static async getAllCategories(query?: {
    is_active?: string;
    name?: string;
    created_at?: string;
    search?: string;
    parent_id?: string;
  }): Promise<Category[] | null> {
    try {
      let url = "/categories/?";

      if (query?.parent_id) url += `&parent_id=${query.parent_id}`;
      if (query?.search) url += `&search=${query.search}`;
      if (query?.is_active) url += `&is_active=${query.is_active}`;
      if (query?.name) url += `&name=${query.name}`;
      if (query?.created_at) url += `&created_at=${query.created_at}`;

      const res = await api.get(url);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success") return null;

      return resData.data as Category[];
    } catch (error) {
      console.log(error);
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
  // GET CATEGORIES COUNT
  // ================================
  static async getCategoriesCount(): Promise<{
    error: string | null;
    count: number | null;
  }> {
    try {
      const res = await api.get("/categories/count");
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success")
        return { error: resData.message, count: 0 };

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
