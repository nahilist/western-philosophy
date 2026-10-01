import type { Metadata } from "next";
import TrustDocument from "@/components/seo/TrustDocument";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Sources & Further Reading Standards",
  description: "Review the primary-source and academic-reference standards used for philosophy guides, quotations, historical context, and further reading.",
  path: "/sources",
});

export default function SourcesPage() {
  return <TrustDocument title="Sources & Further Reading" path="/sources" intro="Sources are selected to help readers distinguish a philosopher’s own work from later scholarship and interpretation." sections={[
    { heading: "Primary sources", paragraphs: ["Original works are the preferred evidence for doctrines and arguments. Citations should identify the work and, where practical, the edition or translation used."] },
    { heading: "Academic references", paragraphs: ["Suitable secondary references include the Stanford Encyclopedia of Philosophy, the Internet Encyclopedia of Philosophy, university publications, scholarly monographs, and peer-reviewed articles."] },
    { heading: "Quotation context", paragraphs: ["A quotation is not treated as a complete argument. Guides should explain its work, context, translation, and philosophical role whenever that information is available."] },
    { heading: "Human review queue", paragraphs: ["Existing quotations and detailed historical claims still require a documented, edition-level source audit. Until that review is complete, the platform avoids claiming comprehensive citation coverage."] },
  ]} />;
}
