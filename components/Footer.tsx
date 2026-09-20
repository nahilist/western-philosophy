"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

interface FooterProps {
  onOpenAbout?: () => void;
}

export default function Footer({ onOpenAbout }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail("");
    }, 600);
  };

  return (
    <footer
      id="contact"
      className="w-full bg-black border-t border-neutral-900/80 pt-20 pb-16 px-6 sm:px-12 text-white"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-neutral-900">
          {/* Brand Column (Left) */}
          <div className="md:col-span-4 space-y-4">
            <Link
              href="/"
              className="inline-block font-serif-classic text-xl font-bold tracking-[0.35em] text-white uppercase"
            >
              PHILOSOPHY <span className="font-light text-neutral-400">Φ</span>
            </Link>
            <p className="font-garamond text-sm sm:text-base text-neutral-400 max-w-sm leading-relaxed">
              Preserving and transmitting foundational philosophical inquiries into truth, reality, and morality through classical art and modern thought.
            </p>
          </div>

          {/* Nav Column: Philosophy */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-serif-classic text-xs font-semibold tracking-[0.25em] text-neutral-300 uppercase">
              Philosophy
            </h4>
            <ul className="space-y-2.5 text-xs tracking-[0.2em] text-neutral-400 uppercase">
              <li>
                <Link
                  href="#home"
                  className="hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <Link
                  href="#courses"
                  className="hover:text-white transition-colors"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="#socrates"
                  className="hover:text-white transition-colors"
                >
                  Dialogues
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-serif-classic text-xs font-semibold tracking-[0.25em] text-neutral-300 uppercase">
              Contact
            </h4>
            <ul className="space-y-2.5 text-xs tracking-[0.2em] text-neutral-400 uppercase">
              <li>
                <a
                  href="mailto:inquiry@philosophy-phi.org"
                  className="hover:text-white transition-colors"
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column (Right) matching screenshot */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-serif-classic text-xs font-semibold tracking-[0.25em] text-neutral-200 uppercase">
              Join Our Newsletter
            </h4>
            <p className="text-xs text-neutral-400 font-garamond leading-relaxed">
              Curated weekly philosophical meditations and seminar dispatches delivered directly to your inbox.
            </p>

            {/* Pill-shaped Newsletter Input matching screenshot */}
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <div className="pill-input-glow relative flex items-center rounded-full border border-neutral-700/80 p-1.5 transition-all focus-within:border-neutral-500">
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent px-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none tracking-wider"
                />
                <button
                  type="submit"
                  disabled={loading || subscribed}
                  className="flex items-center justify-center rounded-full bg-neutral-950 border border-neutral-700 px-5 py-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-white hover:bg-white hover:text-black transition-all duration-300 shadow-md cursor-pointer flex-shrink-0"
                >
                  {loading ? (
                    <span>...</span>
                  ) : subscribed ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Check className="w-3 h-3" />
                      <span>Joined</span>
                    </span>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </div>

              {subscribed && (
                <p className="text-[11px] text-emerald-400 mt-2 tracking-wide font-light">
                  ✓ Gratitude. You have been added to our weekly philosophical discourse.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p className="tracking-widest uppercase text-[10px]">
            © {new Date().getFullYear()} PHILOSOPHY Φ. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[10px] tracking-widest uppercase">
            <button
              onClick={onOpenAbout}
              className="hover:text-neutral-300 transition-colors cursor-pointer"
            >
              UI WebDesign Showcase
            </button>
            <Link href="#home" className="hover:text-neutral-300 transition-colors">
              Back to Top ↑
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

