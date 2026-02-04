"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  HelpCircle,
  ChevronLast,
  ChevronLeft,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { usePathname, useRouter } from "next/navigation";
import path from "path";
import { useCategoryStore } from "@/src/store/category.store";

interface Category {
  id: string;
  name: string;
  level: number;
}

interface CategoryHeaderProps {
  selectedCategory: Category | null;
  breadcrumbPath: Category[]; // Array from Root to Parent
  totalCategories: number;
  onAddCategory: () => void;
  setBreadCrumbPath: any;
}

export default function CategoryHeader({
  selectedCategory,
  totalCategories,
  onAddCategory,
  breadcrumbPath,
  setBreadCrumbPath,
}: CategoryHeaderProps) {
  const isAtMaxDepth = selectedCategory?.level === 5;

  const { fetchCategories } = useCategoryStore();

  const [searchInput, setSearchInput] = useState("");

  const router = useRouter();

  const handleBreadcrumbNavigation = (category: Category) => {
    const index = breadcrumbPath.findIndex((cat) => cat.id === category.id);

    const newPaths = breadcrumbPath.slice(0, index + 1);
    setBreadCrumbPath(newPaths);
  };

  useEffect(() => {
    const trimmed = searchInput.trim();

    const timeout = setTimeout(async () => {
      const data = fetchCategories({
        search: trimmed || undefined,
      });
    }, 400); // debounce delay

    return () => {
      clearTimeout(timeout);
    };
  }, [searchInput]);

  return (
    <header className="sticky top-[0] z-10 flex h-[72px] w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
      {/* 5. Left Section: Context & Breadcrumb */}
      <div className="flex flex-col gap-1 min-w-[300px]">
        <div className="flex items-center gap-2">
          <h1 className="text-[16px] font-semibold text-gray-900 leading-tight">
            {selectedCategory
              ? `Categories under "${selectedCategory.name}"`
              : "All Categories"}
          </h1>
          <span className="text-[12px] text-gray-500 font-normal">
            ({totalCategories})
          </span>
        </div>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-[12px] cursor-pointer"
                onClick={() => router.push("/")}
              >
                {"Home"}
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-[12px] cursor-pointer"
                onClick={() => setBreadCrumbPath([])}
              >
                {"Categories"}
              </BreadcrumbLink>
            </BreadcrumbItem>

            {breadcrumbPath.length > 0 && <BreadcrumbSeparator />}

            {breadcrumbPath.map((cat, index) => {
              const label =
                cat.name.charAt(0).toUpperCase() + cat.name.slice(1);

              return (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className="text-[12px] cursor-pointer"
                      onClick={() => handleBreadcrumbNavigation(cat)}
                    >
                      {label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {index < breadcrumbPath.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 6. Middle Section: Scoped Search */}
      <div className="relative w-[280px]">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />
        <Input
          value={searchInput}
          placeholder={`Search ${selectedCategory ? "in " + selectedCategory.name : "categories"}...`}
          className="h-9 pl-10 text-[13px] border-gray-200 focus-visible:ring-primary rounded-lg"
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* 7. Right Section: Primary Action */}
      <div className="flex items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-block">
                <Button
                  onClick={onAddCategory}
                  disabled={isAtMaxDepth}
                  className="h-10 px-4 "
                >
                  <Plus size={18} />
                  Add Category
                </Button>
              </div>
            </TooltipTrigger>
            {isAtMaxDepth && (
              <TooltipContent
                side="bottom"
                className="bg-gray-900 text-white text-[12px] p-2"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle size={14} />
                  Maximum depth (L3) reached
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}
