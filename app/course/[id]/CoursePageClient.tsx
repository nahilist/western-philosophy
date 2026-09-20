"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Award, Library, ScrollText, CheckCircle, Quote, Sparkles, BookOpen, Lock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import JoinModal from "@/components/JoinModal";
import AboutModal from "@/components/AboutModal";
import DailyWisdomModal from "@/components/DailyWisdomModal";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { PhilosopherCourse, PHILOSOPHER_COURSES } from "@/data/philosophers";

function CoursePageContent({ course }: { course: PhilosopherCourse }) {
  const { user, openAuthModal } = useAuth();
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [dailyWisdomOpen, setDailyWisdomOpen] = useState(false);

  // Find next philosopher for bottom navigation
  const currentIndex = PHILOSOPHER_COURSES.findIndex((c) => c.id === course.id);
  const nextPhilosopher = PHILOSOPHER_COURSES[(currentIndex + 1) % PHILOSOPHER_COURSES.length];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Navbar */}
      <Navbar
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenDailyWisdom={() => setDailyWisdomOpen(true)}
      />

      {/* Top Breadcrumb & Back Link */}
      <div className="pt-28 pb-4 px-6 sm:px-12 max-w-6xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-neutral-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Academy</span>
        </Link>
        <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
          PHILOSOPHY Φ • COURSE DOSSIER
        </div>
      </div>

      {/* ========================================================
          1. FULL-PAGE HERO SECTION (Matching Project Hero Design)
         ======================================================== */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-16 px-6 sm:px-12 bg-black overflow-hidden border-b border-neutral-900">
        {/* Subtle ambient lighting */}
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neutral-900/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Framed High-Res Portrait with Geometric Offset Frame */}
          <div className="lg:col-span-6 flex justify-center lg:justify-start">
            <div className="relative group">
              {/* White geometric offset frame matching the project hero aesthetic */}
              <div className="absolute -top-4 -left-4 sm:-top-7 sm:-left-7 w-64 sm:w-84 h-80 sm:h-104 border-2 border-white/90 z-0 transition-transform duration-700 ease-out group-hover:-translate-x-1.5 group-hover:-translate-y-1.5" />
              <div className="absolute inset-0 bg-neutral-900/40 z-0 blur-lg" />

              {/* Portrait Image Container */}
              <div className="relative z-10 w-64 sm:w-84 h-80 sm:h-104 overflow-hidden bg-neutral-950 border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.95)]">
                <Image
                  src={course.image}
                  alt={course.name}
                  fill
                  priority
                  className="object-cover object-top grayscale contrast-115 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              </div>
            </div>
          </div>

          {/* Right: Giant Serif Quote & Titles */}
          <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-neutral-400 font-medium px-3 py-1 border border-neutral-800 bg-neutral-950">
                  {course.school}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-neutral-500 font-light">
                  {course.era}
                </span>
              </div>
              <h1 className="font-serif-classic text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[0.14em] text-white leading-tight uppercase">
                {course.quote.split(".")[0].replace("(", "").replace(")", "")}
              </h1>
              <p className="font-serif-classic text-base sm:text-lg tracking-[0.3em] text-neutral-300 uppercase font-semibold">
                {course.name}
              </p>
            </div>

            <div className="w-16 h-px bg-neutral-800 mx-auto lg:mx-0" />

            <p className="font-garamond text-neutral-400 text-base sm:text-lg italic max-w-lg leading-relaxed mx-auto lg:mx-0">
              &ldquo;{course.quote}&rdquo;
            </p>

            {/* Stats Row */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-y border-neutral-900 py-3">
              <div className="flex items-center gap-2 text-neutral-400">
                <Clock className="w-4 h-4 text-white" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <Award className="w-4 h-4 text-white" />
                <span>{course.level}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <Library className="w-4 h-4 text-white" />
                <span>{course.seminalWorks.length} Major Books</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <ScrollText className="w-4 h-4 text-white" />
                <span>{course.modules.length} Modules</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#syllabus"
                className="px-8 py-3 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-200 transition-colors shadow-lg"
              >
                Read Syllabus
              </a>
              <button
                onClick={() => setJoinModalOpen(true)}
                className="px-6 py-3 border border-neutral-800 hover:border-white text-neutral-300 hover:text-white text-xs uppercase tracking-[0.25em] transition-colors cursor-pointer"
              >
                Enroll In Academy
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. THE ODYSSEY & BIOGRAPHY SECTION
         ======================================================== */}
      <section className="py-20 px-6 sm:px-12 max-w-5xl mx-auto space-y-12">
        <div className="space-y-4 text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-500 font-medium">
            Historical Context &amp; Legacy
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-4xl font-bold tracking-[0.15em] text-white uppercase">
            THE PHILOSOPHICAL ODYSSEY
          </h2>
          <div className="w-12 h-px bg-neutral-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-6 p-6 bg-neutral-950 border border-neutral-800 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white" />
              <span>Core Mission &amp; Impact</span>
            </h3>
            <p className="font-garamond text-base sm:text-lg text-neutral-200 leading-relaxed">
              {course.overview}
            </p>
          </div>

          <div className="md:col-span-6 p-6 bg-neutral-950 border border-neutral-800 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-white" />
              <span>Life &amp; Struggles</span>
            </h3>
            <p className="font-garamond text-base sm:text-lg text-neutral-300 leading-relaxed">
              {course.biography}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. CORE PHILOSOPHICAL CONCEPTS & AXIOMS
         ======================================================== */}
      <section className="py-20 px-6 sm:px-12 bg-neutral-950/60 border-y border-neutral-900">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-4 text-center sm:text-left">
            <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-500 font-medium">
              Axiomatic Framework
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-4xl font-bold tracking-[0.15em] text-white uppercase">
              FOUNDATIONAL CONCEPTS
            </h2>
            <div className="w-12 h-px bg-neutral-800" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {course.keyConcepts.map((concept, idx) => (
              <div
                key={idx}
                className="p-6 bg-black border border-neutral-800/80 space-y-3 hover:border-neutral-600 transition-colors shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-classic text-base font-bold text-white tracking-wider">
                    {concept.name}
                  </h3>
                  {concept.latinOrGreek && (
                    <span className="text-xs italic text-neutral-400 font-garamond border border-neutral-800 px-2 py-0.5">
                      {concept.latinOrGreek}
                    </span>
                  )}
                </div>
                <p className="font-garamond text-sm sm:text-base text-neutral-300 leading-relaxed">
                  {concept.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. DIALECTICAL SYLLABUS & LESSON BREAKDOWN
         ======================================================== */}
      <section id="syllabus" className="py-20 px-6 sm:px-12 max-w-5xl mx-auto space-y-12">
        <div className="space-y-4 text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-500 font-medium">
            Academic Curriculum
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-4xl font-bold tracking-[0.15em] text-white uppercase">
            DIALECTICAL SYLLABUS
          </h2>
          <div className="w-12 h-px bg-neutral-800" />
        </div>

        {/* Lock Overlay if User is Not Logged In */}
        {!user ? (
          <div className="p-8 sm:p-12 bg-neutral-950 border border-neutral-800 text-center space-y-6">
            <div className="w-14 h-14 rounded-full border border-neutral-700 mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6 text-neutral-300" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="font-serif-classic text-xl font-bold tracking-[0.15em] text-white uppercase">
                ACADEMY ACCESS REQUIRED
              </h3>
              <p className="font-garamond text-sm text-neutral-400 leading-relaxed">
                Sign in or create your Scholar account to unlock all 4 modules, comprehensive lecture transcripts, and guided reading groups for {course.name}.
              </p>
            </div>
            <button
              onClick={() => openAuthModal(course.id)}
              className="px-8 py-3 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-200 transition-colors shadow-lg cursor-pointer"
            >
              Sign In To Read All Lessons
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {course.modules.map((mod, idx) => (
              <div
                key={idx}
                className="p-6 bg-neutral-950 border border-neutral-800 space-y-4 shadow-xl"
              >
                <div className="flex items-center gap-3 font-serif-classic text-base sm:text-lg tracking-wider text-white font-semibold">
                  <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                  <span>{mod.title}</span>
                </div>
                <p className="text-sm text-neutral-400 pl-8 leading-relaxed font-garamond">
                  {mod.description}
                </p>
                <div className="pl-8 pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {mod.lessons.map((lesson, lIdx) => (
                    <div
                      key={lIdx}
                      className="text-xs text-neutral-300 font-garamond py-2 px-3 bg-black border border-neutral-800 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                      <span>{lesson}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          5. SEMINAL BOOKS & BIBLIOGRAPHY
         ======================================================== */}
      <section className="py-20 px-6 sm:px-12 bg-neutral-950/60 border-t border-neutral-900">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-4 text-center sm:text-left">
            <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-500 font-medium">
              Primary Sources
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-4xl font-bold tracking-[0.15em] text-white uppercase">
              SEMINAL TREATISES &amp; BOOKS
            </h2>
            <div className="w-12 h-px bg-neutral-800" />
          </div>

          <div className="space-y-4">
            {course.seminalWorks.map((work, idx) => (
              <div
                key={idx}
                className="p-6 bg-black border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <h3 className="font-serif-classic text-lg font-bold text-white tracking-wider">
                    {work.title}
                  </h3>
                  <p className="font-garamond text-sm sm:text-base text-neutral-300">
                    {work.summary}
                  </p>
                </div>
                <span className="text-xs font-mono text-neutral-400 self-start sm:self-auto border border-neutral-800 px-3 py-1 bg-neutral-950">
                  {work.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. MEMORABLE APHORISMS
         ======================================================== */}
      <section className="py-20 px-6 sm:px-12 max-w-5xl mx-auto space-y-8">
        <div className="space-y-4 text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-500 font-medium">
            Timeless Maxims
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold tracking-[0.15em] text-white uppercase">
            MEMORABLE APHORISMS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {course.famousQuotes.map((q, idx) => (
            <blockquote
              key={idx}
              className="p-6 bg-neutral-950 border border-neutral-800 text-sm sm:text-base italic font-garamond text-neutral-200 leading-relaxed flex items-start gap-3"
            >
              <Quote className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-1" />
              <span>&ldquo;{q}&rdquo;</span>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ========================================================
          7. NEXT PHILOSOPHER TRANSITION BANNER
         ======================================================== */}
      <section className="py-16 px-6 sm:px-12 border-t border-neutral-900 bg-neutral-950">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              Continue Inquiries
            </span>
            <h3 className="font-serif-classic text-xl sm:text-2xl font-bold text-white uppercase mt-1">
              Explore Next: {nextPhilosopher.name}
            </h3>
          </div>
          <Link
            href={`/course/${nextPhilosopher.id}`}
            className="flex items-center gap-2 px-8 py-3.5 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-200 transition-colors shadow-lg"
          >
            <span>Read Next Thinker</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer onOpenAbout={() => setAboutModalOpen(true)} />

      {/* Modals */}
      <AuthModal />
      <JoinModal isOpen={joinModalOpen} onClose={() => setJoinModalOpen(false)} />
      <DailyWisdomModal isOpen={dailyWisdomOpen} onClose={() => setDailyWisdomOpen(false)} />
      <AboutModal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
    </div>
  );
}

export default function CoursePageClient({ course }: { course: PhilosopherCourse }) {
  return (
    <AuthProvider>
      <CoursePageContent course={course} />
    </AuthProvider>
  );
}

