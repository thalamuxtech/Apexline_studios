"use client";

/**
 * Lightweight toast system for the admin panel. Replaces the inline
 * "message" banners with premium, auto-dismissing notifications so save /
 * upload / error feedback is consistent across every content manager.
 */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, AlertTriangle, Info, X, Loader2 } from "lucide-react";

type ToastKind = "success" | "error" | "info" | "loading";
type Toast = { id: number; kind: ToastKind; title: string; body?: string; sticky?: boolean };

type ToastApi = {
  push: (t: Omit<Toast, "id">) => number;
  dismiss: (id: number) => void;
  success: (title: string, body?: string) => number;
  error: (title: string, body?: string) => number;
  info: (title: string, body?: string) => number;
};

const ToastContext = createContext<ToastApi | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

let counter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = ++counter;
    setToasts((current) => [...current, { ...t, id }]);
    if (!t.sticky) setTimeout(() => dismiss(id), t.kind === "error" ? 6000 : 3800);
    return id;
  }, [dismiss]);

  const api: ToastApi = {
    push,
    dismiss,
    success: (title, body) => push({ kind: "success", title, body }),
    error: (title, body) => push({ kind: "error", title, body }),
    info: (title, body) => push({ kind: "info", title, body }),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[60] flex w-[min(92vw,380px)] flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastCard key={t.id} toast={t} onClose={() => dismiss(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

const KIND = {
  success: { Icon: Check, accent: "bg-success", ring: "border-success/40" },
  error: { Icon: AlertTriangle, accent: "bg-danger", ring: "border-danger/40" },
  info: { Icon: Info, accent: "bg-gold", ring: "border-gold/40" },
  loading: { Icon: Loader2, accent: "bg-gold", ring: "border-gold/40" },
} as const;

function ToastCard({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const { Icon, accent, ring } = KIND[toast.kind];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-auto relative flex items-start gap-3 overflow-hidden border ${ring} bg-graphite/95 text-bone shadow-[0_18px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md`}
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${accent}`} />
      <span className="grid h-10 w-10 shrink-0 place-items-center self-center">
        <Icon className={`h-4 w-4 text-gold ${toast.kind === "loading" ? "animate-spin" : ""}`} strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1 py-3 pr-2">
        <p className="text-sm font-medium leading-tight">{toast.title}</p>
        {toast.body && <p className="mt-1 text-xs leading-relaxed text-bone/60">{toast.body}</p>}
      </div>
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        className="grid h-9 w-9 shrink-0 place-items-center text-bone/40 transition-colors hover:text-gold"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

/** Auto-dismiss a specific toast id imperatively (used after long ops). */
export function useDismissAfter() {
  const { dismiss } = useToast();
  useEffect(() => () => {}, []);
  return dismiss;
}
