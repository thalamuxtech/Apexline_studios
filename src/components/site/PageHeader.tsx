import { Reveal } from "@/components/motion/Reveal";

export function PageHeader({
  eyebrow, title, lead, align = "left",
}: { eyebrow?: string; title: string; lead?: string; align?: "left" | "center" }) {
  return (
    <header className="relative bg-onyx text-bone overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="absolute inset-0 blueprint-grid opacity-20" />
      <div className="container-apex relative">
        <div className={align === "center" ? "max-w-3xl mx-auto text-center" : "max-w-4xl"}>
          {eyebrow && <Reveal><p className="eyebrow mb-5">{eyebrow}</p></Reveal>}
          <Reveal delay={0.1}>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.98] text-balance">
              {title}
            </h1>
          </Reveal>
          {lead && (
            <Reveal delay={0.2}>
              <p className="mt-8 text-lg md:text-xl text-bone/70 max-w-2xl leading-relaxed">{lead}</p>
            </Reveal>
          )}
        </div>
      </div>
    </header>
  );
}
