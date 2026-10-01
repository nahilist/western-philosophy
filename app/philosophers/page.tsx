import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { PHILOSOPHER_COURSES } from "@/data/philosophers";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { absoluteUrl, cleanPhilosopherName } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Western Philosophers: Lives, Ideas & Major Works",
  description: "Explore clear, structured guides to major Western philosophers, their central ideas, historical contexts, primary works, and intellectual influence.",
  path: "/philosophers",
});

export default function PhilosophersPage() {
  const items = [
    { name: "Home", path: "/" },
    { name: "Philosophers", path: "/philosophers" },
  ];
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/philosophers")}#collection`,
    name: "Western Philosophers",
    description: "A structured directory of major thinkers in the Western philosophical tradition.",
    breadcrumb: breadcrumbSchema(items, `${absoluteUrl("/philosophers")}#breadcrumb`, false),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: PHILOSOPHER_COURSES.map((course, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: cleanPhilosopherName(course.name),
        url: absoluteUrl(`/course/${course.id}`),
      })),
    },
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 sm:px-12 lg:px-20 xl:px-28 py-16 sm:py-24">
      <JsonLd data={collectionSchema} />
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={items} />
        <header className="max-w-4xl mt-12 mb-14">
          <p className="font-mono text-xs tracking-[0.32em] text-neutral-500 uppercase">Entity archive</p>
          <h1 className="font-serif-classic text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-[0.08em] mt-4">
            Western Philosophers
          </h1>
          <p className="font-garamond text-xl text-neutral-300 leading-relaxed mt-6">
            Explore major thinkers through their biographies, philosophical traditions, defining concepts, primary works, and enduring questions.
          </p>
        </header>

        <section aria-labelledby="philosopher-directory">
          <h2 id="philosopher-directory" className="sr-only">Philosopher directory</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PHILOSOPHER_COURSES.map((course) => (
              <li key={course.id}>
                <Link href={`/course/${course.id}`} className="group block h-full border border-neutral-800 bg-neutral-950 hover:border-neutral-500 transition-colors">
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-neutral-800">
                    <Image src={course.image} alt={`Portrait of ${cleanPhilosopherName(course.name)}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover grayscale group-hover:grayscale-0 transition duration-500" />
                  </div>
                  <div className="p-6">
                    <h2 className="font-serif-classic text-xl font-bold tracking-wider uppercase">{cleanPhilosopherName(course.name)}</h2>
                    <p className="font-mono text-[11px] tracking-wider text-neutral-500 mt-2">{course.era}</p>
                    <p className="font-garamond text-base text-neutral-300 leading-relaxed mt-4 line-clamp-3">{course.overview}</p>
                    <span className="inline-block mt-5 text-xs uppercase tracking-[0.2em] text-neutral-300 group-hover:text-white">Read the guide →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
