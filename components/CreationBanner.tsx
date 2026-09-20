"use client";

import React from "react";
import Image from "next/image";

interface CreationBannerProps {
  onJoinClick: () => void;
}

export default function CreationBanner({ onJoinClick }: CreationBannerProps) {
  return (
    <section className="relative w-full min-h-[420px] sm:min-h-[480px] bg-black text-white flex items-center justify-center overflow-hidden py-16">
      {/* Background Central Lightning Crackle / Cosmic Sparks */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {/* SVG Lightning Fissure Lines behind the Kant quote */}
        <svg
          className="w-full max-w-3xl h-64 opacity-40 animate-pulse-subtle"
          viewBox="0 0 700 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Lightning branch 1 */}
          <path
            d="M200 100 L260 70 L310 110 L370 80 L440 120 L500 90"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Lightning branch 2 */}
          <path
            d="M240 120 L290 140 L340 100 L410 130 L470 105"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          {/* Sub branch */}
          <path
            d="M310 110 L330 150 L360 160"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="0.7"
          />
          <path
            d="M370 80 L390 50 L420 40"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="0.7"
          />
        </svg>

        {/* Ambient white radial core */}
        <div className="absolute w-72 h-72 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Left Hand: Adam's Hand reaching inwards */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-48 sm:w-80 md:w-96 h-40 sm:h-64 z-10 pointer-events-none opacity-85">
        <Image
          src="/images/adam_hand_left.jpg"
          alt="Michelangelo - Hand of Adam"
          fill
          className="object-contain object-left grayscale contrast-130 brightness-90 filter drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
        />
        {/* Mask fade to black */}
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent" />
      </div>

      {/* Right Hand: God's Hand reaching inwards */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 sm:w-80 md:w-96 h-40 sm:h-64 z-10 pointer-events-none opacity-85">
        <Image
          src="/images/god_hand_right.jpg"
          alt="Michelangelo - Hand of God"
          fill
          className="object-contain object-right grayscale contrast-130 brightness-90 filter drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
        />
        {/* Mask fade to black */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent" />
      </div>

      {/* Center Content matching screenshot */}
      <div className="relative z-20 max-w-xl mx-auto px-6 text-center flex flex-col items-center space-y-6">
        <div className="space-y-2">
          <h2 className="font-serif-classic text-2xl sm:text-4xl lg:text-5xl font-bold tracking-[0.2em] text-white uppercase drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
            TO BE IS TO DO.
          </h2>
          <p className="font-serif-classic text-xs sm:text-sm tracking-[0.35em] text-neutral-300 uppercase font-medium">
            IMMANUEL KANT
          </p>
        </div>

        {/* High-Contrast JOIN US! Button */}
        <button
          onClick={onJoinClick}
          className="px-10 sm:px-14 py-3 sm:py-3.5 bg-white text-black font-serif-classic text-sm sm:text-base font-bold tracking-[0.25em] uppercase hover:bg-black hover:text-white border-2 border-white transition-all duration-300 shadow-[0_4px_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] cursor-pointer"
        >
          JOIN US!
        </button>
      </div>
    </section>
  );
}

