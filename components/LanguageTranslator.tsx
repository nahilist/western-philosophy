"use client";

import React, { useState } from "react";
import { Languages, Check, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// 1. NAVBAR TRANSLATOR BUTTON (Minimalist dark luxury pill)
export function NavbarLanguageTranslator({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-full border border-neutral-800 bg-neutral-950 p-0.5 text-xs font-serif-classic transition-all duration-300 hover:border-neutral-600 ${className}`}
      title={language === "hi" ? "हिंदी सक्रिय है (Switch to English)" : "Switch to Hindi (हिंदी में बदलें)"}
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full uppercase tracking-wider text-[10px] transition-all duration-300 cursor-pointer ${
          language === "en"
            ? "bg-white text-black font-bold shadow-sm"
            : "text-neutral-400 hover:text-white"
        }`}
      >
        <span>EN</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage("hi")}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full tracking-wider text-[11px] transition-all duration-300 cursor-pointer ${
          language === "hi"
            ? "bg-white text-black font-bold shadow-sm"
            : "text-neutral-400 hover:text-white"
        }`}
      >
        <Globe className="w-3 h-3" />
        <span>हिंदी</span>
        {language === "hi" && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        )}
      </button>
    </div>
  );
}

// 2. FLOATING TRANSLATOR BUTTON (Always accessible at bottom-right corner)
export function FloatingLanguageButton() {
  const { language, setLanguage } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside
      aria-label="Language selection"
      className="fixed bottom-6 right-6 z-40 flex items-center shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-500"
    >
      <div className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-neutral-950/95 border border-neutral-800 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] hover:border-neutral-600 transition-all duration-300">
        <div className="flex items-center gap-2 text-neutral-300">
          <Languages className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[11px] tracking-wider font-serif-classic uppercase hidden sm:inline text-neutral-300">
            {language === "hi" ? "भाषा:" : "Language:"}
          </span>
        </div>

        <button
          onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
          className={`px-3 py-1 text-[11px] tracking-widest font-serif-classic uppercase rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
            language === "hi"
              ? "bg-emerald-400 text-black font-semibold shadow-[0_0_15px_rgba(52,211,153,0.3)]"
              : "bg-white text-black font-semibold hover:bg-neutral-200"
          }`}
          title={language === "hi" ? "Click to view in English" : "Click to translate website to Hindi"}
        >
          {language === "hi" ? (
            <>
              <Check className="w-3 h-3 text-black" />
              <span>हिंदी (Hindi ON)</span>
            </>
          ) : (
            <>
              <Globe className="w-3 h-3 text-black" />
              <span>हिंदी में अनुवाद (Hindi)</span>
            </>
          )}
        </button>

        {/* Small dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          className="w-5 h-5 rounded-full text-neutral-500 hover:text-neutral-300 text-[10px] flex items-center justify-center cursor-pointer ml-0.5"
          title="Dismiss floating pill"
        >
          ×
        </button>
      </div>
    </aside>
  );
}
