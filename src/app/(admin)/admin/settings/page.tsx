"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Mail, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/content/site";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { Panel, SectionHead, Badge } from "@/components/admin/ui";
import {
  MarkProjects, MarkServices, MarkTestimonials, MarkStats, MarkProfile,
} from "@/components/admin/AdminIcons";

const MANAGERS = [
  { href: "/admin/projects", label: "Projects & Hero", desc: "Slider images, portfolio, galleries", Mark: MarkProjects },
  { href: "/admin/content/services", label: "Services", desc: "Disciplines, summaries, icons", Mark: MarkServices },
  { href: "/admin/content/testimonials", label: "Testimonials", desc: "Client quotes & visibility", Mark: MarkTestimonials },
  { href: "/admin/content/stats", label: "Stats & Clients", desc: "Counters & marquee", Mark: MarkStats },
  { href: "/admin/content/profile", label: "Studio Profile", desc: "Contact, socials, tagline", Mark: MarkProfile },
];

export default function SettingsPage() {
  const [email, setEmail] = useState<string>("");
  useEffect(() => {
    const auth = getFirebaseAuth();
    setEmail(auth.currentUser?.email ?? "");
    const u = auth.onAuthStateChanged((u) => setEmail(u?.email ?? ""));
    return () => u();
  }, []);

  return (
    <div className="max-w-4xl space-y-8">
      <SectionHead eyebrow="Settings" title="Studio settings" desc="Your account, and quick access to every content manager." />

      <Panel className="p-6 md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border border-gold/30 bg-gold/10"><ShieldCheck className="h-4 w-4 text-gold" /></span>
          <h2 className="font-display text-2xl">Account</h2>
        </div>
        <dl className="grid grid-cols-[120px_1fr] gap-y-3 text-sm">
          <dt className="text-stone">Email</dt><dd className="flex items-center gap-2 break-all"><Mail className="h-3.5 w-3.5 text-gold" /> {email || "—"}</dd>
          <dt className="text-stone">Role</dt><dd><Badge tone="gold">Administrator</Badge></dd>
        </dl>
      </Panel>

      <section>
        <h2 className="mb-4 font-display text-2xl">Manage site content</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {MANAGERS.map((m) => (
            <Link key={m.href} href={m.href} className="group flex items-center gap-4 border border-onyx/10 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold">
              <span className="shrink-0"><m.Mark size={40} /></span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg leading-tight">{m.label}</p>
                <p className="mt-0.5 text-xs text-stone">{m.desc}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-onyx/30 transition-colors group-hover:text-gold" />
            </Link>
          ))}
        </div>
      </section>

      <Panel className="p-6 md:p-8">
        <h2 className="mb-4 font-display text-2xl">Studio forms</h2>
        <p className="mb-3 text-sm leading-relaxed text-stone">
          Four studio forms are live on the public site. Submissions route into the Inbox automatically.
        </p>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          <li className="flex items-center gap-2"><span className="h-1 w-1 bg-gold" /> Contact → <code className="text-gold">/contact</code></li>
          <li className="flex items-center gap-2"><span className="h-1 w-1 bg-gold" /> Request-a-Quote → <code className="text-gold">/request-a-quote</code></li>
          <li className="flex items-center gap-2"><span className="h-1 w-1 bg-gold" /> Careers → <code className="text-gold">/careers</code></li>
          <li className="flex items-center gap-2"><span className="h-1 w-1 bg-gold" /> Trainees → <code className="text-gold">/trainees</code></li>
        </ul>
      </Panel>

      <p className="text-xs text-stone">
        Studio name defaults ({siteConfig.name}) and structural copy live in <code>src/content/site.ts</code> as fallbacks — the managers above override them live via Firestore.
      </p>
    </div>
  );
}
