import { create } from "zustand";
import {
  Brand,
  Category,
  CategoryStats,
  CategoryWithRelations,
} from "../lib/types";
import { BrandsServices } from "../services/brands.services";
import { CategoryServices } from "../services/category.services";

let categoriesPromise: Promise<void> | null = null;

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
    if (categoriesPromise) return categoriesPromise;

    categoriesPromise = (async () => {
      try {
        const state = get();
        const queryKey = buildQueryKey(query);

        // reset if query changed
        const newQuery = queryKey !== state.currentQueryKey;
        if (newQuery) {
          set({
            categories: new Map(),
            categoryStats: null,
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

        console.time("Fetch: ");
        const [categories, categoryStats] = await Promise.all([
          CategoryServices.getAllCategories({
            ...query,
            cursor: newQuery ? undefined : state.cursor || undefined,
          }),
          newQuery && CategoryServices.getCategoryStats(),
        ]);
        console.timeEnd("Fetch: ");

        if (!categories) throw new Error("Failed to fetch categories");
        if (newQuery && categoryStats && !categoryStats.stats)
          throw new Error("Failed to fetch category stats");

        const categoriesWithKeys = categories.data.map(
          (category) => [category.id, category] as const,
        );

        set((prev) => {
          const map = new Map(prev.categories);

          for (const cat of categories.data) {
            map.set(cat.id, cat);
          }

          return {
            categories: map,
            nextCursor: categories.nextCursor,
            hasMore: categories.hasMore,
            isLoading: false,
            categoryStats: categoryStats ? categoryStats.stats : null,

            initialized: true,
          };
        });
      } catch (error) {
        set({ loadingFailed: true });
        console.log("Fetch categories error: ", error);
      } finally {
        set({ isLoading: false });
        categoriesPromise = null;
      }
    })();

    return categoriesPromise;
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
