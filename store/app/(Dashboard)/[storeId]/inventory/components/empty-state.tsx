"use client";

import React from "react";
import { Plus } from "lucide-react"; // Using Lucide for a clean icon
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

const InventoryEmptyState = () => {
  const router = useRouter();
  const path = usePathname();

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Main Content: Centered Vertically */}
      <div className="grow flex flex-col items-center justify-center px-6 text-center -mt-6">
        {/* Illustration Placeholder */}
        <div className="w-48 h-48 mb-8 bg-gray-50 rounded-full flex items-center justify-center border border-dashed border-gray-200">
          <span className="text-4xl">🧾</span>
        </div>

        {/* Text Content */}
        <h1 className="text-2xl text-foreground font-bold mb-3 tracking-tight">
          No products in your store yet
        </h1>
        <p className="text-gray-500 max-w-70 leading-relaxed">
          Add products to your store so customers can start ordering.
        </p>
        <Button
          onClick={() => router.push(path + "/add")}
          className="text-lg font-medium h-12 mt-6 w-full max-w-xs"
        >
          <Plus className="size-5" /> Add First Product
        </Button>
      </div>
    </div>
  );
};

export default InventoryEmptyState;
