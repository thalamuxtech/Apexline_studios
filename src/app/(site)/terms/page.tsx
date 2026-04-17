import { Nav } from "@/components/site/Nav";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata = { title: "Terms", description: "Website terms of use." };

export default function Terms() {
  return (
    <>
      <Nav />
      <PageHeader eyebrow="Legal" title="Terms of Use" />
      <section className="section bg-bone">
        <div className="container-apex max-w-3xl text-stone text-lg leading-relaxed space-y-6">
          <p>All content on this site — including text, imagery, drawings and photographs — is the property of Apex-Line Studios and may not be reproduced without written permission.</p>
          <p>Project imagery represents works we have delivered or participated in; individual credits are available on request.</p>
        </div>
      </section>
    </>
  );
}
