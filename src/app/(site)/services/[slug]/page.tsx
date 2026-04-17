import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { services, projects } from "@/content/site";
import { Nav } from "@/components/site/Nav";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import Image from "next/image";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return { title: s?.title ?? "Service", description: s?.summary };
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const related = projects.slice(0, 3);

  return (
    <>
      <Nav />
      <PageHeader eyebrow="Service" title={service.title} lead={service.summary} />

      <section className="section bg-bone">
        <div className="container-apex grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5">
            <Reveal><p className="eyebrow mb-6">Deliverables</p></Reveal>
            <ul className="space-y-4">
              {service.deliverables.map((d) => (
                <Reveal key={d}>
                  <li className="flex items-start gap-3 text-lg">
                    <Check className="h-5 w-5 text-gold mt-1 shrink-0" strokeWidth={1.5} />
                    <span>{d}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
          <div className="md:col-span-7 space-y-6 text-stone text-lg leading-relaxed">
            <Reveal>
              <p className="text-onyx font-editorial italic text-2xl md:text-3xl">
                Disciplined from the first sketch to the final snag list.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Our {service.title.toLowerCase()} engagements are run by a dedicated project principal who stays on the programme from brief through commissioning — no handoffs, no diluted responsibility, no surprises.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <Link href={`/request-a-quote?service=${service.slug}`} className="inline-flex items-center gap-2 text-onyx font-medium link-underline">
                Request a quote for {service.title} <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-graphite text-bone">
        <div className="container-apex">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <Reveal><p className="eyebrow mb-4">Related Work</p></Reveal>
              <Reveal delay={0.1}><h2 className="font-display text-3xl md:text-5xl leading-tight">See this service in practice.</h2></Reveal>
            </div>
            <Reveal delay={0.2}><Link href="/projects" className="btn-ghost">All projects</Link></Reveal>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <Reveal key={p.slug}>
                <Link href={`/projects/${p.slug}`} className="block group">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image src={p.cover} alt={p.name} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <h3 className="mt-4 font-display text-2xl">{p.name}</h3>
                  <p className="text-sm text-bone/60">{p.location}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
