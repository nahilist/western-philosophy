import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const failures = [];
const requiredFiles = [
  "app/robots.ts",
  "app/sitemap.ts",
  "app/manifest.ts",
  "app/opengraph-image.tsx",
  "app/not-found.tsx",
  "app/philosophers/page.tsx",
  "lib/seo/metadata.ts",
  "lib/seo/schema.ts",
];

for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) failures.push(`Missing required SEO file: ${file}`);
}

const dataSource = readFileSync(resolve(root, "data/philosophers.ts"), "utf8");
const ids = [...dataSource.matchAll(/^\s{4}id: "([^"]+)",$/gm)].map((match) => match[1]);
const images = [...dataSource.matchAll(/^\s{4}image: "([^"]+)",$/gm)].map((match) => match[1]);

if (ids.length === 0) failures.push("No philosopher entities found.");
if (new Set(ids).size !== ids.length) failures.push("Duplicate philosopher slug detected.");

for (const image of images) {
  if (!existsSync(resolve(root, "public", image.replace(/^\//, "")))) {
    failures.push(`Missing philosopher image: ${image}`);
  }
}

const coursePage = readFileSync(resolve(root, "app/course/[id]/page.tsx"), "utf8");
for (const requirement of ["generateMetadata", "notFound()", "philosopherSchema", "dynamicParams = false"]) {
  if (!coursePage.includes(requirement)) failures.push(`Course route missing: ${requirement}`);
}

const rootLayout = readFileSync(resolve(root, "app/layout.tsx"), "utf8");
for (const requirement of ["metadataBase", "alternates", "openGraph", "twitter", "websiteSchema"]) {
  if (!rootLayout.includes(requirement)) failures.push(`Root metadata missing: ${requirement}`);
}

if (failures.length > 0) {
  console.error(`SEO audit failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SEO audit passed: ${ids.length} philosopher routes and ${images.length} entity images validated.`);
