"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, BookOpen, Clock, Award, CheckCircle, Quote, Sparkles, ScrollText, Library } from "lucide-react";
import { PhilosopherCourse } from "@/data/philosophers";

interface CourseModalProps {
  course: PhilosopherCourse | null;
  onClose: () => void;
  onEnroll: (course: PhilosopherCourse) => void;
}

export default function CourseModal({
  course,
  onClose,
  onEnroll,
}: CourseModalProps) {
  const [activeTab, setActiveTab] = useState<"bio" | "concepts" | "syllabus" | "works">("bio");

  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-neutral-950 border border-neutral-800 shadow-[0_30px_90px_rgba(0,0,0,0.95)] text-white p-6 sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center pb-8 border-b border-neutral-800">
          <div className="relative w-28 h-36 sm:w-32 sm:h-40 flex-shrink-0 border border-neutral-700 overflow-hidden bg-black shadow-xl">
            <Image
              src={course.image}
              alt={course.name}
              fill
              className="object-cover grayscale contrast-115"
            />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] px-2.5 py-0.5 border border-neutral-700 text-neutral-400">
                {course.school}
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                {course.era}
              </span>
            </div>
            <h3 className="font-serif-classic text-2xl sm:text-3xl font-bold tracking-[0.15em] text-white uppercase">
              {course.name}
            </h3>
            <p className="font-garamond text-base sm:text-lg italic text-neutral-300">
              &ldquo;{course.quote}&rdquo;
            </p>
            <p className="text-xs text-neutral-500 font-garamond">
              Source: {course.quoteSource}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-neutral-900 text-xs">
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
            <span>{course.seminalWorks.length} Primary Texts</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <ScrollText className="w-4 h-4 text-white" />
            <span>{course.modules.length} Dialectical Modules</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 my-6 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab("bio")}
            className={`pb-3 px-3 text-xs uppercase tracking-[0.2em] font-serif-classic font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === "bio"
                ? "text-white border-b-2 border-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Biography &amp; Overview
          </button>
          <button
            onClick={() => setActiveTab("concepts")}
            className={`pb-3 px-3 text-xs uppercase tracking-[0.2em] font-serif-classic font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === "concepts"
                ? "text-white border-b-2 border-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Core Concepts ({course.keyConcepts.length})
          </button>
          <button
            onClick={() => setActiveTab("syllabus")}
            className={`pb-3 px-3 text-xs uppercase tracking-[0.2em] font-serif-classic font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === "syllabus"
                ? "text-white border-b-2 border-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Complete Syllabus ({course.modules.length} Modules)
          </button>
          <button
            onClick={() => setActiveTab("works")}
            className={`pb-3 px-3 text-xs uppercase tracking-[0.2em] font-serif-classic font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === "works"
                ? "text-white border-b-2 border-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Seminal Books &amp; Quotes
          </button>
        </div>

        {/* Tab 1: Biography & Overview */}
        {activeTab === "bio" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Philosophical Mission</span>
              </h4>
              <p className="font-garamond text-base sm:text-lg text-neutral-200 leading-relaxed">
                {course.overview}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Life &amp; Historical Context</span>
              </h4>
              <p className="font-garamond text-base sm:text-lg text-neutral-300 leading-relaxed">
                {course.biography}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Core Philosophical Concepts */}
        {activeTab === "concepts" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold">
              Foundational Breakthroughs &amp; Axioms
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.keyConcepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-neutral-900/70 border border-neutral-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif-classic text-sm font-semibold text-white tracking-wider">
                      {concept.name}
                    </span>
                    {concept.latinOrGreek && (
                      <span className="text-[10px] italic text-neutral-400 font-garamond">
                        {concept.latinOrGreek}
                      </span>
                    )}
                  </div>
                  <p className="font-garamond text-sm text-neutral-300 leading-relaxed">
                    {concept.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Complete Syllabus & Lessons */}
        {activeTab === "syllabus" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold">
              Dialectical Curriculum &amp; Lecture Breakdown
            </h4>
            <div className="space-y-4">
              {course.modules.map((mod, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-neutral-900/60 border border-neutral-800/80 space-y-3"
                >
                  <div className="flex items-center gap-2 font-serif-classic text-sm tracking-wider text-white font-semibold">
                    <CheckCircle className="w-4 h-4 text-neutral-300 flex-shrink-0" />
                    <span>{mod.title}</span>
                  </div>
                  <p className="text-xs text-neutral-400 pl-6 leading-relaxed">
                    {mod.description}
                  </p>
                  <div className="pl-6 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {mod.lessons.map((lesson, lIdx) => (
                      <div
                        key={lIdx}
                        className="text-[11px] text-neutral-300 font-garamond py-1 px-2.5 bg-black/60 border border-neutral-800"
                      >
                        {lesson}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Seminal Works & Quotes */}
        {activeTab === "works" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Books */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold">
                Major Treatises &amp; Publications
              </h4>
              <div className="space-y-3">
                {course.seminalWorks.map((work, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-neutral-900/60 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <h5 className="font-serif-classic text-sm font-semibold text-white tracking-wider">
                        {work.title}
                      </h5>
                      <p className="font-garamond text-xs text-neutral-300 mt-1">
                        {work.summary}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-neutral-400 self-start sm:self-auto border border-neutral-800 px-2 py-0.5">
                      {work.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Famous Aphorisms */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold flex items-center gap-2">
                <Quote className="w-3.5 h-3.5" />
                <span>Memorable Aphorisms</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.famousQuotes.map((q, idx) => (
                  <blockquote
                    key={idx}
                    className="p-3.5 bg-black border border-neutral-800 text-xs italic font-garamond text-neutral-200 leading-relaxed"
                  >
                    &ldquo;{q}&rdquo;
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-8 mt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-400">
            Philosophy Φ Academy • Open Access Repository
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2.5 border border-neutral-800 text-neutral-400 hover:text-white text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => onEnroll(course)}
              className="flex-1 sm:flex-none px-8 py-2.5 bg-white text-black font-semibold text-xs uppercase tracking-[0.25em] hover:bg-neutral-200 transition-colors shadow-lg cursor-pointer"
            >
              Enroll In Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
