"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Lock, User as UserIcon, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  onSuccess?: () => void;
}

export default function AuthModal({ onSuccess }: AuthModalProps) {
  const router = useRouter();
  const { isAuthModalOpen, closeAuthModal, login, signUp, pendingCourseId } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleComplete = () => {
    if (pendingCourseId) {
      router.push(`/course/${pendingCourseId}`);
    }
    onSuccess?.();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "login") {
        await login(email, password);
      } else {
        await signUp(name, email, password);
      }
      handleComplete();
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await login("scholar@philosophy-phi.org", "demo12345");
      handleComplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 p-8 sm:p-10 text-white shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-full border border-neutral-800 mx-auto flex items-center justify-center mb-3">
            <Lock className="w-5 h-5 text-neutral-300" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-medium">
            Philosophy Φ Academy
          </span>
          <h3 className="font-serif-classic text-2xl font-bold tracking-[0.15em] text-white uppercase">
            {tab === "login" ? "ACADEMY SIGN IN" : "JOIN THE DIALECTIC"}
          </h3>
          <p className="font-garamond text-neutral-400 text-sm">
            {pendingCourseId
              ? "Sign in to open the complete full-page philosophical dossier."
              : "Access the complete library of classical inquiries and seminars."}
          </p>
        </div>

        {/* Tabs: Login vs Sign Up */}
        <div className="flex border-b border-neutral-800 mb-6">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`flex-1 pb-3 text-xs uppercase tracking-[0.25em] font-serif-classic font-semibold transition-colors cursor-pointer text-center ${
              tab === "login"
                ? "text-white border-b-2 border-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab("signup")}
            className={`flex-1 pb-3 text-xs uppercase tracking-[0.25em] font-serif-classic font-semibold transition-colors cursor-pointer text-center ${
              tab === "signup"
                ? "text-white border-b-2 border-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "signup" && (
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
                Full Name / Scholar Alias
              </label>
              <div className="relative flex items-center">
                <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Aurelius"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-900/90 border border-neutral-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 tracking-wide"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900/90 border border-neutral-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 tracking-wide"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900/90 border border-neutral-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 tracking-wide"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {loading ? (
                <span>Entering Academy...</span>
              ) : (
                <>
                  <span>{tab === "login" ? "Open Full Page" : "Register & Open Page"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Instant Demo Access */}
        <div className="mt-5 pt-4 border-t border-neutral-900 text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="flex items-center justify-center gap-2 mx-auto text-[11px] uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors cursor-pointer py-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>Instant Demo Access (Skip for now)</span>
          </button>
          <p className="text-[10px] text-neutral-600 mt-2 font-mono">
            * Frontend ready for Supabase Auth integration
          </p>
        </div>
      </div>
    </div>
  );
}
