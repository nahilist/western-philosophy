"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroDescartes() {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 bg-black overflow-hidden border-b border-neutral-900"
    >
      {/* Precision Hairline Background Grid (Architectural blueprint aesthetic) */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-20 [background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"
      />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 xl:gap-28 items-center relative z-10">
        {/* Left Side: Museum Archival Plate */}
        <div className="lg:col-span-5 flex justify-center lg:justify-start">
          <Link
            href="/course/descartes"
            className="relative group cursor-pointer block"
          >
            {/* Architectural Crosshair Corners */}
            <span className="absolute -top-3 -left-3 font-mono text-neutral-400 text-xs select-none pointer-events-none">+</span>
            <span className="absolute -top-3 -right-3 font-mono text-neutral-400 text-xs select-none pointer-events-none">+</span>
            <span className="absolute -bottom-3 -left-3 font-mono text-neutral-400 text-xs select-none pointer-events-none">+</span>
            <span className="absolute -bottom-3 -right-3 font-mono text-neutral-400 text-xs select-none pointer-events-none">+</span>

            {/* Crisp 1px White Architectural Offset Frame */}
            <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-64 sm:w-80 lg:w-88 h-80 sm:h-100 lg:h-112 border border-white/40 z-0 transition-transform duration-700 ease-out group-hover:-translate-x-2 group-hover:-translate-y-2 pointer-events-none" />

            {/* Archival Portrait Frame */}
            <div className="relative z-10 w-64 sm:w-80 lg:w-88 h-80 sm:h-100 lg:h-112 overflow-hidden bg-neutral-950 border border-neutral-800 shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
              <Image
                src="/images/descartes.webp"
                alt="René Descartes by Frans Hals"
                fill
                priority
                className="object-cover object-center grayscale contrast-125 brightness-90 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100"
              />

              {/* Minimal Archival Plate Inscription at bottom of frame */}
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end justify-between text-[10px] font-mono text-neutral-400 tracking-widest uppercase">
                <span>[ARCHIVE • 01]</span>
                <span>PARIS 1637</span>
              </div>
            </div>

            {/* Hover Tooltip */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] tracking-[0.25em] text-neutral-400 font-mono uppercase whitespace-nowrap flex items-center gap-1.5 pt-2">
              <span>{t.heroDescartes.hoverTooltip}</span>
            </div>
          </Link>
        </div>

        {/* Right Side: Stark Monastic Typography */}
        <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left space-y-7">
          <div className="space-y-4">
            {/* Archival Classification Badge */}
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="w-6 h-px bg-neutral-800" />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-400 font-medium">
                {t.heroDescartes.tag}
              </span>
            </div>

            {/* Grand Classical Title */}
            <h1 className="font-serif-classic text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[0.12em] text-white leading-[1.08] uppercase">
              {t.heroDescartes.quote}
            </h1>

            {/* Author Title with Monospace Accent */}
            <p className="font-serif-classic text-sm sm:text-lg tracking-[0.35em] text-neutral-300 uppercase font-semibold">
              {t.heroDescartes.author}
            </p>
          </div>

          <div className="w-12 h-px bg-neutral-800 mx-auto lg:mx-0" />

          {/* Garamond Body Text */}
          <blockquote className="font-garamond text-neutral-200 text-lg sm:text-2xl italic leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
            &ldquo;{t.heroDescartes.body}&rdquo;
          </blockquote>

          {/* Precision CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <a
              href="#courses"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-200 transition-all duration-300 shadow-md text-center cursor-pointer"
            >
              {t.heroDescartes.btnBrowse}
            </a>
            <Link
              href="/course/descartes"
              className="w-full sm:w-auto px-8 py-3.5 border border-neutral-800 hover:border-white text-neutral-300 hover:text-white text-xs uppercase tracking-[0.25em] font-serif-classic transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group bg-neutral-950/60"
            >
              <span>{t.heroDescartes.btnTreatise}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Down Anchor */}
      <a
        href="#courses"
        aria-label="Scroll to course canon"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-300 group"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-neutral-400 group-hover:text-white">
          Scroll Down
        </span>
        <ArrowDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white animate-bounce" />
      </a>
    </section>
  );
}

