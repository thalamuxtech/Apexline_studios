"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";

export function FeaturedProjects() {
  const featured = projects.filter((p) => p.featured).slice(0, 6);
  return (
    <section className="section bg-onyx text-bone relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-30" />
      <div className="container-apex relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-20">
          <div>
            <Reveal><p className="eyebrow mb-4">Selected Work — 2019 to 2025</p></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl md:text-6xl text-balance leading-tight">
                Buildings that <em className="font-editorial text-gold">speak quietly</em>, and stand decisively.
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

        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <Link href={`/projects/${p.slug}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
                  <Image
                    src={p.cover}
                    alt={p.name}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] ease-apex group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/10 to-transparent" />
                  <div className="absolute left-5 top-5 right-5 flex items-start justify-between">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-bone/80 backdrop-blur-sm bg-onyx/30 px-2 py-1">
                      {p.sector}
                    </span>
                    <span className="text-[10px] font-mono text-gold">{p.year}</span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="font-display text-xl md:text-2xl text-bone leading-tight">{p.name}</h3>
                    <p className="mt-1 text-xs text-bone/70">{p.location}</p>
                    <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-gold opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                      View case study <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
