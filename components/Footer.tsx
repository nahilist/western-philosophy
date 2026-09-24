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
    <footer id="contact" className="w-full bg-black text-white pt-20 pb-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-t border-neutral-900">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-start">
        {/* Column 1: PHILOSOPHY */}
        <div className="md:col-span-3 space-y-2">
          <h4 className="font-serif-classic text-base sm:text-lg font-bold tracking-[0.3em] text-white uppercase">
            PHILOSOPHY
          </h4>
          <p className="font-garamond text-sm text-neutral-300 leading-relaxed">
            Preserving classical inquiries into truth, reality, and morality.
          </p>
        </div>

        {/* Column 2: Philosophy links */}
        <div className="md:col-span-2 space-y-3">
          <h5 className="font-serif-classic text-xs font-semibold tracking-[0.2em] text-neutral-200 uppercase">
            Philosophy
          </h5>
          <ul className="space-y-2.5 text-xs tracking-wider text-neutral-300">
            <li>
              <Link href="/#home" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/#courses" className="hover:text-white transition-colors">
                Courses
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact &amp; Inquiries
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact links */}
        <div className="md:col-span-2 space-y-3">
          <h5 className="font-serif-classic text-xs font-semibold tracking-[0.2em] text-neutral-200 uppercase">
            Contact
          </h5>
          <ul className="space-y-2.5 text-xs tracking-wider text-neutral-300">
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
          <form onSubmit={handleSubmit} className="relative w-full max-w-md">
            <div className="relative flex items-center rounded-full bg-gradient-to-b from-[#3a3a3a] to-[#202020] border border-neutral-700/80 p-1.5 shadow-inner">
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent px-4 py-2 text-xs text-white placeholder:text-neutral-400 focus:outline-none tracking-wide"
              />
              <button
                type="submit"
                className="rounded-full bg-black/90 border border-neutral-700 px-6 py-2 text-xs font-serif-classic tracking-[0.16em] uppercase font-semibold text-white hover:bg-white hover:text-black transition-all cursor-pointer flex-shrink-0"
              >
                {status === "submitted" ? "DONE" : "SUBMIT"}
              </button>
            </div>
            {status === "submitted" && (
              <p className="text-xs text-neutral-200 mt-2 pl-2 font-garamond">
                Thank you for subscribing to the weekly dialectic.
              </p>
            )}
          </form>
        </div>
      </div>
    </footer>
  );
}
