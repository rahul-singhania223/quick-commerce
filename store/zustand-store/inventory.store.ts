import { create } from "zustand";
import { Inventory } from "@/types/types";

interface InventoryState {
  inventory: Map<string, Inventory>;

  // Replace entire inventory (initial load, refetch)
  setInventory: (items: Inventory[]) => void;

  // Add or update a single inventory item
  upsertInventory: (item: Inventory) => void;

  // Remove inventory by id
  removeInventory: (id: string) => void;

  // Get single inventory item
  getInventoryById: (id: string) => Inventory | undefined;

  // Clear everything (logout, store switch)
  clearInventory: () => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  inventory: new Map(),

  setInventory: (items) => {
    const map = new Map<string, Inventory>();
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
