import { create } from "zustand";
import { Brand, BrandStats } from "../lib/types";
import { BrandsServices } from "../services/brands.services";

let inflightBrandRequests = new Map<string, Promise<void>>();
let activeBrandQueryKey: string | null = null;

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
    const state = get();
    const queryKey = buildQueryKey(query);
    const isNewQuery = queryKey !== state.currentQueryKey;

    // prevent duplicate same-query requests
    if (inflightBrandRequests.has(queryKey)) {
      return inflightBrandRequests.get(queryKey);
    }

    const promise = (async () => {
      try {
        activeBrandQueryKey = queryKey;

        // ---------- RESET ----------
        if (isNewQuery) {
          set({
            brands: new Map(),
            brandStats: null,
            loadingFailed: false,
            cursor: null,
            hasMore: true,
            currentQueryKey: queryKey,
            initialized: false,
          });
        }

        // read fresh state AFTER reset
        const fresh = get();

        // stop useless pagination calls
        if (!isNewQuery && !fresh.hasMore) return;

        set({ isLoading: true });

        const [brandsRes, statsRes] = await Promise.all([
          BrandsServices.getAllBrands({
            ...query,
            cursor: isNewQuery ? undefined : (fresh.cursor ?? undefined),
          }),
          isNewQuery ? BrandsServices.getBrandStats() : Promise.resolve(null),
        ]);

        // -------- stale response protection --------
        if (activeBrandQueryKey !== queryKey) return;

        if (!brandsRes?.data) throw new Error("Brands fetch failed");

        set((prev) => {
          const map = isNewQuery ? new Map() : new Map(prev.brands);

          for (const b of brandsRes.data) {
            map.set(b.id, b);
          }

          return {
            brands: map,
            cursor: brandsRes.nextCursor ?? null,
            hasMore: brandsRes.hasMore ?? false,
            brandStats: statsRes?.stats ?? prev.brandStats ?? null,
            initialized: true,
            loadingFailed: false,
          };
        });
      } catch (err) {
        if (activeBrandQueryKey === queryKey) {
          set({ loadingFailed: true });
          console.error("fetchBrands error:", err);
        }
      } finally {
        if (activeBrandQueryKey === queryKey) {
          set({ isLoading: false });
        }
        inflightBrandRequests.delete(queryKey);
      }
    })();

    inflightBrandRequests.set(queryKey, promise);
    return promise;
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
