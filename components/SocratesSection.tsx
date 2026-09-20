"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SocratesSection() {
  return (
    <section className="relative w-full min-h-[60vh] sm:min-h-[75vh] lg:min-h-[85vh] flex items-center justify-start bg-black overflow-hidden py-16 sm:py-24">
      {/* Background Painting: The Death of Socrates by Jacques-Louis David */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/socrates_death.jpg"
          alt="The Death of Socrates by Jacques-Louis David"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Cinematic Vignettes */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black via-black/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-full sm:w-2/3 md:w-1/2 bg-gradient-to-r from-black/95 via-black/80 to-transparent" />
      </div>

      {/* Quote Container matching Screenshot 4 Bottom (Clickable Link to /course/socrates) */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-8 sm:px-16">
        <Link
          href="/course/socrates"
          className="group max-w-xl text-center sm:text-left space-y-4 block cursor-pointer"
          title="Open full Socrates page"
        >
          <blockquote className="font-serif-classic text-xl sm:text-3xl lg:text-4xl font-normal tracking-[0.14em] text-white leading-relaxed uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] group-hover:text-neutral-200 transition-colors">
            I KNOW THAT I AM
            <br />
            INTELLIGENT, BECAUSE I KNOW
            <br />
            THAT I KNOW NOTHING.
          </blockquote>
          <div className="flex items-center gap-2">
            <p className="font-serif-classic text-sm sm:text-base tracking-[0.32em] text-neutral-200 uppercase font-semibold group-hover:text-white transition-colors">
              SÓCRATES
            </p>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </section>
  );
}
