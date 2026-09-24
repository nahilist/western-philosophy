"use client";

import React, { useState } from "react";
import { X, RefreshCw, Quote } from "lucide-react";
import { DAILY_QUOTES } from "@/data/philosophers";

interface DailyWisdomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DailyWisdomModal({
  isOpen,
  onClose,
}: DailyWisdomModalProps) {
  const [index, setIndex] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % DAILY_QUOTES.length);
  };

  const item = DAILY_QUOTES[index];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-neutral-950 border border-neutral-800 p-8 sm:p-12 text-white shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center">
            <Quote className="w-5 h-5 text-neutral-300" />
          </div>

          <span className="text-xs uppercase tracking-[0.2em] text-neutral-300 font-medium font-mono">
            Daily Philosophical Aphorism
          </span>

          <blockquote className="font-garamond italic text-xl sm:text-2xl lg:text-3xl text-neutral-100 leading-relaxed max-w-md">
            &ldquo;{item.quote}&rdquo;
          </blockquote>

          <div className="space-y-1">
            <p className="font-serif-classic text-sm sm:text-base font-semibold tracking-[0.2em] text-white uppercase">
              {item.author}
            </p>
            <p className="text-xs text-neutral-300 tracking-wider font-mono">
              {item.era}
            </p>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 border border-neutral-700 hover:border-white text-xs uppercase tracking-[0.2em] text-neutral-300 hover:text-white transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Next Aphorism</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

