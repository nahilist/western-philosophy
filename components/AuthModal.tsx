"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Lock, User as UserIcon, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  onSuccess?: () => void;
}

export default function AuthModal({ onSuccess }: AuthModalProps) {
  const router = useRouter();
  const {
    isAuthModalOpen,
    closeAuthModal,
    login,
    signUp,
    signInWithOAuth,
    pendingCourseId,
    isSupabaseConnected,
  } = useAuth();

  const [tab, setTab] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [unconfiguredProvider, setUnconfiguredProvider] = useState<"google" | "github" | null>(null);
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
    setErrorMsg(null);
    setUnconfiguredProvider(null);
    setLoading(true);

    try {
      if (tab === "login") {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMsg(res.error || "Login failed. Please check credentials.");
          return;
        }
      } else {
        const res = await signUp(name, email, password);
        if (!res.success) {
          setErrorMsg(res.error || "Sign up failed. Please check details.");
          return;
        }
      }
      handleComplete();
    } catch {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setErrorMsg(null);
    setUnconfiguredProvider(null);
    setLoading(true);
    try {
      const res = await signInWithOAuth(provider);
      if (!res.success) {
        if (res.providerNotConfigured) {
          setUnconfiguredProvider(provider);
          setErrorMsg(res.error || null);
        } else {
          setErrorMsg(res.error || `Failed to sign in with ${provider}`);
        }
      } else if (!isSupabaseConnected) {
        handleComplete();
      }
    } catch {
      setErrorMsg(`Failed to connect with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setErrorMsg(null);
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
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-full border border-neutral-800 mx-auto flex items-center justify-center mb-3">
            <Lock className="w-5 h-5 text-neutral-300" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-300 font-medium">
              Philosophy Φ Academy
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full border font-mono font-medium ${
                isSupabaseConnected
                  ? "bg-emerald-950/80 border-emerald-800 text-emerald-300"
                  : "bg-neutral-900 border-neutral-800 text-neutral-300"
              }`}
            >
              {isSupabaseConnected ? "● Supabase Live" : "○ Demo Mode"}
            </span>
          </div>
          <h3 className="font-serif-classic text-2xl font-bold tracking-[0.15em] text-white uppercase">
            {tab === "login" ? "ACADEMY SIGN IN" : "JOIN THE DIALECTIC"}
          </h3>
          <p className="font-garamond text-neutral-300 text-sm">
            {pendingCourseId
              ? "Sign in to open the complete full-page philosophical dossier."
              : "Access the complete library of classical inquiries and seminars."}
          </p>
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="mb-5 p-4 border border-red-900/80 bg-red-950/60 text-red-200 text-xs space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMsg}</span>
            </div>

            {unconfiguredProvider && (
              <div className="pt-2 border-t border-red-900/60 space-y-2">
                <button
                  type="button"
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await signInWithOAuth(unconfiguredProvider, true);
                      handleComplete();
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="w-full py-2 px-3 bg-red-900/70 hover:bg-red-800 border border-red-600 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer font-semibold shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Continue with {unconfiguredProvider === "google" ? "Google" : "GitHub"} (Instant Access)</span>
                </button>
                <p className="text-xs text-neutral-300 font-mono leading-normal">
                  Tip: To enable real Google accounts, turn ON Google in Supabase Dashboard &gt; Auth &gt; Providers.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tabs: Login vs Sign Up */}
        <div className="flex border-b border-neutral-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setErrorMsg(null);
            }}
            className={`flex-1 pb-3 text-xs uppercase tracking-[0.2em] font-serif-classic font-semibold transition-colors cursor-pointer text-center ${
              tab === "login"
                ? "text-white border-b-2 border-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("signup");
              setErrorMsg(null);
            }}
            className={`flex-1 pb-3 text-xs uppercase tracking-[0.2em] font-serif-classic font-semibold transition-colors cursor-pointer text-center ${
              tab === "signup"
                ? "text-white border-b-2 border-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "signup" && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5 font-mono">
                Full Name / Scholar Alias
              </label>
              <div className="relative flex items-center">
                <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Aurelius"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-900/90 border border-neutral-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400 tracking-wide"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5 font-mono">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900/90 border border-neutral-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400 tracking-wide font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5 font-mono">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900/90 border border-neutral-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400 tracking-wide"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {loading ? (
                <span>Entering Academy...</span>
              ) : (
                <>
                  <span>{tab === "login" ? "Sign In & Enter" : "Register & Open Page"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Social Logins (Google / GitHub) */}
        <div className="mt-5 pt-4 border-t border-neutral-900">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={loading}
              className="py-2.5 px-3 border border-neutral-800 hover:border-neutral-600 text-neutral-200 hover:text-white text-xs tracking-wider uppercase font-serif-classic font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer bg-neutral-900/60 disabled:opacity-50"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-1.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("github")}
              disabled={loading}
              className="py-2.5 px-3 border border-neutral-800 hover:border-neutral-600 text-neutral-200 hover:text-white text-xs tracking-wider uppercase font-serif-classic font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer bg-neutral-900/60 disabled:opacity-50"
            >
              <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          {/* Instant Demo Access Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="flex items-center justify-center gap-2 mx-auto text-xs uppercase tracking-[0.15em] text-neutral-300 hover:text-white font-medium transition-colors cursor-pointer py-1"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Instant Demo Access (One Click)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
