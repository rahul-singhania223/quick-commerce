"use client";

import React, { useEffect, useState } from "react";
import CategoryTree from "./components/CategoryTree";
import CategorySidePanel from "./components/CategorySidePanel";
import CategoryHeader from "./components/CategoryHeader";
import CategoryTable from "./components/CategoryTable";
import { useCategoryStore } from "@/src/store/category.store";
import { Category } from "@/src/lib/types";

const categories: {
  id: string;
  name: string;
  parentName: string | null;
  level: 1 | 2 | 3;
  productCount: number;
  status: "active" | "inactive";
  hasChildren: boolean;
}[] = [
  // ===== Level 1 =====
  {
    id: "cat_001",
    name: "Groceries",
    parentName: null,
    level: 1,
    productCount: 1240,
    status: "active",
    hasChildren: true,
  },
  {
    id: "cat_002",
    name: "Fruits & Vegetables",
    parentName: null,
    level: 1,
    productCount: 540,
    status: "active",
    hasChildren: true,
  },
  {
    id: "cat_003",
    name: "Beverages",
    parentName: null,
    level: 1,
    productCount: 310,
    status: "active",
    hasChildren: true,
  },

  // ===== Level 2 =====
  {
    id: "cat_004",
    name: "Staples",
    parentName: "Groceries",
    level: 2,
    productCount: 420,
    status: "active",
    hasChildren: true,
  },
  {
    id: "cat_005",
    name: "Snacks & Packaged Food",
    parentName: "Groceries",
    level: 2,
    productCount: 380,
    status: "active",
    hasChildren: true,
  },
  {
    id: "cat_006",
    name: "Fresh Fruits",
    parentName: "Fruits & Vegetables",
    level: 2,
    productCount: 210,
    status: "active",
    hasChildren: false,
  },
  {
    id: "cat_007",
    name: "Fresh Vegetables",
    parentName: "Fruits & Vegetables",
    level: 2,
    productCount: 190,
    status: "active",
    hasChildren: false,
  },
  {
    id: "cat_008",
    name: "Soft Drinks",
    parentName: "Beverages",
    level: 2,
    productCount: 120,
    status: "active",
    hasChildren: false,
  },
];

export default function CategoriesPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const [breadCrumbPaths, setBreadCrumbPaths] = useState<Category[]>([]);

  const {
    isLoading,
    loadingFailed,
    categories: categoriesMap,
    categoriesCount,
    fetchCategories,
  } = useCategoryStore();

  const onEdit = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setIsPanelOpen(true);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCategories({
      parent_id:
        breadCrumbPaths.length > 0
          ? breadCrumbPaths[breadCrumbPaths.length - 1].id
          : undefined,
    });
  }, [breadCrumbPaths]);

  return (
    <div className="flex h-screen flex-col bg-white overflow-hidden">
      {/* A. Page Header */}
      <CategoryHeader
        onAddCategory={() => setIsPanelOpen(true)}
        selectedCategory={null}
        breadcrumbPath={breadCrumbPaths}
        totalCategories={categoriesCount}
        setBreadCrumbPath={setBreadCrumbPaths}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* B. Category Tree Sidebar */}
        {/* <aside className="w-[260px] border-r border-gray-200 bg-gray-50 overflow-y-auto hidden lg:block">
          <CategoryTree />
        </aside> */}

        {/* C. Categories Table (Center) */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Error State Placeholder (Section 7) */}
          {loadingFailed && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-[14px] text-red-800 border border-red-100 flex justify-between items-center">
              Failed to load brands. Please try again.
              <button
                onClick={() => location.reload()}
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}
          <div className="mx-auto max-w-[1200px]">
            <CategoryTable
              breadcrumbPath={breadCrumbPaths}
              setBreadcrumbPath={setBreadCrumbPaths}
              onEdit={onEdit}
            />
          </div>
        </main>

        {/* D. Side Panel (Drawer) */}
        {isPanelOpen && (
          <CategorySidePanel
            id={selectedCategoryId}
            onClose={() => setIsPanelOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
