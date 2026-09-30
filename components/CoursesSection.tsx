"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

const ROMAN_NUMERALS = [
  "I", "II", "III", "IV", "V", "VI", "VII", 
  "VIII", "IX", "X", "XI", "XII", "XIII", "XIV"
];

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
    <section 
      id="courses" 
      className="w-full bg-black text-white py-28 sm:py-36 px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-28 border-b border-neutral-900 relative"
    >
      {/* Precision Corner Crosshairs */}
      <span className="absolute top-4 left-6 sm:left-12 font-mono text-neutral-400 text-xs select-none pointer-events-none">+</span>
      <span className="absolute top-4 right-6 sm:right-12 font-mono text-neutral-400 text-xs select-none pointer-events-none">+</span>

      <div className="w-full mx-auto space-y-16">
        {/* Section Heading with Archival Framing */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-neutral-800" />
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-neutral-400 font-semibold">
              {t.canon.tag}
            </span>
            <span className="w-8 h-px bg-neutral-800" />
          </div>

          <h2 className="font-serif-classic text-3xl sm:text-5xl lg:text-6xl font-normal tracking-[0.2em] text-white uppercase">
            {t.canon.title}
          </h2>

          <p className="font-garamond text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            {t.canon.subtitle}
          </p>
        </div>

        {/* Minimal Era Filter Navigation Tabs (Hairline Bar) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 border-y border-neutral-900/80 py-4 max-w-4xl mx-auto">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 sm:px-5 py-2 text-xs tracking-[0.2em] uppercase font-serif-classic transition-all duration-300 cursor-pointer flex items-center gap-2.5 ${
                  isActive
                    ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-950 border border-transparent hover:border-neutral-800"
                }`}
              >
                <span>{t.canon[tab.labelKey]}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 ${
                    isActive ? "bg-black text-white" : "text-neutral-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 14 Philosophers Grid: Architectural Hairline Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-px bg-neutral-900 border border-neutral-900">
          {displayedPhilosophers.map((item, idx) => {
            const pData = getPhilosopherData(item);
            const romanIndex = ROMAN_NUMERALS[idx] || String(idx + 1);

            return (
              <Link
                key={item.id}
                href={`/course/${item.id}`}
                className="group flex flex-col justify-between p-4 sm:p-5 bg-black hover:bg-neutral-950 transition-colors duration-300 cursor-pointer relative"
              >
                {/* Top Metadatum: Roman Numeral & Year */}
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase tracking-widest pb-3">
                  <span className="font-semibold text-neutral-400 group-hover:text-white transition-colors">
                    {romanIndex}
                  </span>
                  <span className="truncate max-w-[85px] text-right">
                    {pData.era.split("(")[0].trim()}
                  </span>
                </div>

                {/* Portrait Plate with High-Contrast Monochromatic Filter */}
                <div className="relative w-full aspect-[3/4] bg-neutral-950 border border-neutral-800/80 overflow-hidden my-3">
                  <Image
                    src={item.image}
                    alt={pData.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 14vw"
                    className="object-cover object-top grayscale contrast-125 brightness-90 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100"
                  />

                  {/* Subtle Archival Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />

                  {/* Hover Floating Arrow Indicator */}
                  <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/90 border border-white/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* Philosopher Name & Philosophical Tradition */}
                <div className="pt-2 space-y-1 text-left">
                  <h3 className="font-serif-classic text-sm sm:text-base font-semibold tracking-[0.12em] text-neutral-200 uppercase transition-colors group-hover:text-white truncate">
                    {pData.name}
                  </h3>
                  <p className="text-[11px] font-garamond text-neutral-400 italic truncate group-hover:text-neutral-300 transition-colors">
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
