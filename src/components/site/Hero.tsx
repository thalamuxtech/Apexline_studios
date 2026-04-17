"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown, PlayCircle } from "lucide-react";
import { siteConfig } from "@/content/site";

const HERO_PLATES = [
  { src: "/hero/hero-primary.jpg", label: "Marion Apartment", sector: "Luxury Residential", year: "2025" },
  { src: "/hero/hero-alt.jpg", label: "ED Marina", sector: "Heritage Commercial", year: "2020" },
  { src: "/hero/hero-craft.jpg", label: "Shell FMH, Marina", sector: "Corporate Facilities", year: "2024" },
];

export function Hero() {
  const [active, setActive] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % HERO_PLATES.length), 6500);
    return () => clearInterval(t);
  }, []);

  const plate = HERO_PLATES[active];

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-onyx text-bone">
      {/* Background plate (crossfades) */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={plate.src}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image src={plate.src} alt="" fill priority sizes="100vw" className="object-cover object-center" />
          </motion.div>
        </AnimatePresence>
        {/* Layered gradients for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-onyx/80 via-onyx/40 to-onyx/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-onyx/70 via-transparent to-onyx/40" />
        <div className="absolute inset-0 blueprint-grid opacity-20 mix-blend-overlay" />
      </motion.div>

      {/* Vertical frame rules */}
      <div className="pointer-events-none absolute inset-y-0 left-6 md:left-10 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-6 md:right-10 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />

      <div className="relative container-apex flex min-h-[100svh] flex-col justify-between pt-36 md:pt-44 pb-10 md:pb-14">
        {/* Top eyebrow */}
        <div className="flex items-center justify-between gap-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="eyebrow flex items-center gap-3"
          >
            <span className="h-px w-10 bg-gold" />
            EST. {siteConfig.founded} &nbsp;·&nbsp; Lagos, Nigeria
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-bone/60"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            Accepting 2026 commissions
          </motion.div>
        </div>

        {/* Middle — headline + active plate metadata */}
        <div className="flex-1 grid md:grid-cols-12 gap-10 items-end py-14 md:py-20">
          <div className="md:col-span-8">
            <motion.h1
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
              className="font-display leading-[0.92] text-balance text-[clamp(3rem,10vw,9.5rem)]"
            >
              <motion.span
                initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0 0 0)" }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="block text-bone font-light italic"
              >Where</motion.span>
              <motion.span
                initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0 0 0)" }}
                transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="block text-bone"
              >Excellence</motion.span>
              <motion.span
                initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0 0 0)" }}
                transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="block text-gold font-light italic"
              >Stands.</motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.8 }}
              className="mt-8 md:mt-10 max-w-xl text-base md:text-lg text-bone/80 leading-relaxed font-light"
            >
              A Lagos-based architecture, construction and interior design practice shaping Nigeria&rsquo;s skyline with
              over fifteen years of disciplined craft.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.0 }}
              className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link href="/projects" className="btn-primary group">
                Explore our work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/request-a-quote" className="btn-ghost group">
                <PlayCircle className="h-4 w-4 text-gold" strokeWidth={1.5} />
                Start a project
              </Link>
            </motion.div>
          </div>

          {/* Plate metadata card — right rail */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 1.2 }}
            className="md:col-span-4 md:justify-self-end w-full md:max-w-[280px]"
          >
            <div className="bg-onyx/50 backdrop-blur-md border border-white/10 p-5 md:p-6">
              <p className="eyebrow mb-4">Now showing</p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={plate.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="font-display text-2xl md:text-3xl leading-tight">{plate.label}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-bone/70">
                    <span className="uppercase tracking-[0.18em]">{plate.sector}</span>
                    <span className="font-mono text-gold">{plate.year}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="mt-5 flex gap-1.5">
                {HERO_PLATES.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Show plate ${i + 1}`}
                    onClick={() => setActive(i)}
                    className={`h-[2px] flex-1 transition-all duration-500 ${i === active ? "bg-gold" : "bg-bone/25 hover:bg-bone/50"}`}
                  />
                ))}
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Bottom strip */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
          className="flex items-end justify-between gap-6 border-t border-white/10 pt-5"
        >
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-bone/60">
            <span className="h-px w-6 md:w-10 bg-gold" />
            <span className="hidden sm:inline">Scroll to discover</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </div>
          <div className="flex items-center gap-6 md:gap-10">
            <div className="hidden md:block text-right">
              <p className="eyebrow text-bone/50 mb-1">Projects</p>
              <p className="font-display text-xl md:text-2xl">150<span className="text-gold">+</span></p>
            </div>
            <div className="hidden md:block text-right">
              <p className="eyebrow text-bone/50 mb-1">Years</p>
              <p className="font-display text-xl md:text-2xl">15<span className="text-gold">+</span></p>
            </div>
            <div className="text-right">
              <p className="eyebrow text-bone/50 mb-1">Year</p>
              <p className="font-display text-xl md:text-2xl text-bone">{new Date().getFullYear()}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
