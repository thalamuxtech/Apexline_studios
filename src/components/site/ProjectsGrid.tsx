"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { useManagedProjects } from "@/lib/useManagedProjects";

export function ProjectsGrid() {
  const { projects, loading, error } = useManagedProjects();

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center gap-3 text-sm text-stone">
          <Loader2 className="h-4 w-4 animate-spin text-gold" /> Loading managed portfolio...
        </div>
      )}
      {error && <p className="text-sm text-stone">{error} Showing the saved site portfolio.</p>}
      <div className="grid gap-8 md:gap-10 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 4) * 0.05}>
            <Link href={`/projects/${p.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-graphite">
                <Image src={p.cover} alt={p.name} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-apex group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 via-transparent to-transparent" />
                <span className="absolute left-5 top-5 text-[10px] uppercase tracking-[0.24em] text-bone backdrop-blur-sm bg-onyx/30 px-2 py-1">
                  {p.sector}
                </span>
              </div>
              <div className="mt-5 flex items-start justify-between gap-6">
                <div>
                  <p className="font-mono text-xs text-gold">{p.year}</p>
                  <h2 className="mt-1 font-display text-2xl md:text-3xl">{p.name}</h2>
                  <p className="mt-1 text-sm text-stone">{p.location}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-onyx/60 group-hover:text-gold mt-2 transition-colors" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
