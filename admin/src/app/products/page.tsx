"use client";

import React, { useEffect, useState } from "react";
import ProductFilters from "./components/ProductsFilter";
import ProductsTable from "./components/ProductsTable";
import ProductHeader from "./components/ProductHeader";
import ProductSidePanel from "./components/ProductSidepanel";
import {
  useProductQueryStore,
  useProductsStore,
} from "@/src/store/products.store";
import { ProductWithRelations } from "@/src/lib/types";
import VariantSidePanel from "./components/VariantSidePanel";
import { useInView } from "react-intersection-observer";

export default function ProductsPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  const { productStats, loadingFailed, initialized, fetchProducts } =
    useProductsStore();

  useEffect(() => {
    if (initialized) return;
    console.log("home hit");
    fetchProducts();
  }, []);


  return (
    <div className="flex h-screen flex-col bg-white overflow-hidden">
      {/* Component 1: ProductHeader */}
      <ProductHeader
        count={productStats?.products_count || 0}
        onAdd={() => {
          setSelectedProductId(null);
          setIsPanelOpen(true);
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
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

          {/* Component 2: Filters Row */}
          <ProductFilters />

          {/* Component 3: ProductsTable */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
            <div className="mx-auto max-w-[1400px]">
              <ProductsTable
                onEdit={(id: string) => {
                  setSelectedProductId(id);
                  setIsPanelOpen(true);
                }}
              />
            </div>
          </main>
        </div>

        {/* Component 4: Side Panel */}
        {isPanelOpen && (
          <ProductSidePanel
            id={selectedProductId}
            onClose={() => setIsPanelOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
