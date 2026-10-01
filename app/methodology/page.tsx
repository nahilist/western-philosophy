import type { Metadata } from "next";
import TrustDocument from "@/components/seo/TrustDocument";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Research & Content Methodology",
  description: "How PHILOSOPHY Φ structures philosopher guides, evaluates sources, presents contested interpretations, and builds educational relationships between ideas.",
  path: "/methodology",
});

export default function MethodologyPage() {
  return <TrustDocument title="Research & Content Methodology" path="/methodology" intro="The platform organizes philosophy as a connected body of people, works, concepts, arguments, and historical contexts—not as isolated quotations." sections={[
    { heading: "Source hierarchy", paragraphs: ["Primary philosophical works take priority for a thinker’s stated arguments. Academic encyclopedias, university publications, scholarly books, and peer-reviewed research provide historical and interpretive context."] },
    { heading: "Entity structure", paragraphs: ["Each guide connects a philosopher to major concepts, works, schools, influences, and questions only where the relationship is academically defensible. Relationships are deterministic, not random recommendations."] },
    { heading: "Answer-first explanations", paragraphs: ["Key questions begin with a concise answer and then add qualifications, context, and competing interpretations. This improves usability without flattening philosophical disagreement."] },
    { heading: "Language policy", paragraphs: ["English is currently the canonical published language. Interface translation does not create a separate Hindi indexable page; genuine Hindi URLs and hreflang will be introduced only after human-reviewed translations exist."] },
  ]} />;
}
