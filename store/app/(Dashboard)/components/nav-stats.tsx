"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Today_Stats } from "@/types/types";
import {
  ChevronsUpDown,
  DollarSign,
  IndianRupee,
  Package2,
} from "lucide-react";
import { useState } from "react";

export default function NavStatsChanger() {
  const [activeStatType, setActiveStatType] = useState<Today_Stats>(
    Today_Stats.REVENUE
  );

  const revenue = Math.floor(Math.random() * 10000);
  const orders = Math.floor(Math.random() * 100);

  return (
    <Select
      onValueChange={(value: Today_Stats) => setActiveStatType(value)}
      value={activeStatType}
    >
      <SelectTrigger
        icon={<ChevronsUpDown />}
        className="w-32 border-none shadow-none hover:bg-muted h-[calc(100%-10px)]!"
      >
        <div className="h-full">
          <span className="text-sm text-body">
            {activeStatType === Today_Stats.REVENUE ? "Revenue" : "Orders"}
          </span>
          <h2 className="text-xl font-bold text-foreground">
            {activeStatType === Today_Stats.REVENUE ? (
              <>₹{revenue.toLocaleString()}</>
            ) : (
              `${orders.toLocaleString()}`
            )}
          </h2>
        </div>
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectItem value={Today_Stats.REVENUE}>
          <div className="flex items-center gap-2">
            <IndianRupee className="size-4 inline" />
            Revenue
          </div>
        </SelectItem>
        <SelectItem value={Today_Stats.ORDER}>
          <div className="flex items-center gap-2">
            <Package2 className="size-4 inline" />
            Orders
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
