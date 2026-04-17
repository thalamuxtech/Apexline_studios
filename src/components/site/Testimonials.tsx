"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { testimonials } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % testimonials.length), 8000);
    return () => clearInterval(t);
  }, []);
  const t = testimonials[i];
  return (
    <section className="section bg-bone">
      <div className="container-apex">
        <Reveal><p className="eyebrow mb-8">Client Voices</p></Reveal>
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-2">
            <Reveal><span className="font-display text-8xl md:text-9xl text-gold leading-none">&ldquo;</span></Reveal>
          </div>
          <div className="md:col-span-10 min-h-[240px] md:min-h-[200px] relative">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6 }}
                className="font-editorial italic text-2xl md:text-4xl leading-snug text-onyx text-balance"
              >
                {t.quote}
                <footer className="mt-8 text-sm not-italic font-sans text-stone uppercase tracking-[0.2em]">
                  {t.author} &nbsp;·&nbsp; <span className="text-gold">{t.role}</span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
            <div className="mt-8 flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className={`h-px transition-all duration-500 ${idx === i ? "w-12 bg-gold" : "w-8 bg-onyx/20 hover:bg-onyx/40"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
