export default function HealthMetricsGrid() {
  const metrics = [
    { label: "Orders Today", value: "1,248", delta: "+8%", color: "#2563EB" },
    { label: "Revenue Today", value: "₹3.2L", delta: "-2%", color: "#16A34A" },
    {
      label: "Active Delivery Partners",
      value: "182 online",
      sub: "214 total",
      color: "#F59E0B",
    },
    {
      label: "Products Out of Stock",
      value: "37",
      cta: "View products",
      color: "#DC2626",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="h-[96px] p-4 rounded-xl border border-gray-200 flex flex-col justify-between bg-white shadow-sm"
        >
          <span className="text-[12px] font-medium text-gray-500">
            {m.label}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-[24px] font-bold text-gray-900">
              {m.value}
            </span>
            {m.delta && (
              <span
                className={`text-[12px] font-bold ${m.delta.startsWith("+") ? "text-green-600" : "text-red-600"}`}
              >
                {m.delta}
              </span>
            )}
            {m.cta && (
              <button className="text-[11px] font-bold text-blue-600 hover:underline underline-offset-2">
                {m.cta}
              </button>
            )}
          </div>
          <div className="h-1 w-full bg-gray-50 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ backgroundColor: m.color, width: "40%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
