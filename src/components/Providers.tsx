"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "@/components/ui/Toast";
import { useUIStore } from "@/lib/stores/useUIStore";

export function Providers({ children }: { children: ReactNode }) {
  const { toasts, removeToast } = useUIStore();

  return (
    <SessionProvider>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </SessionProvider>
  );
}
