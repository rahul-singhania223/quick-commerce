import { AxiosError } from "axios";
import { api } from "../config/axios.config";
import {
  Brand,
  CreateBrandPayload,
  ErrorResponse,
  SuccessResponse,
  UpdateBrandPayload,
  Zone,
  ZoneStats,
} from "../lib/types";
import z from "zod";
import { CreateZoneInput, createZoneSchema } from "../lib/schemas";

export class ZonesServices {
  // ================================
  // GET ALL ZONES
  // ================================

  static async getAllZones(query?: {
    is_active?: "0" | "1";
    created_at?: string;
    search?: string;
    city?: string;
    cursor?: string;
  }): Promise<Zone[] | null> {
    try {
      let url = "/zone/?";

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

      console.log(resData);

      if (resData.status !== "success") return null;

      return resData.data as Zone[];
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
  // CREATE ZONE
  // ================================
  static async createZone(
    data: z.infer<typeof createZoneSchema>,
  ): Promise<{ error: string | null; data: Zone | null }> {
    try {
      const res = await api.post("/zone", data);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success")
        return { error: resData.message, data: null };

      return { error: null, data: resData.data as Zone };
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      const errData = err.response?.data as ErrorResponse;
      console.log(errData);
      return { error: errData.message || "Couldn't create zone!", data: null };
    }
  }

  // ================================
  // UPDATE ZONE
  // ================================
  static async updateZone(
    id: string,
    data: Partial<CreateZoneInput>,
  ): Promise<{ error: string | null; data: Zone | null }> {
    try {
      const res = await api.put("/zone/" + id, data);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success")
        return { error: resData.message, data: null };

      return { error: null, data: resData.data as Zone };
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      const errData = err.response?.data as ErrorResponse;
      return { error: errData.message || "Couldn't update brand!", data: null };
    }
  }

  // ================================
  // DELETE ZONE
  // ================================
  static async deleteZone(id: string): Promise<{ error: string | null }> {
    try {
      const res = await api.delete("/zone/" + id);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success") return { error: resData.message };

      return { error: null };
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      const errData = err.response?.data as ErrorResponse;
      return { error: errData.message || "Couldn't delete zone!" };
    }
  }

  // ================================
  // GET ZONES COUNT
  // ================================

  static async getZonesStats({
    is_active,
    without_stores,
  }: {
    is_active?: boolean;
    without_stores?: boolean;
  }): Promise<{
    error: string | null;
    data: ZoneStats | null;
  }> {
    try {
      let url = "/zone/stats/?";

      if (is_active) url += `is_active=${is_active}`;
      if (without_stores) url += `&without_stores=${without_stores}`;

      const res = await api.get(url);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success")
        return { error: resData.message, data: null };

      return { error: null, data: resData.data as ZoneStats };
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response);
      const errData = err.response?.data as ErrorResponse;
      return {
        error: errData.message || "Couldn't get zones stats!",
        data: null,
      };
    }
  }

  // ================================
  // GET OVERLAPPING ZONES
  // ================================

  static async getOverlappingZones(
    boundary: CreateZoneInput["boundary"],
  ): Promise<{
    error: string | null;
    data: Zone[] | null;
  }> {
    try {
      let url = "/zone/overlapping/?";

      const res = await api.post(url, boundary);
      const resData = res.data as SuccessResponse;

      if (resData.status !== "success")
        return { error: resData.message, data: null };

      return { error: null, data: resData.data as Zone[] };
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response);
      const errData = err.response?.data as ErrorResponse;
      return {
        error: errData.message || "Couldn't get overlapping zones!",
        data: null,
      };
    }
  }
}
