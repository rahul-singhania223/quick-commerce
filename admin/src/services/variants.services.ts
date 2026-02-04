"use client";

import { AxiosError } from "axios";
import { api } from "../config/axios.config";
import {
  Brand,
  CreateBrandPayload,
  CreateProductPayload,
  CreateProductVariantInput,
  ErrorResponse,
  Product,
  ProductVariant,
  ProductWithRelations,
  SuccessResponse,
  UpdateBrandPayload,
  UpdateProductPayload,
} from "../lib/types";

export class VariantServices {
  // ================================
  // GET ALL VARIANTS BY PRODUCT
  // ================================

  static async getAllVariants({
    productId,
  }: {
    productId: string;
  }): Promise<ProductVariant[] | null> {
    try {
      let url = "/product-variant/?";

      url += "product_id=" + productId;

      const res = await api.get(url);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success") return null;

      return resData.data as ProductVariant[];
    } catch (error) {
      console.log((error as AxiosError).response);
      return null;
    }
  }

  // ================================
  // CREATE VARIANT
  // ================================
  static async createVariant(
    data: CreateProductVariantInput,
  ): Promise<{ error: string | null; data: ProductVariant | null }> {
    try {
      const res = await api.post("/product-variant", data);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success")
        return { error: resData.message, data: null };

      return { error: null, data: resData.data as ProductVariant };
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      console.log(err.response);
      const errData = err.response?.data as ErrorResponse;
      return {
        error: errData.message || "Couldn't create product variant!",
        data: null,
      };
    }
  }

  // ================================
  // DELETE VARIANT
  // ================================
  static async deleteVariant(
    variantId: string,
  ): Promise<{ error: string | null }> {
    try {
      const res = await api.delete("/product-variant/" + variantId);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success") return { error: resData.message };

      return { error: null };
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      const errData = err.response?.data as ErrorResponse;
      return { error: errData.message || "Couldn't delete product variant!" };
    }
  }
}
