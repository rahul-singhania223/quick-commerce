"use client";

import { Search, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import {
  useProductQueryStore,
  useProductsStore,
} from "@/src/store/products.store";
import FilterButton from "./FilterButton";
import { useSearchParams } from "next/navigation";
import { useCategoryStore } from "@/src/store/category.store";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useBrandsStore } from "@/src/store/brands.store";
import { validate as isValidUUID } from "uuid";

export default function ProductFilters() {
  const { fetchProducts, initialized } = useProductsStore();
  const { query, setQuery, resetQuery } = useProductQueryStore();
  const {
    categories,
    isLoading: isCategoryLoading,
    fetchCategories,
    getCategory,
  } = useCategoryStore();

  const {
    brands,
    isLoading: isBrandLoading,
    fetchBrands,
    getBrand,
  } = useBrandsStore();

  const categoriesOptions = useMemo(
    () =>
      Array.from(categories.values()).map((cat) => ({
        label: cat.name,
        value: cat.id,
      })),
    [categories],
  );

  const brandsOptions = useMemo(
    () =>
      Array.from(brands.values()).map((cat) => ({
        label: cat.name,
        value: cat.id,
      })),
    [brands],
  );

  const activeFilterCategory = getCategory(query.category_id ?? "");
  const activeFilterBrand = getBrand(query.brand_id ?? "");

  const [searchInput, setSearchInput] = useState(query.search || "");
  const [filterOptions, setFilterOptions] = useState<{
    category: { label: string; value: string } | undefined;
    brand: { label: string; value: string } | undefined;
  }>({
    category: activeFilterCategory
      ? { label: activeFilterCategory.name, value: activeFilterCategory.id }
      : undefined,
    brand: activeFilterBrand
      ? { label: activeFilterBrand.name, value: activeFilterBrand.id }
      : undefined,
  });

  const debouncedSearch = useDebounce(searchInput, 200);

  useEffect(() => {
    const search = searchInput.trim();

    setQuery({
      category_id: filterOptions.category?.value,
      brand_id: filterOptions.brand?.value,
      search: search ? search : undefined,
      cursor: undefined,
    });
  }, [filterOptions]);

  useEffect(() => {
    const trimmed = debouncedSearch.trim();

    setQuery({
      search: trimmed,
      category_id: filterOptions.category?.value,
      brand_id: filterOptions.brand?.value,
      cursor: undefined,
    });
  }, [debouncedSearch]);

  useEffect(() => {
    fetchProducts(query);
  }, [query]);

  return (
    <div className="flex h-[56px] w-full items-center gap-4 border-b border-gray-200 bg-[#F9FAFB] px-4">
      {/* Search Field */}
      <div className="relative w-[280px] bg-white">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          placeholder="Search by name, SKU"
          className="h-9 w-full rounded-lg border border-gray-200 pl-10 pr-3 text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
      </div>

      {/* Selectors */}
      <div className="flex items-center gap-2">
        <FilterButton
          label="Categories"
          options={categoriesOptions}
          selectedValue={filterOptions.category}
          onSelect={(category) =>
            setFilterOptions((prev) => ({ ...prev, category: category }))
          }
          loading={isCategoryLoading}
          onSearch={(val) => fetchCategories({ search: val })}
        />

        <FilterButton
          label="Brands"
          options={brandsOptions}
          selectedValue={filterOptions.brand}
          onSelect={(brand) =>
            setFilterOptions((prev) => ({ ...prev, brand: brand }))
          }
          loading={isBrandLoading}
          onSearch={(val) => fetchBrands({ search: val })}
        />
      </div>

      <div className="ml-auto">
        <Button
          onClick={() => {
            setFilterOptions({
              category: undefined,
              brand: undefined,
            });

            setSearchInput("");
          }}
          variant="ghost"
          className="text-[12px] text-gray-500 hover:text-gray-900 h-8"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
