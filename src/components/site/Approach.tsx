"use client";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { Compass, Hammer, Ruler, ShieldCheck } from "lucide-react";

const PILLARS = [
  {
    key: "design",
    title: "Design",
    eyebrow: "01",
    icon: Compass,
    body: "Sketch-led, site-aware design that resolves form, material and experience at every scale — residential to civic.",
    image: "/projects/marion-apartment/02.jpg",
  },
  {
    key: "craft",
    title: "Craft",
    eyebrow: "02",
    icon: Ruler,
    body: "Detail drawings honoured on site. Tolerances held. Finishes specified and verified to international standards.",
    image: "/projects/shell-fmh-upgrade/08.jpg",
  },
  {
    key: "delivery",
    title: "Delivery",
    eyebrow: "03",
    icon: Hammer,
    body: "Direct site leadership keeps schedule, cost, safety and quality aligned — day by day, trade by trade.",
    image: "/projects/chevron-housing/02.jpg",
  },
  {
    key: "care",
    title: "Care",
    eyebrow: "04",
    icon: ShieldCheck,
    body: "Commissioning, snagging and aftercare until every room, system and surface performs as the drawings promised.",
    image: "/projects/ed-marina/01.jpg",
  },
];

export function Approach() {
  const [active, setActive] = useState(PILLARS[0].key);
  const current = PILLARS.find((p) => p.key === active) ?? PILLARS[0];

  return (
    <section className="section bg-bone border-y border-onyx/10">
      <div className="container-apex">
        <div className="grid gap-10 md:grid-cols-12 mb-12 md:mb-16">
          <div className="md:col-span-5">
            <Reveal><p className="eyebrow mb-4">Our Approach</p></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl leading-[1.05] text-balance">
                Four disciplines, <em className="font-editorial italic text-gold">one studio</em>.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7 pt-1">
            <Reveal delay={0.2}>
              <p className="text-stone text-lg leading-relaxed">
                Design, craft, delivery and care — carried end to end by the same hands that signed the brief. Hover or tap each pillar to see it at work.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Interactive split */}
        <div className="grid md:grid-cols-12 gap-8 lg:gap-12">
          {/* Pillar list (left on desktop, top on mobile) */}
          <ul className="md:col-span-5 flex flex-col divide-y divide-onyx/10 border-t border-b border-onyx/10">
            {PILLARS.map((p) => {
              const isActive = p.key === active;
              return (
                <li key={p.key}>
                  <button
                    onMouseEnter={() => setActive(p.key)}
                    onFocus={() => setActive(p.key)}
                    onClick={() => setActive(p.key)}
                    className="group w-full text-left py-6 md:py-8 px-1 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className={`font-mono text-sm transition-colors ${isActive ? "text-gold" : "text-stone/60"}`}>{p.eyebrow}</span>
                        <h3 className={`font-display text-3xl md:text-4xl leading-tight transition-colors ${isActive ? "text-onyx" : "text-onyx/50 group-hover:text-onyx/80"}`}>
                          {p.title}
                        </h3>
                      </div>
                      <p.icon className={`h-5 w-5 transition-colors ${isActive ? "text-gold" : "text-stone/40"}`} strokeWidth={1.5} />
                    </div>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.p
                          key="body"
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          className="text-stone leading-relaxed max-w-md overflow-hidden"
                        >
                          {p.body}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Preview pane */}
          <div className="md:col-span-7 relative aspect-[4/5] md:aspect-[4/5] md:sticky md:top-28 self-start overflow-hidden bg-graphite">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.key}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image src={current.image} alt="" fill sizes="(min-width:768px) 55vw, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-onyx/70 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-5 left-5 right-5 text-bone">
              <p className="eyebrow text-gold">{current.eyebrow} — Pillar</p>
              <p className="mt-1 font-display text-3xl md:text-4xl">{current.title}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
