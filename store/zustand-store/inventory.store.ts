import { create } from "zustand";
import { Inventory, StoreProduct } from "@/types/types";

interface InventoryState {
  inventory: Map<string, StoreProduct>;

  // Replace entire inventory (initial load, refetch)
  setInventory: (items: StoreProduct[]) => void;

  // Add or update a single inventory item
  upsertInventory: (item: StoreProduct) => void;

  // Remove inventory by id
  removeInventory: (id: string) => void;

  // Get single inventory item
  getInventoryById: (id: string) => StoreProduct | undefined;

  // Clear everything (logout, store switch)
  clearInventory: () => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  inventory: new Map(),

  setInventory: (items) => {
    const map = new Map<string, StoreProduct>();
    for (const item of items) {
      map.set(item.id, item);
    }
    set({ inventory: map });
  },

  upsertInventory: (item) =>
    set((state) => {
      const map = new Map(state.inventory); 
      map.set(item.id, item);
      return { inventory: map };
    }),

  removeInventory: (id) =>
    set((state) => {
      const map = new Map(state.inventory);
      map.delete(id);
      return { inventory: map };
    }),

  getInventoryById: (id) => {
    return get().inventory.get(id);
  },

  clearInventory: () => set({ inventory: new Map() }),
}));
