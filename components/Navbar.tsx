"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sparkles, Volume2, VolumeX, User as UserIcon, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { NavbarLanguageTranslator } from "@/components/LanguageTranslator";
import AccountModal from "@/components/AccountModal";

interface NavbarProps {
  onOpenAbout?: () => void;
  onOpenDailyWisdom?: () => void;
}

export default function Navbar({ onOpenAbout, onOpenDailyWisdom }: NavbarProps) {
  const { user, openAuthModal, logout } = useAuth();
  const { t, language } = useLanguage();
  const isHi = language === "hi";
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
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
            {t.nav.home}
          </Link>
          <Link
            href="/about"
            className="text-xs font-medium tracking-[0.25em] text-neutral-300 hover:text-white transition-colors uppercase"
          >
            {t.nav.about}
          </Link>
          <Link
            href="/#courses"
            className="text-xs font-medium tracking-[0.25em] text-neutral-300 hover:text-white transition-colors uppercase"
          >
            {t.nav.courses}
          </Link>
          <Link
            href="/contact"
            className="text-xs font-medium tracking-[0.25em] text-neutral-300 hover:text-white transition-colors uppercase"
          >
            {t.nav.contact}
          </Link>

          {/* Wisdom Modal Trigger */}
          {onOpenDailyWisdom && (
            <button
              onClick={onOpenDailyWisdom}
              title="Daily Philosophical Aphorism"
              className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
              <span>{t.nav.wisdom}</span>
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

          {/* Hindi / English Language Translator */}
          <NavbarLanguageTranslator />

          {/* Auth Button: Sign In or User Profile */}
          {user ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-neutral-800">
              <button
                onClick={() => setAccountModalOpen(true)}
                title={isHi ? "खाता एवं दार्शनिक डायरी देखें" : "View Scholar Account & Codex"}
                className="flex items-center gap-2 px-3 py-1.5 border border-neutral-800 hover:border-neutral-500 bg-neutral-950/80 hover:bg-neutral-900 transition-all font-serif-classic cursor-pointer group"
              >
                <div className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-600 flex items-center justify-center text-xs text-white font-bold group-hover:border-white transition-colors">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium tracking-wide text-neutral-200 group-hover:text-white transition-colors">
                  {user.name}
                </span>
              </button>
              <button
                onClick={logout}
                title={t.nav.signOut}
                className="p-1.5 rounded-full border border-neutral-800 text-neutral-300 hover:text-red-400 hover:border-red-900 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] px-4 py-1.5 border border-white/70 text-white hover:bg-white hover:text-black transition-all duration-300 font-serif-classic font-semibold cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{t.nav.signIn}</span>
            </button>
          )}
        </nav>

        {/* Mobile Menu Trigger & Auth */}
        <div className="flex md:hidden items-center gap-2.5">
          {/* Mobile Hindi Translator Pill */}
          <NavbarLanguageTranslator />

          {user ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setAccountModalOpen(true)}
                title={isHi ? "मेरा खाता" : "My Account"}
                className="flex items-center gap-1 text-xs text-neutral-200 py-1 px-2.5 border border-neutral-800 bg-neutral-950/90 rounded"
              >
                <UserIcon className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-serif-classic font-medium tracking-wide">
                  {user.name.split(" ")[0]}
                </span>
              </button>
              <button
                onClick={logout}
                className="text-xs text-neutral-300 p-1"
                title={t.nav.signOut}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
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
            {t.nav.home}
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-left text-sm tracking-[0.25em] text-neutral-300 hover:text-white uppercase transition-colors"
          >
            {t.nav.about}
          </Link>
          <Link
            href="/#courses"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm tracking-[0.25em] text-neutral-300 hover:text-white uppercase transition-colors"
          >
            {t.nav.courses}
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm tracking-[0.25em] text-neutral-300 hover:text-white uppercase transition-colors"
          >
            {t.nav.contact}
          </Link>

          {user && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setAccountModalOpen(true);
              }}
              className="w-full py-2.5 bg-neutral-900 border border-neutral-700 text-center text-xs uppercase tracking-[0.25em] text-white hover:bg-white hover:text-black transition-colors font-serif-classic flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{isHi ? "मेरा खाता एवं डायरी" : "My Account & Codex"}</span>
            </button>
          )}

          {!user ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal();
              }}
              className="w-full py-2.5 border border-white text-center text-xs uppercase tracking-[0.25em] text-white hover:bg-white hover:text-black transition-colors font-serif-classic cursor-pointer"
            >
              {t.nav.signIn}
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="text-left text-xs tracking-[0.2em] uppercase text-red-400 cursor-pointer"
            >
              {t.nav.signOut} ({user.name})
            </button>
          )}
        </div>
      )}

      {/* Account Modal accessible from everywhere */}
      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />
    </header>
  );
}
