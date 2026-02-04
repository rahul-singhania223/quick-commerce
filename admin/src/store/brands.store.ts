import { create } from "zustand";
import { Brand } from "../lib/types";
import { BrandsServices } from "../services/brands.services";

interface QueryParams {
  is_active?: "true" | "false";
  name?: "asc" | "desc";
  created_at?: "asc" | "desc";
  search?: string;
}

interface BrandsState {
  brandsCount: number;
  brands: Map<Brand["id"], Brand>;
  loadingFailed: boolean;
  isLoading: boolean;
  fetchBrands: (query?: QueryParams) => void;
  // fetchBrandsWithStatus: (status: string) => void;
  addBrand: (brand: any) => void;
  getBrand: (brandId: string) => Brand | undefined;
  removeBrand: (brandId: string) => void;
  clearBrands: () => void;
}

export const useBrandsStore = create<BrandsState>((set, get) => ({
  brands: new Map(),
  brandsCount: 0,
  loadingFailed: false,
  isLoading: true,
  fetchBrands: async (query) => {
    try {
      set({ isLoading: true });
      const brands = await BrandsServices.getAllBrands({
        is_active: query?.is_active,
        name: query?.name,
        created_at: query?.created_at,
        search: query?.search,
      });
      const brandsCount = await BrandsServices.getBrandsCount();
      if (!brands) return set({ loadingFailed: true });

      if (!brandsCount.count) return set({ loadingFailed: true });

      const brandsWithKeys = brands.map((brand) => [brand.id, brand] as const);
      set({ brands: new Map(brandsWithKeys), brandsCount: brandsCount.count });
    } finally {
      set({ isLoading: false });
    }
  },

  addBrand: (brand: Brand) => {
    set((state) => {
      const next = new Map(state.brands);
      next.set(brand.id, brand);
      return { brands: next, brandsCount: state.brandsCount + 1 };
    });
  },

  getBrand: (brandId: string) => {
    return get().brands.get(brandId);
  },
  removeBrand: (brandId: string) => {
    set((state) => {
      const next = new Map(state.brands);
      next.delete(brandId);
      return { brands: next, brandsCount: state.brandsCount - 1 };
    });
  },

  clearBrands: () => set({ brands: new Map(), brandsCount: 0 }),
}));
