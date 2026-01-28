import { create } from "zustand";

interface Props {
  open: boolean;
  title: string;
  content: React.ReactNode | null;
  onOpen: (title: string, content: React.ReactNode | null) => void;
  onClose: () => void;
}

export const useModal = create<Props>((set) => ({
  open: false,
  title: "",
  content: null,
  onOpen: (title: string, content: React.ReactNode | null) =>
    set({ content, title, open: true }),
  onClose: () => set({ open: false, content: null, title: "" }),
}));
