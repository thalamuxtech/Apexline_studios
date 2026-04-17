import Image from "next/image";
import { Nav } from "@/components/site/Nav";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Stats } from "@/components/site/Stats";
import { CtaBand } from "@/components/site/CtaBand";

export const metadata = { title: "Studio", description: "The practice, the principal, and the philosophy behind Apex-Line Studios." };

const milestones = [
  { year: "2009", title: "Practice founded", body: "Arc. Sumaila Onimisi Yusuf launches Apex-Line Studios in Lagos, after formative years leading residential delivery in Abuja." },
  { year: "2014", title: "First major institutional project", body: "Victoria Island commercial remodelling commissions establish the studio's reputation for disciplined finishing." },
  { year: "2018", title: "Corporate client expansion", body: "Facilities programmes for multinationals including Shell and Chevron anchor the practice's commercial portfolio." },
  { year: "2022", title: "Healthcare & hospitality", body: "Duchess Hospital and George Hotel Annex extend the studio's reach across sectors." },
  { year: "2024", title: "Sixteen-floor Shell upgrade", body: "FMH Broad Street programme completes to world-class operational standard." },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <PageHeader
        eyebrow="The Studio"
        title="Architecture, built with the same hands that signed the brief."
        lead="Apex-Line Studios is an architecture, construction and interior design practice in Lagos, founded on a simple conviction: that a building must earn the ground it stands on."
      />

      <section className="section bg-bone">
        <div className="container-apex grid md:grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="md:col-span-5">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src="/site/site-04.jpg" alt="On site with the studio" fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-7 space-y-6">
            <Reveal><p className="eyebrow">The Principal</p></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl leading-tight">Arc. Sumaila Onimisi Yusuf</h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-editorial italic text-xl md:text-2xl text-stone leading-snug">
                &ldquo;Every line we draw is a commitment we will honour on site.&rdquo;
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="text-stone text-lg leading-relaxed">
                Trained as an architect with a B-Tech in technology, the principal cut his professional teeth supervising the delivery of ten duplex buildings at BUA Estate, Abuja. Fifteen years on, his hands-on approach still defines how Apex-Line Studios operates — from sketch to snagging.
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <p className="text-stone text-lg leading-relaxed">
                Under his direction, the practice has delivered remodellings for Access Bank, estate-scale housing at Twin Lakes, institutional healthcare in Ikeja and a full sixteen-floor rebuild for Shell on Broad Street — each one held to the same uncompromising standard.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-graphite text-bone">
        <div className="container-apex">
          <Reveal><p className="eyebrow mb-6">Milestones</p></Reveal>
          <Reveal delay={0.1}><h2 className="font-display text-4xl md:text-5xl mb-14 leading-tight">A record of growth, built project by project.</h2></Reveal>

          <ol className="relative border-l border-white/10 pl-8 md:pl-12 space-y-10">
            {milestones.map((m, i) => (
              <Reveal key={m.year} delay={i * 0.05}>
                <li className="relative">
                  <span className="absolute -left-[calc(2rem+6px)] md:-left-[calc(3rem+6px)] top-2 h-3 w-3 rounded-full bg-gold ring-4 ring-graphite" />
                  <p className="font-mono text-gold text-sm mb-2">{m.year}</p>
                  <h3 className="font-display text-2xl md:text-3xl">{m.title}</h3>
                  <p className="mt-2 text-bone/70 leading-relaxed max-w-2xl">{m.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <Stats />
      <CtaBand />
    </>
  );
}
