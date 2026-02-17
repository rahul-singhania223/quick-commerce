"use client";

import React, { useMemo, useState } from "react";
import {
  X,
  Map as MapIcon,
  Info,
  AlertTriangle,
  Loader2,
  Save,
  Power,
  Check,
  Trash2,
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
import ZoneDrawingModal from "./ZoneDrawingModel";
import z, { set } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { CreateZoneInput, createZoneSchema } from "@/src/lib/schemas";
import { isSamePolygon } from "@/src/lib/utils";
import { ZonesServices } from "@/src/services/zones.service";
import { toast } from "sonner";
import { useZonesStore } from "@/src/store/zones.store";
import { Zone } from "@/src/lib/types";

interface ZoneSidePanelProps {
  id: string | null;
  onClose: () => void;
}

export default function ZoneSidePanel({ id, onClose }: ZoneSidePanelProps) {
  const isEdit = !!id;

  const emptyPolygon = {
    type: "Polygon" as const,
    coordinates: [
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ] as [number, number][], // Cast as an array of tuples
    ],
  };

  const { addZone, getZone, updateZone, removeZone } = useZonesStore();

  const zone = getZone(id || "");

  const form = useForm<CreateZoneInput>({
    resolver: zodResolver(createZoneSchema),
    defaultValues: {
      name: zone?.name ?? "",
      city: zone?.city ?? "",
      is_active: zone?.is_active ?? true,
      priority: zone?.priority ?? 0,
      base_fee: zone?.base_fee ?? 0,
      per_km_fee: zone?.per_km_fee ?? 0,
      avg_prep_time: zone?.avg_prep_time ?? 10,
      // Ensure boundary matches your GeoJSON structure
      boundary: zone?.boundary ?? emptyPolygon,
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isZoneModelOpen, setZoneModelOpen] = useState(false);
  const [overlappingZones, setOverlappingZones] = useState<Zone[]>([]);
  const [zoneSelected, setZoneSelected] = useState<boolean>(
    zone?.boundary ? true : false,
  );

  const overlappingZonesNamesAndPriority = useMemo(() => {
    let str = "";
    overlappingZones.forEach((zone) => {
      str += `${zone.name} (${zone.priority}), `;
    });

    return str;
  }, [overlappingZones]);

  const checkOverlapping = async (boundary: CreateZoneInput["boundary"]) => {
    const res = await ZonesServices.getOverlappingZones(boundary);
    if (res.error) return toast.error(res.error);

    if (res.data) {
      setOverlappingZones(res.data);
    }
  };

  const formattedZoneBoundary = (coords: [number, number][]) => {
    const formattedBoundary = {
      type: "Polygon",
      coordinates: [
        // Add the first point to the end to close the ring if the map didn't
        [...coords, coords[0]],
      ],
    } as CreateZoneInput["boundary"];

    return formattedBoundary;
  };

  const deleteZone = async () => {
    try {
      setDeleting(true);

      if (!id) return;
      const res = await ZonesServices.deleteZone(id);
      if (res.error) return toast.error(res.error);

      removeZone(id);
      toast.success("Zone deleted successfully!");
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof createZoneSchema>) => {
    if (!zoneSelected) {
      form.setError("boundary", {
        message: "Draw the zone boundary on the map",
      });
      return;
    }
    try {
      setIsSaving(true);

      // update
      if (isEdit && zone) {
        const res = await ZonesServices.updateZone(zone.id, values);
        if (res.error) return toast.error(res.error);

        if (res.data) {
          updateZone(res.data.id, res.data);
          toast.success("Zone updated successfully!");
          return onClose();
        }
      }

      // Create Zone
      const res = await ZonesServices.createZone(values);
      if (res.error) return toast.error(res.error);

      if (res.data) {
        addZone(res.data);
        toast.success("Zone created successfully!");
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Section 1: Zone Basics */}
              <div className="space-y-4">
                <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">
                  1. Zone Basics
                </h3>

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-[13px] font-medium">Name*</Label>
                      <FormControl>
                        <Input
                          placeholder="e.g. Bengaluru"
                          className="h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-[13px] font-medium">City*</Label>
                      <FormControl>
                        <Input
                          placeholder="e.g. Bengaluru"
                          className="h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section 2: Zone Boundary (Map Placeholder) */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="boundary"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">
                              2. Zone Boundary
                            </h3>
                            <Button
                              disabled={!zoneSelected}
                              onClick={() => {
                                field.onChange(emptyPolygon);
                                setZoneSelected(false);
                              }}
                              type="button"
                              variant="link"
                              className="h-auto p-0 text-blue-600 text-[12px] font-bold cursor-pointer"
                            >
                              Reset Polygon
                            </Button>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (!form.getValues("city")) {
                                form.setError("city", {
                                  message: "Please select a city",
                                });
                              } else {
                                form.setError("city", {
                                  message: "",
                                });
                                setZoneModelOpen(true);
                              }
                            }}
                            className="h-[180px] w-full bg-gray-100 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group"
                          >
                            {zoneSelected ? (
                              <Check
                                size={24}
                                className="text-green-300 group-hover:text-green-400 transition-colors"
                              />
                            ) : (
                              <MapIcon
                                size={24}
                                className="text-gray-300 group-hover:text-blue-400 transition-colors"
                              />
                            )}
                            <p className="text-[12px] text-gray-500 mt-2 font-medium">
                              Click to begin drawing on map
                            </p>
                            {/* This would integrate with the parent map instance */}
                          </button>

                          {overlappingZones.length > 0 && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
                              <AlertTriangle
                                size={14}
                                className="text-amber-600 mt-0.5 shrink-0"
                              />
                              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                                This zone overlaps with{" "}
                                <span className="font-semibold">
                                  {overlappingZonesNamesAndPriority}
                                </span>
                              </p>
                            </div>
                          )}

                          {/* zone model */}
                          <ZoneDrawingModal
                            city={form.getValues("city")}
                            isOpen={isZoneModelOpen}
                            onClose={() => setZoneModelOpen(false)}
                            onSubmit={(coords) => {
                              const formattedBoundary =
                                formattedZoneBoundary(coords);

                              field.onChange(formattedBoundary);
                              setZoneModelOpen(false);

                              setZoneSelected(true);

                              checkOverlapping(formattedBoundary);
                            }}
                            apiKey={
                              process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section 3: Operational Settings */}
              <div className="space-y-4 text-left">
                <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest text-left">
                  3. Operational Settings
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Base Fee */}
                  <FormField
                    control={form.control}
                    name="base_fee"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-[13px] font-medium text-left">
                          Base Fee
                        </Label>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="h-10"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Per KM Fee */}
                  <FormField
                    control={form.control}
                    name="per_km_fee"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-[13px] font-medium text-left">
                          Per KM Fee
                        </Label>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="h-10"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Per KM Fee */}
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-[13px] font-medium text-left">
                          Priority
                        </Label>
                        <FormControl>
                          <Input
                            type="number"
                            step="1"
                            placeholder="59"
                            className="h-10"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="avg_prep_time"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-[13px] font-medium text-left">
                          Prep time
                        </Label>
                        <FormControl>
                          <Input
                            type="number"
                            step="1"
                            placeholder="10"
                            className="h-10"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    <HealthStat
                      label="Stores"
                      value={zone?.stores_count?.toString() ?? "0"}
                    />
                    <HealthStat
                      label="Riders"
                      value={zone?.riders_count?.toString() ?? "0"}
                    />
                    <HealthStat
                      label="24h Orders"
                      value={zone?.orders_count?.toString() ?? "0"}
                    />
                  </div>
                </div>
              )}

              {/* status */}
              <FormField
                disabled={isSaving}
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormControl>
                      <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <div className="grid gap-0.5">
                          <span className="text-[14px] font-medium text-gray-900">
                            Active Status
                          </span>
                          <span className="text-[12px] text-gray-500">
                            Enable to show in navigation
                          </span>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(val) => field.onChange(val)}
                          disabled={isSaving}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="border-t border-gray-100 bg-white space-y-3 mt-10">
                <Button
                  disabled={isSaving}
                  type="submit"
                  className="w-full h-11 rounded-lg gap-2 text-[15px] font-semibold shadow-sm"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  Save Zone
                </Button>
                <Button
                  disabled={isSaving}
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="w-full h-10 text-gray-500"
                >
                  Cancel
                </Button>

                {isEdit && (
                  <Button
                    disabled={isSaving}
                    type="button"
                    variant="link"
                    onClick={deleteZone}
                    className="w-full h-10 text-gray-500 text-destructive/80 hover:text-destructive hover:no-underline cursor-pointer"
                  >
                    {deleting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Trash2 />
                    )}{" "}
                    Delete
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
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
