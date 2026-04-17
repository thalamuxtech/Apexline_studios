import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { projects } from "@/content/site";
import { Nav } from "@/components/site/Nav";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/site/CtaBand";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return { title: p?.name ?? "Project", description: p?.brief };
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <>
      <Nav variant="dark" />
      <section className="relative min-h-[90svh] bg-onyx text-bone overflow-hidden">
        <Image src={project.cover} alt={project.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-onyx/60 via-onyx/30 to-onyx/90" />
        <div className="relative container-apex pt-36 pb-16 md:pt-44 md:pb-24 min-h-[90svh] flex flex-col justify-end">
          <Reveal><p className="eyebrow mb-5">{project.sector} · {project.year}</p></Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-5xl md:text-8xl leading-[0.95] text-balance">{project.name}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 flex items-center gap-3 text-bone/70 text-lg"><MapPin className="h-4 w-4 text-gold" /> {project.location}</p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-bone">
        <div className="container-apex grid md:grid-cols-12 gap-10 md:gap-16">
          <aside className="md:col-span-4 space-y-8">
            <div>
              <p className="eyebrow mb-2">Client</p>
              <p className="font-display text-2xl">{project.client}</p>
            </div>
            <div>
              <p className="eyebrow mb-2">Location</p>
              <p className="text-lg text-stone">{project.location}</p>
            </div>
            <div>
              <p className="eyebrow mb-2">Year</p>
              <p className="text-lg text-stone font-mono">{project.year}</p>
            </div>
            <div>
              <p className="eyebrow mb-2">Scope</p>
              <p className="text-lg text-stone leading-relaxed">{project.scope}</p>
            </div>
          </aside>
          <div className="md:col-span-8 space-y-6">
            <Reveal>
              <p className="font-editorial italic text-2xl md:text-4xl text-onyx leading-snug text-balance">
                {project.brief}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-bone pb-20 md:pb-28">
        <div className="container-apex grid gap-4 md:gap-6 sm:grid-cols-2">
          {project.gallery.map((src, i) => (
            <Reveal key={src} delay={(i % 4) * 0.05}>
              <div className={`relative overflow-hidden ${i % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
                <Image src={src} alt={`${project.name} — image ${i + 1}`} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-graphite text-bone py-16 md:py-20">
        <div className="container-apex flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="eyebrow mb-3">Next Project</p>
            <Link href={`/projects/${next.slug}`} className="font-display text-3xl md:text-5xl leading-tight link-underline">
              {next.name}
            </Link>
          </div>
          <Link href={`/projects/${next.slug}`} className="btn-ghost group self-start">
            View <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
