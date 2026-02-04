import { create } from "zustand";

export type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertOptions {
  title?: string;
  message: string;
  variant?: AlertVariant;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface AlertState {
  isOpen: boolean;
  title: string | null;
  message: string | null;
  variant: AlertVariant;
  confirmText: string;
  cancelText: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;

  show: (options: AlertOptions) => void;
  close: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  isOpen: false,
  title: null,
  message: null,
  variant: "info",
  confirmText: "Confirm",
  cancelText: "Cancel",
  onConfirm: undefined,
  onCancel: undefined,

  show: ({
    title = null,
    message,
    variant = "info",
    confirmText = "OK",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
  }) =>
    set({
      isOpen: true,
      title,
      message,
      variant,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
    }),

  close: () =>
    set({
      isOpen: false,
      title: null,
      message: null,
      onConfirm: undefined,
      onCancel: undefined,
    }),
}));
