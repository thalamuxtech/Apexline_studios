"use client";

/**
 * Managed site content hooks. Each block of homepage/site content that used to
 * live only in `src/content/site.ts` can now be overridden from the admin panel
 * via a document under the `settings` collection. These hooks read the managed
 * document and fall back to the hardcoded defaults so the public site always
 * renders — even before anything has been saved, or if Firebase is unreachable.
 *
 * Mirrors the existing `useHeroSlides` pattern.
 */
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import {
  services as fallbackServices,
  testimonials as fallbackTestimonials,
  stats as fallbackStats,
  clientMarquee as fallbackClients,
  siteConfig as fallbackProfile,
} from "@/content/site";

/* --------------------------------------------------------------- Types */

export type ServiceItem = {
  slug: string;
  title: string;
  summary: string;
  icon: string;
  deliverables: string[];
};

export type TestimonialItem = {
  quote: string;
  author: string;
  role: string;
  approved?: boolean;
};

export type StatItem = { value: string; label: string };

export type SiteProfile = {
  tagline: string;
  description: string;
  contact: { email: string; phone: string; address: string; hours: string };
  social: { facebook: string; instagram: string; linkedin: string; behance: string };
};

/* ------------------------------------------------------- Default exports */

export const defaultServices: ServiceItem[] = fallbackServices.map((s) => ({
  slug: s.slug,
  title: s.title,
  summary: s.summary,
  icon: s.icon,
  deliverables: [...s.deliverables],
}));

export const defaultTestimonials: TestimonialItem[] = fallbackTestimonials.map((t) => ({
  ...t,
  approved: true,
}));

export const defaultStats: StatItem[] = fallbackStats.map((s) => ({ ...s }));

export const defaultClients: string[] = [...fallbackClients];

export const defaultProfile: SiteProfile = {
  tagline: fallbackProfile.tagline,
  description: fallbackProfile.description,
  contact: { ...fallbackProfile.contact },
  social: { ...fallbackProfile.social },
};

/* ------------------------------------------------- Icon whitelist (services) */

/** Lucide icon names offered in the admin picker for services. */
export const SERVICE_ICONS = [
  "Compass", "HardHat", "Sofa", "Trees", "Hammer", "FileText",
  "Building2", "Ruler", "Lightbulb", "PenTool", "Layers", "Landmark",
] as const;

/* ------------------------------------------------------------- Generic hook */

function useManagedDoc<T>(docId: string, key: string, fallback: T, sanitize?: (raw: T) => T) {
  const [value, setValue] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const snap = await getDoc(doc(getDb(), "settings", docId));
        const raw = snap.data()?.[key] as T | undefined;
        if (live && raw != null) {
          const clean = sanitize ? sanitize(raw) : raw;
          if (Array.isArray(clean) ? clean.length : clean) setValue(clean);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId, key]);

  return { value, loading };
}

/* -------------------------------------------------------------- Sanitizers */

export function cleanServices(list: ServiceItem[]): ServiceItem[] {
  return list
    .map((s) => ({
      slug: (s.slug || slugify(s.title)).trim(),
      title: (s.title ?? "").trim(),
      summary: (s.summary ?? "").trim(),
      icon: (s.icon || "Compass").trim(),
      deliverables: (s.deliverables ?? []).map((d) => d.trim()).filter(Boolean),
    }))
    .filter((s) => s.title && s.slug);
}

export function cleanTestimonials(list: TestimonialItem[]): TestimonialItem[] {
  return list
    .map((t) => ({
      quote: (t.quote ?? "").trim(),
      author: (t.author ?? "").trim(),
      role: (t.role ?? "").trim(),
      approved: t.approved !== false,
    }))
    .filter((t) => t.quote && t.author);
}

export function cleanStats(list: StatItem[]): StatItem[] {
  return list
    .map((s) => ({ value: (s.value ?? "").trim(), label: (s.label ?? "").trim() }))
    .filter((s) => s.value && s.label);
}

export function cleanClients(list: string[]): string[] {
  return Array.from(new Set(list.map((c) => c.trim()).filter(Boolean)));
}

export function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/* --------------------------------------------------------------- Public hooks */

export function useServices() {
  const { value, loading } = useManagedDoc<ServiceItem[]>("services", "items", defaultServices, cleanServices);
  return { services: value, loading };
}

export function useTestimonials(approvedOnly = true) {
  const { value, loading } = useManagedDoc<TestimonialItem[]>("testimonials", "items", defaultTestimonials, cleanTestimonials);
  const testimonials = approvedOnly ? value.filter((t) => t.approved !== false) : value;
  return { testimonials: testimonials.length ? testimonials : defaultTestimonials, loading };
}

export function useStats() {
  const { value, loading } = useManagedDoc<StatItem[]>("stats", "items", defaultStats, cleanStats);
  return { stats: value, loading };
}

export function useClients() {
  const { value, loading } = useManagedDoc<string[]>("clients", "items", defaultClients, cleanClients);
  return { clients: value, loading };
}

export function useSiteProfile() {
  const { value, loading } = useManagedDoc<SiteProfile>("profile", "profile", defaultProfile);
  return { profile: value, loading };
}
