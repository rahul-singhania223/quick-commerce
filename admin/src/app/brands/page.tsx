"use client";

import { useEffect, useState } from "react";
import BrandHeader from "./components/BrandHeader";
import BrandControls from "./components/BrandControls";
import BrandsTableSkeleton from "./components/LoadingState";
import BrandsTable from "./components/BrandsTable";
import {
  BrandsTableEmpty,
  BrandsTablePagination,
} from "./components/BrandsTablePagination";
import BrandModal from "./components/BrandModal";
import { BrandsServices } from "@/src/services/brands.services";
import { useBrandsStore } from "@/src/store/brands.store";

export default function BrandsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  const { brands, brandsCount, isLoading, loadingFailed, fetchBrands } =
    useBrandsStore();

  const [countsPerPage, setCountsPerPage] = useState(10);

  const handleOpenCreateModal = () => {
    setSelectedBrandId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (id: string) => {
    setSelectedBrandId(id);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-12">
      <BrandHeader count={brandsCount} onAddBrand={handleOpenCreateModal} />

      <main className="mx-auto max-w-[1600px]">
        <BrandControls />

        <div className="p-4 md:p-6">
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

          {isLoading ? (
            <BrandsTableSkeleton />
          ) : brandsCount > 0 ? (
            <>
              {/* 3C. Brands Table */}
              <BrandsTable onEdit={handleOpenEditModal} />

              {/* 8. Pagination */}
              <BrandsTablePagination
                current={1}
                total={Math.ceil(brandsCount / countsPerPage)}
              />
            </>
          ) : (
            /* 3D. Empty State */
            <BrandsTableEmpty onAdd={handleOpenCreateModal} />
          )}
        </div>
      </main>

      {/* 4. Create / Edit Brand Modal */}
      {isModalOpen && (
        <BrandModal
          isOpen={isModalOpen}
          brandId={selectedBrandId}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Mobile Strategy Warning (Overlay or Logic could go here) */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden">
        <div className="rounded-md bg-gray-900 p-3 text-center text-[12px] text-white opacity-90 shadow-lg">
          Mobile view is read-only. Use desktop for full management.
        </div>
      </div>
    </div>
  );
}
