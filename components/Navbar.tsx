"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sparkles, Volume2, VolumeX } from "lucide-react";

interface NavbarProps {
  onOpenAbout?: () => void;
  onOpenDailyWisdom?: () => void;
}

export default function Navbar({ onOpenAbout, onOpenDailyWisdom }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ambient sound generator using Web Audio API (gentle ethereal drone)
  const toggleSound = () => {
    if (audioPlaying) {
      if (audio) {
        audio.pause();
      }
      setAudioPlaying(false);
    } else {
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(108, audioCtx.currentTime); // Deep resonant 108Hz harmonic
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        setAudioPlaying(true);
      } catch {
        setAudioPlaying(false);
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-neutral-900/80 py-4 shadow-2xl"
          : "bg-transparent py-7"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 tracking-[0.25em] text-sm sm:text-base font-semibold text-white transition-opacity hover:opacity-80"
        >
          <span className="font-serif-classic font-bold tracking-[0.3em]">
            PHILOSOPHY
          </span>
          <span className="text-neutral-400 group-hover:text-white transition-colors text-lg font-light">
            Φ
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-10">
          <Link
            href="#home"
            className="text-xs font-medium tracking-[0.25em] text-neutral-300 hover:text-white transition-colors uppercase"
          >
            Home
          </Link>
          <button
            onClick={onOpenAbout}
            className="text-xs font-medium tracking-[0.25em] text-neutral-300 hover:text-white transition-colors uppercase cursor-pointer"
          >
            About
          </button>
          <Link
            href="#courses"
            className="text-xs font-medium tracking-[0.25em] text-neutral-300 hover:text-white transition-colors uppercase"
          >
            Courses
          </Link>
          <Link
            href="#contact"
            className="text-xs font-medium tracking-[0.25em] text-neutral-300 hover:text-white transition-colors uppercase"
          >
            Contact
          </Link>

          {/* Quick Wisdom Button */}
          {onOpenDailyWisdom && (
            <button
              onClick={onOpenDailyWisdom}
              title="Daily Philosophical Aphorism"
              className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
              <span>Wisdom</span>
            </button>
          )}

          {/* Ambience Toggle */}
          <button
            onClick={toggleSound}
            title={audioPlaying ? "Silence Ambience" : "Enable Ambient Resonance"}
            className="p-1.5 rounded-full border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
          >
            {audioPlaying ? (
              <Volume2 className="w-3.5 h-3.5 text-neutral-200" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-3">
          {onOpenDailyWisdom && (
            <button
              onClick={onOpenDailyWisdom}
              className="p-2 text-neutral-400 hover:text-white"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-black/95 backdrop-blur-xl border-b border-neutral-900 px-8 py-8 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <Link
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm tracking-[0.25em] text-neutral-300 hover:text-white uppercase transition-colors"
          >
            Home
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAbout?.();
            }}
            className="text-left text-sm tracking-[0.25em] text-neutral-300 hover:text-white uppercase transition-colors"
          >
            About
          </button>
          <Link
            href="#courses"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm tracking-[0.25em] text-neutral-300 hover:text-white uppercase transition-colors"
          >
            Courses
          </Link>
          <Link
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm tracking-[0.25em] text-neutral-300 hover:text-white uppercase transition-colors"
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}

