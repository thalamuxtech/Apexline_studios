import { ProjectDetailClient } from "@/components/site/ProjectDetailClient";

// Client-side fallback for admin-added projects with no pre-rendered static
// page. Firebase Hosting rewrites unmatched /projects/** paths here; the
// component reads the real slug from the browser URL.
export const metadata = { title: "Project", description: "Apex-Line Studios project." };

export default function ProjectView() {
  return <ProjectDetailClient />;
}
