import { create } from "zustand";
import { Brand, Category, CategoryWithRelations } from "../lib/types";
import { BrandsServices } from "../services/brands.services";
import { CategoryServices } from "../services/category.services";

interface QueryParams {
  is_active?: "true" | "false";
  name?: "asc" | "desc";
  created_at?: "asc" | "desc";
  search?: string;
  parent_id?: string;
}

interface CategoriesState {
  categoriesCount: number;
  categories: Map<Category["id"], CategoryWithRelations>;
  loadingFailed: boolean;
  isLoading: boolean;
  fetchCategories: (query?: QueryParams) => void;
  addCategory: (category: CategoryWithRelations) => void;
  getCategory: (categoryId: string) => CategoryWithRelations | undefined;
  removeCategory: (categoryId: string) => void;
  clearCategory: () => void;
}

export const useCategoryStore = create<CategoriesState>((set, get) => ({
  categories: new Map(),
  categoriesCount: 0,
  loadingFailed: false,
  isLoading: true,
  fetchCategories: async (query) => {
    try {
      set({ isLoading: true });
      const categories = await CategoryServices.getAllCategories({
        is_active: query?.is_active,
        name: query?.name,
        created_at: query?.created_at,
        search: query?.search,
        parent_id: query?.parent_id,
      });
      const categoriesCount = await CategoryServices.getCategoriesCount();
      if (!categories) return set({ loadingFailed: true });

      const categoriesWithKeys = categories.map(
        (category) => [category.id, category] as const,
      );
      set({
        categories: new Map(categoriesWithKeys),
        categoriesCount: categoriesCount.count || 0,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addCategory: (category: CategoryWithRelations) => {
    set((state) => {
      const next = new Map(state.categories);
      next.set(category.id, category);
      return { categories: next, categoriesCount: state.categoriesCount + 1 };
    });
  },

  getCategory: (categoryId: string) => {
    return get().categories.get(categoryId);
  },
  removeCategory: (categoryId: string) => {
    set((state) => {
      const next = new Map(state.categories);
      next.delete(categoryId);
      return { categories: next, categoriesCount: state.categoriesCount - 1 };
    });
  },
  clearCategory: () => set({ categories: new Map(), categoriesCount: 0 }),
}));
