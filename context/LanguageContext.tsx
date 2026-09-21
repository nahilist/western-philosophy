"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Language, UI_TRANSLATIONS, PHILOSOPHER_TRANSLATIONS, PhilosopherTranslation } from "@/data/translations";
import { PhilosopherCourse } from "@/data/philosophers";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof UI_TRANSLATIONS.en;
  getPhilosopherData: (course: PhilosopherCourse) => {
    name: string;
    title: string;
    era: string;
    school: string;
    quote: string;
    overview: string;
  };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  // Read saved preference on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("preferred_language") as Language | null;
      if (savedLang === "hi" || savedLang === "en") {
        setLanguageState(savedLang);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("preferred_language", lang);

      // Set cookie for both client and potential server/Google hooks
      document.cookie = `preferred_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
      document.cookie = `googtrans=/en/${lang}; path=/; SameSite=Lax`;

      // Trigger Google Translate dropdown if available in DOM
      const selectElem = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (selectElem && selectElem.value !== lang) {
        selectElem.value = lang;
        selectElem.dispatchEvent(new Event("change"));
      }
    } catch {
      // Ignore cookie errors
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "hi" : "en");
  }, [language, setLanguage]);

  // Translate helper for philosopher
  const getPhilosopherData = useCallback(
    (course: PhilosopherCourse) => {
      if (language === "hi") {
        const hiTrans: PhilosopherTranslation | undefined = PHILOSOPHER_TRANSLATIONS[course.id];
        if (hiTrans) {
          return {
            name: hiTrans.name,
            title: hiTrans.title,
            era: hiTrans.era,
            school: hiTrans.school,
            quote: hiTrans.quote,
            overview: hiTrans.overview,
          };
        }
      }
      return {
        name: course.name,
        title: course.title,
        era: course.era,
        school: course.school,
        quote: course.quote,
        overview: course.overview,
      };
    },
    [language]
  );

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        getPhilosopherData,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

