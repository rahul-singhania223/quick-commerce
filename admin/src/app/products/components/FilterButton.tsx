"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { Brand, Category } from "@/src/lib/types";
import { useDebounce } from "@/src/hooks/useDebounce";

interface Option {
  value: string;
  label: string;
}

interface FilterButtonProps {
  selectedValue?: Option;
  onSelect: (value: Option | undefined) => void;
  options: Option[];
  loading: boolean;
  label: string;
  onSearch: (query: string) => void;
}

export default function FilterButton({
  selectedValue,
  onSelect,
  loading,
  options,
  label,
  onSearch,
}: FilterButtonProps) {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const debouncedSearch = useDebounce(searchInput, 200);

  useEffect(() => {
    if (loading) return;
    const trimmed = debouncedSearch.trim();
    if (!trimmed) return;

    onSearch(trimmed);
  }, [debouncedSearch]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors outline-none focus:ring-2 focus:ring-blue-500/20">
          <span className="font-medium text-gray-900">
            {selectedValue?.label || "All" + " " + label}
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
        <Command shouldFilter={false}>
          <CommandInput
            value={searchInput}
            onValueChange={setSearchInput}
            placeholder={`Search ${label}...`}
            className="h-9"
          />

          <CommandList>
            {/* empty search result */}
            {!loading && debouncedSearch && options.length === 0 && (
              <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
            )}

            {loading ? (
              <FilterLoadingSkeleton />
            ) : (
              <CommandGroup>
                <CommandItem
                  value={undefined}
                  onSelect={() => {
                    onSelect(undefined);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between text-[13px]"
                >
                  All {label}
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4 text-blue-600",
                      !selectedValue ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>

                {options.map((option) => (
                  <CommandItem
                    key={option.label}
                    value={option.value}
                    onSelect={() => {
                      onSelect(option);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between text-[13px]"
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4 text-blue-600",
                        selectedValue?.value === option.value
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
