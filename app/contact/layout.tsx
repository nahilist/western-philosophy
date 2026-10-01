import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact & Educational Inquiries",
  description: "Contact PHILOSOPHY Φ about corrections, source suggestions, educational collaboration, manuscripts, translations, or platform support.",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
