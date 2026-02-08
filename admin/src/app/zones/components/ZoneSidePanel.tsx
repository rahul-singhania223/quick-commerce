// components/zones/ZoneSidePanel.tsx
"use client";

import React, { useState } from "react";
import {
  X,
  Map as MapIcon,
  Info,
  AlertTriangle,
  Loader2,
  Save,
  Power,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

export default function ZoneSidePanel({
  id,
  onClose,
}: {
  id: string | null;
  onClose: () => void;
}) {
  const isEdit = !!id;
  const [isSaving, setIsSaving] = useState(false);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[420px] border-l border-gray-200 bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex h-[72px] items-center justify-between px-6 border-b border-gray-100 bg-white shrink-0">
        <div className="flex flex-col">
          <h2 className="text-[18px] font-semibold text-gray-900">
            {isEdit ? "Edit Zone" : "Create New Zone"}
          </h2>
          <p className="text-[12px] text-gray-500 font-medium">
            Define boundaries and SLAs
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >
          <X size={20} className="text-gray-400" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-8">
          {/* Section 1: Zone Basics */}
          <div className="space-y-4">
            <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">
              1. Zone Basics
            </h3>
            <div className="space-y-3">
              <div className="grid gap-1.5">
                <Label className="text-[13px] font-medium">Zone Name *</Label>
                <Input
                  placeholder="e.g. Indiranagar Sector 1"
                  className="h-10"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[13px] font-medium">City *</Label>
                <Select>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blr">Bangalore</SelectItem>
                    <SelectItem value="del">Delhi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-[14px] font-medium text-gray-700">
                  Active Status
                </span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* Section 2: Zone Boundary (Map Placeholder) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">
                2. Zone Boundary
              </h3>
              <Button
                variant="link"
                className="h-auto p-0 text-blue-600 text-[12px] font-bold"
              >
                Reset Polygon
              </Button>
            </div>
            <div className="h-[180px] w-full bg-gray-100 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group">
              <MapIcon
                size={24}
                className="text-gray-300 group-hover:text-blue-400 transition-colors"
              />
              <p className="text-[12px] text-gray-500 mt-2 font-medium">
                Click to begin drawing on map
              </p>
              {/* This would integrate with the parent map instance */}
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
              <AlertTriangle
                size={14}
                className="text-amber-600 mt-0.5 shrink-0"
              />
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                Ensure boundaries do not overlap with existing zones in the same
                city. Self-intersecting polygons are blocked.
              </p>
            </div>
          </div>

          {/* Section 3: Operational Settings */}
          <div className="space-y-4 text-left">
            <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest text-left">
              3. Operational Settings
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5 text-left">
                <Label className="text-[13px] font-medium text-left">
                  Target SLA (min)
                </Label>
                <Input type="number" placeholder="15" className="h-10" />
              </div>
              <div className="grid gap-1.5 text-left">
                <Label className="text-[13px] font-medium text-left">
                  Min Riders
                </Label>
                <Input type="number" placeholder="25" className="h-10" />
              </div>
            </div>
          </div>

          {/* Section 4: Read-only Health Preview (Edit Mode Only) */}
          {isEdit && (
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Info size={14} className="text-blue-500" />
                <span className="text-[12px] font-bold text-gray-900 uppercase tracking-wide">
                  Live Zone Health
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <HealthStat label="Stores" value="12" />
                <HealthStat label="Riders" value="45" />
                <HealthStat label="24h Orders" value="842" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-gray-100 bg-white space-y-3">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 h-11 rounded-lg gap-2 text-[15px] font-semibold shadow-sm">
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Save Zone
        </Button>
        <Button
          variant="ghost"
          onClick={onClose}
          className="w-full h-10 text-gray-500"
        >
          Cancel
        </Button>

        {isEdit && (
          <div className="pt-2 border-t border-gray-50 mt-2">
            <Button
              variant="ghost"
              className="w-full h-10 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2 text-[13px] font-medium"
            >
              <Power size={14} />
              Disable Zone
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function HealthStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col bg-white p-2 rounded border border-gray-100">
      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
        {label}
      </span>
      <span className="text-[14px] font-bold text-gray-900">{value}</span>
    </div>
  );
}
