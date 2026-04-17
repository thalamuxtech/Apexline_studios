import { processSteps } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";

export function Process() {
  return (
    <section className="section bg-graphite text-bone relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-25" />
      <div className="container-apex relative">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 mb-14">
          <div className="md:col-span-5">
            <Reveal><p className="eyebrow mb-4">Our Method · Why Excellence Stands</p></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl leading-tight">
                Six unwavering standards the studio is <em className="font-editorial text-gold">known for</em>.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7 pt-1 space-y-5">
            <Reveal delay={0.2}>
              <p className="text-bone/80 text-lg leading-relaxed">
                Excellence, for us, is not a claim — it is a method. Every phase has a deliverable, a sign-off and a principal personally accountable for it. It is the reason clients from Shell to Access Bank return, and the reason our projects finish on time, to international standard, without drama.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="font-editorial italic text-gold text-xl md:text-2xl leading-snug">
                Fifteen years. One hundred and fifty buildings. A single standard.
              </p>
            </Reveal>
          </div>
        </div>

        <ol className="grid gap-px bg-white/10 md:grid-cols-3 border-t border-b border-white/10">
          {processSteps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.05}>
              <li className="bg-graphite p-8 md:p-10 h-full">
                <p className="font-mono text-xs text-gold">{step.number}</p>
                <h3 className="mt-4 font-display text-2xl md:text-3xl">{step.title}</h3>
                <p className="mt-3 text-sm text-bone/70 leading-relaxed">{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
