import { create } from "zustand";
import { ToastData } from "@/components/ui/Toast";

interface UIState {
  sidebarOpen: boolean;
  toasts: ToastData[];
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addToast: (toast: Omit<ToastData, "id">) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toasts: [],
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  addToast: (toast) =>
    set((s) => ({
      toasts: [...s.toasts, { ...toast, id: Date.now().toString() + Math.random() }],
    })),
  removeToast: (id) =>
    set((s) => ({
      toasts: s.toasts.filter((t) => t.id !== id),
    })),
}));
