import type { Metadata } from "next";
import TrustDocument from "@/components/seo/TrustDocument";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Editorial Policy",
  description: "Read the editorial standards for philosophical accuracy, quotations, interpretations, corrections, translations, and responsible educational content.",
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return <TrustDocument title="Editorial Policy" path="/editorial-policy" intro="Our editorial standard separates historical fact, philosophical argument, and interpretation so readers can understand both the evidence and its limits." sections={[
    { heading: "Accuracy and interpretation", paragraphs: ["Biographical facts and descriptions of philosophical positions should be checked against primary texts or reputable academic references. Interpretive disagreements are identified as interpretations rather than presented as settled fact."] },
    { heading: "Quotations and translations", paragraphs: ["Quotations should identify a work whenever the source is known. Modern translations may remain copyrighted even when an original philosophical text is in the public domain, so excerpts are kept proportionate and contextualized."] },
    { heading: "Corrections", paragraphs: ["Readers may report a factual, citation, attribution, or accessibility issue through the contact page. Substantive corrections should update the affected content rather than merely changing a displayed date."] },
    { heading: "No fabricated authority", paragraphs: ["The platform does not invent reviewers, academic affiliations, ratings, publication dates, quotations, or credentials. Material requiring specialist verification is treated as a review item rather than filled with an unsupported claim."] },
  ]} />;
}
