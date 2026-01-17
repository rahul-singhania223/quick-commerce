"use client";

import { Store } from "@/types/types";
import { create } from "zustand";

interface UserStoreProps {
  stores: Store[] | null;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  setStores: (stores: Store[]) => void;
  emptyStores: () => void;
  getStore: (name: string) => Store | null;
  addStore: (store: Store) => void;
  removeStore: (name: string) => void;
}

export const useUserStore = create<UserStoreProps>((set) => ({
  stores: null,
  isLoading: false,

  setLoading: (loading) => set({ isLoading: loading }),

  setStores: (stores) => set({ stores }),

  emptyStores: () => set({ stores: [] }),

  getStore: (name: string): Store | null =>
    useUserStore
      .getState()
      .stores?.find((store: Store) => store.name === name) || null,

  addStore: (store) =>
    set((state) => ({
      stores: state.stores ? [...state.stores, store] : [store],
    })),

  removeStore: (name) =>
    set((state) => {
      const stores = state.stores;
      if (!stores) return { stores: null };

      return {
        stores: stores.filter((store) => store.name !== name),
      };
    }),
}));
