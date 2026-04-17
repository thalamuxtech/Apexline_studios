import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export function CtaBand() {
  return (
    <section className="bg-onyx text-bone section relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 blueprint-grid opacity-30" />
      <div className="container-apex relative">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-8">
            <Reveal><p className="eyebrow mb-4">Begin a Conversation</p></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl md:text-6xl leading-tight">
                When the brief must not fail, the studio you want is the one <em className="font-editorial italic text-gold">Lagos already trusts</em>.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-bone/70 text-lg max-w-2xl leading-relaxed">
                Fifteen years. One hundred and fifty buildings. A single uncompromising standard — delivered on time, without drama.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-4 flex flex-col gap-3">
            <Reveal delay={0.2}>
              <Link href="/request-a-quote" className="btn-primary w-full justify-center group">
                Start a project <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
            <Reveal delay={0.25}>
              <Link href="/contact" className="btn-ghost w-full justify-center">Schedule a call</Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
