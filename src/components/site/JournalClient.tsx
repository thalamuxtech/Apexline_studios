"use client";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/site/Nav";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { useJournal } from "@/lib/useSiteContent";

export function JournalClient() {
  const { articles } = useJournal();

  return (
    <>
      <Nav />
      <PageHeader eyebrow="Journal" title="Writings on craft, construction and the Lagos context." lead="Short essays and case notes from the studio — on material, method and the discipline of delivering buildings that last." />

      <section className="section bg-bone">
        <div className="container-apex">
          {articles.length === 0 ? (
            <p className="text-stone">No journal entries yet. Check back soon.</p>
          ) : (
            <div className="grid gap-10 md:grid-cols-3">
              {articles.map((a, i) => (
                <Reveal key={a.slug} delay={i * 0.05}>
                  <Link href={`/journal/${a.slug}`} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
                      {a.image && <Image src={a.image} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" />}
                    </div>
                    <p className="mt-5 font-mono text-xs text-gold">{a.date}</p>
                    <h3 className="mt-2 font-display text-2xl md:text-3xl leading-tight">{a.title}</h3>
                    <p className="mt-3 text-stone leading-relaxed">{a.excerpt}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
