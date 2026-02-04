// components/products/FilterButton.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Check, Search, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import { cn } from "@/src/lib/utils";
import { useCategoryStore } from "@/src/store/category.store";
import { useBrandsStore } from "@/src/store/brands.store";

interface Option {
  value: string;
  label: string;
}

interface FilterButtonProps {
  label: "Category" | "Brand";
  selectedValue: string;
  onSelect: (value: string) => void;
}

export default function FilterButton({
  label,
  selectedValue,
  onSelect,
}: FilterButtonProps) {
  const {
    fetchCategories,
    isLoading: isCategoryLoading,
    categories,
  } = useCategoryStore();
  const { fetchBrands, isLoading: isBrandLoading, brands } = useBrandsStore();

  const [open, setOpen] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(isCategoryLoading || isBrandLoading);

  const options =
    label === "Category"
      ? Array.from(categories.values())
      : Array.from(brands.values());

  useEffect(() => {
    const trimmed = searchInput.trim();

    if (trimmed === "") return setLoading(false);

    setLoading(true);

    const timeout = setTimeout(async () => {
      if (label === "Category") {
        await Promise.resolve(
          fetchCategories({ search: trimmed || undefined }),
        );
        setLoading(false);
      }

      if (label === "Brand") {
        await Promise.resolve(fetchBrands({ search: trimmed || undefined }));
        setLoading(false);
      }
    }, 400); // debounce delay

    return () => {
      clearTimeout(timeout);
    };
  }, [searchInput]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors outline-none focus:ring-2 focus:ring-blue-500/20">
          <span className="text-gray-400 font-normal">{label}:</span>
          <span className="font-medium text-gray-900">
            {options.find((opt) => opt.name === selectedValue)?.name ||
              selectedValue}
          </span>
          <ChevronDown
            size={14}
            className={cn(
              "text-gray-400 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[240px] p-0" align="start">
        <Command>
          <CommandInput
            onValueChange={(val) => setSearchInput(val)}
            placeholder={`Search ${label}...`}
            className="h-9"
          />
          <CommandList>
            {!loading && options.length === 0 && (
              <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
            )}

            {loading ? (
              <FilterLoadingSkeleton />
            ) : (
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.name}
                    value={option.name}
                    onSelect={(currentValue) => {
                      onSelect(currentValue);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between text-[13px]"
                  >
                    {option.name}
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4 text-blue-600",
                        selectedValue === option.name
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function FilterLoadingSkeleton() {
  return (
    <div className="p-2 space-y-2 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-2 py-1.5">
          <div className="h-4 w-4 rounded bg-gray-100" /> {/* Checkbox spot */}
          <div className="h-3 w-full rounded bg-gray-100" /> {/* Text spot */}
        </div>
      ))}
      <div className="flex justify-center py-2">
        <Loader2 size={16} className="text-gray-300 animate-spin" />
      </div>
    </div>
  );
}
