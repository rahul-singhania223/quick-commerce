"use client";

import React from "react";
import { Plus, Download, ChevronLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

interface ProductHeaderProps {
  count: number;
  onAdd: () => void;
}

export default function ProductHeader({ count, onAdd }: ProductHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-[0] z-30 flex h-[72px] w-full items-center justify-between border-b border-gray-200 bg-white px-6 pl-2 shadow-sm">
      <div className="flex">
        <Button
          onClick={() => router.back()}
          variant={"ghost"}
          className="cursor-pointer"
        >
          <ChevronLeft size={18} />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-[20px] font-semibold text-gray-900 leading-tight">
            Products
          </h1>
          <span className="text-[12px] text-gray-500 font-medium">
            {count.toLocaleString()} total products
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Primary Action */}
        <Button
          onClick={onAdd}
          className="h-10  px-4 text-[14px] font-medium text-white  rounded-lg gap-2 shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus size={18} />
          Add Product
        </Button>
      </div>
    </header>
  );
}
