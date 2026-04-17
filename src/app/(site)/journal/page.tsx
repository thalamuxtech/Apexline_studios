import { Nav } from "@/components/site/Nav";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import Image from "next/image";

export const metadata = { title: "Journal", description: "Writings on architecture, construction and material culture from Apex-Line Studios." };

const articles = [
  { title: "On disciplined site craft", excerpt: "Why the quietest projects we deliver are also the most demanding.", image: "/site/site-10.jpg", date: "2026 · Editorial" },
  { title: "Marina, rebuilt", excerpt: "Notes from a sixteen-floor upgrade and what facilities-grade finishing really means.", image: "/site/site-15.jpg", date: "2025 · Case Notes" },
  { title: "Material restraint", excerpt: "A short argument for doing less, done better — in finishes and in specification.", image: "/site/site-18.jpg", date: "2025 · Essay" },
];

export default function JournalPage() {
  return (
    <>
      <Nav />
      <PageHeader eyebrow="Journal" title="Writings on craft, construction and the Lagos context." lead="Short essays and case notes from the studio — on material, method and the discipline of delivering buildings that last." />

      <section className="section bg-bone">
        <div className="container-apex grid gap-10 md:grid-cols-3">
          {articles.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.05}>
              <article className="group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image src={a.image} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                </div>
                <p className="mt-5 font-mono text-xs text-gold">{a.date}</p>
                <h3 className="mt-2 font-display text-2xl md:text-3xl leading-tight">{a.title}</h3>
                <p className="mt-3 text-stone leading-relaxed">{a.excerpt}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
