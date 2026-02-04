"use client";

import { AxiosError } from "axios";
import { api } from "../config/axios.config";
import {
  Brand,
  CreateBrandPayload,
  CreateProductPayload,
  ErrorResponse,
  Product,
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
    is_active?: string;
    name?: string;
    created_at?: string;
    search?: string;
    category?: string;
    brand?: string;
  }): Promise<ProductWithRelations[] | null> {
    try {
      let url = "/product/?";

      if (query?.search) url += `search=${query.search}`;
      if (query?.is_active) url += `&is_active=${query.is_active}`;
      if (query?.name) url += `&name=${query.name}`;
      if (query?.created_at) url += `&created_at=${query.created_at}`;
      if (query?.category) url += `&category=${query.category}`;
      if (query?.brand) url += `&brand=${query.brand}`;

      const res = await api.get(url);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success") return null;

      return resData.data as ProductWithRelations[];
    } catch (error) {
      console.log(error);
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
  // GET PRODUCTS COUNT
  // ================================
  static async getProductsCount(): Promise<{
    error: string | null;
    count: number | null;
  }> {
    try {
      const res = await api.get("/product/count");
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success")
        return { error: resData.message, count: null };

      return { error: null, count: resData.data.count as number };
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      const errData = err.response?.data as ErrorResponse;
      return {
        error: errData.message || "Couldn't get products count!",
        count: null,
      };
    }
  }
}
