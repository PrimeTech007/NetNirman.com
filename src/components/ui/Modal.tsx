"use client";

import { useEffect, useRef } from "react";
import { X } from "@phosphor-icons/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl" };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div
        className={`w-full ${sizes[size]} bg-cream border-2 border-black shadow-brutal-lg relative max-h-[90vh] overflow-y-auto`}
        style={{ borderRadius: "2px" }}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b-2 border-black bg-yellow">
            <h3 className="text-lg font-bold font-space">{title}</h3>
            <button onClick={onClose} className="p-1 hover:bg-black/10 cursor-pointer">
              <X size={20} weight="bold" />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 hover:bg-black/10 cursor-pointer z-10"
          >
            <X size={20} weight="bold" />
          </button>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
