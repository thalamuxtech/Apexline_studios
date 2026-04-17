import { Nav } from "@/components/site/Nav";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata = { title: "Privacy", description: "How Apex-Line Studios handles your data." };

export default function Privacy() {
  return (
    <>
      <Nav />
      <PageHeader eyebrow="Legal" title="Privacy Notice" />
      <section className="section bg-bone">
        <div className="container-apex max-w-3xl prose prose-lg prose-stone text-stone leading-relaxed space-y-6">
          <p>Apex-Line Studios collects only the information you voluntarily submit — including name, contact details and the details of your enquiry or application — for the purpose of responding to you.</p>
          <p>We do not sell or share your data with third parties. Submissions are stored securely on Google Firebase infrastructure and accessed only by authorised personnel.</p>
          <p>You may request deletion of your data at any time by emailing us at the address provided on the Contact page.</p>
          <p className="text-xs text-stone/60 pt-8">Last updated: {new Date().getFullYear()}</p>
        </div>
      </section>
    </>
  );
}
