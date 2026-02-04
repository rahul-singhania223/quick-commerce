import { AlertCircle, ChevronRight } from "lucide-react";

export default function ActionRequired() {
  const items = [
    { msg: "12 products are out of stock", cta: "Fix inventory" },
    {
      msg: "5 categories are inactive but have products",
      cta: "Review categories",
    },
    { msg: "3 delivery partners pending approval", cta: "Review partners" },
  ];

  return (
    <section className="rounded-xl border border-red-200 bg-[#FEF2F2] p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle size={18} className="text-[#991B1B]" />
        <h2 className="text-[16px] font-semibold text-[#991B1B]">
          Needs Attention
        </h2>
      </div>
      <div className="divide-y divide-red-100">
        {items.map((item, i) => (
          <div key={i} className="flex h-12 items-center justify-between group">
            <span className="text-[14px] text-[#991B1B] font-medium">
              {item.msg}
            </span>
            <button className="flex items-center gap-1 text-[13px] font-bold text-blue-600 hover:text-blue-800 transition-colors">
              {item.cta}
              <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
