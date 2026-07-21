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
  processSteps as fallbackProcess,
  navLinks as fallbackNav,
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

export type ProcessStep = { number: string; title: string; body: string };

export type Milestone = { year: string; title: string; body: string };

export type AboutContent = {
  imageSrc: string;
  principalEyebrow: string;
  principalName: string;
  principalQuote: string;
  principalBio: string[];
  milestonesTitle: string;
  milestones: Milestone[];
};

export type JournalArticle = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  body?: string;
  status?: "draft" | "published";
};

export type NavLink = { href: string; label: string };

export type FooterLink = { href: string; label: string };

export type FooterContent = {
  statementEyebrow: string;
  statementTitle: string;
  practiceLinks: FooterLink[];
  engageLinks: FooterLink[];
};

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

export const defaultProcess: ProcessStep[] = fallbackProcess.map((s) => ({ ...s }));

export const defaultAbout: AboutContent = {
  imageSrc: "/site/site-04.jpg",
  principalEyebrow: "The Principal",
  principalName: "Arc. Sumaila Onimisi Yusuf",
  principalQuote: "Every line we draw is a commitment we will honour on site.",
  principalBio: [
    "Trained as an architect with a B-Tech in technology, the principal cut his professional teeth supervising the delivery of ten duplex buildings at BUA Estate, Abuja. Fifteen years on, his hands-on approach still defines how Apex-Line Studios operates — from sketch to snagging.",
    "Under his direction, the practice has delivered remodellings for Access Bank, estate-scale housing at Twin Lakes, institutional healthcare in Ikeja and a full sixteen-floor rebuild for Shell on Broad Street — each one held to the same uncompromising standard.",
  ],
  milestonesTitle: "A record of growth, built project by project.",
  milestones: [
    { year: "2009", title: "Practice founded", body: "Arc. Sumaila Onimisi Yusuf launches Apex-Line Studios in Lagos, after formative years leading residential delivery in Abuja." },
    { year: "2014", title: "First major institutional project", body: "Victoria Island commercial remodelling commissions establish the studio's reputation for disciplined finishing." },
    { year: "2018", title: "Corporate client expansion", body: "Facilities programmes for multinationals including Shell and Chevron anchor the practice's commercial portfolio." },
    { year: "2022", title: "Healthcare & hospitality", body: "Duchess Hospital and George Hotel Annex extend the studio's reach across sectors." },
    { year: "2024", title: "Sixteen-floor Shell upgrade", body: "FMH Broad Street programme completes to world-class operational standard." },
  ],
};

export const defaultJournal: JournalArticle[] = [
  { slug: "on-disciplined-site-craft", title: "On disciplined site craft", excerpt: "Why the quietest projects we deliver are also the most demanding.", image: "/site/site-10.jpg", date: "2026 · Editorial", status: "published" },
  { slug: "marina-rebuilt", title: "Marina, rebuilt", excerpt: "Notes from a sixteen-floor upgrade and what facilities-grade finishing really means.", image: "/site/site-15.jpg", date: "2025 · Case Notes", status: "published" },
  { slug: "material-restraint", title: "Material restraint", excerpt: "A short argument for doing less, done better — in finishes and in specification.", image: "/site/site-18.jpg", date: "2025 · Essay", status: "published" },
];

export const defaultNav: NavLink[] = fallbackNav.map((l) => ({ ...l }));

export const defaultFooter: FooterContent = {
  statementEyebrow: "Let's build",
  statementTitle: "Have a site, a brief, or a vision?",
  practiceLinks: fallbackNav.map((l) => ({ ...l })),
  engageLinks: [
    { href: "/request-a-quote", label: "Request a quote" },
    { href: "/careers", label: "Careers" },
    { href: "/trainees", label: "Internship" },
    { href: "/journal", label: "Journal" },
    { href: "/contact", label: "Contact" },
  ],
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

export function cleanProcess(list: ProcessStep[]): ProcessStep[] {
  return list
    .map((s, i) => ({
      number: (s.number ?? "").trim() || String(i + 1).padStart(2, "0"),
      title: (s.title ?? "").trim(),
      body: (s.body ?? "").trim(),
    }))
    .filter((s) => s.title);
}

export function cleanMilestones(list: Milestone[]): Milestone[] {
  return list
    .map((m) => ({ year: (m.year ?? "").trim(), title: (m.title ?? "").trim(), body: (m.body ?? "").trim() }))
    .filter((m) => m.title);
}

export function cleanJournal(list: JournalArticle[]): JournalArticle[] {
  return list
    .map((a) => ({
      slug: (a.slug || slugify(a.title)).trim(),
      title: (a.title ?? "").trim(),
      excerpt: (a.excerpt ?? "").trim(),
      image: (a.image ?? "").trim(),
      date: (a.date ?? "").trim(),
      body: (a.body ?? "").trim(),
      status: (a.status === "draft" ? "draft" : "published") as "draft" | "published",
    }))
    .filter((a) => a.title && a.slug);
}

export function cleanLinks(list: FooterLink[]): FooterLink[] {
  return list
    .map((l) => ({ href: (l.href ?? "").trim(), label: (l.label ?? "").trim() }))
    .filter((l) => l.href && l.label);
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

export function useProcessSteps() {
  const { value, loading } = useManagedDoc<ProcessStep[]>("process", "items", defaultProcess, cleanProcess);
  return { steps: value, loading };
}

export function useAbout() {
  const { value, loading } = useManagedDoc<AboutContent>("about", "about", defaultAbout);
  return { about: value, loading };
}

export function useJournal(publishedOnly = true) {
  const { value, loading } = useManagedDoc<JournalArticle[]>("journal", "items", defaultJournal, cleanJournal);
  const articles = publishedOnly ? value.filter((a) => a.status !== "draft") : value;
  return { articles: articles.length ? articles : defaultJournal, loading };
}

export function useNavLinks() {
  const { value, loading } = useManagedDoc<NavLink[]>("nav", "items", defaultNav, cleanLinks);
  return { links: value, loading };
}

export function useFooter() {
  const { value, loading } = useManagedDoc<FooterContent>("footer", "footer", defaultFooter);
  return { footer: value, loading };
}
