// components/brands/BrandsTablePagination.tsx
export function BrandsTablePagination({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="mt-4 flex items-center justify-end gap-4 px-2">
      <span className="text-[13px] text-gray-500">
        Page <span className="font-medium text-gray-900">{current}</span> of{" "}
        <span className="font-medium text-gray-900">{total}</span>
      </span>
      <div className="flex items-center gap-2">
        <button
          disabled={current === 1}
          className="flex h-8 items-center px-3 rounded border border-gray-300 bg-white text-[13px] font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={current === total}
          className="flex h-8 items-center px-3 rounded border border-gray-300 bg-white text-[13px] font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

import { Button } from "@/src/components/ui/button";
// components/brands/BrandsTableEmpty.tsx
import { Tag } from "lucide-react";
export function BrandsTableEmpty({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400 mb-4">
        <Tag size={24} />
      </div>
      <h3 className="text-[16px] font-semibold text-gray-900">No brands yet</h3>
      <p className="text-[14px] text-gray-500 mt-1 mb-6 text-center">
        Add brands to organize products
      </p>
      <Button
        onClick={onAdd}
        className="h-10 px-4 rounded-lg text-white font-medium text-[14px]  transition-colors"
      >
        Add Brand
      </Button>
    </div>
  );
}
