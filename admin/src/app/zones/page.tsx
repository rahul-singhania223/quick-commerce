"use client";

import React, { useEffect, useState } from "react";
import ZonesHeader from "./components/ZonesHeader";
import ZonesSummaryStrip from "./components/ZonesSummaryStrips";
import ZonesTable from "./components/ZonesTable";
import ZonesMap from "./components/ZonesMap";
import ZoneSidePanel from "./components/ZoneSidePanel";
import { useZonesStore } from "@/src/store/zones.store";

export default function ZonesPage() {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const { fetchZones } = useZonesStore();

  useEffect(() => {
    fetchZones();
  }, []);

  return (
    <div className="flex h-screen flex-col bg-white overflow-hidden">
      {/* Component 1: Header */}
      <ZonesHeader
        onAdd={() => {
          setSelectedZoneId(null);
          setIsPanelOpen(true);
        }}
      />

      <div className="flex-1 overflow-y-auto bg-gray-50/30">
        <main className="max-w-[1600px] mx-auto p-6 space-y-6">
          {/* Component 2: Summary Strip */}
          <ZonesSummaryStrip />

          {/* Component 3: Core UI (Split View) */}
          <div className="flex gap-6 h-[700px]">
            {/* 60% Table */}
            <div className="w-[60%] flex flex-col overflow-hidden">
              <ZonesTable
                selectedId={selectedZoneId}
                onSelect={setSelectedZoneId}
                onEdit={(id: string) => {
                  setSelectedZoneId(id);
                  setIsPanelOpen(true);
                }}
              />
            </div>

            {/* 40% Map */}
            <div className="w-[40%] sticky top-0">
              <ZonesMap selectedId={selectedZoneId} />
            </div>
          </div>
        </main>
      </div>

      {/* Component 4: Side Panel */}
      {isPanelOpen && (
        <ZoneSidePanel
          id={selectedZoneId}
          onClose={() => setIsPanelOpen(false)}
        />
      )}
    </div>
  );
}
