import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "The Dialectical Arena: Interactive Philosophy Tools",
  description: "Use interactive philosophical instruments to compare arguments, examine assumptions, and map positions across major questions in Western thought.",
  path: "/arena",
});

export default function ArenaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
