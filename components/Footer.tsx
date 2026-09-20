"use client";

import React, { useState } from "react";
import Link from "next/link";

interface FooterProps {
  onOpenAbout?: () => void;
}

export default function Footer({ onOpenAbout }: FooterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("submitted");
    setTimeout(() => {
      setStatus("idle");
      setEmail("");
    }, 3000);
  };

  return (
    <footer id="contact" className="w-full bg-black text-white pt-16 pb-24 px-8 sm:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 lg:gap-8 items-start">
        {/* Column 1: PHILOSOPHY */}
        <div className="md:col-span-3">
          <h4 className="font-serif-classic text-sm sm:text-base font-bold tracking-[0.3em] text-white uppercase">
            PHILOSOPHY
          </h4>
        </div>

        {/* Column 2: Philosophy links */}
        <div className="md:col-span-2 space-y-3">
          <h5 className="font-serif-classic text-xs font-semibold tracking-[0.2em] text-neutral-300 uppercase">
            Philosophy
          </h5>
          <ul className="space-y-2 text-xs tracking-wider text-neutral-400">
            <li>
              <Link href="#home" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <button
                onClick={onOpenAbout}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                About
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact links */}
        <div className="md:col-span-2 space-y-3">
          <h5 className="font-serif-classic text-xs font-semibold tracking-[0.2em] text-neutral-300 uppercase">
            Contact
          </h5>
          <ul className="space-y-2 text-xs tracking-wider text-neutral-400">
            <li>
              <a
                href="mailto:contact@philosophy.org"
                className="hover:text-white transition-colors"
              >
                Email
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                Twitter
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Join Our Newsletter */}
        <div className="md:col-span-5 space-y-3">
          <h5 className="font-serif-classic text-xs font-semibold tracking-[0.2em] text-neutral-200 uppercase">
            Join Our Newsletter
          </h5>

          {/* Pill-shaped Newsletter Input matching Screenshot 1 */}
          <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
            <div className="relative flex items-center rounded-full bg-gradient-to-b from-[#3a3a3a] to-[#202020] border border-neutral-700/80 p-1.5 shadow-inner">
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent px-4 py-1.5 text-xs text-white placeholder:text-neutral-400 focus:outline-none tracking-wide"
              />
              <button
                type="submit"
                className="rounded-full bg-black/90 border border-neutral-700 px-5 py-1.5 text-[10px] font-serif-classic tracking-[0.2em] uppercase text-white hover:bg-white hover:text-black transition-all cursor-pointer flex-shrink-0"
              >
                {status === "submitted" ? "DONE" : "SUBMIT"}
              </button>
            </div>
            {status === "submitted" && (
              <p className="text-[11px] text-neutral-300 mt-2 pl-2">
                Thank you for subscribing.
              </p>
            )}
          </form>
        </div>
      </div>
    </footer>
  );
}
