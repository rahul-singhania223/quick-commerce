import { create } from "zustand";

interface ToastState {
  message: string;
  type: "success" | "error" | "warning" | "info";
  open: boolean;
  onOpen: (
    message: string,
    type: "success" | "error" | "warning" | "info",
  ) => void;
  onClose: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: "",
  type: "success",
  open: false,
  onOpen: (message: string, type: "success" | "error" | "warning" | "info") =>
    set({ message, type, open: true }),
  onClose: () => set({ open: false, message: "" }),
}));
