"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Award, 
  Library, 
  ScrollText, 
  CheckCircle, 
  Quote, 
  Sparkles,
  Bookmark,
  BookmarkCheck,
  PenLine,
  Send,
  ShieldCheck,
  Lock,
  Loader2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import JoinModal from "@/components/JoinModal";
import AboutModal from "@/components/AboutModal";
import DailyWisdomModal from "@/components/DailyWisdomModal";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { PhilosopherCourse, PHILOSOPHER_COURSES } from "@/data/philosophers";
import { 
  getCourseProgress, 
  saveCourseProgress, 
  toggleBookmark, 
  saveReflection 
} from "@/lib/supabase/queries";

function CoursePageContent({ course }: { course: PhilosopherCourse }) {
  const { t, getPhilosopherData } = useLanguage();
  const { user, openAuthModal } = useAuth();

  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [dailyWisdomOpen, setDailyWisdomOpen] = useState(false);

  // Supabase Backend States (Protected & Parameterized)
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [reflectionInput, setReflectionInput] = useState("");
  const [isReflectionPrivate, setIsReflectionPrivate] = useState(true);
  const [isSavingReflection, setIsSavingReflection] = useState(false);
  const [reflectionFeedback, setReflectionFeedback] = useState<string | null>(null);
  const [savedReflections, setSavedReflections] = useState<
    Array<{ id: string; text: string; date: string; isPrivate: boolean }>
  >([]);

  const pData = getPhilosopherData(course);

  // Total lessons for progress tracking
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const totalLessonsCount = allLessons.length || 1;

  // Next and previous thinkers for seamless editorial reading
  const currentIndex = PHILOSOPHER_COURSES.findIndex((c) => c.id === course.id);
  const nextPhilosopher = PHILOSOPHER_COURSES[(currentIndex + 1) % PHILOSOPHER_COURSES.length];
  const prevPhilosopher = PHILOSOPHER_COURSES[(currentIndex - 1 + PHILOSOPHER_COURSES.length) % PHILOSOPHER_COURSES.length];

  const nextPData = getPhilosopherData(nextPhilosopher);
  const prevPData = getPhilosopherData(prevPhilosopher);

  // Load progress & reflections on mount or user change
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      // 1. Fetch user progress
      const progressRes = await getCourseProgress(course.id);
      if (isMounted && progressRes.data) {
        setCompletedLessons(progressRes.data.completed_modules || []);
        setProgressPercent(progressRes.data.progress_percent || 0);
      }

      // 2. Check local bookmark status
      try {
        const savedBookmark = localStorage.getItem(`wp_bookmark_${course.id}`);
        if (isMounted && savedBookmark) {
          setIsBookmarked(true);
        }
      } catch {
        // ignore
      }

      // 3. Check local reflections
      try {
        const savedRefls = localStorage.getItem(`wp_reflections_${course.id}`);
        if (isMounted && savedRefls) {
          const parsed = JSON.parse(savedRefls);
          setSavedReflections(
            parsed.map((r: any) => ({
              id: r.id || String(Math.random()),
              text: r.reflection_text,
              date: new Date(r.created_at || Date.now()).toLocaleDateString(),
              isPrivate: r.is_private ?? true,
            }))
          );
        }
      } catch {
        // ignore
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [course.id, user]);

  const handleToggleBookmark = async () => {
    if (!user) {
      openAuthModal(course.id);
      return;
    }
    const res = await toggleBookmark(course.id, pData.quote, course.title);
    setIsBookmarked(res.bookmarked);
  };

  const handleToggleLesson = async (lessonName: string) => {
    if (!user) {
      openAuthModal(course.id);
      return;
    }

    const nextCompleted = completedLessons.includes(lessonName)
      ? completedLessons.filter((l) => l !== lessonName)
      : [...completedLessons, lessonName];

    const nextPercent = Math.round((nextCompleted.length / totalLessonsCount) * 100);

    setCompletedLessons(nextCompleted);
    setProgressPercent(nextPercent);

    await saveCourseProgress(course.id, nextCompleted, nextPercent);
  };

  const handleSaveReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal(course.id);
      return;
    }

    const trimmed = reflectionInput.trim();
    if (!trimmed) return;

    setIsSavingReflection(true);
    setReflectionFeedback(null);

    const res = await saveReflection(course.id, trimmed, isReflectionPrivate);
    setIsSavingReflection(false);

    if (res.success) {
      setSavedReflections((prev) => [
        {
          id: "ref-" + Date.now(),
          text: trimmed,
          date: new Date().toLocaleDateString(),
          isPrivate: isReflectionPrivate,
        },
        ...prev,
      ]);
      setReflectionInput("");
      setReflectionFeedback("Contemplation inscribed into the eternal record.");
      setTimeout(() => setReflectionFeedback(null), 4000);
    } else {
      setReflectionFeedback(res.error || "Failed to inscribe reflection");
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white selection:bg-white selection:text-black overflow-x-hidden">
      {/* Minimal Sticky Header */}
      <Navbar
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenDailyWisdom={() => setDailyWisdomOpen(true)}
      />

      {/* Top Full-Bleed Breadcrumb Bar */}
      <div className="pt-28 pb-6 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 w-full flex items-center justify-between border-b border-neutral-900">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] text-neutral-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>{t.coursePage.homeLink}</span>
        </Link>
        <div className="flex items-center gap-4 text-xs tracking-widest text-neutral-400 uppercase">
          <span>{pData.school.split(",")[0]}</span>
          <span className="text-neutral-600">•</span>
          <span>{pData.era}</span>
        </div>
      </div>

      {/* ========================================================
          1. FULL-BLEED 100% WIDTH HERO SECTION
         ======================================================== */}
      <section className="w-full py-16 sm:py-24 lg:py-32 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-black">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 xl:gap-28 items-center">
          {/* Left: Framed High-Res Portrait with Signature White Offset Frame */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative group">
              {/* White modern geometric frame offset behind */}
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-64 sm:w-80 lg:w-96 xl:w-[420px] h-80 sm:h-100 lg:h-116 xl:h-[500px] border-2 border-white/80 z-0 transition-transform duration-700 ease-out group-hover:-translate-x-2 group-hover:-translate-y-2 pointer-events-none" />

              {/* Ambient backdrop glow */}
              <div className="absolute inset-0 bg-neutral-900/40 z-0 blur-xl" />

              {/* Portrait Image Container */}
              <div className="relative z-10 w-64 sm:w-80 lg:w-96 xl:w-[420px] h-80 sm:h-100 lg:h-116 xl:h-[500px] overflow-hidden bg-neutral-950 border border-neutral-800 shadow-[0_20px_60px_rgba(0,0,0,0.95)]">
                <Image
                  src={course.image}
                  alt={pData.name}
                  fill
                  priority
                  className="object-cover object-top grayscale-0 md:grayscale contrast-115 transition-all duration-700 group-hover:scale-105 md:group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75" />
              </div>
            </div>
          </div>

          {/* Right: Giant Serif Titles & Quotations Stretching Across Widescreen */}
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                <span className="text-xs sm:text-sm uppercase tracking-[0.18em] text-neutral-200 font-medium px-3.5 py-1.5 border border-neutral-800 bg-neutral-950">
                  {pData.school}
                </span>
                <span className="text-xs sm:text-sm uppercase tracking-[0.18em] text-neutral-300 font-mono font-medium">
                  {pData.era}
                </span>
              </div>

              <h1 className="font-serif-classic text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-[0.14em] text-white leading-tight uppercase">
                {pData.quote.split(".")[0].replace("(", "").replace(")", "")}
              </h1>

              <p className="font-serif-classic text-base sm:text-xl xl:text-2xl tracking-[0.3em] text-neutral-300 uppercase font-semibold">
                {pData.name}
              </p>
            </div>

            <div className="w-20 h-px bg-neutral-800 mx-auto lg:mx-0" />

            <blockquote className="font-garamond text-lg sm:text-2xl xl:text-3xl italic text-neutral-200 leading-relaxed font-light">
              &ldquo;{pData.quote}&rdquo;
            </blockquote>

            <p className="font-garamond text-sm text-neutral-400">
              Primary Source: {course.quoteSource}
            </p>

            {/* Quick Metrics Bar across full width */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-neutral-900 py-4 text-xs">
              <div className="flex items-center gap-2 text-neutral-300">
                <Clock className="w-4 h-4 text-white" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Award className="w-4 h-4 text-white" />
                <span>{course.level}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Library className="w-4 h-4 text-white" />
                <span>{course.seminalWorks.length} Primary Texts</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <ScrollText className="w-4 h-4 text-white" />
                <span>{course.modules.length} Modules</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="#biography"
                className="px-7 py-3.5 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-200 transition-colors shadow-lg"
              >
                Read Odyssey
              </a>
              <a
                href="#syllabus"
                className="px-7 py-3.5 border border-white/70 hover:border-white text-white text-xs uppercase tracking-[0.25em] transition-colors"
              >
                View Syllabus
              </a>
              <button
                onClick={handleToggleBookmark}
                className={`px-6 py-3.5 border text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-2 cursor-pointer ${
                  isBookmarked
                    ? "bg-neutral-900 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                    : "border-neutral-800 hover:border-neutral-500 text-neutral-400 hover:text-white"
                }`}
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-white" />
                    <span>Saved to Codex</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-neutral-400" />
                    <span>Bookmark Thinker</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. SECTION 01: THE ODYSSEY (100% Full-Bleed 2-Column Layout)
         ======================================================== */}
      <section id="biography" className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-black">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 xl:gap-28 items-start">
          {/* Left Column: Title & Grand Pull Quote */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-neutral-400 tracking-widest font-semibold">
                  01
                </span>
                <div className="w-8 h-px bg-neutral-800" />
                <span className="text-xs uppercase tracking-[0.35em] text-neutral-400">
                  {t.coursePage.section01}
                </span>
              </div>
              <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[0.12em] text-white uppercase leading-tight">
                {t.coursePage.section01Title}
              </h2>
            </div>

            {/* Standout Pull Quote Box */}
            <div className="p-8 sm:p-10 border-l-2 border-white space-y-4 bg-neutral-950/70 border border-neutral-900">
              <Quote className="w-6 h-6 text-neutral-400" />
              <p className="font-serif-classic text-xl sm:text-2xl text-white leading-snug uppercase">
                &ldquo;{course.famousQuotes[0]}&rdquo;
              </p>
              <span className="text-xs tracking-[0.25em] text-neutral-400 uppercase font-serif-classic block">
                — {pData.name}
              </span>
            </div>
          </div>

          {/* Right Column: Full-Scale Longform Reading Text Stretching to Margin */}
          <div className="lg:col-span-7 space-y-10 font-garamond text-lg sm:text-xl lg:text-2xl xl:text-3xl text-neutral-200 leading-[1.9] font-light">
            <div className="space-y-4 pb-8 border-b border-neutral-900">
              <span className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-serif-classic block font-semibold">
                {t.coursePage.section01}
              </span>
              <p className="first-letter:font-serif-classic first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-4 first-letter:text-white">
                {pData.overview}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <span className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-serif-classic block font-semibold">
                Historical Life &amp; Context
              </span>
              <p className="text-neutral-300">
                {course.biography}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SECTION 02: FOUNDATIONAL CONCEPTS (Full-Width 4-Col Grid)
         ======================================================== */}
      <section className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-black">
        <div className="w-full space-y-16">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-900">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-neutral-400 tracking-widest font-semibold">
                  02
                </span>
                <div className="w-8 h-px bg-neutral-800" />
                <span className="text-xs uppercase tracking-[0.35em] text-neutral-400">
                  {t.coursePage.section02}
                </span>
              </div>
              <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.12em] text-white uppercase">
                {t.coursePage.section02Title}
              </h2>
            </div>
            <p className="text-xs text-neutral-400 tracking-widest uppercase font-mono">
              4 CORE BREAKTHROUGHS
            </p>
          </div>

          {/* Full-Width Responsive 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 xl:gap-16">
            {course.keyConcepts.map((concept, idx) => (
              <div
                key={idx}
                className="space-y-4 pb-8 border-b lg:border-b-0 lg:border-r border-neutral-900 lg:pr-10 xl:pr-14 last:border-r-0"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-neutral-400 tracking-widest">
                    CONCEPT 0{idx + 1}
                  </span>
                  {concept.latinOrGreek && (
                    <span className="text-xs italic text-neutral-400 font-garamond">
                      {concept.latinOrGreek}
                    </span>
                  )}
                </div>

                <h3 className="font-serif-classic text-xl sm:text-2xl font-bold text-white tracking-wide uppercase leading-snug">
                  {concept.name}
                </h3>

                <div className="w-10 h-px bg-neutral-800" />

                <p className="font-garamond text-base sm:text-lg lg:text-xl text-neutral-300 leading-relaxed font-light">
                  {concept.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. SECTION 03: DIALECTICAL SYLLABUS (Full-Width Split Layout)
         ======================================================== */}
      <section id="syllabus" className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-black">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 xl:gap-28 items-start">
          {/* Left Column: Curriculum Overview & Action */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-neutral-400 tracking-widest font-semibold">
                  03
                </span>
                <div className="w-8 h-px bg-neutral-800" />
                <span className="text-xs uppercase tracking-[0.35em] text-neutral-400">
                  {t.coursePage.section03}
                </span>
              </div>
              <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.12em] text-white uppercase leading-tight">
                {t.coursePage.section03Title}
              </h2>
            </div>

            <p className="font-garamond text-base sm:text-lg lg:text-xl text-neutral-300 leading-relaxed font-light">
              Structured into four sequential intellectual movements, moving from initial philosophical deconstruction to ontological certainty and ethical mastery.
            </p>

            {/* Live Contemplation Progress Card */}
            <div className="p-6 border border-neutral-800 space-y-4 bg-neutral-950">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
                <span className="text-neutral-400">Mastery Progress</span>
                <span className="text-white font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-900 overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 font-garamond">
                {completedLessons.length} of {totalLessonsCount} lectures contemplated.
              </p>
            </div>

            <div className="p-8 border border-neutral-800 space-y-5 bg-neutral-950">
              <div className="flex items-center gap-2 font-serif-classic text-xs tracking-wider text-white">
                <Sparkles className="w-4 h-4 text-neutral-300" />
                <span>Philosophy Φ Seminars</span>
              </div>
              <p className="text-xs text-neutral-400 font-garamond leading-relaxed">
                Enrollment grants complete access to reading groups, dialectical seminar transcripts, and digital manuscript translations.
              </p>
              <button
                onClick={() => setJoinModalOpen(true)}
                className="w-full py-3.5 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Enroll In Academy
              </button>
            </div>
          </div>

          {/* Right Column: 4 Full-Width Modules & Lectures */}
          <div className="lg:col-span-8 space-y-12">
            {course.modules.map((mod, idx) => (
              <div
                key={idx}
                className="pb-10 border-b border-neutral-900 space-y-5 last:border-b-0"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-neutral-400 tracking-widest font-semibold">
                    MODULE 0{idx + 1}
                  </span>
                  <h3 className="font-serif-classic text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-wide uppercase">
                    {mod.title.replace(/^I+\.\s*/, "").replace(/^IV\.\s*/, "")}
                  </h3>
                </div>

                <p className="font-garamond text-base sm:text-lg lg:text-xl text-neutral-300 leading-relaxed font-light">
                  {mod.description}
                </p>

                {/* Lecture Topics spanning wide horizontal space (Interactive) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 pt-2">
                  {mod.lessons.map((lesson, lIdx) => {
                    const isDone = completedLessons.includes(lesson);
                    return (
                      <button
                        type="button"
                        key={lIdx}
                        onClick={() => handleToggleLesson(lesson)}
                        className={`p-3.5 border text-left flex items-center gap-3 font-garamond text-sm lg:text-base transition-all cursor-pointer group ${
                          isDone
                            ? "bg-neutral-900 border-neutral-600 text-white"
                            : "border-neutral-900 bg-neutral-950/80 text-neutral-300 hover:border-neutral-700"
                        }`}
                      >
                        <CheckCircle
                          className={`w-4 h-4 flex-shrink-0 transition-colors ${
                            isDone ? "text-white fill-white/20" : "text-neutral-600 group-hover:text-neutral-400"
                          }`}
                        />
                        <span className={isDone ? "line-through text-neutral-400" : ""}>{lesson}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. SECTION 04: SEMINAL TREATISES (Full-Width 3-Column Grid)
         ======================================================== */}
      <section className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-black">
        <div className="w-full space-y-16">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-900">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-neutral-400 tracking-widest font-semibold">
                  04
                </span>
                <div className="w-8 h-px bg-neutral-800" />
                <span className="text-xs uppercase tracking-[0.35em] text-neutral-400">
                  {t.coursePage.section04}
                </span>
              </div>
              <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.12em] text-white uppercase">
                {t.coursePage.section04Title}
              </h2>
            </div>
            <p className="text-xs text-neutral-400 tracking-widest uppercase font-mono">
              HISTORICAL BIBLIOGRAPHY
            </p>
          </div>

          {/* Full-Width 3-Column Grid across widescreen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 xl:gap-16">
            {course.seminalWorks.map((work, idx) => (
              <div
                key={idx}
                className="space-y-4 pb-8 border-b md:border-b-0 md:border-r border-neutral-900 md:pr-10 xl:pr-14 last:border-r-0"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-neutral-400 tracking-widest">
                    PUBLICATION
                  </span>
                  <span className="font-mono text-xs text-neutral-300 font-semibold px-2 py-0.5 border border-neutral-800">
                    {work.year}
                  </span>
                </div>

                <h3 className="font-serif-classic text-xl sm:text-2xl font-bold text-white tracking-wide">
                  {work.title}
                </h3>

                <div className="w-10 h-px bg-neutral-800" />

                <p className="font-garamond text-base sm:text-lg lg:text-xl text-neutral-300 leading-relaxed font-light">
                  {work.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. SECTION 05: MEMORABLE APHORISMS (Full-Width 2-Col Grid)
         ======================================================== */}
      <section className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-black">
        <div className="w-full space-y-16">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-neutral-400 tracking-widest font-semibold">
                05
              </span>
              <div className="w-8 h-px bg-neutral-800" />
              <span className="text-xs uppercase tracking-[0.35em] text-neutral-400">
                {t.coursePage.section05}
              </span>
            </div>
            <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.12em] text-white uppercase">
              {t.coursePage.section05Title}
            </h2>
          </div>

          {/* 2-Column Full-Width Grid across entire screen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 xl:gap-20">
            {course.famousQuotes.map((q, idx) => (
              <blockquote
                key={idx}
                className="pl-8 border-l-2 border-white/80 space-y-3 font-garamond text-xl sm:text-2xl lg:text-3xl italic text-neutral-200 leading-relaxed"
              >
                <p>&ldquo;{q}&rdquo;</p>
                <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 not-italic font-serif-classic block">
                  — {pData.name}
                </span>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. SECTION 06: THE CONTEMPLATIVE CODEX (Reflections Journal)
         ======================================================== */}
      <section id="reflections" className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-neutral-950">
        <div className="w-full space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-900">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-neutral-400 tracking-widest font-semibold">
                  06
                </span>
                <div className="w-8 h-px bg-neutral-800" />
                <span className="text-xs uppercase tracking-[0.35em] text-neutral-400">
                  Dialectical Journal
                </span>
              </div>
              <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.12em] text-white uppercase">
                The Contemplative Codex
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Row-Level Security Active • Parameterized Queries</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Input Form */}
            <div className="lg:col-span-6 space-y-6">
              <p className="font-garamond text-base sm:text-lg text-neutral-300 leading-relaxed font-light">
                Inscribe your critical reflections, questions, or counter-arguments on {pData.name}’s philosophy.
                Reflections are securely tied to your encrypted account identity.
              </p>

              <form onSubmit={handleSaveReflection} className="space-y-4">
                <div className="relative">
                  <textarea
                    rows={5}
                    maxLength={5000}
                    value={reflectionInput}
                    onChange={(e) => setReflectionInput(e.target.value)}
                    placeholder={`What is your philosophical judgment on ${pData.name}'s ideas?`}
                    className="w-full bg-black border border-neutral-800 p-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors resize-none font-garamond text-base sm:text-lg leading-relaxed"
                  />
                  {/* Anti-DDoS safety limit counter */}
                  <div className="absolute bottom-3 right-3 text-xs font-mono text-neutral-400">
                    {reflectionInput.length} / 5000 chars
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <label className="flex items-center gap-2 text-xs sm:text-sm text-neutral-300 cursor-pointer select-none font-medium">
                    <input
                      type="checkbox"
                      checked={isReflectionPrivate}
                      onChange={(e) => setIsReflectionPrivate(e.target.checked)}
                      className="accent-white cursor-pointer"
                    />
                    <Lock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Private to my personal codex</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSavingReflection || !reflectionInput.trim()}
                    className="px-8 py-3 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.2em] font-bold hover:bg-neutral-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    {isSavingReflection ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Inscribing...</span>
                      </>
                    ) : (
                      <>
                        <PenLine className="w-3.5 h-3.5" />
                        <span>Inscribe Reflection</span>
                      </>
                    )}
                  </button>
                </div>

                {reflectionFeedback && (
                  <p className="text-xs text-neutral-300 font-mono pt-1">
                    {reflectionFeedback}
                  </p>
                )}
              </form>
            </div>

            {/* Right: Inscribed List */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="font-serif-classic text-sm uppercase tracking-wider text-neutral-300 font-semibold pb-2 border-b border-neutral-900">
                Inscribed Chronicles ({savedReflections.length})
              </h3>

              {savedReflections.length === 0 ? (
                <div className="p-8 border border-neutral-900 bg-black/50 text-center space-y-2">
                  <p className="font-garamond text-neutral-300 italic text-base">
                    No reflections recorded yet for this thinker.
                  </p>
                  <p className="text-xs text-neutral-400 font-mono">
                    Pen your thoughts above to begin your philosophical treatise.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                  {savedReflections.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 border border-neutral-800 bg-neutral-950/80 space-y-3 relative group hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                        <span>{item.date}</span>
                        <span className="flex items-center gap-1.5 text-neutral-300">
                          {item.isPrivate ? (
                            <>
                              <Lock className="w-3.5 h-3.5 text-neutral-400" />
                              <span>Private</span>
                            </>
                          ) : (
                            <span>Public</span>
                          )}
                        </span>
                      </div>
                      <p className="font-garamond text-base sm:text-lg text-neutral-200 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. FULL-WIDTH BILATERAL NAVIGATION
         ======================================================== */}
      <nav className="w-full py-16 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 bg-neutral-950 border-b border-neutral-900">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-8">
          <Link
            href={`/course/${prevPhilosopher.id}`}
            className="group flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-neutral-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <div>
              <span className="text-xs text-neutral-400 block font-mono">{t.coursePage.prevThinker}</span>
              <span className="font-serif-classic text-sm sm:text-base font-semibold text-neutral-200 group-hover:text-white">
                {prevPData.name}
              </span>
            </div>
          </Link>

          <Link
            href={`/course/${nextPhilosopher.id}`}
            className="group flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-neutral-300 hover:text-white transition-colors text-right"
          >
            <div>
              <span className="text-xs text-neutral-400 block font-mono">{t.coursePage.nextThinker}</span>
              <span className="font-serif-classic text-sm sm:text-base font-semibold text-white">
                {nextPData.name}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </nav>

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
