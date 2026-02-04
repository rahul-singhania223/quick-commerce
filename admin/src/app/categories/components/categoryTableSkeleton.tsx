export function CategoryTableSkeleton() {
  return (
    <div className="w-full animate-pulse rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="h-12 border-b border-gray-200 bg-gray-50" />
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex h-[56px] items-center border-b border-gray-200 px-4 gap-6"
        >
          <div className="h-4 w-[300px] rounded bg-gray-200" />
          <div className="h-4 w-[150px] rounded bg-gray-100" />
          <div className="h-6 w-10 rounded bg-gray-100 mx-auto" />
          <div className="h-4 w-12 rounded bg-gray-100 mx-auto" />
          <div className="h-6 w-20 rounded bg-gray-100 mx-auto" />
          <div className="h-8 w-8 rounded bg-gray-50 ml-auto" />
        </div>
      ))}
    </div>
  );
}
