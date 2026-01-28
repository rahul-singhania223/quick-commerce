import { create } from "zustand";
import { User } from "../types/types";
import { getRefreshTokenCached } from "../utils/token.utils";
import authServices from "../services/auth.services";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  user: User | null;
  bootstrap: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "idle",
  user: null,

  bootstrap: async () => {
    set({ status: "loading" });

    const tokens = await getRefreshTokenCached();
    if (!tokens) {
      set({ status: "unauthenticated", user: null });
      return;
    }

    try {
      const res = await authServices.getAuthUser();
      set({ user: res.data.data.user, status: "authenticated" });
    } catch (error) {
      set({ user: null, status: "unauthenticated" });
    }
  },

  logout: async () => {
    await authServices.logout();
    set({ user: null, status: "unauthenticated" });
  },
}));
