"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { siteConfig } from "@/content/site";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-onyx text-bone">
      <div className="absolute inset-0">
        <Image
          src="/hero/hero-primary.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-onyx/70 via-onyx/40 to-onyx/90" />
        <div className="absolute inset-0 blueprint-grid opacity-20 mix-blend-overlay" />
      </div>

      <div className="relative container-apex flex min-h-[100svh] flex-col justify-between pt-28 md:pt-32 pb-10 md:pb-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="eyebrow"
        >
          EST. {siteConfig.founded} &nbsp;|&nbsp; Lagos, Nigeria
        </motion.p>

        <div className="flex-1 flex items-center py-10 md:py-16">
          <div className="max-w-5xl">
            <h1 className="font-display text-display-l md:text-display-xl italic leading-[0.95] text-bone">
              <motion.span
                initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0 0 0)" }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                Where Excellence
              </motion.span>
              <motion.span
                initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0 0 0)" }}
                transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="block text-gold"
              >
                Stands.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.7 }}
              className="mt-8 md:mt-10 max-w-xl text-base md:text-lg text-bone/80 leading-relaxed font-light"
            >
              Apex-Line Studios is an architecture, construction and interior design practice shaping Nigeria's skyline with over fifteen years of disciplined craft.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.9 }}
              className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link href="/projects" className="btn-primary group">
                Explore our work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/request-a-quote" className="btn-ghost">
                Start a project
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1 }}
          className="flex items-end justify-between gap-6"
        >
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-bone/60">
            <span className="h-px w-10 bg-gold" />
            <span className="hidden sm:inline">Scroll to discover</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </div>
          <div className="text-right">
            <p className="eyebrow text-bone/60">Year</p>
            <p className="font-display text-2xl md:text-3xl text-bone">{new Date().getFullYear()}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
