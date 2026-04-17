"use client";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { stats } from "@/content/site";

function Counter({ to }: { to: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const match = to.match(/(\d+)/);
  const num = match ? parseInt(match[1], 10) : 0;
  const suffix = to.replace(/\d+/, "");
  const rounded = useTransform(mv, (v) => Math.round(v).toString() + suffix);

  useEffect(() => {
    if (inView) animate(mv, num, { duration: 2, ease: [0.22, 1, 0.36, 1] });
  }, [inView, mv, num]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export function Stats() {
  return (
    <section className="bg-onyx text-bone py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-20" />
      <div className="container-apex relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-4 md:gap-x-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="border-t border-gold/40 pt-6 md:pt-8"
            >
              <p className="font-display text-5xl md:text-7xl text-bone leading-none">
                <Counter to={s.value} />
              </p>
              <p className="mt-3 text-xs md:text-sm uppercase tracking-[0.22em] text-bone/60">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
