"use client";

import React from "react";
import Image from "next/image";

interface CosmicSectionProps {
  onSelectNietzsche?: () => void;
  onSelectMachiavelli?: () => void;
}

export default function CosmicSection({
  onSelectNietzsche,
  onSelectMachiavelli,
}: CosmicSectionProps) {
  return (
    <section className="relative min-h-screen bg-black text-white py-24 px-6 sm:px-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neutral-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col items-center space-y-32">
        {/* ========================================================
            1. TOP: ANGEL STATUE WITH CELESTIAL HALOS & ARCS
           ======================================================== */}
        <div className="relative flex flex-col items-center">
          {/* Subtle heavenly beam from above */}
          <div className="absolute -top-24 w-40 h-72 bg-gradient-to-b from-white/20 via-white/5 to-transparent blur-xl pointer-events-none" />

          {/* Concentric Geometric Halos & Arcs */}
          <div className="relative w-80 h-72 sm:w-96 sm:h-80 flex items-center justify-center">
            {/* SVG Halo Lines matching the screenshot */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 380 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Center Main Halo Circle */}
              <circle
                cx="190"
                cy="140"
                r="70"
                stroke="rgba(255, 255, 255, 0.65)"
                strokeWidth="1.5"
              />
              {/* Left Intersecting Arch */}
              <circle
                cx="100"
                cy="170"
                r="85"
                stroke="rgba(255, 255, 255, 0.35)"
                strokeWidth="1.2"
                strokeDasharray="4 0"
              />
              {/* Right Intersecting Arch */}
              <circle
                cx="280"
                cy="170"
                r="85"
                stroke="rgba(255, 255, 255, 0.35)"
                strokeWidth="1.2"
                strokeDasharray="4 0"
              />
              {/* Overhead Zenith Glow Ring */}
              <circle
                cx="190"
                cy="60"
                r="25"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
              />
            </svg>

            {/* Angel Statue Image Container */}
            <div className="relative z-10 w-44 sm:w-52 h-56 sm:h-64 flex items-center justify-center">
              <Image
                src="/images/angel_section.png"
                alt="Celestial Angel Statue with Raised Arms"
                width={280}
                height={280}
                className="object-contain filter contrast-125 brightness-110 drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]"
              />
            </div>
          </div>
        </div>

        {/* ========================================================
            2. MIDDLE: NIETZSCHE & PLANETARY ORBIT RINGS
           ======================================================== */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          {/* Left / Center-Left: Nietzsche Portrait with Planetary Orbits */}
          <div className="md:col-span-7 flex justify-center md:justify-end md:pr-12">
            <div
              onClick={onSelectNietzsche}
              className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center cursor-pointer group"
            >
              {/* Dynamic Animated Planetary Orbits */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Orbit 1: Angled 35deg */}
                <div className="absolute w-64 h-36 sm:w-80 sm:h-44 border border-white/50 rounded-[100%] rotate-[-30deg] group-hover:border-white/80 transition-colors duration-500">
                  {/* Planet node */}
                  <span className="absolute -top-1.5 left-10 w-3 h-3 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                  <span className="absolute -bottom-1 right-12 w-2 h-2 rounded-full bg-white/70" />
                </div>

                {/* Orbit 2: Angled -35deg */}
                <div className="absolute w-64 h-36 sm:w-80 sm:h-44 border border-white/35 rounded-[100%] rotate-[28deg] group-hover:border-white/60 transition-colors duration-500">
                  {/* Planet node */}
                  <span className="absolute top-8 -right-1 w-2.5 h-2.5 rounded-full bg-neutral-300" />
                  <span className="absolute bottom-6 -left-1 w-2 h-2 rounded-full bg-white/80" />
                </div>
              </div>

              {/* Central Nietzsche Portrait Shape */}
              <div className="relative z-10 w-40 h-52 sm:w-48 sm:h-60 rounded-[35%_65%_60%_40%/50%_45%_55%_50%] overflow-hidden border-2 border-white/60 shadow-[0_0_30px_rgba(0,0,0,0.9)] bg-neutral-950 transition-transform duration-500 group-hover:scale-105">
                <Image
                  src="/images/nietzsche.jpg"
                  alt="Friedrich Nietzsche"
                  fill
                  className="object-cover object-top grayscale contrast-125 transition-all duration-500 group-hover:contrast-140"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            </div>
          </div>

          {/* Right: Quote */}
          <div className="md:col-span-5 text-center md:text-left space-y-3">
            <h2 className="font-serif-classic text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[0.16em] text-white uppercase leading-snug">
              BECOME WHO YOU ARE.
            </h2>
            <p className="font-serif-classic text-sm tracking-[0.3em] text-neutral-400 uppercase font-semibold">
              FRIEDRICH NIETZSCHE
            </p>
            <p className="font-garamond italic text-neutral-400 text-sm max-w-sm">
              &ldquo;The secret for harvesting from existence the greatest fruitfulness and the greatest enjoyment is: to live dangerously!&rdquo;
            </p>
          </div>
        </div>

        {/* ========================================================
            3. BOTTOM: MACHIAVELLI & CONCENTRIC RADAR RIPPLES
           ======================================================== */}
        <div className="relative w-full">
          {/* Subtle horizontal baseline extending across the section */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-neutral-800 -z-0 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            {/* Left: Quote */}
            <div className="md:col-span-6 order-2 md:order-1 text-center md:text-right space-y-3 md:pr-8 z-10">
              <h2 className="font-serif-classic text-xl sm:text-2xl lg:text-3xl font-bold tracking-[0.12em] text-white uppercase leading-snug">
                EVERYONE SEES WHAT YOU
                <br className="hidden sm:inline" />
                APPEAR TO BE, FEW EXPERIENCE
                <br className="hidden sm:inline" />
                WHAT YOU REALLY ARE.
              </h2>
              <p className="font-serif-classic text-sm tracking-[0.3em] text-neutral-400 uppercase font-semibold">
                NICOLAU MAQUIAVEL
              </p>
              <p className="font-garamond italic text-neutral-400 text-sm max-w-md md:ml-auto">
                &ldquo;There is nothing more difficult to take in hand, more perilous to conduct, or more uncertain in its success, than to take the lead in the introduction of a new order of things.&rdquo;
              </p>
            </div>

            {/* Right: Machiavelli with Concentric Arc Ripples */}
            <div className="md:col-span-6 order-1 md:order-2 flex justify-center md:justify-start md:pl-8 z-10">
              <div
                onClick={onSelectMachiavelli}
                className="relative w-72 h-60 sm:w-84 sm:h-72 flex items-center justify-center cursor-pointer group"
              >
                {/* Concentric Halo Arcs above Machiavelli */}
                <div className="absolute top-0 inset-x-0 flex flex-col items-center pointer-events-none">
                  <div className="w-48 h-24 border-t-2 border-white/70 rounded-t-full transition-all duration-500 group-hover:border-white" />
                  <div className="w-56 h-28 -mt-20 border-t border-white/40 rounded-t-full" />
                  <div className="w-64 h-32 -mt-24 border-t border-white/20 rounded-t-full" />
                </div>

                {/* Machiavelli Oval / Pill Card */}
                <div className="relative z-10 w-56 sm:w-64 h-36 sm:h-44 rounded-3xl overflow-hidden border-2 border-white/70 shadow-[0_10px_35px_rgba(0,0,0,0.9)] bg-neutral-950 transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src="/images/machiavelli.jpg"
                    alt="Niccolò Machiavelli by Santi di Tito"
                    fill
                    className="object-cover object-center grayscale contrast-120 transition-all duration-500 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

