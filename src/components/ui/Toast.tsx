"use client";

import { useEffect } from "react";
import { CheckCircle, Warning, XCircle, X } from "@phosphor-icons/react";

export interface ToastData {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

interface ToastProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

const icons = {
  success: <CheckCircle size={20} weight="fill" className="text-green" />,
  error: <XCircle size={20} weight="fill" className="text-red" />,
  warning: <Warning size={20} weight="fill" className="text-yellow" />,
  info: <CheckCircle size={20} weight="fill" className="text-blue" />,
};

const bgColors = {
  success: "bg-green/10",
  error: "bg-red/10",
  warning: "bg-yellow/10",
  info: "bg-blue/10",
};

export function Toast({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 border-2 border-black shadow-brutal-sm ${bgColors[toast.type]}`}
      style={{ borderRadius: "2px" }}
    >
      {icons[toast.type]}
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} className="cursor-pointer">
        <X size={16} weight="bold" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}
