import React, { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import SelectInput from "@/src/components/SelectInput";
import { useBrandsQueryStore, useBrandsStore } from "@/src/store/brands.store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useDebounce } from "@/src/hooks/useDebounce";

export default function BrandControls() {
  const { fetchBrands, initialized } = useBrandsStore();
  const { query, setQuery } = useBrandsQueryStore();

  const [params, setParams] = useState({
    is_active: undefined as "true" | "false" | undefined,
    created_at: undefined as "asc" | "desc" | undefined,
    name: undefined as "asc" | "desc" | undefined,
    search: undefined as string | undefined,
  });

  const [searchInput, setSearchInput] = useState("");

  const debouncedSearch = useDebounce(searchInput, 400);

  const handleStatusChange = (value: string) => {
    const is_active =
      value === "active" ? "1" : value === "inactive" ? "0" : undefined;

    setQuery({ ...query, is_active });
  };

  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    setQuery({ ...query, search: trimmed });
  }, [debouncedSearch]);

  useEffect(() => {
    if (!initialized) return;
    fetchBrands(query);
  }, [query]);

  return (
    <div className="flex h-[56px] w-full items-center justify-between bg-gray-50 px-4 md:px-6 border-b border-gray-200">
      {/* Search Input - Left */}
      <div className="relative w-[320px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={16} />
        </span>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          placeholder="Search brands..."
          className="h-9 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-[14px] placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Filters & Sort - Right */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-[14px] text-gray-600">
          <span className="hidden sm:inline">Status:</span>
          <FilterButton
            options={[
              { value: "_all_", label: "All" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            value="_all_"
            label="Status"
            onChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  );
}

interface FilterButtonProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  defaultValue?: string;
}

function FilterButton({
  label,
  value,
  onChange,
  options,
  className,
}: FilterButtonProps) {
  return (
    <Select defaultValue={value} onValueChange={onChange}>
      <SelectTrigger className="w-full h-10 bg-white!">
        <SelectValue placeholder={label} className="bg-white!" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            onClick={() => onChange(option.value)}
            className="bg-white"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
