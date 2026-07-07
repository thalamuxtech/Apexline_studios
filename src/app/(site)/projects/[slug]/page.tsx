import { notFound } from "next/navigation";
import { projects } from "@/content/site";
import { ProjectDetailClient } from "@/components/site/ProjectDetailClient";

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

  return <ProjectDetailClient initialProject={{ ...project, status: "published" }} />;
}
