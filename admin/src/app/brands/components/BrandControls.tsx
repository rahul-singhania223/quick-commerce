import React, { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import SelectInput from "@/src/components/SelectInput";
import { useBrandsStore } from "@/src/store/brands.store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

export default function BrandControls() {
  const { fetchBrands } = useBrandsStore();

  const [params, setParams] = useState({
    is_active: undefined as "true" | "false" | undefined,
    created_at: undefined as "asc" | "desc" | undefined,
    name: undefined as "asc" | "desc" | undefined,
    search: undefined as string | undefined,
  });

  const [searchInput, setSearchInput] = useState("");

  const handleStatusChange = async (value: string) => {
    setParams((prev) => ({
      ...prev,
      search: searchInput === "" ? undefined : searchInput,
      is_active:
        value === "active"
          ? "true"
          : value === "inactive"
            ? "false"
            : undefined,
    }));
  };

  const handleSortChange = async (value: string) => {
    let created_at: "asc" | "desc" | undefined = undefined;
    let name: "asc" | "desc" | undefined = undefined;

    switch (value) {
      case "newest":
        created_at = "desc";
        break;
      case "oldest":
        created_at = "asc";
        break;
      case "a-z":
        name = "asc";
        break;
      case "z-a":
        name = "desc";
        break;
      default:
        break;
    }

    setParams((prev) => ({
      ...prev,
      search: searchInput === "" ? undefined : searchInput,
      created_at,
      name,
    }));
  };

  React.useEffect(() => {
    fetchBrands(params);
  }, [params]);

  useEffect(() => {
    const trimmed = searchInput.trim();

    const timeout = setTimeout(async () => {
      const data = fetchBrands({
        ...params,
        search: trimmed || undefined,
      });
    }, 400); // debounce delay

    return () => {
      clearTimeout(timeout);
    };
  }, [searchInput]);

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
              { value: "all", label: "All" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            value="all"
            label="Status"
            onChange={handleStatusChange}
          />
        </div>

        <div className="flex items-center gap-2 text-[14px] text-gray-600">
          <span className="hidden sm:inline">Sort:</span>
          <FilterButton
            options={[
              { value: "newest", label: "Newest" },
              { value: "oldest", label: "Oldest" },
              // { value: "a-z", label: "A-Z" },
              // { value: "z-a", label: "Z-A" },
            ]}
            value="newest"
            label="Sort"
            onChange={handleSortChange}
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
