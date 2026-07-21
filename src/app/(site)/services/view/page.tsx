import { ServiceDetailClient } from "@/components/site/ServiceDetailClient";

// Client-side fallback for admin-added services that have no pre-rendered
// static page. Firebase Hosting rewrites unmatched /services/** paths here;
// the component reads the real slug from the browser URL.
export const metadata = { title: "Service", description: "Apex-Line Studios service." };

export default function ServiceView() {
  return <ServiceDetailClient />;
}
