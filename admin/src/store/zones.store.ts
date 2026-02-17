import { create } from "zustand";
import { Brand, Zone, ZoneStats } from "../lib/types";
import { BrandsServices } from "../services/brands.services";
import { ZonesServices } from "../services/zones.service";

let activeZonesQueryKey: string | null = null;
let inflightRequests = new Map<string, Promise<void>>();

const buildQueryKey = (query?: QueryParams) =>
  JSON.stringify({
    is_active: query?.is_active ?? null,
    search: query?.search ?? "",
    created_at: query?.created_at ?? "desc",
  });

interface QueryParams {
  is_active?: "0" | "1";
  city?: string;
  created_at?: "asc" | "desc";
  search?: string;
}

interface ZonesState {
  hasMore: boolean;
  currentQueryKey: string;
  cursor: string | null;
  initialized: boolean;
  zoneStats: ZoneStats | null;
  zones: Map<Zone["id"], Zone>;
  loadingFailed: boolean;
  isLoading: boolean;
  fetchZones: (query?: QueryParams) => void;
  addZone: (zone: any) => void;
  getZone: (zoneId: string) => Zone | undefined;
  removeZone: (zoneId: string) => void;
  updateZone: (zoneId: string, data: Zone) => void;
  clearZones: () => void;
}
export const useZonesStore = create<ZonesState>((set, get) => ({
  zones: new Map(),
  loadingFailed: false,
  isLoading: false,
  currentQueryKey: "",
  initialized: false,
  cursor: null,
  hasMore: false,
  zoneStats: null,

  fetchZones: async (query) => {
    const state = get();
    const queryKey = buildQueryKey(query);
    const isNewQuery = queryKey !== state.currentQueryKey;

    // prevent duplicate same-query requests
    if (inflightRequests.has(queryKey)) {
      return inflightRequests.get(queryKey);
    }

    const promise = (async () => {
      try {
        activeZonesQueryKey = queryKey;

        // RESET ONLY ON NEW QUERY
        if (isNewQuery) {
          set({
            zones: new Map(),
            zoneStats: null,
            loadingFailed: false,
            cursor: null,
            hasMore: true,
            currentQueryKey: queryKey,
            initialized: false,
          });
        }

        const fresh = get();

        // stop useless pagination calls
        if (!isNewQuery && !fresh.hasMore) return;

        set({ isLoading: true });

        const [zoneRes, statsRes] = await Promise.all([
          ZonesServices.getAllZones({
            ...query,
            cursor: isNewQuery ? undefined : (fresh.cursor ?? undefined),
          }),
          ZonesServices.getZonesStats({}),
        ]);

        // stale response protection
        if (activeZonesQueryKey !== queryKey) return;

        if (!zoneRes) throw new Error("Zones fetch failed");

        set((prev) => {
          const map = isNewQuery ? new Map() : new Map(prev.zones);

          for (const z of zoneRes) {
            map.set(z.id, z);
          }

          return {
            zones: map,
            zoneStats: statsRes?.data ?? prev.zoneStats ?? null,
            initialized: true,
            loadingFailed: false,
          };
        });
      } catch (err) {
        if (activeZonesQueryKey === queryKey) {
          set({ loadingFailed: true });
          console.error("fetchZones error:", err);
        }
      } finally {
        if (activeZonesQueryKey === queryKey) {
          set({ isLoading: false });
        }
        inflightRequests.delete(queryKey);
      }
    })();

    inflightRequests.set(queryKey, promise);
    return promise;
  },


  addZone: (zone: Zone) => {
    set((state) => {
      const next = new Map(state.zones);
      next.set(zone.id, zone);

      return {
        zones: next,
        zoneStats: state.zoneStats
          ? { ...state.zoneStats, zones_count: state.zoneStats.zones_count + 1 }
          : { zones_count: 1 },
      };
    });
  },

  getZone: (zoneId: string) => get().zones.get(zoneId),

  removeZone: (zoneId: string) => {
    set((state) => {
      if (!state.zones.has(zoneId)) return state;

      const next = new Map(state.zones);
      next.delete(zoneId);

      return {
        zones: next,
        zoneStats: state.zoneStats
          ? {
              ...state.zoneStats,
              zones_count: Math.max(0, state.zoneStats.zones_count - 1),
            }
          : null,
      };
    });
  },

  updateZone: (zoneId: string, data: Zone) => {
    set((state) => {
      if (!state.zones.has(zoneId)) return state;

      const next = new Map(state.zones);
      next.set(zoneId, data);
      return { zones: next };
    });
  },

  clearZones: () =>
    set({
      zones: new Map(),
      cursor: null,
      hasMore: false,
      initialized: false,
      zoneStats: null,
    }),
}));
