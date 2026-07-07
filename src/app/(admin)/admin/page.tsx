"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";
import { ArrowUpRight, Inbox, Briefcase, Users, FolderKanban } from "lucide-react";
import { getDb } from "@/lib/firebase/client";
import { formatDate } from "@/lib/utils";
import { AnalyticsPanel } from "./Analytics";
import { CompassCrest, MarkProjects, MarkServices, MarkTestimonials, MarkStats, MarkProfile } from "@/components/admin/AdminIcons";
import { RiseCard, Skeleton, Badge } from "@/components/admin/ui";

type Lead = { id: string; formType: string; status: string; createdAt?: any; data?: Record<string, any> };

const QUICK_LINKS = [
  { href: "/admin/projects", label: "Projects & Hero", desc: "Fix slider & portfolio images", Mark: MarkProjects },
  { href: "/admin/content/services", label: "Services", desc: "Titles, summaries, icons", Mark: MarkServices },
  { href: "/admin/content/testimonials", label: "Testimonials", desc: "Client voices", Mark: MarkTestimonials },
  { href: "/admin/content/stats", label: "Stats & Clients", desc: "Counters & marquee", Mark: MarkStats },
  { href: "/admin/content/profile", label: "Studio Profile", desc: "Contact & socials", Mark: MarkProfile },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(getDb(), "leads"), orderBy("createdAt", "desc"), limit(200)));
        setLeads(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const counts = {
    newCount: leads.filter((l) => l.status === "new").length,
    quote: leads.filter((l) => l.formType === "quote").length,
    careers: leads.filter((l) => l.formType === "careers").length,
    trainee: leads.filter((l) => l.formType === "trainee").length,
  };
  const recent = leads.slice(0, 6);

  const cards = [
    { label: "Inbox (new)", value: counts.newCount, icon: Inbox, href: "/admin/leads?status=new" },
    { label: "Quote requests", value: counts.quote, icon: FolderKanban, href: "/admin/leads?formType=quote" },
    { label: "Career applications", value: counts.careers, icon: Briefcase, href: "/admin/leads?formType=careers" },
    { label: "Trainee applications", value: counts.trainee, icon: Users, href: "/admin/leads?formType=trainee" },
  ];

  return (
    <div className="space-y-12">
      {/* Hero header */}
      <header className="relative overflow-hidden border border-white/10 bg-graphite px-6 py-10 text-bone md:px-10 md:py-12">
        <div className="absolute inset-0 blueprint-grid opacity-30" aria-hidden />
        <div className="pointer-events-none absolute -right-6 -top-6 opacity-90 md:right-6 md:top-1/2 md:-translate-y-1/2">
          <CompassCrest size={180} />
        </div>
        <div className="relative max-w-2xl">
          <p className="eyebrow mb-3 text-gold">Studio control room</p>
          <h1 className="font-display text-4xl leading-tight md:text-5xl">
            Welcome back to <em className="font-editorial italic text-gold">Apex-Line</em>.
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-bone/65">
            A real-time view of every inbound enquiry — and one place to manage every image, title and word the public site shows.
          </p>
        </div>
      </header>

      {/* Stat cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((c, i) => (
          <RiseCard key={c.label} delay={i * 0.06}>
            <Link href={c.href} className="group block h-full border border-onyx/10 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold md:p-7">
              <div className="flex items-start justify-between">
                <c.icon className="h-6 w-6 text-gold" strokeWidth={1.25} />
                <ArrowUpRight className="h-4 w-4 text-onyx/40 transition-colors group-hover:text-gold" />
              </div>
              {loading ? <Skeleton className="mt-8 h-12 w-16" /> : <p className="mt-8 font-display text-5xl">{c.value}</p>}
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone">{c.label}</p>
            </Link>
          </RiseCard>
        ))}
      </section>

      {/* Manage content quick links */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="eyebrow mb-1 text-gold">Manage content</p>
            <h2 className="font-display text-2xl md:text-3xl">Everything on the public site</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {QUICK_LINKS.map((q, i) => (
            <RiseCard key={q.href} delay={i * 0.05}>
              <Link href={q.href} className="group flex h-full items-center gap-4 border border-onyx/10 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold">
                <span className="shrink-0"><q.Mark size={40} /></span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg leading-tight">{q.label}</p>
                  <p className="mt-0.5 text-xs text-stone">{q.desc}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-onyx/30 transition-colors group-hover:text-gold" />
              </Link>
            </RiseCard>
          ))}
        </div>
      </section>

      <AnalyticsPanel leads={leads} />

      {/* Recent submissions */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-2xl">Recent submissions</h2>
          <Link href="/admin/leads" className="text-xs uppercase tracking-[0.2em] text-onyx/70 link-underline">View all</Link>
        </div>
        <div className="overflow-hidden border border-onyx/10 bg-white">
          {loading && (
            <div className="divide-y divide-onyx/5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 md:p-5">
                  <Skeleton className="h-3 w-16" />
                  <div className="flex-1 space-y-2"><Skeleton className="h-3.5 w-40" /><Skeleton className="h-3 w-56" /></div>
                  <Skeleton className="h-5 w-14" />
                </div>
              ))}
            </div>
          )}
          {!loading && recent.length === 0 && (
            <p className="p-6 text-sm text-stone">No submissions yet. Once the public forms receive enquiries, they&rsquo;ll appear here.</p>
          )}
          {!loading && (
            <ul className="divide-y divide-onyx/10">
              {recent.map((r, i) => (
                <motion.li key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <Link href={`/admin/leads/detail?id=${r.id}`} className="flex items-center gap-4 p-4 hover:bg-ivory/50 md:p-5">
                    <span className="hidden w-20 shrink-0 text-[10px] uppercase tracking-[0.2em] text-gold sm:inline-block">{r.formType}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{r.data?.fullName ?? r.data?.name ?? r.data?.email ?? "—"}</p>
                      <p className="truncate text-xs text-stone">{r.data?.email} · {r.data?.subject ?? r.data?.serviceType ?? r.data?.role ?? r.data?.interest ?? ""}</p>
                    </div>
                    <span className="hidden text-xs text-stone md:inline">{r.createdAt?.toDate ? formatDate(r.createdAt.toDate()) : ""}</span>
                    <Badge tone={r.status === "new" ? "gold" : "muted"}>{r.status}</Badge>
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
