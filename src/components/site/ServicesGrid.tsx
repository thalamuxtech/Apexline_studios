"use client";
import Link from "next/link";
import { ArrowUpRight, Compass, HardHat, Sofa, Trees, Hammer, FileText, type LucideIcon } from "lucide-react";
import { services } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";

const ICONS: Record<string, LucideIcon> = {
  Compass, HardHat, Sofa, Trees, Hammer, FileText,
};

export function ServicesGrid({ compact = false }: { compact?: boolean }) {
  return (
    <section className="section bg-bone">
      <div className="container-apex">
        <div className="grid md:grid-cols-12 gap-8 mb-12 md:mb-16">
          <div className="md:col-span-5">
            <Reveal><p className="eyebrow mb-4">What we do</p></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl leading-tight text-balance">
                A single studio, <em className="font-editorial text-gold">end-to-end</em> delivery.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7 pt-2">
            <Reveal delay={0.15}>
              <p className="text-lg text-stone leading-relaxed">
                Architecture, construction and interior disciplines housed under one roof — so every decision, from the first sketch to the last tile, is made by the same hands that signed the brief.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="grid gap-px bg-onyx/10 sm:grid-cols-2 lg:grid-cols-3 border border-onyx/10">
          {services.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Compass;
            return (
              <Reveal key={s.slug} delay={i * 0.06}>
                <Link
                  href={`/services/${s.slug}`}
                  className="relative block bg-bone p-8 md:p-10 h-full transition-colors duration-500 hover:bg-onyx hover:text-bone group"
                >
                  <div className="flex items-start justify-between mb-8 md:mb-12">
                    <Icon className="h-8 w-8 text-gold" strokeWidth={1.25} />
                    <ArrowUpRight className="h-5 w-5 text-onyx/50 group-hover:text-gold transition-colors" />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl leading-tight mb-4">{s.title}</h3>
                  {!compact && <p className="text-sm text-stone group-hover:text-bone/70 transition-colors leading-relaxed">{s.summary}</p>}
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
