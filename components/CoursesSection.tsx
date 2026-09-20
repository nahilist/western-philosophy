"use client";

import React from "react";
import Image from "next/image";
import { PHILOSOPHER_COURSES, PhilosopherCourse } from "@/data/philosophers";

interface CoursesSectionProps {
  onSelectCourse: (course: PhilosopherCourse) => void;
}

export default function CoursesSection({ onSelectCourse }: CoursesSectionProps) {
  return (
    <section id="courses" className="py-24 px-6 sm:px-12 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading matching screenshot */}
        <div className="text-center mb-16 space-y-2">
          <h2 className="font-serif-classic text-2xl sm:text-3xl lg:text-4xl font-normal tracking-[0.35em] text-white uppercase">
            COURSES
          </h2>
          <div className="w-12 h-px bg-neutral-800 mx-auto mt-4" />
        </div>

        {/* 4 Philosophers Grid matching screenshot */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {PHILOSOPHER_COURSES.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectCourse(item)}
              className="group cursor-pointer flex flex-col items-center text-center space-y-4 transition-all duration-300"
            >
              {/* Image Frame */}
              <div className="relative w-full aspect-[4/5] bg-neutral-950 border border-neutral-900 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-500 group-hover:border-neutral-700 group-hover:shadow-[0_15px_40px_rgba(255,255,255,0.05)]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover object-top grayscale contrast-110 brightness-95 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-105"
                />

                {/* Subtle vignette layer */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300">
                  <span className="px-4 py-1.5 border border-white text-[10px] tracking-[0.25em] text-white uppercase font-medium bg-black/60">
                    View Course
                  </span>
                </div>
              </div>

              {/* Philosopher Name */}
              <div className="space-y-1">
                <h3 className="font-serif-classic text-xs sm:text-sm font-semibold tracking-[0.25em] text-neutral-200 uppercase transition-colors group-hover:text-white">
                  {item.name}
                </h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-light">
                  {item.school}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

