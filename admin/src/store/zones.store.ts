import { create } from "zustand";
import { Brand, Zone } from "../lib/types";
import { BrandsServices } from "../services/brands.services";
import { ZonesServices } from "../services/zones.service";
import { count } from "console";

interface QueryParams {
  is_active?: "0" | "1";
  name?: "asc" | "desc";
  city?: string;
  created_at?: "asc" | "desc";
  search?: string;
}

interface ZonesState {
  zonesCount: number;
  activeZonesCount: number;
  zonesWithoutStoresCount: number;
  zonesWithLowRidersCount: number;
  zones: Map<Zone["id"], Zone>;
  loadingFailed: boolean;
  isLoading: boolean;
  fetchZones: (query?: QueryParams) => void;
  addZone: (zone: any) => void;
  getZone: (zoneId: string) => Zone | undefined;
  removeZone: (zoneId: string) => void;
  clearZones: () => void;
}

export const useZonesStore = create<ZonesState>((set, get) => ({
  zones: new Map(),
  zonesCount: 0,
  loadingFailed: false,
  isLoading: true,
  activeZonesCount: 0,
  zonesWithoutStoresCount: 0,
  zonesWithLowRidersCount: 0,
  fetchZones: async (query?: QueryParams) => {
    set({ isLoading: true, loadingFailed: false });

    try {
      const [zones, counts] = await Promise.all([
        ZonesServices.getAllZones({
          is_active: query?.is_active,
          name: query?.name,
          created_at: query?.created_at,
          search: query?.search,
        }),
        ZonesServices.getZonesCount({}),
      ]);

      // Validate responses properly
      if (!Array.isArray(zones)) {
        throw new Error("Invalid zones response");
      }

      if (!counts.count) {
        throw new Error("Invalid counts response");
      }

      const zonesWithKeys = zones.map((zone) => [zone.id, zone] as const);

      set({
        zones: new Map(zonesWithKeys),
        zonesCount: counts.count.zones,
        activeZonesCount: counts.count.activeZones,
        zonesWithoutStoresCount: counts.count.zonesWithoutStores,
      });
    } catch (err) {
      set({ loadingFailed: true });
      console.error("fetchZones failed:", err);
    } finally {
      set({ isLoading: false });
    }
  },
  addZone: (zone: Zone) => {
    set((state) => {
      const next = new Map(state.zones);
      next.set(zone.id, zone);
      return { zones: next, zonesCount: state.zonesCount + 1 };
    });
  },

  getZone: (zoneId: string) => {
    return get().zones.get(zoneId);
  },
  removeZone: (zoneId: string) => {
    set((state) => {
      const next = new Map(state.zones);
      next.delete(zoneId);
      return { zones: next, zonesCount: state.zonesCount - 1 };
    });
  },

  clearZones: () => set({ zones: new Map(), zonesCount: 0 }),
}));
