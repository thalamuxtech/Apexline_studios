"use client";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "10%"]);

  return (
    <section ref={ref} className="relative bg-bone overflow-hidden">
      {/* Huge translucent "15+" as decorative numeral */}
      <motion.p
        style={{ y: useTransform(scrollYProgress, [0, 1], ["10%", "-20%"]) }}
        className="pointer-events-none select-none absolute -top-10 md:-top-16 right-[-4vw] md:right-[-3vw] font-display text-[32vw] md:text-[22vw] leading-none tracking-tightest text-onyx/[0.04]"
        aria-hidden
      >
        15+
      </motion.p>

      <div className="section container-apex relative">
        <div className="grid gap-12 md:gap-20 md:grid-cols-12 items-start">
          {/* Left — portrait of craft */}
          <div className="md:col-span-5 md:sticky md:top-28">
            <Reveal>
              <p className="eyebrow mb-6">The Practice</p>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="relative aspect-[3/4] overflow-hidden">
                <motion.div style={{ y: imgY }} className="absolute inset-[-6%]">
                  <Image
                    src="/hero/hero-site.jpg"
                    alt="On site with Apex-Line Studios"
                    fill
                    sizes="(min-width:768px) 40vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 border border-onyx/10" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-xs">
                  <span className="bg-onyx text-bone px-2.5 py-1 uppercase tracking-[0.22em]">On site</span>
                  <span className="font-mono text-bone bg-onyx/80 px-2.5 py-1">2025</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right — editorial text */}
          <div className="md:col-span-7 md:pl-6 lg:pl-10 space-y-7">
            <Reveal>
              <h2 className="font-display text-4xl md:text-6xl leading-[1.02] text-balance">
                Architecture that <em className="font-editorial italic text-gold">earns the ground</em> it stands on.
              </h2>
            </Reveal>

            <Reveal delay={0.05}>
              <p className="text-onyx/80 text-lg md:text-xl leading-relaxed font-light max-w-2xl">
                Apex-Line Studios is a Lagos multi-disciplinary practice led by
                <span className="text-onyx"> Arc. Sumaila Onimisi Yusuf</span> — delivering architecture, construction, interior and exterior design for institutional, commercial and residential clients across Nigeria.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <blockquote className="border-l-2 border-gold pl-6 py-2 font-editorial italic text-2xl md:text-3xl text-onyx leading-snug max-w-xl">
                &ldquo;Every line we draw is a commitment we will honour on site.&rdquo;
              </blockquote>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="text-onyx/70 text-base md:text-lg leading-relaxed max-w-2xl">
                From remodelling Access Bank&rsquo;s Victoria Island annex, to Shell&rsquo;s sixteen-floor Marina rebuild and estate-scale housing at Twin Lakes — our portfolio is a record of disciplined delivery: on time, to standard, in service of the client&rsquo;s long view.
              </p>
            </Reveal>

            {/* Three-column accolade row */}
            <Reveal delay={0.2}>
              <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 border-t border-onyx/10 pt-8">
                <Accolade label="Years of practice" value="15+" />
                <Accolade label="Projects delivered" value="150+" />
                <Accolade label="Sector clients" value="40+" />
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="pt-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-onyx/15" />
                <p className="font-editorial italic text-onyx">— Arc. Sumaila O. Yusuf, Principal</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Accolade({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-4xl md:text-5xl leading-none">{value}</p>
      <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-stone">{label}</p>
    </div>
  );
}
