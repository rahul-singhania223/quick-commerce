"use client";

import React, { useEffect, useRef, useState } from "react";
import CategoryTree from "./components/CategoryTree";
import CategorySidePanel from "./components/CategorySidePanel";
import CategoryHeader from "./components/CategoryHeader";
import CategoryTable from "./components/CategoryTable";
import {
  useCategoryQueryStore,
  useCategoryStore,
} from "@/src/store/category.store";
import { Category } from "@/src/lib/types";
import { useInView } from "react-intersection-observer";

export default function CategoriesPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const [breadCrumbPaths, setBreadCrumbPaths] = useState<Category[]>([]);

  const { initialized, loadingFailed, categoryStats, fetchCategories } =
    useCategoryStore();

  const { query, resetQuery } = useCategoryQueryStore();

  const onEdit = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setIsPanelOpen(true);
  };

  useEffect(() => {
    if (initialized) return;
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!initialized) return;
    fetchCategories(query);
  }, [query]);

  useEffect(() => {
    if (!initialized) return;
    resetQuery();
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
        totalCategories={categoryStats?.categories_count || 0}
        setBreadCrumbPath={setBreadCrumbPaths}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* B. Category Tree Sidebar */}

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
