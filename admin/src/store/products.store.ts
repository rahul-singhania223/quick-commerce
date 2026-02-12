import { create } from "zustand";
import { Product, ProductStats, ProductWithRelations } from "../lib/types";
import { ProductServices } from "../services/products.services";

let inflightRequests = new Map<string, Promise<void>>();
let activeRequestKey: string | null = null;

interface QueryParams {
  is_active?: "1" | "0";
  name?: string;
  created_at?: "asc" | "desc";
  search?: string;
  category_id?: string;
  brand_id?: string;
  limit?: number;
  cursor?: string;
}

const buildQueryKey = (query?: QueryParams) =>
  JSON.stringify({
    is_active: query?.is_active ?? null,
    search: query?.search ?? "",
    name: query?.name ?? null,
    category_id: query?.category_id ?? null,
    brand_id: query?.brand_id ?? null,
    created_at: query?.created_at ?? "desc",
  });

interface ProductsState {
  productStats: ProductStats | null;
  products: Map<Product["id"], ProductWithRelations>;
  loadingFailed: boolean;
  isLoading: boolean;
  initialized: boolean;
  cursor: string | null;
  hasMore: boolean;
  currentQueryKey: string;
  fetchProducts: (query?: QueryParams) => void;
  addProduct: (product: ProductWithRelations) => void;
  getProduct: (productId: string) => ProductWithRelations | undefined;
  updateProduct: (productId: string, data: Product) => void;
  removeProduct: (productId: string) => void;
}

interface ProductQueryState {
  query: QueryParams;
  setQuery: (query: QueryParams) => void;
  resetQuery: () => void;
}

export const useProductQueryStore = create<ProductQueryState>((set) => ({
  query: {},
  setQuery: (query) =>
    set((state) => ({ query: { ...state.query, ...query } })),
  resetQuery: () => set({ query: {} }),
}));

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: new Map(),
  productStats: null,
  loadingFailed: false,
  isLoading: false,
  currentQueryKey: "",
  initialized: false,
  cursor: null,
  hasMore: false,
  fetchProducts: async (query) => {
    const state = get();
    const queryKey = buildQueryKey(query);
    const isNewQuery = queryKey !== state.currentQueryKey;

    // prevent duplicate same-page requests
    if (inflightRequests.has(queryKey)) {
      return inflightRequests.get(queryKey);
    }

    const promise = (async () => {
      try {
        activeRequestKey = queryKey;

        // ---------- RESET ON FILTER CHANGE ----------
        if (isNewQuery) {
          set({
            products: new Map(),
            productStats: null,
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

        const [productsRes, statsRes] = await Promise.all([
          ProductServices.getAllProducts({
            ...query,
            cursor: isNewQuery ? undefined : (fresh.cursor ?? undefined),
          }),
          isNewQuery
            ? ProductServices.getProductStats()
            : Promise.resolve(null),
        ]);

        // -------- STALE RESPONSE PROTECTION --------
        if (activeRequestKey !== queryKey) return;

        if (!productsRes?.data) throw new Error("Products fetch failed");

        set((prev) => {
          const map = isNewQuery ? new Map() : new Map(prev.products);

          for (const p of productsRes.data) {
            map.set(p.id, p);
          }

          return {
            products: map,
            cursor: productsRes.nextCursor ?? null,
            hasMore: productsRes.hasMore ?? false,
            productStats: statsRes?.stats ?? prev.productStats ?? null,
            initialized: true,
            loadingFailed: false,
          };
        });
      } catch (err) {
        if (activeRequestKey === queryKey) {
          set({ loadingFailed: true });
          console.error("fetchProducts error:", err);
        }
      } finally {
        if (activeRequestKey === queryKey) {
          set({ isLoading: false });
        }
        inflightRequests.delete(queryKey);
      }
    })();

    inflightRequests.set(queryKey, promise);
    return promise;
  },

  addProduct: (product: ProductWithRelations) => {
    set((state) => {
      const next = new Map(state.products);
      next.set(product.id, product);
      return {
        products: next,
        productStats: state.productStats
          ? {
              ...state.productStats,
              products_count: state.productStats?.products_count + 1,
            }
          : null,
      };
    });
  },

  getProduct: (categoryId: string) => {
    return get().products.get(categoryId);
  },
  removeProduct: (productId: string) => {
    set((state) => {
      const next = new Map(state.products);
      next.delete(productId);
      return {
        products: next,
        productStats: state.productStats
          ? {
              ...state.productStats,
              products_count: state.productStats?.products_count - 1,
            }
          : null,
      };
    });
  },

  updateProduct: (productId: string, data: Product) => {
    set((state) => {
      const next = new Map(state.products);
      next.set(productId, data);
      return { products: next };
    });
  },
}));
