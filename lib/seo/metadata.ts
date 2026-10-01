import type { Metadata } from "next";
import type { PhilosopherCourse } from "@/data/philosophers";
import { absoluteUrl, cleanPhilosopherName, SITE_NAME } from "./site";

const philosopherTitleTopics: Record<string, string> = {
  descartes: "Philosophy, Cogito, Biography & Works",
  nietzsche: "Philosophy, Ideas & Major Works",
  socrates: "Philosophy, Socratic Method & Legacy",
  machiavelli: "Political Philosophy, The Prince & Virtù",
  plato: "Philosophy, Theory of Forms & Works",
  aristotle: "Philosophy, Ethics, Logic & Major Works",
  spinoza: "Philosophy, Ethics, God & Nature",
  hume: "Philosophy, Empiricism & Skepticism",
  kant: "Philosophy, Ethics & Critique of Pure Reason",
  hegel: "Philosophy, Dialectic & Absolute Idealism",
  schopenhauer: "Philosophy, Will & Representation",
  marx: "Philosophy, Historical Materialism & Capital",
  russell: "Philosophy, Logic & Analytic Thought",
  camus: "Philosophy, Absurdism & Major Works",
};

export function buildPageMetadata({
  title,
  description,
  path,
  image = "/opengraph-image",
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false, noarchive: true }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${title} — ${SITE_NAME}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function buildPhilosopherMetadata(course: PhilosopherCourse): Metadata {
  const name = cleanPhilosopherName(course.name);
  const topic = philosopherTitleTopics[course.id] ?? "Philosophy, Biography & Major Works";
  const title = `${name}: ${topic}`;
  const description = `${course.overview.slice(0, 152).trim().replace(/[.,;:]?$/, "")}.`;
  const path = `/course/${course.id}`;

  return {
    ...buildPageMetadata({ title, description, path, image: course.image }),
    category: "Philosophy",
    openGraph: {
      ...buildPageMetadata({ title, description, path, image: course.image }).openGraph,
      type: "article",
    },
  };
}
