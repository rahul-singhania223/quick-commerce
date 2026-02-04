import { create } from "zustand";
import { Product, ProductWithRelations } from "../lib/types";
import { ProductServices } from "../services/products.services";

interface QueryParams {
  is_active?: "true" | "false";
  name?: "asc" | "desc";
  created_at?: "asc" | "desc";
  search?: string;
  category?: string;
  brand?: string;
}

interface ProductsState {
  productsCount: number;
  products: Map<Product["id"], ProductWithRelations>;
  loadingFailed: boolean;
  isLoading: boolean;
  fetchProducts: (query?: QueryParams) => void;
  addProduct: (product: ProductWithRelations) => void;
  getProduct: (productId: string) => ProductWithRelations | undefined;
  removeProduct: (productId: string) => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: new Map(),
  productsCount: 0,
  loadingFailed: false,
  isLoading: true,
  fetchProducts: async (query) => {
    try {
      set({ isLoading: true });
      const products = await ProductServices.getAllProducts({
        is_active: query?.is_active,
        name: query?.name,
        created_at: query?.created_at,
        search: query?.search,
        category: query?.category,
        brand: query?.brand,
      });
      const productsCount = await ProductServices.getProductsCount();
      if (!products) return set({ loadingFailed: true });

      const productsWithKeys = products.map(
        (product) => [product.id, product] as const,
      );
      set({
        products: new Map(productsWithKeys),
        productsCount: productsCount.count || 0,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: (product: ProductWithRelations) => {
    set((state) => {
      const next = new Map(state.products);
      next.set(product.id, product);
      return { products: next, productsCount: state.productsCount + 1 };
    });
  },

  getProduct: (categoryId: string) => {
    return get().products.get(categoryId);
  },
  removeProduct: (productId: string) => {
    set((state) => {
      const next = new Map(state.products);
      next.delete(productId);
      return { products: next, productsCount: state.productsCount - 1 };
    });
  },
}));
