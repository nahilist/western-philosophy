"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { PHILOSOPHER_COURSES } from "@/data/philosophers";
import { useLanguage } from "@/context/LanguageContext";

type EraFilter = "all" | "antiquity" | "early_modern" | "enlightenment" | "contemporary";

interface FilterTab {
  id: EraFilter;
  labelKey: "all" | "antiquity" | "earlyModern" | "enlightenment" | "contemporary";
  count: number;
}

const EPOCH_MAP: Record<string, EraFilter> = {
  socrates: "antiquity",
  plato: "antiquity",
  aristotle: "antiquity",
  machiavelli: "early_modern",
  descartes: "early_modern",
  spinoza: "early_modern",
  hume: "enlightenment",
  kant: "enlightenment",
  hegel: "enlightenment",
  schopenhauer: "contemporary",
  marx: "contemporary",
  nietzsche: "contemporary",
  russell: "contemporary",
  camus: "contemporary",
};

export default function CoursesSection() {
  const { t, getPhilosopherData } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<EraFilter>("all");

  const filterTabs: FilterTab[] = useMemo(
    () => [
      { id: "all", labelKey: "all", count: PHILOSOPHER_COURSES.length },
      { id: "antiquity", labelKey: "antiquity", count: 3 },
      { id: "early_modern", labelKey: "earlyModern", count: 3 },
      { id: "enlightenment", labelKey: "enlightenment", count: 3 },
      { id: "contemporary", labelKey: "contemporary", count: 5 },
    ],
    []
  );

  const displayedPhilosophers = useMemo(() => {
    if (activeFilter === "all") return PHILOSOPHER_COURSES;
    return PHILOSOPHER_COURSES.filter((p) => EPOCH_MAP[p.id] === activeFilter);
  }, [activeFilter]);

  return (
    <section id="courses" className="w-full bg-black text-white py-24 sm:py-32 px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-28 border-b border-neutral-900">
      <div className="w-full mx-auto">
        {/* Section Heading with subtle accent line */}
        <div className="text-center mb-12 sm:mb-16 space-y-3">
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-neutral-800" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-medium">
              {t.canon.tag}
            </span>
            <span className="w-8 h-px bg-neutral-800" />
          </div>
          <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[0.35em] text-white uppercase">
            {t.canon.title}
          </h2>
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            {t.canon.subtitle}
          </p>
        </div>

        {/* Era Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-14 sm:mb-16">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 sm:px-5 py-2 text-[10px] sm:text-[11px] tracking-[0.22em] uppercase font-serif-classic transition-all duration-300 border cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "bg-white text-black border-white font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white"
                }`}
              >
                <span>{t.canon[tab.labelKey]}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-sm ${
                    isActive ? "bg-black text-white" : "bg-neutral-900 text-neutral-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 14 Philosophers Grid: Perfectly balanced (7 cols on 2xl/xl screens = 2 rows of 7!) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-5 sm:gap-6 lg:gap-7">
          {displayedPhilosophers.map((item) => {
            const pData = getPhilosopherData(item);
            return (
              <Link
                key={item.id}
                href={`/course/${item.id}`}
                className="group flex flex-col items-center text-center space-y-3.5 transition-all duration-300 cursor-pointer"
              >
                {/* Image Frame */}
                <div className="relative w-full aspect-[3/4] bg-neutral-950 border border-neutral-800/90 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-500 group-hover:border-neutral-400 group-hover:shadow-[0_15px_40px_rgba(255,255,255,0.12)]">
                  <Image
                    src={item.image}
                    alt={pData.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 14vw"
                    className="object-cover object-top grayscale-0 md:grayscale contrast-110 brightness-95 transition-all duration-700 group-hover:scale-105 md:group-hover:grayscale-0 group-hover:brightness-105"
                  />

                  {/* Vignette layer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

                  {/* Subtle top era badge */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-neutral-300 px-1.5 py-0.5 bg-black/60 backdrop-blur-[2px] border border-neutral-800">
                      {pData.era.split("(")[0].trim()}
                    </span>
                  </div>

                  {/* Hover overlay button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 border border-white text-[9px] sm:text-[10px] tracking-[0.22em] text-white uppercase font-serif-classic bg-black/85 shadow-lg">
                      <BookOpen className="w-3 h-3 text-white" />
                      <span>{t.canon.openDossier}</span>
                      <ArrowRight className="w-2.5 h-2.5 text-white" />
                    </span>
                  </div>
                </div>

                {/* Philosopher Name & Primary School */}
                <div className="space-y-1 w-full px-1">
                  <h3 className="font-serif-classic text-xs sm:text-[13px] font-semibold tracking-[0.2em] text-neutral-200 uppercase transition-colors group-hover:text-white truncate">
                    {pData.name}
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-neutral-500 font-light group-hover:text-neutral-400 transition-colors truncate">
                    {pData.school.split(",")[0]}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
