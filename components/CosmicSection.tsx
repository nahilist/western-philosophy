"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function CosmicSection() {
  return (
    <section className="relative w-full bg-black text-white py-20 sm:py-32 px-6 sm:px-12 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col items-center space-y-28 sm:space-y-36">
        {/* ==========================================================
            1. TOP: ANGEL STATUE WITH HALO ARCS & SPOTLIGHT
           ========================================================== */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative w-[320px] sm:w-[420px] md:w-[480px] h-[150px] sm:h-[190px] md:h-[220px]">
            <Image
              src="/design_assets/angel_hd.png"
              alt="Angel Statue with Halo Arcs"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>

        {/* ==========================================================
            2. MIDDLE: NIETZSCHE & ATOMIC ORBITAL RINGS
           ========================================================== */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Nietzsche Pebble + Atomic Rings (Clickable Link to /course/nietzsche) */}
          <div className="md:col-span-6 flex justify-center md:justify-end md:pr-12">
            <Link
              href="/course/nietzsche"
              className="relative w-[220px] sm:w-[260px] md:w-[300px] aspect-square block group cursor-pointer"
              title="Open full Friedrich Nietzsche page"
            >
              <Image
                src="/design_assets/nietzsche_orbit_hd.png"
                alt="Friedrich Nietzsche Orbital Composition"
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Right: Quote BECOME WHO YOU ARE. */}
          <div className="md:col-span-6 text-center md:text-left space-y-3 md:pl-4">
            <Link href="/course/nietzsche" className="group inline-block">
              <h2 className="font-serif-classic text-xl sm:text-2xl lg:text-3xl font-bold tracking-[0.2em] text-white uppercase group-hover:text-neutral-300 transition-colors">
                BECOME WHO YOU ARE.
              </h2>
              <p className="font-serif-classic text-xs sm:text-sm tracking-[0.32em] text-neutral-300 uppercase mt-1">
                FRIEDRICH NIETZSCHE →
              </p>
            </Link>
          </div>
        </div>

        {/* ==========================================================
            3. BOTTOM: MACHIAVELLI & CONCENTRIC RIPPLE ARCS
           ========================================================== */}
        <div className="relative w-full">
          {/* Horizontal Line Cutting Across matching screenshot */}
          <div className="absolute top-[48%] left-0 right-0 h-px bg-white/25 pointer-events-none -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left: Quote matching Screenshot 3 */}
            <div className="md:col-span-6 text-center md:text-right space-y-3 md:pr-10">
              <Link href="/course/machiavelli" className="group inline-block">
                <h2 className="font-serif-classic text-base sm:text-xl lg:text-2xl font-bold tracking-[0.14em] text-white uppercase leading-snug group-hover:text-neutral-300 transition-colors">
                  EVERYONE SEES WHAT YOU
                  <br />
                  APPEAR TO BE, FEW EXPERIENCE
                  <br />
                  WHAT YOU REALLY ARE.
                </h2>
                <p className="font-serif-classic text-xs sm:text-sm tracking-[0.32em] text-neutral-300 uppercase mt-1">
                  ← NICOLAU MAQUIAVEL
                </p>
              </Link>
            </div>

            {/* Right: Machiavelli Pill + Concentric Rings (Clickable Link to /course/machiavelli) */}
            <div className="md:col-span-6 flex justify-center md:justify-start md:pl-8">
              <Link
                href="/course/machiavelli"
                className="relative w-[240px] sm:w-[280px] md:w-[320px] aspect-[1.15/1] block group cursor-pointer"
                title="Open full Nicolau Maquiavel page"
              >
                <Image
                  src="/design_assets/machiavelli_pill_hd.png"
                  alt="Nicolau Maquiavel Capsule Composition"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
