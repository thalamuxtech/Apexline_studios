"use client";

/**
 * Shared admin UI primitives. One consistent set of buttons, panels, section
 * headers, inputs, skeletons and badges used by every content manager so the
 * whole control room reads as a single premium system.
 */
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ Buttons */

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "quiet" | "quiet-dark" | "danger";
  loading?: boolean;
  icon?: LucideIcon;
};

const BTN_BASE =
  "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-all duration-300 ease-apex disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-graphite";

const BTN_VARIANT = {
  primary: "bg-gold text-onyx hover:bg-gold-soft hover:-translate-y-0.5 shadow-[0_10px_30px_-12px_rgba(201,162,75,0.7)]",
  ghost: "border border-gold/50 text-gold hover:bg-gold hover:text-onyx",
  quiet: "border border-onyx/15 text-onyx/70 hover:border-gold/70 hover:text-gold",
  "quiet-dark": "border border-white/12 text-bone/80 hover:border-gold/60 hover:text-gold",
  danger: "border border-danger/40 text-danger hover:bg-danger hover:text-bone",
} as const;

export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button(
  { variant = "primary", loading, icon: Icon, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button ref={ref} disabled={disabled || loading} className={cn(BTN_BASE, BTN_VARIANT[variant], className)} {...rest}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" strokeWidth={1.75} /> : null}
      {children}
    </button>
  );
});

/* ------------------------------------------------------------------- Panels */

export function Panel({
  tone = "light",
  className,
  children,
}: { tone?: "light" | "dark"; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "relative border",
        tone === "dark"
          ? "border-white/10 bg-graphite text-bone"
          : "border-onyx/10 bg-white text-onyx",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Section header with animated SVG mark, eyebrow and title. */
export function SectionHead({
  mark,
  eyebrow,
  title,
  desc,
  actions,
  tone = "light",
}: {
  mark?: React.ReactNode;
  eyebrow: string;
  title: string;
  desc?: string;
  actions?: React.ReactNode;
  tone?: "light" | "dark";
}) {
  const sub = tone === "dark" ? "text-bone/60" : "text-stone";
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex items-start gap-4">
        {mark && <div className="mt-1 shrink-0">{mark}</div>}
        <div>
          <p className="eyebrow mb-2 text-gold">{eyebrow}</p>
          <h2 className="font-display text-3xl leading-tight md:text-4xl">{title}</h2>
          {desc && <p className={cn("mt-2 max-w-2xl text-sm leading-relaxed", sub)}>{desc}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------- Fields */

const FIELD =
  "w-full border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-gold";

export function fieldClass(tone: "light" | "dark" = "light") {
  return cn(
    FIELD,
    tone === "dark"
      ? "border-white/12 bg-onyx/40 text-bone placeholder:text-bone/30"
      : "border-onyx/12 bg-ivory/40 text-onyx placeholder:text-stone/50",
  );
}

export function Field({
  label,
  hint,
  tone = "light",
  className,
  children,
}: { label: string; hint?: string; tone?: "light" | "dark"; className?: string; children: React.ReactNode }) {
  const sub = tone === "dark" ? "text-bone/40" : "text-stone";
  return (
    <label className={cn("block space-y-2", className)}>
      <span className={cn("block text-[10px] uppercase tracking-[0.22em]", sub)}>{label}</span>
      {children}
      {hint && <span className={cn("block text-[11px] leading-relaxed", sub)}>{hint}</span>}
    </label>
  );
}

/* ------------------------------------------------------------------ Badges */

export function Badge({
  tone = "gold",
  children,
}: { tone?: "gold" | "muted" | "success" | "danger"; children: React.ReactNode }) {
  const map = {
    gold: "bg-gold/15 text-gold-deep",
    muted: "bg-onyx/5 text-stone",
    success: "bg-success/15 text-success",
    danger: "bg-danger/15 text-danger",
  } as const;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]", map[tone])}>
      {children}
    </span>
  );
}

/* --------------------------------------------------------------- Skeletons */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-onyx/[0.07]", className)} />;
}

export function SkeletonDark({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-white/[0.06]", className)} />;
}

/* ------------------------------------------------------------- Empty state */

export function EmptyState({
  mark,
  title,
  desc,
  action,
}: { mark?: React.ReactNode; title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center gap-4 border border-dashed border-onyx/15 bg-ivory/40 px-6 py-16 text-center"
    >
      {mark}
      <div>
        <p className="font-display text-2xl">{title}</p>
        {desc && <p className="mx-auto mt-2 max-w-md text-sm text-stone">{desc}</p>}
      </div>
      {action}
    </motion.div>
  );
}

/* ----------------------------------------------------- Reveal-on-mount card */

export function RiseCard({
  delay = 0,
  className,
  children,
}: { delay?: number; className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
