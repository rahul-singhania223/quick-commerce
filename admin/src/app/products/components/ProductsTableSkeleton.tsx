import React from "react";

export default function ProductsTableSkeleton() {
  return (
    <div className="w-full animate-pulse rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {/* 1. Header Skeleton */}
      <div className="h-12 border-b border-gray-200 bg-gray-50/50 flex items-center px-4 gap-4">
        <div className="h-3 w-40 rounded bg-gray-200" /> {/* Product */}
        <div className="h-3 w-32 rounded bg-gray-100 ml-auto hidden lg:block" />{" "}
        {/* Category */}
        <div className="h-3 w-24 rounded bg-gray-100 hidden md:block" />{" "}
        {/* Brand */}
        <div className="h-3 w-16 rounded bg-gray-100" /> {/* Price */}
        <div className="h-3 w-16 rounded bg-gray-100" /> {/* Stock */}
        <div className="h-3 w-16 rounded bg-gray-100" /> {/* Status */}
        <div className="h-3 w-8 rounded bg-gray-100" /> {/* Actions */}
      </div>

      {/* 2. Rows Skeleton (6-8 rows as per spec) */}
      <div className="divide-y divide-gray-100">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex h-[64px] items-center px-4 gap-4">
            {/* Column 1: Product (Image + Name + SKU) */}
            <div className="flex items-center gap-3 min-w-[320px]">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-200" />
              <div className="flex flex-col gap-2">
                <div className="h-3.5 w-48 rounded bg-gray-200" />
                <div className="h-2.5 w-24 rounded bg-gray-100" />
              </div>
            </div>

            {/* Column 2: Category */}
            <div className="w-[220px] px-4 hidden lg:block">
              <div className="h-3 w-32 rounded bg-gray-100" />
            </div>

            {/* Column 3: Brand */}
            <div className="w-[160px] px-4 hidden md:block">
              <div className="h-3 w-24 rounded bg-gray-100" />
            </div>

            {/* Column 4: Price */}
            <div className="w-[120px] px-4 ml-auto lg:ml-0">
              <div className="h-3 w-12 rounded bg-gray-100 ml-auto" />
            </div>

            {/* Column 5: Stock */}
            <div className="w-[120px] px-4">
              <div className="h-6 w-20 rounded-full bg-gray-100 mx-auto" />
            </div>

            {/* Column 6: Status */}
            <div className="w-[120px] px-4">
              <div className="h-6 w-16 rounded-full bg-gray-100 mx-auto" />
            </div>

            {/* Column 7: Actions */}
            <div className="w-[80px] px-4 flex justify-end">
              <div className="h-8 w-8 rounded-md bg-gray-50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
