"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutModal from "@/components/AboutModal";
import DailyWisdomModal from "@/components/DailyWisdomModal";
import DilemmaModal from "@/components/DilemmaModal";
import AuthModal from "@/components/AuthModal";
import { AuthProvider } from "@/context/AuthContext";
import SocraticVoiceOracle from "@/components/arena/SocraticVoiceOracle";
import DialecticalDuel from "@/components/arena/DialecticalDuel";
import ExistentialRadar from "@/components/arena/ExistentialRadar";
import { Mic, Swords, Compass, ArrowLeft } from "lucide-react";

type InstrumentTab = "oracle" | "duel" | "radar";

function ArenaContent() {
  const [activeTab, setActiveTab] = useState<InstrumentTab>("oracle");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [dailyWisdomOpen, setDailyWisdomOpen] = useState(false);
  const [dilemmaOpen, setDilemmaOpen] = useState(false);

  const tabs = [
    {
      id: "oracle" as InstrumentTab,
      label: "01. Socratic Voice Oracle",
      shortLabel: "Voice Oracle",
      icon: Mic,
      tag: "ORAL DIALECTIC",
      desc: "Live voice dialogue with Socrates through browser speech synthesis & interrogation.",
    },
    {
      id: "duel" as InstrumentTab,
      label: "02. The Dialectical Duel",
      shortLabel: "Philosophical Duel",
      icon: Swords,
      tag: "CLASH OF TITANS",
      desc: "Turn-by-turn debate simulator between history's greatest philosophers with tension gauge.",
    },
    {
      id: "radar" as InstrumentTab,
      label: "03. The Existential Radar",
      shortLabel: "Mind Compass",
      icon: Compass,
      tag: "6-AXIS COMPASS",
      desc: "Map your metaphysical coordinates, solve ethical dilemmas, and export your archetype.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-white selection:text-black">
      {/* Primary Navigation */}
      <Navbar
        onOpenAbout={() => setAboutOpen(true)}
        onOpenDailyWisdom={() => setDailyWisdomOpen(true)}
        onOpenDilemma={() => setDilemmaOpen(true)}
      />

      {/* Main Sanctuary Viewport */}
      <main className="flex-1 pt-28 sm:pt-32 pb-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto w-full">
        {/* Back Link & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-900 text-xs font-mono">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO ARCHIVE</span>
          </Link>

          <div className="flex items-center gap-2 text-zinc-500 text-[11px] tracking-widest uppercase">
            <span>SANCTUARY</span>
            <span>//</span>
            <span className="text-zinc-300 font-semibold">THE DIALECTICAL ARENA</span>
          </div>
        </div>

        {/* Hero Section */}
        <header className="mb-12 relative">
          <div className="absolute -top-3 -left-3 text-zinc-700 font-mono text-xs">+</div>
          <div className="absolute -top-3 -right-3 text-zinc-700 font-mono text-xs">+</div>

          <div className="p-6 sm:p-10 border border-zinc-900 bg-zinc-950/70 backdrop-blur-sm relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] tracking-[0.3em] uppercase font-mono text-zinc-400 border border-zinc-800 bg-black">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Advanced Experimental Instruments
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-white mb-4">
              The Dialectical Arena
            </h1>

            <p className="text-sm sm:text-base font-serif italic text-zinc-400 max-w-3xl leading-relaxed">
              &ldquo;Philosophy begins in wonder, and culminates in rigorous dialectic.&rdquo; Step beyond passive reading into three interactive, sovereign instruments engineered to interrogate your convictions, stage intellectual clashes, and chart your existential compass.
            </p>

            {/* Instrument Switcher Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8 pt-6 border-t border-zinc-900">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`p-4 text-left border transition-all relative group cursor-pointer ${
                      isActive
                        ? "border-white bg-zinc-900/90 text-white shadow-lg"
                        : "border-zinc-900 bg-black/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-500"}`} />
                      <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                        {tab.tag}
                      </span>
                    </div>
                    <div className="text-sm font-serif font-semibold text-white mb-1">
                      {tab.label}
                    </div>
                    <p className="text-[11px] font-serif text-zinc-400 leading-tight">
                      {tab.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Active Instrument Presentation */}
        <section className="relative transition-all duration-300">
          {activeTab === "oracle" && (
            <div className="animate-fade-in">
              <SocraticVoiceOracle />
            </div>
          )}

          {activeTab === "duel" && (
            <div className="animate-fade-in">
              <DialecticalDuel />
            </div>
          )}

          {activeTab === "radar" && (
            <div className="animate-fade-in">
              <ExistentialRadar />
            </div>
          )}
        </section>

        {/* Footer Navigation Bar inside Arena */}
        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>MONASTIC COMPUTING LAB // EXPERIMENTAL FRONTEND v2.4</div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("oracle")}
              className={`hover:text-white transition-colors cursor-pointer ${activeTab === "oracle" ? "text-white underline" : ""}`}
            >
              [ORACLE]
            </button>
            <button
              onClick={() => setActiveTab("duel")}
              className={`hover:text-white transition-colors cursor-pointer ${activeTab === "duel" ? "text-white underline" : ""}`}
            >
              [DUEL]
            </button>
            <button
              onClick={() => setActiveTab("radar")}
              className={`hover:text-white transition-colors cursor-pointer ${activeTab === "radar" ? "text-white underline" : ""}`}
            >
              [RADAR]
            </button>
          </div>
        </div>
      </main>

      {/* Global Modals for Navbar interop */}
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
      <DailyWisdomModal isOpen={dailyWisdomOpen} onClose={() => setDailyWisdomOpen(false)} />
      <DilemmaModal isOpen={dilemmaOpen} onClose={() => setDilemmaOpen(false)} />

      {/* Footer */}
      <Footer onOpenAbout={() => setAboutOpen(true)} />
    </div>
  );
}

export default function ArenaPage() {
  return (
    <AuthProvider>
      <ArenaContent />
      <AuthModal />
    </AuthProvider>
  );
}
