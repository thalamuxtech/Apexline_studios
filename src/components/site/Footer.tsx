import Link from "next/link";
import { Instagram, Linkedin, Lock, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig, navLinks } from "@/content/site";
import { BrandMark } from "./BrandMark";

export function Footer() {
  return (
    <footer className="relative bg-onyx text-bone overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-40" aria-hidden />
      <div className="container-apex relative py-16 md:py-24 grid gap-12 md:gap-16 md:grid-cols-12">
        <div className="md:col-span-5 space-y-6">
          <BrandMark size={64} invert />
          <p className="text-bone/50 text-sm max-w-md leading-relaxed">
            Architecture, construction and interior design practice shaping
            Nigeria&rsquo;s skyline — {siteConfig.founded} to date.
          </p>
          <p className="text-stone font-editorial text-xl md:text-2xl italic leading-snug max-w-md">
            {siteConfig.tagline}
          </p>
          <div className="space-y-2 text-sm text-bone/70">
            <p className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-1 text-gold shrink-0" /> {siteConfig.contact.address}</p>
            <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-gold shrink-0" /> {siteConfig.contact.email}</p>
            <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-gold shrink-0" /> {siteConfig.contact.phone}</p>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow mb-5">Practice</p>
          <ul className="space-y-3 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-underline text-bone/80 hover:text-bone">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="eyebrow mb-5">Engage</p>
          <ul className="space-y-3 text-sm">
            <li><Link href="/request-a-quote" className="link-underline text-bone/80 hover:text-bone">Request a quote</Link></li>
            <li><Link href="/careers" className="link-underline text-bone/80 hover:text-bone">Careers</Link></li>
            <li><Link href="/trainees" className="link-underline text-bone/80 hover:text-bone">Internship</Link></li>
            <li><Link href="/contact" className="link-underline text-bone/80 hover:text-bone">Contact</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="eyebrow mb-5">Connect</p>
          <div className="flex gap-4 items-center">
            <a aria-label="Instagram" href={siteConfig.social.instagram} className="p-2 border border-white/10 hover:border-gold hover:text-gold transition"><Instagram className="h-4 w-4" /></a>
            <a aria-label="LinkedIn" href={siteConfig.social.linkedin} className="p-2 border border-white/10 hover:border-gold hover:text-gold transition"><Linkedin className="h-4 w-4" /></a>
          </div>
          <p className="mt-6 text-xs text-bone/50">{siteConfig.contact.hours}</p>
        </div>
      </div>

      <div className="relative flex justify-center pb-4">
        <Link
          href="/admin/login"
          aria-label="Studio admin sign in"
          title="Studio admin"
          className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-onyx/40 backdrop-blur-sm text-bone/40 hover:border-gold hover:text-gold transition-colors"
        >
          <Lock className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
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
