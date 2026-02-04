"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Check,
  Search,
  Loader2,
  Cross,
  X,
  XCircle,
} from "lucide-react";
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
import { Button } from "./ui/button";

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps {
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onSearch: (query: string) => void;
  isLoading: boolean;
  placeholder?: string;
  label: string;
  width?: string;
  clearSelection: () => void;
}

export default function SelectInput({
  onSelect,
  options,
  onSearch,
  isLoading,
  selectedValue,
  label,
  width,
  clearSelection,
}: SelectInputProps) {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const trimmed = searchInput.trim();

    const timeout = setTimeout(() => {
      onSearch(trimmed);
    }, 400); // debounce delay

    return () => {
      clearTimeout(timeout);
    };
  }, [searchInput]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="">
        <button className="flex h-9 items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors outline-none focus:ring-2 focus:ring-blue-500/20 w-full">
          {selectedValue ? (
            <>
              <span className="font-medium text-gray-900">
                {options.find((opt) => opt.label === selectedValue)?.label ||
                  selectedValue}
              </span>
            </>
          ) : (
            <span className="text-gray-400 font-normal">{label}:</span>
          )}

          <div className="flex items-center gap-4">
            {selectedValue && (
              <Button
                onClick={clearSelection}
                type="button"
                variant={"ghost"}
                size={"icon"}
                className="cursor-pointer"
              >
                <XCircle className="text-destructive/70" />
              </Button>
            )}
            <ChevronDown
              size={14}
              className={cn(
                "text-gray-400 transition-transform",
                open && "rotate-180",
              )}
            />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent className="width-[200px] p-0" align="start">
        <Command className="w-full">
          <CommandInput
            onValueChange={(val) => setSearchInput(val)}
            placeholder={`Search ...`}
            className="h-9"
          />
          <CommandList className="w-full">
            {!isLoading && options.length === 0 && (
              <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
            )}

            {isLoading ? (
              <FilterLoadingSkeleton />
            ) : (
              <CommandGroup className="w-full">
                {options.map((option) => (
                  <CommandItem
                    key={option.label}
                    value={option.label}
                    onSelect={(currentValue) => {
                      onSelect(currentValue);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between text-[13px]"
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4 text-blue-600",
                        selectedValue === option.label
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
