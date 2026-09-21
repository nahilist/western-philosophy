"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface CreationBannerProps {
  onJoinClick?: () => void;
}

export default function CreationBanner({ onJoinClick }: CreationBannerProps) {
  const { t } = useLanguage();
  return (
    <section className="relative w-full bg-black text-white py-16 sm:py-24 overflow-hidden">
      {/* Background Michelangelo Hands & Root/Lightning Texture */}
      <div className="relative max-w-6xl mx-auto min-h-[220px] sm:min-h-[280px] flex items-center justify-center">
        {/* Left Hand: Hand of Adam from Sistine Chapel */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-40 sm:w-64 md:w-80 h-32 sm:h-48 md:h-56 pointer-events-none opacity-90">
          <Image
            src="/images/adam_hand_left.jpg"
            alt="Hand of Adam"
            fill
            className="object-contain object-left grayscale contrast-130 brightness-95"
          />
          {/* Subtle fade to black */}
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent" />
        </div>

        {/* Right Hand: Hand of God */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-40 sm:w-64 md:w-80 h-32 sm:h-48 md:h-56 pointer-events-none opacity-90">
          <Image
            src="/images/god_hand_right.jpg"
            alt="Hand of God"
            fill
            className="object-contain object-right grayscale contrast-130 brightness-95"
          />
          {/* Subtle fade to black */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent" />
        </div>

        {/* Center: Lightning / Root Fissures SVG behind the Kant quote */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            className="w-full max-w-xl h-44 opacity-35"
            viewBox="0 0 600 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M180 80 L230 60 L270 95 L320 65 L370 100 L420 75"
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <path
              d="M210 95 L250 115 L290 85 L350 110 L400 90"
              stroke="rgba(255, 255, 255, 0.5)"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            <path
              d="M270 95 L285 125 L310 135"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="0.7"
            />
            <path
              d="M320 65 L335 40 L360 35"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="0.7"
            />
          </svg>
        </div>

        {/* Center Content matching Screenshot 1 */}
        <div className="relative z-10 text-center flex flex-col items-center space-y-5 px-4">
          <div className="space-y-2">
            <h2 className="font-serif-classic text-xl sm:text-3xl lg:text-4xl font-bold tracking-[0.2em] text-white uppercase">
              {t.creation.quote}
            </h2>
            <p className="font-serif-classic text-[11px] sm:text-xs tracking-[0.32em] text-neutral-300 uppercase">
              {t.creation.author}
            </p>
          </div>

          {/* Button: JOIN US! (Solid White Box with Black Text) */}
          <button
            onClick={onJoinClick}
            className="px-10 py-2.5 sm:py-3 bg-white text-black font-serif-classic text-xs sm:text-sm font-bold tracking-[0.25em] uppercase hover:bg-neutral-200 transition-colors cursor-pointer shadow-lg"
          >
            {t.creation.joinBtn}
          </button>
        </div>
      </div>
    </section>
  );
}
