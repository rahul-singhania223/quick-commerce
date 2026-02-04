// components/brands/BrandHeader.tsx
import React from "react";
import { ChevronLeft, Plus } from "lucide-react"; // Assuming lucide-react for icons
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

interface BrandHeaderProps {
  count: number;
  onAddBrand: () => void;
}

export default function BrandHeader({ count, onAddBrand }: BrandHeaderProps) {

  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6 md:pl-2">
      <div className="flex items-center gap-2">
        <Button onClick={() => router.back()}  variant={"ghost"} className="cursor-pointer">
          <ChevronLeft size={18} />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-[20px] font-semibold text-gray-900 leading-tight">
            Brands
          </h1>
          <span className="text-[13px] text-gray-500">{count} brands</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={onAddBrand} className="flex h-10 ">
          <Plus size={18} />
          <span>Add Brand</span>
        </Button>
      </div>
    </header>
  );
}
