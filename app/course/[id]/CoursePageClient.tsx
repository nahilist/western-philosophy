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
  Loader2,
  Download
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import JoinModal from "@/components/JoinModal";
import AboutModal from "@/components/AboutModal";
import DailyWisdomModal from "@/components/DailyWisdomModal";
import TypographicPosterModal, { PosterQuoteData } from "@/components/TypographicPosterModal";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { PhilosopherCourse, PHILOSOPHER_COURSES } from "@/data/philosophers";
import { PHILOSOPHER_REFERENCES } from "@/lib/seo/references";
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
  const [posterModalOpen, setPosterModalOpen] = useState(false);
  const [posterData, setPosterData] = useState<PosterQuoteData | null>(null);

  const openPoster = (d: PosterQuoteData) => {
    setPosterData(d);
    setPosterModalOpen(true);
  };

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

  const monographSections = [
    { id: "biography", num: "01", label: t.coursePage.section01 || "Odyssey" },
    { id: "concepts", num: "02", label: t.coursePage.section02 || "Doctrine" },
    { id: "pure-wisdom", num: "03", label: t.coursePage.section02b || "Wisdom" },
    { id: "syllabus", num: "04", label: t.coursePage.section03 || "Syllabus" },
    { id: "treatises", num: "05", label: t.coursePage.section04 || "Texts" },
    { id: "aphorisms", num: "06", label: t.coursePage.section05 || "Maxims" },
    { id: "reflections", num: "07", label: "Codex" },
  ];

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
          const parsed = JSON.parse(savedRefls) as Array<{
            id?: string;
            reflection_text?: string;
            created_at?: string;
            is_private?: boolean;
          }>;
          setSavedReflections(
            parsed.map((r, index) => ({
              id: r.id || `local-${course.id}-${index}`,
              text: r.reflection_text ?? "",
              date: r.created_at ? new Date(r.created_at).toLocaleDateString() : "Saved locally",
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
        <Breadcrumbs
          items={[
            { name: t.coursePage.homeLink || "Home", path: "/" },
            { name: "Philosophers", path: "/philosophers" },
            { name: pData.name, path: `/course/${course.id}` },
          ]}
        />
        <div className="flex items-center gap-4 text-xs tracking-widest text-neutral-400 uppercase">
          <span>{pData.school.split(",")[0]}</span>
          <span className="text-neutral-600">•</span>
          <span>{pData.era}</span>
        </div>
      </div>

      {/* Floating Monastic Section Tracker (01 – 07) */}
      <aside
        aria-label="Treatise Section Index"
        className="hidden 2xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2.5 py-4 px-2 border border-neutral-900 bg-black/85 backdrop-blur-md shadow-2xl"
      >
        <span className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest mb-1 select-none">
          INDEX
        </span>
        {monographSections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            title={s.label}
            className="group relative flex items-center justify-center p-1 cursor-pointer"
          >
            <span className="font-mono text-[10px] text-neutral-400 group-hover:text-white transition-colors">
              {s.num}
            </span>
            {/* Minimalist Hover Tooltip */}
            <span className="absolute right-9 px-2.5 py-1 bg-black border border-neutral-800 text-[10px] uppercase font-mono tracking-widest text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
              {s.num} • {s.label}
            </span>
          </a>
        ))}
      </aside>

      {/* ========================================================
          1. FULL-BLEED 100% WIDTH HERO SECTION
         ======================================================== */}
      <section className="w-full py-16 sm:py-24 lg:py-32 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-black relative">
        {/* Precision Corner Crosshairs */}
        <span className="absolute top-4 left-6 sm:left-12 font-mono text-neutral-400 text-xs select-none pointer-events-none">+</span>
        <span className="absolute top-4 right-6 sm:right-12 font-mono text-neutral-400 text-xs select-none pointer-events-none">+</span>

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
                {pData.name}
              </h1>

              <p className="font-serif-classic text-base sm:text-xl xl:text-2xl tracking-[0.3em] text-neutral-300 uppercase font-semibold">
                {course.title}
              </p>
            </div>

            <div className="w-20 h-px bg-neutral-800 mx-auto lg:mx-0" />

            <blockquote className="font-garamond text-lg sm:text-2xl xl:text-3xl italic text-neutral-200 leading-relaxed font-light">
              &ldquo;{pData.quote}&rdquo;
            </blockquote>

            <p className="font-garamond text-lg text-neutral-300 leading-relaxed max-w-3xl">
              {pData.overview}
            </p>

            <p className="font-garamond text-sm text-neutral-400">
              Primary Source: {course.quoteSource}
            </p>

            {course.coreQuestion && (
              <div className="p-4 sm:p-5 border-l-2 border-white/80 bg-neutral-950/90 border border-neutral-900 space-y-1.5 text-left">
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-400 font-semibold block">
                  {t.coursePage.fundamentalInquiry || "The Fundamental Inquiry"}
                </span>
                <p className="font-serif-classic text-sm sm:text-base text-neutral-100 italic leading-relaxed">
                  &ldquo;{course.coreQuestion}&rdquo;
                </p>
              </div>
            )}

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
                href="#pure-wisdom"
                className="px-7 py-3.5 border border-white/80 hover:bg-white hover:text-black text-white text-xs uppercase tracking-[0.25em] transition-all font-semibold"
              >
                {t.coursePage.section02b || "Pure Wisdom"}
              </a>
              <a
                href="#syllabus"
                className="px-7 py-3.5 border border-neutral-700 hover:border-white text-neutral-300 hover:text-white text-xs uppercase tracking-[0.25em] transition-colors"
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

      <section aria-labelledby="sources-heading" className="w-full py-16 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-neutral-950/35">
        <div className="max-w-5xl">
          <p className="font-mono text-[10px] tracking-[0.3em] text-neutral-500 uppercase">Evidence trail</p>
          <h2 id="sources-heading" className="font-serif-classic text-2xl sm:text-3xl font-bold uppercase tracking-wider mt-3">Sources &amp; Further Reading</h2>
          <p className="font-garamond text-lg text-neutral-300 mt-4 leading-relaxed">
            Begin with the primary works listed in this guide, then consult the academic reference below for scholarly context and bibliography.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-neutral-300">
            {(PHILOSOPHER_REFERENCES[course.id] ?? []).map((reference) => (
              <li key={reference.url}>
                <a href={reference.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-neutral-700 hover:decoration-white hover:text-white transition-colors">
                  {reference.title}
                </a>
              </li>
            ))}
            <li><Link href="/sources" className="underline underline-offset-4 decoration-neutral-700 hover:decoration-white hover:text-white">Read the platform source policy</Link></li>
          </ul>
        </div>
      </section>

      {/* ========================================================
          2. SECTION 01: THE ODYSSEY (100% Full-Bleed 2-Column Layout)
         ======================================================== */}
      <section id="biography" className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-black relative">
        <span className="absolute top-4 left-6 sm:left-12 font-mono text-neutral-600 text-xs select-none pointer-events-none">+</span>
        <span className="absolute top-4 right-6 sm:right-12 font-mono text-neutral-600 text-xs select-none pointer-events-none">+</span>
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
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs tracking-[0.25em] text-neutral-400 uppercase font-serif-classic block">
                  — {pData.name}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    openPoster({
                      quote: course.famousQuotes[0],
                      author: pData.name,
                      school: pData.school,
                      era: pData.era,
                    })
                  }
                  className="flex items-center gap-1.5 px-2.5 py-1 border border-neutral-800 hover:border-white text-[10px] uppercase font-mono tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Card</span>
                </button>
              </div>
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
      <section id="concepts" className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-black relative">
        <span className="absolute top-4 left-6 sm:left-12 font-mono text-neutral-600 text-xs select-none pointer-events-none">+</span>
        <span className="absolute top-4 right-6 sm:right-12 font-mono text-neutral-600 text-xs select-none pointer-events-none">+</span>
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
          3. SECTION 02B: PURE WISDOM & DIALECTICAL AXIOMS (Full-Width Minimal Section)
         ======================================================== */}
      {course.pureWisdom && course.pureWisdom.length > 0 && (
        <section id="pure-wisdom" className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-neutral-950/90 relative">
          <span className="absolute top-4 left-6 sm:left-12 font-mono text-neutral-600 text-xs select-none pointer-events-none">+</span>
          <span className="absolute top-4 right-6 sm:right-12 font-mono text-neutral-600 text-xs select-none pointer-events-none">+</span>
          <div className="w-full space-y-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-900">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-neutral-400 tracking-widest font-semibold">
                    03
                  </span>
                  <div className="w-8 h-px bg-neutral-800" />
                  <span className="text-xs uppercase tracking-[0.35em] text-neutral-400">
                    {t.coursePage.section02b || "Pure Wisdom"}
                  </span>
                </div>
                <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.12em] text-white uppercase">
                  {t.coursePage.section02bTitle || "PURE WISDOM & DIALECTICAL AXIOMS"}
                </h2>
              </div>
              <p className="text-xs text-neutral-400 tracking-widest uppercase font-mono max-w-md text-left sm:text-right">
                {t.coursePage.section02bSub ||
                  "Essential philosophical maxims stripped of superficial ornamentation—pure, eternal reflections designed for meditative contemplation."}
              </p>
            </div>

            {/* Dialectical Inquiry & Paradox Highlight Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {course.coreQuestion && (
                <div className="p-8 border border-neutral-800 bg-black/80 space-y-3 relative group hover:border-neutral-700 transition-colors">
                  <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-400 font-semibold block">
                    {t.coursePage.fundamentalInquiry || "The Fundamental Inquiry"}
                  </span>
                  <h3 className="font-serif-classic text-xl sm:text-2xl text-white leading-relaxed font-light">
                    &ldquo;{course.coreQuestion}&rdquo;
                  </h3>
                  <div className="w-12 h-px bg-neutral-800" />
                  <p className="text-xs text-neutral-400 font-garamond leading-relaxed">
                    The ontological axis around which the thinker&apos;s entire intellectual and ethical life rotated.
                  </p>
                </div>
              )}

              {course.epistemicParadox && (
                <div className="p-8 border border-neutral-800 bg-black/80 space-y-3 relative group hover:border-neutral-700 transition-colors">
                  <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-400 font-semibold block">
                    {t.coursePage.dialecticalParadox || "The Dialectical Paradox"}
                  </span>
                  <h3 className="font-serif-classic text-xl sm:text-2xl text-neutral-200 leading-relaxed font-light italic">
                    &ldquo;{course.epistemicParadox}&rdquo;
                  </h3>
                  <div className="w-12 h-px bg-neutral-800" />
                  <p className="text-xs text-neutral-400 font-garamond leading-relaxed">
                    The irreducible contradiction that shatters dogmatic complacency and awakens conscious inquiry.
                  </p>
                </div>
              )}
            </div>

            {/* Pure Wisdom Cards (Minimal 3-Column Responsive Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {course.pureWisdom.map((item, idx) => (
                <div
                  key={idx}
                  className="p-8 border border-neutral-800/90 bg-black flex flex-col justify-between space-y-8 hover:border-neutral-600 transition-all duration-300 relative group"
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-400 tracking-widest font-semibold">
                        AXIOM 0{idx + 1}
                      </span>
                      {item.latinOrGreek && (
                        <span className="text-neutral-400 italic font-garamond text-sm">
                          {item.latinOrGreek}
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif-classic text-2xl font-bold text-white tracking-wide uppercase leading-snug">
                      {item.axiom}
                    </h4>

                    <div className="w-10 h-px bg-neutral-800 group-hover:w-16 group-hover:bg-neutral-500 transition-all" />

                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-neutral-400 font-semibold block">
                        The Pure Essence
                      </span>
                      <p className="font-garamond text-base sm:text-lg text-neutral-200 leading-relaxed font-light">
                        {item.essence}
                      </p>
                    </div>

                    <div className="pt-2 space-y-2 border-t border-neutral-900">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-neutral-400 font-semibold block">
                        Contemplative Practice
                      </span>
                      <p className="font-garamond text-sm sm:text-base text-neutral-300 leading-relaxed italic">
                        &ldquo;{item.contemplation}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-900 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const note = `[Contemplating ${pData.name} — ${item.axiom}]: ${item.contemplation}`;
                        setReflectionInput(note);
                        const el = document.getElementById("reflections");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="py-2.5 px-2 border border-neutral-800 hover:border-white text-neutral-400 hover:text-white text-[10px] uppercase tracking-[0.15em] font-serif-classic transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-neutral-950"
                    >
                      <Sparkles className="w-3 h-3 text-neutral-400" />
                      <span>{t.coursePage.inscribeInCodex || "Codex"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openPoster({
                          quote: item.essence,
                          author: pData.name,
                          axiom: item.axiom,
                          latinOrGreek: item.latinOrGreek,
                          school: pData.school,
                          era: pData.era,
                        })
                      }
                      className="py-2.5 px-2 border border-neutral-800 hover:border-white text-neutral-300 hover:text-white text-[10px] uppercase tracking-[0.15em] font-serif-classic transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-neutral-900"
                    >
                      <Download className="w-3 h-3" />
                      <span>Card</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          4. SECTION 04: DIALECTICAL SYLLABUS (Full-Width Split Layout)
         ======================================================== */}
      <section id="syllabus" className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-black relative">
        <span className="absolute top-4 left-6 sm:left-12 font-mono text-neutral-600 text-xs select-none pointer-events-none">+</span>
        <span className="absolute top-4 right-6 sm:right-12 font-mono text-neutral-600 text-xs select-none pointer-events-none">+</span>
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 xl:gap-28 items-start">
          {/* Left Column: Curriculum Overview & Action */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-neutral-400 tracking-widest font-semibold">
                  04
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
          5. SECTION 05: SEMINAL TREATISES (Full-Width 3-Column Grid)
         ======================================================== */}
      <section id="treatises" className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-black relative">
        <span className="absolute top-4 left-6 sm:left-12 font-mono text-neutral-600 text-xs select-none pointer-events-none">+</span>
        <span className="absolute top-4 right-6 sm:right-12 font-mono text-neutral-600 text-xs select-none pointer-events-none">+</span>
        <div className="w-full space-y-16">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-900">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-neutral-400 tracking-widest font-semibold">
                  05
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
          6. SECTION 06: MEMORABLE APHORISMS (Full-Width 2-Col Grid)
         ======================================================== */}
      <section id="aphorisms" className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-black relative">
        <span className="absolute top-4 left-6 sm:left-12 font-mono text-neutral-600 text-xs select-none pointer-events-none">+</span>
        <span className="absolute top-4 right-6 sm:right-12 font-mono text-neutral-600 text-xs select-none pointer-events-none">+</span>
        <div className="w-full space-y-16">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-neutral-400 tracking-widest font-semibold">
                06
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
                className="pl-8 border-l-2 border-white/80 space-y-4 font-garamond text-xl sm:text-2xl lg:text-3xl italic text-neutral-200 leading-relaxed group"
              >
                <p>&ldquo;{q}&rdquo;</p>
                <div className="flex items-center justify-between not-italic">
                  <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-serif-classic block">
                    — {pData.name}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      openPoster({
                        quote: q,
                        author: pData.name,
                        school: pData.school,
                        era: pData.era,
                      })
                    }
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 px-2.5 py-1 border border-neutral-800 hover:border-white text-[10px] uppercase font-mono tracking-widest text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Card</span>
                  </button>
                </div>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. SECTION 07: THE CONTEMPLATIVE CODEX (Reflections Journal)
         ======================================================== */}
      <section id="reflections" className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-neutral-950 relative">
        <span className="absolute top-4 left-6 sm:left-12 font-mono text-neutral-600 text-xs select-none pointer-events-none">+</span>
        <span className="absolute top-4 right-6 sm:right-12 font-mono text-neutral-600 text-xs select-none pointer-events-none">+</span>
        <div className="w-full space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-900">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-neutral-400 tracking-widest font-semibold">
                  07
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
      <TypographicPosterModal
        isOpen={posterModalOpen}
        onClose={() => setPosterModalOpen(false)}
        data={posterData}
      />
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
