// components/brands/BrandsTableSkeleton.tsx
export default function BrandsTableSkeleton() {
  return (
    <div className="w-full animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="h-12 border-b border-gray-200 bg-gray-50" />
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex h-[56px] items-center border-b border-gray-200 px-4 gap-4"
        >
          <div className="h-8 w-8 rounded bg-gray-200" />
          <div className="h-4 w-48 rounded bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-100" />
          <div className="ml-auto h-4 w-12 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}
