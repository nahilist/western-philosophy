"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ThumbsUp, Sparkles, BookOpen } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [likes, setLikes] = useState(33);
  const [hasLiked, setHasLiked] = useState(false);

  if (!isOpen) return null;

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 text-white shadow-[0_30px_80px_rgba(0,0,0,0.95)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-white bg-black/60 backdrop-blur-md border border-white/20 hover:border-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Fallen Angel Banner matching screenshot 2 */}
        <div className="relative w-full h-52 sm:h-64 overflow-hidden border-b border-neutral-800">
          <Image
            src="/images/fallen_angel.jpg"
            alt="Alexandre Cabanel - Fallen Angel (1847)"
            fill
            className="object-cover object-top contrast-115"
          />
          {/* Subtle dark gradient overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-4">
            <h2 className="font-serif-classic text-2xl sm:text-4xl font-bold tracking-[0.2em] text-white uppercase drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
              THANKS FOR WATCHING!
            </h2>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-200 mt-2">
              PHILOSOPHY (UI WebDesign)
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-6">
          {/* Interactive Behance / Design Showcase Like Button from Screenshot 2 */}
          <div className="flex flex-col items-center justify-center space-y-2 -mt-12 sm:-mt-14 relative z-10">
            <button
              onClick={handleLike}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
                hasLiked
                  ? "bg-blue-500 text-white scale-105 shadow-blue-500/50"
                  : "bg-blue-600 hover:bg-blue-500 text-white hover:scale-105"
              }`}
            >
              <ThumbsUp className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
            <div className="text-[11px] uppercase tracking-[0.25em] text-neutral-400">
              PHILOSOPHY (UI WebDesign) • {likes} Applauds
            </div>
          </div>

          <div className="space-y-3 text-center sm:text-left">
            <h3 className="font-serif-classic text-xl font-bold tracking-[0.15em] text-white uppercase">
              The Philosophy Manifesto
            </h3>
            <p className="font-garamond text-neutral-300 text-base sm:text-lg leading-relaxed">
              Western philosophy began not as an academic credential, but as a burning inquiry into being, virtue, and existence. From Socratic cross-examination on the streets of Athens to Descartes&apos; solitary fire in Holland, to Nietzsche&apos;s mountain solitude in Sils Maria, our project revives these monumental dialogues through classical aesthetics and modern digital craft.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-3 bg-neutral-900/60 border border-neutral-800 space-y-1">
              <div className="flex items-center gap-2 font-serif-classic text-white">
                <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                <span>Renaissance Aesthetics</span>
              </div>
              <p className="text-neutral-400">
                Crafted with museum-grade public domain masterpieces.
              </p>
            </div>
            <div className="p-3 bg-neutral-900/60 border border-neutral-800 space-y-1">
              <div className="flex items-center gap-2 font-serif-classic text-white">
                <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                <span>Primary Sources</span>
              </div>
              <p className="text-neutral-400">
                Direct quotes from the seminal treatises of history.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-neutral-700 hover:border-white text-xs uppercase tracking-[0.2em] text-neutral-300 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

