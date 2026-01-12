"use client";

import { Store } from "@/types/types";
import { create } from "zustand";

interface userStoreProps {
  stores: Store[];
  setStores: (stores: Store[]) => void;
  emptyStores: () => void;
  getStore: (name: string) => Store | null;
  addStore: (store: Store) => void;
  removeStore: (name: string) => void;
}

export const useUserStore = create<userStoreProps>((set) => ({
  stores: [],
  setStores: (stores) => set({ stores }),
  emptyStores: () => set({ stores: [] }),
  getStore: (name: string): Store | null => {
    return (
      useUserStore
        .getState()
        .stores.find((store: Store) => store.name === name) || null
    );
  },
  addStore: (store) => set((state) => ({ stores: [...state.stores, store] })),
  removeStore: (name) =>
    set((state) => ({
      stores: state.stores.filter((store) => store.name !== name),
    })),
}));
