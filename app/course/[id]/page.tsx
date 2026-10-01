import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PHILOSOPHER_COURSES } from "@/data/philosophers";
import JsonLd from "@/components/seo/JsonLd";
import { buildPhilosopherMetadata } from "@/lib/seo/metadata";
import { philosopherSchema } from "@/lib/seo/schema";
import CoursePageClient from "./CoursePageClient";

interface CoursePageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return PHILOSOPHER_COURSES.map((c) => ({
    id: c.id,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { id } = await params;
  const course = PHILOSOPHER_COURSES.find((c) => c.id === id);
  if (!course) return { title: "Philosopher Not Found", robots: { index: false } };
  return buildPhilosopherMetadata(course);
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  const course = PHILOSOPHER_COURSES.find((c) => c.id === id);

  if (!course) {
    notFound();
  }

  return (
    <>
      <JsonLd data={philosopherSchema(course)} />
      <CoursePageClient course={course} />
    </>
  );
}

