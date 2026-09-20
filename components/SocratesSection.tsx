"use client";

import React from "react";
import Image from "next/image";

interface SocratesSectionProps {
  onSelectSocrates?: () => void;
}

export default function SocratesSection({ onSelectSocrates }: SocratesSectionProps) {
  return (
    <section
      id="socrates"
      className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center bg-black overflow-hidden py-24"
    >
      {/* Background Image: The Death of Socrates by Jacques-Louis David */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/socrates_death.jpg"
          alt="The Death of Socrates by Jacques-Louis David"
          fill
          priority
          className="object-cover object-center opacity-70 contrast-110 saturate-90"
        />

        {/* Cinematic Vignette Overlays */}
        {/* Top Fade */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black via-black/80 to-transparent" />
        {/* Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent" />
        {/* Left Heavy Vignette for High-Contrast Text Readability */}
        <div className="absolute inset-y-0 left-0 w-full md:w-3/4 bg-gradient-to-r from-black via-black/75 to-transparent" />
        {/* Subtle radial center vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.85)_100%)]" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-6 sm:px-12">
        <div className="max-w-xl text-left space-y-6">
          <div className="inline-block border-b border-neutral-600 pb-1">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-neutral-300 font-light">
              Classical Antiquity • Athens, 399 BCE
            </span>
          </div>

          <blockquote className="font-serif-classic text-2xl sm:text-4xl lg:text-5xl font-bold tracking-[0.12em] text-white leading-tight uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
            I KNOW THAT I AM
            <br />
            INTELLIGENT, BECAUSE I KNOW
            <br />
            THAT I KNOW NOTHING.
          </blockquote>

          <div className="pt-2">
            <p className="font-serif-classic text-base sm:text-lg tracking-[0.35em] text-neutral-200 uppercase font-semibold">
              SÓCRATES
            </p>
            <p className="font-garamond italic text-neutral-400 text-sm sm:text-base mt-1">
              Plato&apos;s Apology (21d) — The Oracle at Delphi &amp; Socratic Ignorance
            </p>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button
              onClick={onSelectSocrates}
              className="px-6 py-2.5 bg-white/10 hover:bg-white text-white hover:text-black border border-white/40 hover:border-white text-xs uppercase tracking-[0.25em] transition-all duration-300 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            >
              Examine Dialogue
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

