"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sparkles, Volume2, VolumeX, User as UserIcon, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  onOpenAbout?: () => void;
  onOpenDailyWisdom?: () => void;
}

export default function Navbar({ onOpenAbout, onOpenDailyWisdom }: NavbarProps) {
  const { user, openAuthModal, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSound = () => {
    if (audioPlaying) {
      setAudioPlaying(false);
    } else {
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(108, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.035, audioCtx.currentTime);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-full ${
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-neutral-900/80 py-4 shadow-2xl"
          : "bg-transparent py-7"
      }`}
    >
      <div className="w-full px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 flex items-center justify-between">
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          <Link
            href="/#home"
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
            href="/#courses"
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

          {/* Wisdom Modal Trigger */}
          {onOpenDailyWisdom && (
            <button
              onClick={onOpenDailyWisdom}
              title="Daily Philosophical Aphorism"
              className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
              <span>Wisdom</span>
            </button>
          )}

          {/* Sound Ambience */}
          <button
            onClick={toggleSound}
            title={audioPlaying ? "Silence Ambience" : "Enable Ambient Resonance"}
            className="p-1.5 rounded-full border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors cursor-pointer"
          >
            {audioPlaying ? (
              <Volume2 className="w-3.5 h-3.5 text-neutral-200" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Auth Button: Sign In or User Profile */}
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-neutral-800">
              <span className="text-xs tracking-wider text-neutral-300 font-serif-classic">
                {user.name}
              </span>
              <button
                onClick={logout}
                title="Sign out of Academy"
                className="p-1.5 rounded-full border border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-900 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] px-4 py-1.5 border border-white/60 text-white hover:bg-white hover:text-black transition-all duration-300 font-serif-classic cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </nav>

        {/* Mobile Menu Trigger & Auth */}
        <div className="flex md:hidden items-center gap-3">
          {user ? (
            <button
              onClick={logout}
              className="text-xs text-neutral-400 p-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="text-xs tracking-wider uppercase text-neutral-300 p-1"
            >
              <UserIcon className="w-4 h-4" />
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
            href="/#home"
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
            href="/#courses"
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
          {!user ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal();
              }}
              className="w-full py-2.5 border border-white text-center text-xs uppercase tracking-[0.25em] text-white hover:bg-white hover:text-black transition-colors font-serif-classic"
            >
              Sign In / Register
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="text-left text-xs tracking-[0.2em] uppercase text-red-400"
            >
              Sign Out ({user.name})
            </button>
          )}
        </div>
      )}
    </header>
  );
}
