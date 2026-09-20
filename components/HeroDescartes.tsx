"use client";

import React from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

interface HeroDescartesProps {
  onSelectDescartes?: () => void;
}

export default function HeroDescartes({ onSelectDescartes }: HeroDescartesProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-6 sm:px-12 bg-black overflow-hidden"
    >
      {/* Subtle background ambient radial light */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neutral-900/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Side: Descartes Framed Composition */}
        <div className="lg:col-span-6 flex justify-center lg:justify-start">
          <div className="relative group cursor-pointer" onClick={onSelectDescartes}>
            {/* White modern geometric frame offset behind the portrait */}
            <div className="absolute -top-4 -left-4 sm:-top-7 sm:-left-7 w-64 sm:w-84 h-80 sm:h-104 border-2 border-white/90 z-0 transition-transform duration-700 ease-out group-hover:-translate-x-1 group-hover:-translate-y-1" />

            {/* Subtle glow layer */}
            <div className="absolute inset-0 bg-neutral-900/40 z-0 blur-lg" />

            {/* Portrait Image Container */}
            <div className="relative z-10 w-64 sm:w-84 h-80 sm:h-104 overflow-hidden bg-neutral-950 border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
              <Image
                src="/images/descartes.jpg"
                alt="René Descartes by Frans Hals"
                fill
                priority
                className="object-cover object-center grayscale contrast-115 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />

              {/* Subtle inner dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            </div>

            {/* Tooltip on hover */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] tracking-[0.25em] text-neutral-400 uppercase whitespace-nowrap">
              Click to view Cartesian syllabus
            </div>
          </div>
        </div>

        {/* Right Side: Iconic Quote & Philosophy Name */}
        <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left space-y-6">
          <div className="space-y-3">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-neutral-400 font-medium">
              Rationalism & Epistemology
            </span>
            <h1 className="font-serif-classic text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[0.15em] text-white leading-tight uppercase">
              COGITO, ERGO SUM
            </h1>
            <p className="font-serif-classic text-sm sm:text-base tracking-[0.3em] text-neutral-300 uppercase">
              RENÉ DESCARTES
            </p>
          </div>

          <div className="w-16 h-px bg-neutral-800 mx-auto lg:mx-0 my-4" />

          <p className="font-garamond text-neutral-400 text-base sm:text-lg italic max-w-lg leading-relaxed mx-auto lg:mx-0">
            &ldquo;I resolved to pretend that all the things that had ever entered into my mind were no more true than the illusions of my dreams. But immediately afterwards I noticed that whilst I thus wished to think all things false, it was absolutely necessary that I who thought so should be something.&rdquo;
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <a
              href="#courses"
              className="px-6 py-3 border border-white/80 text-white text-xs uppercase tracking-[0.25em] hover:bg-white hover:text-black transition-all duration-300"
            >
              Explore Courses
            </a>
            <button
              onClick={onSelectDescartes}
              className="px-6 py-3 text-neutral-400 hover:text-white text-xs uppercase tracking-[0.25em] transition-colors"
            >
              Read Biography →
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <a
        href="#socrates"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-300 group"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 group-hover:text-neutral-300">
          Scroll
        </span>
        <ArrowDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white animate-bounce" />
      </a>
    </section>
  );
}

