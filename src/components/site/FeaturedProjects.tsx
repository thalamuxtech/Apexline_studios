"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { projects } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";

const SECTORS = ["All", "Commercial", "Residential", "Hospitality", "Healthcare", "Corporate"];

function matchSector(p: (typeof projects)[number], s: string) {
  if (s === "All") return true;
  return p.sector.toLowerCase().includes(s.toLowerCase());
}

export function FeaturedProjects() {
  const [filter, setFilter] = useState("All");
  const [hovered, setHovered] = useState<string | null>(null);

  const list = useMemo(() => projects.filter((p) => matchSector(p, filter)).slice(0, 6), [filter]);

  return (
    <section className="relative section bg-onyx text-bone overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-25" />
      <div className="container-apex relative">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 md:mb-16">
          <div className="max-w-3xl">
            <Reveal><p className="eyebrow mb-4">Selected Work · 2019 — 2025</p></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-balance">
                Buildings that <em className="font-editorial italic text-gold">speak quietly</em>, and stand decisively.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <Link href="/projects" className="btn-ghost group self-start">
              All projects
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        {/* Sector filter */}
        <Reveal delay={0.15}>
          <div className="flex flex-wrap items-center gap-2 mb-10 md:mb-14">
            {SECTORS.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`text-[11px] uppercase tracking-[0.22em] px-4 py-2 border transition-colors duration-300 ${
                  filter === s ? "bg-gold text-onyx border-gold" : "border-white/15 text-bone/70 hover:text-bone hover:border-bone/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {list.length === 0 && (
              <p className="col-span-full text-bone/60">No projects in this sector yet. Coming soon.</p>
            )}
            {list.map((p, i) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setHovered(p.slug)}
                onMouseLeave={() => setHovered(null)}
              >
                <Link href={`/projects/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
                    <Image
                      src={p.cover}
                      alt={p.name}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1.2s] ease-apex group-hover:scale-[1.06]"
                    />
                    {/* Base gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/10 to-transparent" />

                    {/* Top-left index + year */}
                    <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                      <span className="font-mono text-[10px] text-gold bg-onyx/40 backdrop-blur-sm px-2 py-1">
                        {String(i + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.24em] text-bone/90 backdrop-blur-sm bg-onyx/40 px-2 py-1">
                        {p.sector}
                      </span>
                    </div>

                    {/* Hover overlay — scope preview */}
                    <AnimatePresence>
                      {hovered === p.slug && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 bg-gold/90 text-onyx p-6 md:p-8 flex flex-col justify-between"
                        >
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.22em] font-medium mb-3">Scope</p>
                            <p className="font-editorial italic text-xl md:text-2xl leading-snug">
                              {p.scope}
                            </p>
                          </div>
                          <div>
                            <p className="flex items-center gap-2 text-xs">
                              <MapPin className="h-3.5 w-3.5" /> {p.location}
                            </p>
                            <div className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-medium">
                              View case study <ArrowUpRight className="h-3.5 w-3.5" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Bottom caption (always visible, fades on hover) */}
                    <div className="absolute bottom-5 left-5 right-5 transition-opacity duration-300 group-hover:opacity-0">
                      <p className="font-mono text-[10px] text-gold mb-1">{p.year}</p>
                      <h3 className="font-display text-xl md:text-2xl text-bone leading-tight">{p.name}</h3>
                      <p className="mt-1 text-xs text-bone/70">{p.location}</p>
                    </div>
                  </div>

                  {/* Below-card title (for mobile where hover isn't available) */}
                  <div className="mt-4 md:hidden">
                    <p className="font-display text-lg">{p.name}</p>
                    <p className="text-xs text-bone/60 mt-1">{p.scope}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
