import { Store } from "@/types/types";
import { create } from "zustand";

interface CurrentStore {
  store: Store | null;
  isLoading: boolean;
  setStore: (storeData: Store) => void;
  setLoading: (loading: boolean) => void;
  clearStore: () => void;
}

export const useCurrentStore = create<CurrentStore>((set) => ({
  store: null, // Store | null
  isLoading: true,

  // set store data (after API fetch)
  setStore: (storeData) =>
    set({
      store: storeData,
      isLoading: false,
    }),

  // loading state
  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  // clear store (logout / switch store)
  clearStore: () =>
    set({
      store: null,
      isLoading: false,
    }),
}));
