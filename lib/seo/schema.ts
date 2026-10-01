import type { PhilosopherCourse } from "@/data/philosophers";
import { absoluteUrl, cleanPhilosopherName, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";

type JsonLdObject = Record<string, unknown>;

export function websiteSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: { "@type": "ImageObject", url: absoluteUrl("/icon.png") },
      },
    ],
  };
}

export function philosopherSchema(course: PhilosopherCourse): JsonLdObject {
  const url = absoluteUrl(`/course/${course.id}`);
  const name = cleanPhilosopherName(course.name);
  const concepts = course.keyConcepts.map((concept) => concept.name);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: `${name}: Philosophy, Biography and Major Works`,
        description: course.overview,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": `${url}#person` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        inLanguage: "en",
      },
      {
        "@type": "Person",
        "@id": `${url}#person`,
        name,
        description: course.overview,
        image: absoluteUrl(course.image),
        knowsAbout: concepts,
        subjectOf: { "@id": `${url}#course` },
      },
      {
        "@type": "Course",
        "@id": `${url}#course`,
        name: course.title,
        description: course.overview,
        url,
        educationalLevel: course.level,
        provider: { "@id": `${SITE_URL}/#organization` },
        about: { "@id": `${url}#person` },
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Philosophers", path: "/philosophers" },
        { name, path: `/course/${course.id}` },
      ], `${url}#breadcrumb`, false),
    ],
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; path: string }>,
  id?: string,
  includeContext = true
): JsonLdObject {
  return {
    ...(includeContext ? { "@context": "https://schema.org" } : {}),
    "@type": "BreadcrumbList",
    ...(id ? { "@id": id } : {}),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
