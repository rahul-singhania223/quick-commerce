"use client";

import React, { use } from "react";
import { Map, Zap, Store, Bike, Timer } from "lucide-react";
import { useZonesStore } from "@/src/store/zones.store";

interface SummaryCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: "default" | "red" | "amber";
  onClick?: () => void;
}

function SummaryCard({
  label,
  value,
  icon,
  color = "default",
  onClick,
}: SummaryCardProps) {
  const colorClasses = {
    default: "text-gray-900 border-gray-200 hover:border-blue-200",
    red: "text-red-600 border-red-100 bg-red-50/30 hover:border-red-200",
    amber:
      "text-amber-600 border-amber-100 bg-amber-50/30 hover:border-amber-200",
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col justify-between p-4 h-[88px] rounded-xl border transition-all text-left group ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-[12px] font-medium text-gray-500 group-hover:text-current transition-colors">
          {label}
        </span>
        <div className="opacity-40 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
      </div>
      <span className="text-[20px] font-bold leading-none tracking-tight">
        {value}
      </span>
    </button>
  );
}

export default function ZonesSummaryStrip() {
  const { isLoading, zoneStats } = useZonesStore();

  if (isLoading) return <ZoneStripsSkeleton />;

  console.log(zoneStats);

  return (
    <div className="flex w-full gap-4 overflow-x-auto pb-2 no-scrollbar">
      <SummaryCard
        label="Total Zones"
        value={zoneStats?.zones_count.toString() || "-"}
        icon={<Map size={16} />}
      />
      <SummaryCard
        label="Active Zones"
        value={zoneStats?.active_zones_count?.toString() || "-"}
        icon={<Zap size={16} />}
      />
      <SummaryCard
        label="Zones with No Stores"
        value={zoneStats?.no_stores_count?.toString() || "-"}
        color="red"
        icon={<Store size={16} />}
        onClick={() => console.log("Filtering: No Stores")}
      />
      <SummaryCard
        label="Zones with Low Riders"
        value={zoneStats?.low_riders_count?.toString() || "-"}
        color="amber"
        icon={<Bike size={16} />}
        onClick={() => console.log("Filtering: Low Riders")}
      />
      <SummaryCard
        label="Avg Delivery Time"
        value={zoneStats?.avg_delivery_time?.toString() || "-"}
        icon={<Timer size={16} />}
      />
    </div>
  );
}

function ZoneStripsSkeleton() {
  return (
    <div className="flex w-full gap-4 overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex-1 h-[88px] bg-white rounded-xl border border-gray-100 p-4 space-y-3 animate-pulse"
        >
          <div className="flex justify-between items-center">
            <div className="h-3 w-16 bg-gray-100 rounded" />
            <div className="h-4 w-4 bg-gray-50 rounded" />
          </div>
          <div className="h-6 w-12 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}
