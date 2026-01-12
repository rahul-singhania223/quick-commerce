import { User } from "@/types/types";
import { create } from "zustand";

interface userStoreProps {
  user: User | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setUser: (user: User) => void;
  emptyUser: () => void;
}

export const useUser = create<userStoreProps>((set) => ({
  user: null,
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  setUser: (user: User) => set({ user }),
  emptyUser: () => set({ user: null }),
}));
