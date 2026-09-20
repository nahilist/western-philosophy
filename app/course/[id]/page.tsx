import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PHILOSOPHER_COURSES } from "@/data/philosophers";
import CoursePageClient from "./CoursePageClient";

interface CoursePageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return PHILOSOPHER_COURSES.map((c) => ({
    id: c.id,
  }));
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { id } = await params;
  const course = PHILOSOPHER_COURSES.find((c) => c.id === id);
  if (!course) return { title: "Philosopher Not Found" };

  return {
    title: `${course.name} — Full Philosophical Dossier & Course | PHILOSOPHY Φ`,
    description: course.overview,
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  const course = PHILOSOPHER_COURSES.find((c) => c.id === id);

  if (!course) {
    notFound();
  }

  return <CoursePageClient course={course} />;
}

