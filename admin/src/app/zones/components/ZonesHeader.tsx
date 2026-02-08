"use client";

import React from "react";
import { Plus, MapPin } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

interface ZonesHeaderProps {
  onAdd: () => void;
  onCityChange?: (city: string) => void;
}

export default function ZonesHeader({ onAdd, onCityChange }: ZonesHeaderProps) {
  return (
    <header className="sticky top-[0] z-30 flex h-[72px] w-full items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Left: Title and Context */}
      <div className="flex flex-col">
        <h1 className="text-[20px] font-semibold text-gray-900 leading-tight">
          Zones
        </h1>
        <span className="text-[12px] text-gray-500 font-medium">
          Managing delivery zones across all cities
        </span>
      </div>

      {/* Right: City Selector & Primary CTA */}
      <div className="flex items-center gap-4">
        {/* <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-gray-400">City:</span>
          <Select defaultValue="all" onValueChange={onCityChange}>
            <SelectTrigger className="h-9 w-[160px] rounded-lg border-gray-200 bg-white text-[13px] font-medium focus:ring-1 focus:ring-blue-500">
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              <SelectItem value="bangalore">Bangalore</SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
              <SelectItem value="mumbai">Mumbai</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        <div className="h-6 w-[1px] bg-gray-200 mx-1" />

        <Button
          onClick={onAdd}
          className="h-10 bg-[#2563EB] hover:bg-blue-700 text-white px-4 rounded-lg gap-2 text-[14px] font-medium shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus size={18} />
          Create Zone
        </Button>
      </div>
    </header>
  );
}
