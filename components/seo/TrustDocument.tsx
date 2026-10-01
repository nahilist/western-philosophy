import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";
import JsonLd from "./JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { absoluteUrl, SITE_URL } from "@/lib/seo/site";

type TrustSection = { heading: string; paragraphs: string[] };

export default function TrustDocument({
  title,
  intro,
  path,
  sections,
}: {
  title: string;
  intro: string;
  path: string;
  sections: TrustSection[];
}) {
  const breadcrumbs = [{ name: "Home", path: "/" }, { name: title, path }];
  const url = absoluteUrl(path);
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description: intro,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    breadcrumb: breadcrumbSchema(breadcrumbs, `${url}#breadcrumb`, false),
    inLanguage: "en",
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 sm:px-12 py-16 sm:py-24">
      <JsonLd data={schema} />
      <article className="max-w-4xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />
        <header className="mt-12 pb-10 border-b border-neutral-800">
          <h1 className="font-serif-classic text-4xl sm:text-6xl font-bold uppercase tracking-[0.08em]">{title}</h1>
          <p className="font-garamond text-xl text-neutral-300 leading-relaxed mt-6">{intro}</p>
        </header>
        <div className="py-10 space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-serif-classic text-2xl font-bold tracking-wide">{section.heading}</h2>
              <div className="mt-4 space-y-4 font-garamond text-lg leading-relaxed text-neutral-300">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>
        <footer className="pt-8 border-t border-neutral-800 flex flex-wrap gap-5 text-xs uppercase tracking-widest">
          <Link href="/sources" className="hover:text-neutral-300">Sources</Link>
          <Link href="/methodology" className="hover:text-neutral-300">Methodology</Link>
          <Link href="/contact" className="hover:text-neutral-300">Submit a correction</Link>
        </footer>
      </article>
    </main>
  );
}
