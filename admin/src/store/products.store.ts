import { create } from "zustand";
import { Product, ProductStats, ProductWithRelations } from "../lib/types";
import { ProductServices } from "../services/products.services";

let productPromise: Promise<void> | null = null;

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
    if (productPromise) return productPromise;

    productPromise = (async () => {
      try {
        const state = get();
        const queryKey = buildQueryKey(query);

        // reset if query changed
        const newQuery = queryKey !== state.currentQueryKey;

        if (newQuery) {
          set({
            products: new Map(),
            productStats: null,
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

        const [products, productStats] = await Promise.all([
          ProductServices.getAllProducts({
            ...query,
            cursor: newQuery ? undefined : state.cursor || undefined,
          }),
          ProductServices.getProductStats(),
        ]);

        if (!products) throw new Error("Failed to fetch categories");
        if (productStats && !productStats.stats)
          throw new Error("Failed to fetch counts");

        const productsWithKeys = products.data.map(
          (product) => [product.id, product] as const,
        );

        set((prev) => {
          const map = new Map(prev.products);

          for (const p of products.data) {
            map.set(p.id, p);
          }

          return {
            products: map,
            cursor: products.nextCursor,
            hasMore: products.hasMore,
            isLoading: false,
            productStats: (productStats && productStats?.stats) || null,
            initialized: true,
          };
        });
      } catch (error) {
        set({ loadingFailed: true });
        console.log("Fetch categories error: ", error);
      } finally {
        set({ isLoading: false });
        productPromise = null;
      }
    })();

    return productPromise;
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
}));
