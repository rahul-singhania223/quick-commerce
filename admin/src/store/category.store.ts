import { create } from "zustand";
import {
  Brand,
  Category,
  CategoryStats,
  CategoryWithRelations,
} from "../lib/types";
import { BrandsServices } from "../services/brands.services";
import { CategoryServices } from "../services/category.services";

let inflightCategoryRequests = new Map<string, Promise<void>>();
let activeCategoryQueryKey: string | null = null;

const buildQueryKey = (query?: QueryParams) =>
  JSON.stringify({
    is_active: query?.is_active ?? null,
    search: query?.search ?? "",
    parent_id: query?.parent_id ?? null,
    name: query?.name ?? null,
    created_at: query?.created_at ?? "desc",
  });

interface QueryParams {
  is_active?: "1" | "0";
  name?: "asc" | "desc";
  created_at?: "asc" | "desc";
  search?: string;
  parent_id?: string;
  cursor?: string;
  limit?: number;
}

interface CategoriesState {
  cursor: string | null;
  hasMore: boolean;
  categoryStats: CategoryStats | null;
  categories: Map<Category["id"], CategoryWithRelations>;
  loadingFailed: boolean;
  isLoading: boolean;
  currentQueryKey: string;
  initialized: boolean;
  fetchCategories: (query?: QueryParams) => void;
  addCategory: (category: CategoryWithRelations) => void;
  getCategory: (categoryId: string) => CategoryWithRelations | undefined;
  removeCategory: (categoryId: string) => void;
  updateCategory: (categoryId: string, data: Category) => void;
  clearCategories: () => void;
}

interface CategoryQueryState {
  query: QueryParams;
  setQuery: (query: QueryParams) => void;
  resetQuery: () => void;
}

export const useCategoryQueryStore = create<CategoryQueryState>((set) => ({
  query: {},
  setQuery: (query) => set({ query: { ...query } }),
  resetQuery: () => set({ query: {} }),
}));

export const useCategoryStore = create<CategoriesState>((set, get) => ({
  categories: new Map(),
  categoryStats: null,
  loadingFailed: false,
  isLoading: false,
  cursor: null,
  hasMore: false,
  currentQueryKey: "",
  initialized: false,
  fetchCategories: async (query) => {
    const state = get();
    const queryKey = buildQueryKey(query);
    const isNewQuery = queryKey !== state.currentQueryKey;

    // prevent duplicate calls for same query
    if (inflightCategoryRequests.has(queryKey)) {
      return inflightCategoryRequests.get(queryKey);
    }

    const promise = (async () => {
      try {
        activeCategoryQueryKey = queryKey;

        // -------- RESET --------
        if (isNewQuery) {
          set({
            categories: new Map(),
            categoryStats: null,
            loadingFailed: false,
            cursor: null,
            hasMore: true,
            currentQueryKey: queryKey,
            initialized: false,
          });
        }

        // read fresh state after reset
        const fresh = get();

        // stop useless pagination calls
        if (!isNewQuery && !fresh.hasMore) return;

        set({ isLoading: true });

        const [categoriesRes, statsRes] = await Promise.all([
          CategoryServices.getAllCategories({
            ...query,
            cursor: isNewQuery ? undefined : (fresh.cursor ?? undefined),
          }),
          isNewQuery
            ? CategoryServices.getCategoryStats()
            : Promise.resolve(null),
        ]);

        // ignore stale response
        if (activeCategoryQueryKey !== queryKey) return;

        if (!categoriesRes?.data) throw new Error("Categories fetch failed");

        set((prev) => {
          const map = isNewQuery ? new Map() : new Map(prev.categories);

          for (const cat of categoriesRes.data) {
            map.set(cat.id, cat);
          }

          return {
            categories: map,
            cursor: categoriesRes.nextCursor ?? null,
            hasMore: categoriesRes.hasMore ?? false,
            categoryStats: statsRes?.stats ?? prev.categoryStats ?? null,
            initialized: true,
            loadingFailed: false,
          };
        });
      } catch (err) {
        if (activeCategoryQueryKey === queryKey) {
          set({ loadingFailed: true });
          console.error("fetchCategories error:", err);
        }
      } finally {
        if (activeCategoryQueryKey === queryKey) {
          set({ isLoading: false });
        }
        inflightCategoryRequests.delete(queryKey);
      }
    })();

    inflightCategoryRequests.set(queryKey, promise);
    return promise;
  },

  addCategory: (category: CategoryWithRelations) => {
    set((state) => {
      const next = new Map(state.categories);
      next.set(category.id, category);
      return {
        categories: next,
        categoryStats: state.categoryStats
          ? {
              ...state.categoryStats,
              categories_count: state.categoryStats?.categories_count + 1,
            }
          : null,
      };
    });
  },

  getCategory: (categoryId: string) => {
    return get().categories.get(categoryId);
  },
  removeCategory: (categoryId: string) => {
    set((state) => {
      const next = new Map(state.categories);
      next.delete(categoryId);
      return {
        categories: next,
        categoryStats: state.categoryStats
          ? {
              ...state.categoryStats,
              categories_count: state.categoryStats?.categories_count - 1,
            }
          : null,
      };
    });
  },

  updateCategory: (categoryId: string, data: Category) => {
    set((state) => {
      const next = new Map(state.categories);
      next.set(categoryId, { ...next.get(categoryId), ...data });
      return { categories: next };
    });
  },

  clearCategories: () => {
    set({
      categories: new Map(),
      categoryStats: null,
      loadingFailed: false,
      isLoading: true,
      cursor: null,
      hasMore: false,
    });
  },
}));
