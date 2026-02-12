import { create } from "zustand";
import { Brand, BrandStats } from "../lib/types";
import { BrandsServices } from "../services/brands.services";

let brandsPromise: Promise<void> | null = null;

interface QueryParams {
  is_active?: "1" | "0";
  name?: string;
  created_at?: "asc" | "desc";
  search?: string;
  category_id?: string;
  limit?: number;
  cursor?: string;
}

const buildQueryKey = (query?: QueryParams) =>
  JSON.stringify({
    is_active: query?.is_active ?? null,
    search: query?.search ?? "",
    name: query?.name ?? null,
    category_id: query?.category_id ?? null,
    created_at: query?.created_at ?? "desc",
  });

interface BrandsState {
  hasMore: boolean;
  currentQueryKey: string;
  cursor: string | null;
  initialized: boolean;
  brandStats: BrandStats | null;
  brands: Map<Brand["id"], Brand>;
  loadingFailed: boolean;
  isLoading: boolean;
  fetchBrands: (query?: QueryParams) => void;
  addBrand: (brand: any) => void;
  getBrand: (brandId: string) => Brand | undefined;
  removeBrand: (brandId: string) => void;
  updateBrand: (brandId: string, data: Brand) => void;
  clearBrands: () => void;
}

interface BrandsQueryState {
  query: QueryParams;
  setQuery: (query: QueryParams) => void;
  resetQuery: () => void;
}

export const useBrandsQueryStore = create<BrandsQueryState>((set) => ({
  query: {},
  setQuery: (query) => set({ query: { ...query } }),
  resetQuery: () => set({ query: {} }),
}));

export const useBrandsStore = create<BrandsState>((set, get) => ({
  brands: new Map(),
  brandsCount: 0,
  loadingFailed: false,
  isLoading: false,
  currentQueryKey: "",
  initialized: false,
  cursor: null,
  hasMore: false,
  brandStats: null,
  fetchBrands: async (query) => {
    if (brandsPromise) return brandsPromise;

    brandsPromise = (async () => {
      try {
        const state = get();
        const queryKey = buildQueryKey(query);

        // reset if query changed
        const newQuery = queryKey !== state.currentQueryKey;

        if (newQuery) {
          set({
            brands: new Map(),
            brandStats: null,
            loadingFailed: false,
            isLoading: true,
            cursor: null,
            hasMore: false,
            currentQueryKey: queryKey,
          });
        }

        // nothing left to fetch
        if (!state.hasMore && !newQuery) return;

        set({ isLoading: true });

        const [brands, brandStats] = await Promise.all([
          BrandsServices.getAllBrands({
            ...query,
            cursor: newQuery ? undefined : state.cursor || undefined,
          }),
          BrandsServices.getBrandStats(),
        ]);

        if (!brands) throw new Error("Failed to fetch categories");
        if (brandStats && !brandStats.stats)
          throw new Error("Failed to fetch counts");

        set((prev) => {
          const map = new Map(prev.brands);

          for (const p of brands.data) {
            map.set(p.id, p);
          }

          return {
            brands: map,
            cursor: brands.nextCursor,
            hasMore: brands.hasMore,
            isLoading: false,
            brandStats: (brandStats && brandStats?.stats) || null,
            initialized: true,
          };
        });
      } catch (error) {
        set({ loadingFailed: true });
        console.log("Fetch categories error: ", error);
      } finally {
        set({ isLoading: false });
        brandsPromise = null;
      }
    })();

    return brandsPromise;
  },

  addBrand: (brand: Brand) => {
    set((state) => {
      const next = new Map(state.brands);
      next.set(brand.id, brand);
      return {
        brands: next,
        brandStats: state.brandStats
          ? {
              ...state.brandStats,
              brands_count: state.brandStats.brands_count + 1,
            }
          : null,
      };
    });
  },

  getBrand: (brandId: string) => {
    return get().brands.get(brandId);
  },
  removeBrand: (brandId: string) => {
    set((state) => {
      const next = new Map(state.brands);
      next.delete(brandId);
      return {
        brands: next,
        brandStats: state.brandStats
          ? {
              ...state.brandStats,
              brands_count: state.brandStats?.brands_count - 1,
            }
          : null,
      };
    });
  },

  updateBrand: (brandId: string, data: Brand) => {
    set((state) => {
      const next = new Map(state.brands);
      next.set(brandId, data);
      return { brands: next };
    });
  },
  clearBrands: () => {
    set({
      brands: new Map(),
      brandStats: null,
      loadingFailed: false,
      isLoading: true,
      cursor: null,
      hasMore: false,
    });
  },
}));
