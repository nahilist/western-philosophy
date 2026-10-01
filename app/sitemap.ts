import type { MetadataRoute } from "next";
import { PHILOSOPHER_COURSES } from "@/data/philosophers";
import { absoluteUrl } from "@/lib/seo/site";

const CONTENT_UPDATED = "2026-10-01";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/philosophers"), lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/about"), lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.7 },
    { url: absoluteUrl("/arena"), lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/editorial-policy"), lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/methodology"), lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/sources"), lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.4 },
  ];

  const philosopherPages: MetadataRoute.Sitemap = PHILOSOPHER_COURSES.map((course) => ({
    url: absoluteUrl(`/course/${course.id}`),
    lastModified: CONTENT_UPDATED,
    changeFrequency: "monthly",
    priority: 0.8,
    images: [absoluteUrl(course.image)],
  }));

  return [...staticPages, ...philosopherPages];
}
