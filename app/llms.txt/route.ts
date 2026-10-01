import { PHILOSOPHER_COURSES } from "@/data/philosophers";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, cleanPhilosopherName } from "@/lib/seo/site";

export function GET() {
  const philosophers = PHILOSOPHER_COURSES.map(
    (course) => `- ${cleanPhilosopherName(course.name)}: ${SITE_URL}/course/${course.id}`
  ).join("\n");
  const content = `# ${SITE_NAME}\n\n${SITE_DESCRIPTION}\n\n## Main sections\n- Philosopher directory: ${SITE_URL}/philosophers\n- About: ${SITE_URL}/about\n- Research methodology: ${SITE_URL}/methodology\n- Sources policy: ${SITE_URL}/sources\n- Editorial policy: ${SITE_URL}/editorial-policy\n\n## Philosopher guides\n${philosophers}\n\n## Crawling\n- Sitemap: ${SITE_URL}/sitemap.xml\n- Robots: ${SITE_URL}/robots.txt\n\nThis file is supplementary documentation. Canonical HTML pages and the XML sitemap remain authoritative.\n`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
