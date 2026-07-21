"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { useJournal, type JournalArticle } from "@/lib/useSiteContent";

export function JournalDetailClient({ slug: injectedSlug }: { slug?: string }) {
  const { articles, loading } = useJournal(false);
  const [urlSlug, setUrlSlug] = useState(injectedSlug ?? "");

  useEffect(() => {
    if (injectedSlug) return;
    const parts = window.location.pathname.split("/").filter(Boolean);
    setUrlSlug(decodeURIComponent(parts[parts.length - 1] ?? ""));
  }, [injectedSlug]);

  const slug = injectedSlug || urlSlug;
  const article: JournalArticle | undefined = useMemo(() => articles.find((a) => a.slug === slug), [articles, slug]);

  if (loading && !article) {
    return (
      <>
        <Nav />
        <div className="grid min-h-[60svh] place-items-center bg-bone"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Nav />
        <div className="container-apex flex min-h-[60svh] flex-col items-center justify-center gap-4 text-center">
          <p className="eyebrow text-gold">Article not found</p>
          <h1 className="font-display text-4xl">This journal entry isn&rsquo;t available.</h1>
          <Link href="/journal" className="btn-ghost mt-4">All entries</Link>
        </div>
        <CtaBand />
      </>
    );
  }

  return (
    <>
      <Nav variant="dark" />
      <section className="relative min-h-[60svh] bg-onyx text-bone overflow-hidden">
        {article.image && <Image src={article.image} alt={article.title} fill priority sizes="100vw" className="object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-b from-onyx/70 via-onyx/40 to-onyx/95" />
        <div className="relative container-apex flex min-h-[60svh] flex-col justify-end pt-36 pb-16 md:pt-44 md:pb-24">
          <Reveal><p className="eyebrow mb-5 text-gold">{article.date}</p></Reveal>
          <Reveal delay={0.1}><h1 className="font-display text-4xl md:text-7xl leading-[0.98] text-balance max-w-4xl">{article.title}</h1></Reveal>
        </div>
      </section>

      <section className="section bg-bone">
        <div className="container-apex max-w-3xl">
          <Reveal>
            <p className="font-editorial italic text-2xl md:text-3xl text-onyx leading-snug">{article.excerpt}</p>
          </Reveal>
          {article.body && (
            <div className="mt-10 space-y-6 text-stone text-lg leading-relaxed">
              {article.body.split(/\n\n+/).map((para, i) => (
                <Reveal key={i} delay={i * 0.03}><p>{para}</p></Reveal>
              ))}
            </div>
          )}
          <div className="mt-12">
            <Link href="/journal" className="inline-flex items-center gap-2 text-onyx font-medium link-underline">
              <ArrowLeft className="h-4 w-4" /> Back to journal
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
