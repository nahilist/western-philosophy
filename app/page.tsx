"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroDescartes from "@/components/HeroDescartes";
import SocratesSection from "@/components/SocratesSection";
import CosmicSection from "@/components/CosmicSection";
import CoursesSection from "@/components/CoursesSection";
import CreationBanner from "@/components/CreationBanner";
import Footer from "@/components/Footer";
import JoinModal from "@/components/JoinModal";
import DailyWisdomModal from "@/components/DailyWisdomModal";
import AboutModal from "@/components/AboutModal";
import AuthModal from "@/components/AuthModal";
import DilemmaModal from "@/components/DilemmaModal";
import { AuthProvider } from "@/context/AuthContext";

function PhilosophyPlatform() {
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [dailyWisdomOpen, setDailyWisdomOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [dilemmaModalOpen, setDilemmaModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* 1. Header Navigation with Sign In, Wisdom & Ambience */}
      <Navbar
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenDailyWisdom={() => setDailyWisdomOpen(true)}
        onOpenDilemma={() => setDilemmaModalOpen(true)}
      />

      {/* 2. Beloved Rich Hero Section: René Descartes (links to /course/descartes) */}
      <HeroDescartes />

      {/* 3. Socrates Section */}
      <SocratesSection />

      {/* 4. Cosmic Section: Angel, Nietzsche, Machiavelli (Exact Screenshot Match) */}
      <CosmicSection />

      {/* 5. Courses Grid: 4 Thinkers (opens dedicated Full Page /course/[id]) */}
      <CoursesSection />

      {/* 6. Creation of Adam Banner: Michelangelo Hands + Kant */}
      <CreationBanner onJoinClick={() => setJoinModalOpen(true)} />

      {/* 7. Footer */}
      <Footer onOpenAbout={() => setAboutModalOpen(true)} />

      {/* Login / Sign Up Modal (Ready for Supabase) */}
      <AuthModal />

      {/* Membership & Secondary Modals */}
      <JoinModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
      />

      <DailyWisdomModal
        isOpen={dailyWisdomOpen}
        onClose={() => setDailyWisdomOpen(false)}
      />

      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />

      <DilemmaModal
        isOpen={dilemmaModalOpen}
        onClose={() => setDilemmaModalOpen(false)}
      />
    </main>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <PhilosophyPlatform />
    </AuthProvider>
  );
}
