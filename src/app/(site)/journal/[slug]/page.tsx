import { JournalDetailClient } from "@/components/site/JournalDetailClient";

// Seed slugs pre-rendered at build; admin-added entries resolve via the
// /journal/view client fallback (Firebase rewrite) so they never 404.
const SEED_SLUGS = ["on-disciplined-site-craft", "marina-rebuilt", "material-restraint"];

export function generateStaticParams() {
  return SEED_SLUGS.map((slug) => ({ slug }));
}

export default async function JournalDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <JournalDetailClient slug={slug} />;
}
