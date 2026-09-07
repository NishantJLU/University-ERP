"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Global event bus for non-React contexts
type ToastListener = (toast: Omit<ToastItem, "id">) => void;
const toastListeners: ToastListener[] = [];

export const toast = {
  success: (message: string, title?: string) => {
    toastListeners.forEach((l) => l({ type: "success", message, title }));
  },
  error: (message: string, title?: string) => {
    toastListeners.forEach((l) => l({ type: "error", message, title }));
  },
  warning: (message: string, title?: string) => {
    toastListeners.forEach((l) => l({ type: "warning", message, title }));
  },
  info: (message: string, title?: string) => {
    toastListeners.forEach((l) => l({ type: "info", message, title }));
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toastData: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { ...toastData, id };
      setToasts((prev) => [...prev, newToast]);

      const duration = toastData.duration ?? 4500;
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  useEffect(() => {
    toastListeners.push(addToast);
    return () => {
      const idx = toastListeners.indexOf(addToast);
      if (idx !== -1) toastListeners.splice(idx, 1);
    };
  }, [addToast]);

  const success = useCallback((message: string, title?: string) => addToast({ type: "success", message, title }), [addToast]);
  const error = useCallback((message: string, title?: string) => addToast({ type: "error", message, title }), [addToast]);
  const warning = useCallback((message: string, title?: string) => addToast({ type: "warning", message, title }), [addToast]);
  const info = useCallback((message: string, title?: string) => addToast({ type: "info", message, title }), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      {/* Toast Render Viewport */}
      <div
        aria-live="assertive"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2 sm:p-0"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
              t.type === "success"
                ? "bg-emerald-900/95 text-emerald-100 border-emerald-700/60"
                : t.type === "error"
                ? "bg-rose-900/95 text-rose-100 border-rose-700/60"
                : t.type === "warning"
                ? "bg-amber-900/95 text-amber-100 border-amber-700/60"
                : "bg-slate-900/95 text-slate-100 border-slate-700/60"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
              {t.type === "error" && <AlertCircle className="w-4 h-4 text-rose-300" />}
              {t.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-300" />}
              {t.type === "info" && <Info className="w-4 h-4 text-blue-300" />}
            </div>
            <div className="flex-1 min-w-0 text-xs">
              {t.title && <p className="font-bold mb-0.5">{t.title}</p>}
              <p className="leading-relaxed opacity-95">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 text-white/60 hover:text-white p-0.5 rounded transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
