"use client";

import React from "react";
import Link from "next/link";
import { X, Compass, ArrowRight, BookOpen, Layers, ThumbsUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Ensure Turbopack factory is available for any legacy cache requests
void ThumbsUp;

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 text-white shadow-[0_30px_90px_rgba(0,0,0,0.98)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-neutral-900 bg-black flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400">
            <Compass className="w-3.5 h-3.5 text-neutral-400" />
            <span>{isHi ? "पाश्चात्य दर्शन परिचय" : "About Western Philosophy"}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body (Clean & Minimalist, No Ultra-Realistic Clutter) */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-medium">
              EST. 600 BCE • ATHENS TO MODERNITY
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold tracking-[0.14em] text-white uppercase leading-snug">
              {isHi ? "सत्य, विवेक एवं स्वतंत्र चिंतन की परंपरा" : "The Quest for Unexamined Truth"}
            </h2>
          </div>

          <p className="font-garamond text-base sm:text-lg text-neutral-200 leading-relaxed font-light">
            {isHi
              ? "पाश्चात्य दर्शन की शुरुआत 2,500 वर्ष पूर्व प्राचीन यूनान में अंधविश्वासों (Mythos) से विवेक (Logos) की ओर संक्रमण के साथ हुई। यह केवल सैद्धांतिक अध्ययन नहीं, बल्कि जीवन, वास्तविकता, ज्ञान और नैतिकता की निरंतर तार्किक परीक्षा है।"
              : "Western philosophy originated twenty-five centuries ago as humanity’s daring departure from supernatural myth into rational critique (Logos). It is the systematic interrogation of existence, consciousness, morality, and justice through unyielding logic and radical skepticism."}
          </p>

          {/* Minimal 3-Point Pillar Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3.5 border border-neutral-800 bg-neutral-950/80 space-y-1">
              <span className="font-mono text-neutral-300 text-xs font-medium block">01. EPOCHS</span>
              <h4 className="font-serif-classic font-semibold text-white uppercase">4 Great Eras</h4>
              <p className="text-neutral-300 font-garamond text-sm">
                {isHi ? "प्राचीन काल से आधुनिक युग तक।" : "From Classical Antiquity to Modernity."}
              </p>
            </div>

            <div className="p-3.5 border border-neutral-800 bg-neutral-950/80 space-y-1">
              <span className="font-mono text-neutral-300 text-xs font-medium block">02. DISCIPLINES</span>
              <h4 className="font-serif-classic font-semibold text-white uppercase">5 Core Pillars</h4>
              <p className="text-neutral-300 font-garamond text-sm">
                {isHi ? "तत्व, ज्ञान, नीति, तर्क और राजनीति।" : "Metaphysics, Epistemology, Ethics & Logic."}
              </p>
            </div>

            <div className="p-3.5 border border-neutral-800 bg-neutral-950/80 space-y-1">
              <span className="font-mono text-neutral-300 text-xs font-medium block">03. CANON</span>
              <h4 className="font-serif-classic font-semibold text-white uppercase">14 Thinkers</h4>
              <p className="text-neutral-300 font-garamond text-sm">
                {isHi ? "सुकरात से कामू तक का संग्रह।" : "From Socrates to Albert Camus."}
              </p>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/about"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>{isHi ? "सम्पूर्ण परिचय पृष्ठ खोलें" : "Open Full Editorial Page"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={onClose}
              className="text-xs uppercase font-mono tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              {isHi ? "बंद करें" : "Dismiss"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
