"use client";

import { Search, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useEffect, useState } from "react";
import { useProductsStore } from "@/src/store/products.store";
import FilterButton from "./FilterButton";
import { useSearchParams } from "next/navigation";

export default function ProductFilters() {
  const { fetchProducts } = useProductsStore();

  const [filterOptions, setFilterOptions] = useState({
    category: undefined as string | undefined,
    brand: undefined as string | undefined,
    search: "",
  });

  useEffect(() => {
    const timeout = setTimeout(async () => {
      fetchProducts({
        ...filterOptions,
        search: filterOptions.search.trim() || undefined,
      });
    }, 400); // debounce delay

    return () => {
      clearTimeout(timeout);
    };
  }, [filterOptions]);

  return (
    <div className="flex h-[56px] w-full items-center gap-4 border-b border-gray-200 bg-[#F9FAFB] px-4">
      {/* Search Field */}
      <div className="relative w-[280px] bg-white">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />
        <input
          value={filterOptions.search}
          onChange={(e) =>
            setFilterOptions((prev) => ({ ...prev, search: e.target.value }))
          }
          type="text"
          placeholder="Search by name, SKU"
          className="h-9 w-full rounded-lg border border-gray-200 pl-10 pr-3 text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
      </div>

      {/* Selectors */}
      <div className="flex items-center gap-2">
        <FilterButton
          label="Category"
          selectedValue={filterOptions.category || "All Categories"}
          onSelect={(cat) =>
            setFilterOptions((prev) => ({ ...prev, category: cat }))
          }
        />
        <FilterButton
          label="Brand"
          selectedValue={filterOptions.brand || "All Brands"}
          onSelect={(brand) =>
            setFilterOptions((prev) => ({ ...prev, brand: brand }))
          }
        />
      </div>

      <div className="ml-auto">
        <Button
          onClick={() =>
            setFilterOptions({
              category: undefined,
              brand: undefined,
              search: "",
            })
          }
          variant="ghost"
          className="text-[12px] text-gray-500 hover:text-gray-900 h-8"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}

// function FilterButton({ label, value }: { label: string; value: string }) {
//   return (
//     <button className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-[13px] text-gray-600 hover:bg-gray-50">
//       <span className="text-gray-400 font-normal">{label}:</span>
//       <span className="font-medium text-gray-900">{value}</span>
//       <ChevronDown size={14} className="text-gray-400" />
//     </button>
//   );
// }
