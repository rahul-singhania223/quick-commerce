"use client";

import {
  Edit2,
  Image as ImageIcon,
  ExternalLink,
  Trash2,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useBrandsQueryStore, useBrandsStore } from "@/src/store/brands.store";
import { Button } from "@/src/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { set } from "zod";
import { useAlertStore } from "@/src/store/alert.store";
import { id } from "zod/v4/locales";
import { BrandsServices } from "@/src/services/brands.services";
import { toast } from "sonner";
import { deleteFile, getFilePath } from "@/src/lib/utils";
import { useRouter } from "next/navigation";

export default function BrandsTable({
  onEdit,
}: {
  onEdit: (id: string) => void;
}) {
  const {
    brands: brandsMap,
    removeBrand,
    brandStats,
    cursor,
    hasMore,
    fetchBrands,
  } = useBrandsStore();
  const { query, resetQuery } = useBrandsQueryStore();
  const { show } = useAlertStore();

  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [deleting, setDeleting] = useState("");
  const pageSize = 20;

  const brandsList = useMemo(() => {
    return Array.from(brandsMap.values());
  }, [brandsMap]);

  const paginatedBrands = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return brandsList.slice(startIndex, endIndex);
  }, [brandsList, currentPage]);

  const totalPages = Math.ceil(
    brandStats ? brandStats.brands_count / pageSize : 1,
  );

  const fetchPaginatedBrands = async () => {
    if (currentPage * pageSize <= brandsMap.size) return;
    if (!hasMore) return;
    if (!cursor) return;
    fetchBrands({ ...query, cursor: cursor });
  };

  const deleteBrand = async (id: string) => {
    try {
      setDeleting(id);

      // Delete in DB
      const res = await BrandsServices.deleteBrand(id);
      if (res.error) return toast.error(res.error);

      // Remove from store
      removeBrand(id);

      // Delete image
      const filePath = getFilePath(brandsMap.get(id)?.logo || "");
      await deleteFile(filePath);

      return toast.success("Brand deleted successfully!");
    } finally {
      setDeleting("");
    }
  };

  const handleDelete = (id: string) => {
    show({
      title: "Delete Brand",
      message: "Are you sure you want to delete this brand?",
      onConfirm: () => {
        deleteBrand(id);
      },
    });
  };

  useEffect(() => {
    fetchPaginatedBrands();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="h-12 border-b border-gray-200 bg-gray-50">
              <th className="w-[64px] px-4 text-center text-[12px] font-medium tracking-wider text-gray-500 uppercase">
                Logo
              </th>
              <th className="min-w-[220px] max-w-[360px] px-4 text-[12px] font-medium tracking-wider text-gray-500 uppercase">
                Brand Name
              </th>
              <th className="w-[180px] px-4 text-[12px] font-medium tracking-wider text-gray-500 uppercase">
                Slug
              </th>
              <th className="w-[120px] px-4 text-center text-[12px] font-medium tracking-wider text-gray-500 uppercase">
                Products
              </th>
              <th className="w-[120px] px-4 text-center text-[12px] font-medium tracking-wider text-gray-500 uppercase">
                Status
              </th>
              <th className="w-[72px] px-4 text-right text-[12px] font-medium tracking-wider text-gray-500 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedBrands.map((brand) => (
              <tr
                key={brand.id}
                className="group h-[56px] transition-colors hover:bg-gray-50"
              >
                {/* Logo */}
                <td className="px-4 text-center">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center overflow-hidden rounded-md bg-gray-100 border border-gray-100">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <ImageIcon size={16} className="text-gray-400" />
                    )}
                  </div>
                </td>

                {/* Name */}
                <td className="px-4">
                  <button className="text-[14px] font-medium text-gray-900 line-clamp-2 hover:underline focus:outline-none text-left">
                    {brand.name}
                  </button>
                </td>

                {/* Slug */}
                <td className="px-4">
                  <code className="rounded bg-gray-50 px-1.5 py-0.5 font-mono text-[13px] text-gray-500">
                    {brand.slug}
                  </code>
                </td>

                {/* Products Count */}
                <td className="px-4 text-center">
                  <button className="inline-flex items-center gap-1 text-[13px] font-medium text-gray-900 hover:text-blue-600">
                    {brand.products_count}
                    {/* <ExternalLink
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    /> */}
                  </button>
                </td>

                {/* Status Badge */}
                <td className="px-4 text-center">
                  <span
                    className={`inline-flex h-6 items-center rounded-full px-2.5 text-[12px] font-medium ${
                      brand.is_active
                        ? "bg-[#DCFCE7] text-[#166534]"
                        : "bg-[#E5E7EB] text-[#374151]"
                    }`}
                  >
                    {brand.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      disabled={!!deleting}
                      variant={"ghost"}
                      onClick={() => onEdit(brand.id)}
                      className=""
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      disabled={!!deleting}
                      onClick={() => handleDelete(brand.id)}
                      variant={"destructive"}
                      className="bg-destructive/10 hover:bg-destructive/40"
                    >
                      {deleting === brand.id ? (
                        <Loader2
                          size={16}
                          className="animate-spin text-destructive/60"
                        />
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
            {[...Array(Math.ceil(brandsList.length / pageSize))].map(
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
