import { Reveal } from "@/components/motion/Reveal";

export function Manifesto() {
  return (
    <section className="section bg-bone">
      <div className="container-apex grid gap-12 md:gap-16 md:grid-cols-12 items-start">
        <div className="md:col-span-5">
          <Reveal>
            <p className="eyebrow mb-6">A Lagos Practice</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-display text-[22vw] md:text-[12vw] leading-[0.82] tracking-tightest">15<span className="text-gold">+</span></p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-sm uppercase tracking-[0.2em] text-stone">Years building landmarks across Nigeria</p>
          </Reveal>
        </div>

        <div className="md:col-span-7 md:pl-8 lg:pl-12 space-y-6 text-stone text-lg md:text-xl leading-relaxed font-light">
          <Reveal>
            <p className="text-onyx font-editorial italic text-2xl md:text-3xl leading-snug">
              We draw, detail, and build with a singular conviction — that architecture must earn the ground it stands on.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              Founded by Arc. Sumaila Onimisi Yusuf, Apex-Line Studios is a Lagos-based multi-disciplinary practice delivering architecture, construction, interior and exterior design for institutional, commercial and residential clients.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p>
              From the remodelling of Access Bank&rsquo;s Victoria Island annex to Shell&rsquo;s Marina facility rebuild and estate-scale housing across Lagos, our portfolio is a record of disciplined delivery — on time, to standard, and in service of the client&rsquo;s long view.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="pt-4 flex items-center gap-4">
              <div className="h-px flex-1 bg-onyx/10" />
              <p className="font-editorial italic text-onyx">— Arc. Sumaila O. Yusuf, Principal</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
