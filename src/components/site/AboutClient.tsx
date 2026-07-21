"use client";
import Image from "next/image";
import { Nav } from "@/components/site/Nav";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Stats } from "@/components/site/Stats";
import { CtaBand } from "@/components/site/CtaBand";
import { useAbout } from "@/lib/useSiteContent";

export function AboutClient() {
  const { about } = useAbout();

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
              <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
                {about.imageSrc && <Image src={about.imageSrc} alt="On site with the studio" fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />}
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-7 space-y-6">
            <Reveal><p className="eyebrow">{about.principalEyebrow}</p></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl leading-tight">{about.principalName}</h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-editorial italic text-xl md:text-2xl text-stone leading-snug">
                &ldquo;{about.principalQuote}&rdquo;
              </p>
            </Reveal>
            {about.principalBio.map((para, i) => (
              <Reveal key={i} delay={0.3 + i * 0.1}>
                <p className="text-stone text-lg leading-relaxed">{para}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {about.milestones.length > 0 && (
        <section className="section bg-graphite text-bone">
          <div className="container-apex">
            <Reveal><p className="eyebrow mb-6">Milestones</p></Reveal>
            <Reveal delay={0.1}><h2 className="font-display text-4xl md:text-5xl mb-14 leading-tight">{about.milestonesTitle}</h2></Reveal>

            <ol className="relative border-l border-white/10 pl-8 md:pl-12 space-y-10">
              {about.milestones.map((m, i) => (
                <Reveal key={i} delay={i * 0.05}>
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
      )}

      <Stats />
      <CtaBand />
    </>
  );
}
