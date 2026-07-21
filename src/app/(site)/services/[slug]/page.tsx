import { services } from "@/content/site";
import { ServiceDetailClient } from "@/components/site/ServiceDetailClient";

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
  return <ServiceDetailClient slug={slug} />;
}
