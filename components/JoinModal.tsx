"use client";

import React, { useState } from "react";
import { X, Check, ArrowRight, AlertCircle } from "lucide-react";
import { joinWaitlist } from "@/lib/supabase/queries";

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinModal({ isOpen, onClose }: JoinModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("Existentialism");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorMsg(null);

    const res = await joinWaitlist(email, interest);
    setLoading(false);

    if (res.success) {
      setSubmitted(true);
    } else {
      setErrorMsg(res.error || "An error occurred. Please try again.");
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setErrorMsg(null);
    setName("");
    setEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 p-8 sm:p-10 text-white shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="space-y-2 mb-8">
              <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-medium">
                Academy of Free Inquiry
              </span>
              <h3 className="font-serif-classic text-2xl sm:text-3xl font-bold tracking-[0.15em] text-white uppercase">
                JOIN PHILOSOPHY Φ
              </h3>
              <p className="font-garamond text-neutral-300 text-sm sm:text-base leading-relaxed">
                Step into the ancient tradition of dialectical reasoning. Receive curated weekly philosophical translations, seminar invites, and digital library access.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-neutral-400 mb-2">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Aurelius"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-900/90 border border-neutral-800 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-neutral-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900/90 border border-neutral-800 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-neutral-400 mb-2">
                  Primary Philosophical Discipline
                </label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full bg-neutral-900/90 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                >
                  <option value="Rationalism">Cartesian Rationalism &amp; Epistemology</option>
                  <option value="Existentialism">Existentialism &amp; Nihilism (Nietzsche)</option>
                  <option value="Socratic">Socratic Dialectics &amp; Virtue Ethics</option>
                  <option value="Political">Political Realism &amp; Statecraft (Machiavelli)</option>
                  <option value="Idealism">German Idealism &amp; Kantian Ethics</option>
                </select>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/50 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span>Inscribing into Registry...</span>
                  ) : (
                    <>
                      <span>Enter the Academy</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-full border border-white mx-auto flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif-classic text-2xl font-bold tracking-[0.15em] text-white uppercase">
                Welcome, {name || "Fellow Seeker"}
              </h3>
              <p className="font-garamond text-neutral-300 text-base max-w-sm mx-auto">
                Your registry has been accepted. We have transmitted the introductory treatise and syllabus to <strong className="text-white">{email}</strong>.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-8 py-2.5 border border-neutral-700 hover:border-white text-xs uppercase tracking-[0.2em] text-neutral-300 hover:text-white transition-colors"
            >
              Return to Inquiries
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

