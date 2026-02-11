"use client";

import { AxiosError } from "axios";
import { api } from "../config/axios.config";
import {
  Brand,
  CreateBrandPayload,
  CreateProductPayload,
  ErrorResponse,
  Product,
  ProductStats,
  ProductWithRelations,
  SuccessResponse,
  UpdateBrandPayload,
  UpdateProductPayload,
} from "../lib/types";

export class ProductServices {
  // ================================
  // GET ALL PRODUCTS
  // ================================

  static async getAllProducts(query?: {
    is_active?: "1" | "0";
    name?: string;
    created_at?: "asc" | "desc";
    search?: string;
    category_id?: string;
    brand_id?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{
    data: ProductWithRelations[];
    nextCursor: string | null;
    hasMore: boolean;
  } | null> {
    try {
      let url = "/product";

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
        data: ProductWithRelations[];
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
  // GET PRODUCT
  // ================================
  static async getProduct(productId: string): Promise<Product | null> {
    try {
      const res = await api.get("/product" + productId);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success") return null;

      return resData.data as Product;
    } catch (error) {
      throw error;
    }
  }

  // ================================
  // CREATE PRODUCT
  // ================================
  static async createProduct(
    data: CreateProductPayload,
  ): Promise<{ error: string | null; data: ProductWithRelations | null }> {
    try {
      const res = await api.post("/product", data);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success")
        return { error: resData.message, data: null };

      return { error: null, data: resData.data as ProductWithRelations };
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      const errData = err.response?.data as ErrorResponse;
      return {
        error: errData.message || "Couldn't create product!",
        data: null,
      };
    }
  }

  // ================================
  // UPDATE PRODUCT
  // ================================
  static async updateProduct(
    productId: string,
    data: UpdateProductPayload,
  ): Promise<{ error: string | null; data: ProductWithRelations | null }> {
    try {
      const res = await api.put("/product/" + productId, data);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success")
        return { error: resData.message, data: null };

      return { error: null, data: resData.data as ProductWithRelations };
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      const errData = err.response?.data as ErrorResponse;
      return {
        error: errData.message || "Couldn't update product!",
        data: null,
      };
    }
  }

  // ================================
  // DELETE PRODUCT
  // ================================
  static async deleteProduct(
    productId: string,
  ): Promise<{ error: string | null }> {
    try {
      const res = await api.delete("/product/" + productId);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success") return { error: resData.message };

      return { error: null };
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      const errData = err.response?.data as ErrorResponse;
      return { error: errData.message || "Couldn't delete product!" };
    }
  }

  // ================================
  // GET PRODUCTS STATS
  // ================================
  static async getProductStats(): Promise<{
    error: string | null;
    stats: ProductStats | null;
  }> {
    try {
      const res = await api.get("/product/stats");
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success")
        return { error: resData.message, stats: null };

      return { error: null, stats: resData.data as ProductStats };
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      const errData = err.response?.data as ErrorResponse;
      return {
        error: errData.message || "Couldn't get products stats!",
        stats: null,
      };
    }
  }
}
