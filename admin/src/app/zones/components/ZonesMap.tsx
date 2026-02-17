import { Zone } from "@/src/lib/types";
import { useZonesStore } from "@/src/store/zones.store";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import PolygonMap from "./PolygonMap";

interface Props {
  selectedId: string | null;
}

export default function ZonesMap({ selectedId }: Props) {
  const { getZone } = useZonesStore();

  const [zoneData, setZoneData] = useState<Zone | null>(null);

  useEffect(() => {
    if (selectedId) {
      const zone = getZone(selectedId);
      if (zone) {
        setZoneData(zone);
      }
    }
  }, [selectedId]);


  if (zoneData)
    return (
      <PolygonMap
        coordinates={zoneData.boundary.coordinates[0]}
        defaultZoom={12}
      />
    );

  return (
    <div className="h-full w-full rounded-xl border border-gray-200 bg-gray-100 relative overflow-hidden shadow-sm">
      {/* Map Placeholder Logic */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center max-w-[240px]">
          <p className="text-[13px] font-semibold text-gray-900">
            Map Interface Ready
          </p>
          <p className="text-[11px] text-gray-500 mt-1">
            Select a zone in the table to view boundaries
          </p>
        </div>
      </div>

      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <button className="h-8 w-8 bg-white border border-gray-200 rounded shadow-sm flex items-center justify-center font-bold text-gray-600">
          +
        </button>
        <button className="h-8 w-8 bg-white border border-gray-200 rounded shadow-sm flex items-center justify-center font-bold text-gray-600">
          -
        </button>
      </div>

      {/* Zone Tooltip (Visible on Hover/Select) */}
      {selectedId && (
        <div className="absolute bottom-4 left-4 right-4 bg-gray-900 text-white p-3 rounded-lg flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">
              Selected Zone
            </span>
            <span className="text-[14px] font-medium mt-1">
              Indiranagar Core
            </span>
          </div>
          <div className="flex items-center gap-4 border-l border-gray-700 pl-4">
            <div className="flex flex-col items-center">
              <span className="text-[12px] font-bold">14.2 min</span>
              <span className="text-[10px] text-gray-400">Avg Time</span>
            </div>
            <Info size={16} className="text-blue-400" />
          </div>
        </div>
      )}
    </div>
  );
}

function ZoneMapSkeleton() {
  return (
    <div className="w-full h-full bg-gray-100 border border-gray-200 rounded-xl relative overflow-hidden animate-pulse">
      {/* Fake Map Grid Lines */}
      <div className="absolute inset-0 opacity-20 flex">
        <div
          className="w-full h-full border-r border-b border-gray-300"
          style={{
            backgroundSize: "40px 40px",
            backgroundImage:
              "linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)",
          }}
        />
      </div>
      {/* Fake Map Controls */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="h-8 w-8 bg-white rounded border border-gray-200 shadow-sm" />
        <div className="h-8 w-8 bg-white rounded border border-gray-200 shadow-sm" />
      </div>
      {/* Fake Selection Info (Bottom) */}
      <div className="absolute bottom-4 left-4 right-4 h-16 bg-gray-200/50 backdrop-blur-sm rounded-lg" />
    </div>
  );
}
