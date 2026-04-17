import Link from "next/link";
import { ArrowUpRight, Facebook, Instagram, Linkedin, Lock, Mail, MapPin, Phone, Clock } from "lucide-react";
import { siteConfig, navLinks, services } from "@/content/site";
import { BrandMark } from "./BrandMark";

export function Footer() {
  return (
    <footer className="relative bg-onyx text-bone overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-40" aria-hidden />

      {/* Top band — oversized studio statement */}
      <div className="relative border-b border-white/10">
        <div className="container-apex py-20 md:py-28 grid gap-10 md:gap-14 md:grid-cols-12 items-end">
          <div className="md:col-span-8">
            <p className="eyebrow mb-6">Let&rsquo;s build</p>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.02] text-balance">
              Have a site, a brief, or a vision?
              <br />
              <em className="font-editorial italic text-gold">We&rsquo;d be glad to hear from you.</em>
            </h2>
          </div>
          <div className="md:col-span-4 md:justify-self-end flex flex-col gap-3 w-full md:max-w-[280px]">
            <Link href="/request-a-quote" className="btn-primary justify-center group">
              Start a project
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link href="/contact" className="btn-ghost justify-center">Schedule a call</Link>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="container-apex relative py-20 md:py-28 grid gap-16 md:gap-20 md:grid-cols-12">
        <div className="md:col-span-5 space-y-8">
          <BrandMark size={80} invert />
          <p className="font-editorial italic text-2xl md:text-3xl text-bone leading-snug max-w-md">
            {siteConfig.tagline}
          </p>
          <p className="text-bone/60 text-base leading-relaxed max-w-md">
            A Lagos multi-disciplinary architecture, construction and interior design practice — shaping Nigeria&rsquo;s skyline with disciplined craft since {siteConfig.founded}.
          </p>
          <div className="space-y-3 text-sm text-bone/80 pt-4 border-t border-white/10">
            <p className="flex items-start gap-4">
              <MapPin className="h-4 w-4 mt-1 text-gold shrink-0" strokeWidth={1.5} />
              <span>{siteConfig.contact.address}</span>
            </p>
            <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-4 hover:text-gold transition-colors">
              <Mail className="h-4 w-4 text-gold shrink-0" strokeWidth={1.5} />
              <span>{siteConfig.contact.email}</span>
            </a>
            <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-4 hover:text-gold transition-colors">
              <Phone className="h-4 w-4 text-gold shrink-0" strokeWidth={1.5} />
              <span>{siteConfig.contact.phone}</span>
            </a>
            <p className="flex items-center gap-4 text-bone/60">
              <Clock className="h-4 w-4 text-gold shrink-0" strokeWidth={1.5} />
              <span>{siteConfig.contact.hours}</span>
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="eyebrow mb-6">Practice</p>
          <ul className="space-y-3.5 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-underline text-bone/80 hover:text-bone">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow mb-6">Services</p>
          <ul className="space-y-3.5 text-sm">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="link-underline text-bone/80 hover:text-bone">{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="eyebrow mb-6">Engage</p>
          <ul className="space-y-3.5 text-sm">
            <li><Link href="/request-a-quote" className="link-underline text-bone/80 hover:text-bone">Request a quote</Link></li>
            <li><Link href="/careers" className="link-underline text-bone/80 hover:text-bone">Careers</Link></li>
            <li><Link href="/trainees" className="link-underline text-bone/80 hover:text-bone">Internship</Link></li>
            <li><Link href="/journal" className="link-underline text-bone/80 hover:text-bone">Journal</Link></li>
            <li><Link href="/contact" className="link-underline text-bone/80 hover:text-bone">Contact</Link></li>
          </ul>
          <p className="eyebrow mt-10 mb-5">Follow</p>
          <div className="flex gap-3 items-center">
            <a aria-label="Facebook" href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center border border-white/15 hover:border-gold hover:text-gold transition"><Facebook className="h-4 w-4" strokeWidth={1.5} /></a>
            <a aria-label="Instagram" href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center border border-white/15 hover:border-gold hover:text-gold transition"><Instagram className="h-4 w-4" strokeWidth={1.5} /></a>
            <a aria-label="LinkedIn" href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center border border-white/15 hover:border-gold hover:text-gold transition"><Linkedin className="h-4 w-4" strokeWidth={1.5} /></a>
          </div>
        </div>
      </div>

      {/* Huge background wordmark */}
      <div aria-hidden className="relative overflow-hidden border-t border-white/10">
        <p className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display italic text-[26vw] md:text-[22vw] leading-none text-white/[0.03] tracking-tightest">
          Apex-Line
        </p>
        <div className="container-apex relative py-16 md:py-20 flex flex-col items-center gap-5">
          <Link
            href="/admin/login"
            aria-label="Studio admin sign in"
            title="Studio admin"
            className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-onyx/60 backdrop-blur-sm text-bone/50 hover:border-gold hover:text-gold transition-colors"
          >
            <Lock className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <p className="text-[10px] uppercase tracking-[0.24em] text-bone/30">Studio admin</p>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-apex flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-6 text-xs text-bone/50">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy" className="hover:text-bone">Privacy</Link>
            <Link href="/terms" className="hover:text-bone">Terms</Link>
            <span className="hidden md:inline text-bone/20">|</span>
            <a
              href="https://thalamux-tech.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold link-underline"
            >
              Built by ThalamuxTech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
