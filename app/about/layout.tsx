import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About the Western Philosophy Learning Platform",
  description: "Learn how PHILOSOPHY Φ organizes Western philosophical traditions, thinkers, concepts, learning instruments, and educational course material.",
  path: "/about",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
