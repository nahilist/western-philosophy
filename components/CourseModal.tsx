"use client";

import React from "react";
import Image from "next/image";
import { X, BookOpen, Clock, Award, CheckCircle } from "lucide-react";
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
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-neutral-950 border border-neutral-800 shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-white rounded-none p-6 sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center pb-8 border-b border-neutral-800">
          <div className="relative w-24 h-28 sm:w-28 sm:h-32 flex-shrink-0 border border-neutral-700 overflow-hidden bg-black">
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
            <p className="font-garamond text-base italic text-neutral-300">
              &ldquo;{course.quote}&rdquo;
            </p>
          </div>
        </div>

        {/* Course Details Grid */}
        <div className="py-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-neutral-900 text-xs">
          <div className="flex items-center gap-2 text-neutral-400">
            <Clock className="w-4 h-4 text-white" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <Award className="w-4 h-4 text-white" />
            <span>{course.level}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-400 col-span-2 sm:col-span-1">
            <BookOpen className="w-4 h-4 text-white" />
            <span>Certificate of Mastery</span>
          </div>
        </div>

        {/* Overview */}
        <div className="py-6 space-y-3">
          <h4 className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold">
            Course Overview
          </h4>
          <p className="font-garamond text-base sm:text-lg text-neutral-300 leading-relaxed">
            {course.overview}
          </p>
        </div>

        {/* Modules Syllabus */}
        <div className="py-4 space-y-4">
          <h4 className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold">
            Syllabus &amp; Dialectical Modules
          </h4>
          <div className="space-y-3">
            {course.modules.map((m, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-neutral-900/60 border border-neutral-800/80 space-y-1"
              >
                <div className="flex items-center gap-2 font-serif-classic text-xs tracking-wider text-white font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{m.title}</span>
                </div>
                <p className="text-xs text-neutral-400 pl-5 leading-relaxed">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Works */}
        <div className="py-4 space-y-2">
          <h4 className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold">
            Required &amp; Recommended Texts
          </h4>
          <div className="flex flex-wrap gap-2">
            {course.keyWorks.map((work, idx) => (
              <span
                key={idx}
                className="text-xs italic font-garamond px-3 py-1 bg-black border border-neutral-800 text-neutral-300"
              >
                {work}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Footer */}
        <div className="pt-8 mt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-400">
            Complimentary Access via Philosophy Φ Open Dialogues
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2.5 border border-neutral-800 text-neutral-400 hover:text-white text-xs uppercase tracking-[0.2em] transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onEnroll(course)}
              className="flex-1 sm:flex-none px-8 py-2.5 bg-white text-black font-semibold text-xs uppercase tracking-[0.25em] hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

