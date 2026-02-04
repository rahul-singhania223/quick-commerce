export default function DashboardHeader() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <header className="sticky top-[64px] z-20 flex h-[72px] w-full items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex flex-col">
        <h1 className="text-[20px] font-semibold text-gray-900 leading-tight">
          Dashboard
        </h1>
        <span className="text-[12px] text-gray-500 font-medium">
          Today • {today}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <select className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-[13px] font-medium outline-none focus:ring-1 focus:ring-blue-500">
          <option>Main Warehouse - Sasaram</option>
          <option>South Outlet</option>
        </select>
      </div>
    </header>
  );
}
