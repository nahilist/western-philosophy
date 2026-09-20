"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroDescartes from "@/components/HeroDescartes";
import SocratesSection from "@/components/SocratesSection";
import CosmicSection from "@/components/CosmicSection";
import CoursesSection from "@/components/CoursesSection";
import CreationBanner from "@/components/CreationBanner";
import Footer from "@/components/Footer";
import CourseModal from "@/components/CourseModal";
import JoinModal from "@/components/JoinModal";
import DailyWisdomModal from "@/components/DailyWisdomModal";
import AboutModal from "@/components/AboutModal";
import { PHILOSOPHER_COURSES, PhilosopherCourse } from "@/data/philosophers";

export default function Home() {
  const [selectedCourse, setSelectedCourse] = useState<PhilosopherCourse | null>(null);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [dailyWisdomOpen, setDailyWisdomOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  const handleOpenCourseById = (id: string) => {
    const course = PHILOSOPHER_COURSES.find((c) => c.id === id);
    if (course) {
      setSelectedCourse(course);
    }
  };

  const handleEnrollFromCourse = (course: PhilosopherCourse) => {
    setSelectedCourse(null);
    setJoinModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Top Header Navigation */}
      <Navbar
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenDailyWisdom={() => setDailyWisdomOpen(true)}
      />

      {/* Hero Section: René Descartes (Matching Screenshot 4 Top) */}
      <HeroDescartes
        onSelectDescartes={() => handleOpenCourseById("descartes")}
      />

      {/* Socrates Section: The Death of Socrates (Matching Screenshot 4 Bottom) */}
      <SocratesSection
        onSelectSocrates={() => handleOpenCourseById("socrates")}
      />

      {/* Cosmic Section: Angel, Nietzsche, Machiavelli (Matching Screenshot 3) */}
      <CosmicSection
        onSelectNietzsche={() => handleOpenCourseById("nietzsche")}
        onSelectMachiavelli={() => handleOpenCourseById("machiavelli")}
      />

      {/* Courses Grid: 4 Thinkers (Matching Screenshot 1 Top) */}
      <CoursesSection
        onSelectCourse={(course) => setSelectedCourse(course)}
      />

      {/* Call to Action Banner: Michelangelo Hands + Kant (Matching Screenshot 1 Middle) */}
      <CreationBanner
        onJoinClick={() => setJoinModalOpen(true)}
      />

      {/* Footer & Newsletter (Matching Screenshot 1 Bottom) */}
      <Footer
        onOpenAbout={() => setAboutModalOpen(true)}
      />

      {/* Interactive Modals */}
      <CourseModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onEnroll={handleEnrollFromCourse}
      />

      <JoinModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
      />

      <DailyWisdomModal
        isOpen={dailyWisdomOpen}
        onClose={() => setDailyWisdomOpen(false)}
      />

      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />
    </main>
  );
}
