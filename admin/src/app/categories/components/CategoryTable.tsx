"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Edit2,
  MoreVertical,
  Folder,
  FileText,
  ArrowRight,
  Info,
  Trash2,
  Pencil,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Badge } from "@/src/components/ui/badge";
import { CategoryTableSkeleton } from "./categoryTableSkeleton";
import {
  useCategoryQueryStore,
  useCategoryStore,
} from "@/src/store/category.store";
import { Category } from "@/src/lib/types";
import { Button } from "@/src/components/ui/button";
import { CategoryServices } from "@/src/services/category.services";
import { toast } from "sonner";
import { useAlertStore } from "@/src/store/alert.store";

interface CategoryTableProps {
  breadcrumbPath: Category[];
  setBreadcrumbPath: any;
  onEdit: (categoryId: string) => void;
}

export default function CategoryTable({
  breadcrumbPath,
  setBreadcrumbPath,
  onEdit,
}: CategoryTableProps) {
  const {
    categories,
    isLoading,
    initialized,
    loadingFailed,
    categoryStats,
    hasMore,
    cursor,
    getCategory,
    removeCategory,
    fetchCategories,
  } = useCategoryStore();

  const { query } = useCategoryQueryStore();

  const { show: showAlert } = useAlertStore();

  const categoriesList = useMemo(
    () => Array.from(categories.values()),
    [categories],
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return categoriesList.slice(startIndex, startIndex + pageSize);
  }, [categoriesList, currentPage]);

  const totalPages = Math.ceil(
    categoryStats ? categoryStats.categories_count / pageSize : 1,
  );

  const [deleting, setDeleting] = useState("");

  const onViewProducts = (id: string) => {};

  const fetchPaginatedCategories = async () => {
    if (currentPage * pageSize <= categories.size) return;
    if (!hasMore) return;
    if (!cursor) return;
    fetchCategories({ ...query, cursor });
  };

  const deleteCategory = async (id: string) => {
    try {
      setDeleting(id);

      const res = await CategoryServices.deleteCategory(id);
      if (res.error) return toast.error(res.error);

      toast.success("Category deleted successfully!");
      removeCategory(id);
    } finally {
      setDeleting("");
    }
  };

  const onDelete = (id: string) => {
    showAlert({
      title: "Delete Category",
      message: `Deleting this category will also delete its subcategories and ${getCategory(id)?.products_count} Products. Are you sure you want to delete this category?`,
      onConfirm: () => {
        deleteCategory(id);
      },
    });
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  if (isLoading) return <CategoryTableSkeleton />;

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="h-12 border-b border-gray-200 bg-gray-50">
              <th className="min-w-[260px] max-w-[420px] px-4 text-[12px] font-medium uppercase tracking-[0.04em] text-gray-500">
                Category Name
              </th>
              <th className="w-[200px] px-4 text-[12px] font-medium uppercase tracking-[0.04em] text-gray-500">
                Parent Category
              </th>
              <th className="w-[80px] px-4 text-center text-[12px] font-medium uppercase tracking-[0.04em] text-gray-500">
                Level
              </th>
              <th className="w-[120px] px-4 text-center text-[12px] font-medium uppercase tracking-[0.04em] text-gray-500">
                Products
              </th>
              <th className="w-[120px] px-4 text-center text-[12px] font-medium uppercase tracking-[0.04em] text-gray-500">
                Status
              </th>
              <th className="w-[80px] px-4 text-right text-[12px] font-medium uppercase tracking-[0.04em] text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedCategories.map((cat) => (
              <tr
                key={cat.id}
                className="group h-[56px] transition-colors hover:bg-gray-50 focus-within:bg-gray-50 outline-none"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onEdit(cat.id)}
              >
                {/* 1. Category Name */}
                <td className="px-4">
                  <button
                    onClick={() =>
                      setBreadcrumbPath((prev: Category[]) => [...prev, cat])
                    }
                    className="flex items-center gap-3 text-left focus:outline-none"
                  >
                    {cat.level < 5 ? (
                      <Folder size={18} className="text-primary shrink-0" />
                    ) : (
                      <FileText size={18} className="text-gray-400 shrink-0" />
                    )}
                    <span className="text-[14px] font-medium text-gray-900 line-clamp-2 hover:underline decoration-primary decoration-2">
                      {cat.name}
                    </span>
                  </button>
                </td>

                {/* 2. Parent Category */}
                <td className="px-4 text-[13px] text-gray-500">
                  {cat.parent?.name || "—"}
                </td>

                {/* 3. Level Badge */}
                <td className="px-4 text-center">
                  <span
                    className={`inline-flex h-6 w-10 items-center justify-center rounded text-[12px] font-bold ${
                      cat.level === 1
                        ? "bg-[#DBEAFE] text-[#1E40AF]"
                        : cat.level === 2
                          ? "bg-[#EDE9FE] text-[#5B21B6]"
                          : "bg-[#F3F4F6] text-[#374151]"
                    }`}
                  >
                    L{cat.level}
                  </span>
                </td>

                {/* 4. Products Count */}
                <td className="px-4 text-center">
                  <button
                    onClick={() => onViewProducts(cat.id)}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {cat.products_count}
                    <ArrowRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"
                    />
                  </button>
                </td>

                {/* 5. Status */}
                <td className="px-4 text-center">
                  <Badge
                    variant="secondary"
                    className={`h-6 rounded-full px-2.5 text-[12px] font-medium shadow-none ${
                      cat.is_active
                        ? "bg-[#DCFCE7] text-[#166534] hover:bg-[#DCFCE7]"
                        : "bg-[#E5E7EB] text-[#374151] hover:bg-[#E5E7EB]"
                    }`}
                  >
                    {cat.is_active ? "Active" : "Inactive"}
                  </Badge>
                </td>

                {/* 6. Actions */}
                <td className="px-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Button
                      disabled={!!deleting}
                      variant={"outline"}
                      onClick={() => onEdit(cat.id)}
                    >
                      <Pencil size={16} className="text-gray-700" />
                    </Button>

                    <Button
                      disabled={!!deleting}
                      onClick={() => onDelete(cat.id)}
                      variant={"ghost"}
                      className="bg-destructive/10 hover:bg-destructive/20"
                    >
                      {deleting === cat.id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Trash2 size={16} className="text-destructive" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* COMPONENT 8: Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50/50">
        <div className="text-[13px] text-gray-500 space-x-2"></div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft size={16} />
          </Button>

          <div className="flex items-center gap-1">
            {[...Array(Math.ceil(categoriesList.length / pageSize))].map(
              (_, i) => {
                const pageNum = i + 1;
                // Simple logic to only show few page numbers if there are many
                if (totalPages > 5 && Math.abs(pageNum - currentPage) > 2)
                  return null;

                return (
                  <Button
                    type="button"
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "ghost"}
                    size="sm"
                    className={`h-8 w-8 p-0 text-[13px] ${currentPage === pageNum ? "bg-primary hover:bg-primary/95" : ""}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              },
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentPage((prev) => Math.min(prev + 1, totalPages));
            }}
            disabled={!hasMore}
            className="h-8 w-8 p-0"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
