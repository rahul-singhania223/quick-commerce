import { useZonesStore } from "@/src/store/zones.store";
import { Edit2, MoreVertical } from "lucide-react";

interface ZonesTableProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function ZonesTable({
  selectedId,
  onSelect,
  onEdit,
}: ZonesTableProps) {
  const { zones: zonesMap, isLoading } = useZonesStore();

  if(isLoading) return <ZonesTableSkeleton />

  return (
    <div className="flex-1 border border-gray-200 rounded-xl bg-white overflow-hidden flex flex-col shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="h-12 bg-gray-50/50 border-b border-gray-200 px-4">
              <th className="px-4 text-[12px] font-medium text-gray-500 uppercase">
                Zone Name
              </th>
              <th className="px-4 text-[12px] font-medium text-gray-500 uppercase">
                City
              </th>
              <th className="px-4 text-center text-[12px] font-medium text-gray-500 uppercase">
                Stores
              </th>
              <th className="px-4 text-center text-[12px] font-medium text-gray-500 uppercase">
                Riders
              </th>
              <th className="px-4 text-[12px] font-medium text-gray-500 uppercase">
                Avg Time
              </th>
              <th className="px-4 text-center text-[12px] font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from(zonesMap.values()).map((zone) => (
              <tr
                key={zone.id}
                onClick={() => onSelect(zone.id)}
                className={`h-14 cursor-pointer transition-colors ${
                  selectedId === zone.id ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <td className="px-4 text-[14px] font-medium text-gray-900">
                  {zone.name}
                </td>
                <td className="px-4 text-[13px] text-gray-600">{zone.city}</td>
                <td
                  className={`px-4 text-center text-[13px] font-medium ${zone._count?.stores || 0 ? "text-red-600" : "text-gray-900"}`}
                >
                  {zone._count?.stores || 0}
                </td>
                <td className="px-4 text-center">
                  <span
                    className={`px-2 py-1 rounded text-[11px] font-bold uppercase ${
                      // zone.riderState === "good"
                      true
                        ? "bg-green-100 text-green-700"
                        : // : zone.riderState === "low"
                          false
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    0
                  </span>
                </td>
                <td className="px-4 text-[13px] font-medium">
                  {zone.stats[0]?.avgTime || "-"}
                </td>
                <td className="px-4 text-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-2" />
                  <span className="text-[12px] font-medium uppercase text-gray-600">
                    Active
                  </span>
                </td>
                <td className="px-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(zone.id);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600"
                  >
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ZonesTableSkeleton() {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col animate-pulse">
      <div className="h-12 bg-gray-50 border-b border-gray-200" />
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="h-14 border-b border-gray-50 flex items-center px-4 gap-6"
        >
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="h-4 w-12 bg-gray-50 rounded mx-auto" />
          <div className="h-6 w-20 bg-gray-100 rounded-full mx-auto" />
          <div className="h-4 w-16 bg-gray-100 rounded" />
          <div className="h-8 w-8 bg-gray-50 rounded ml-auto" />
        </div>
      ))}
    </div>
  );
}
