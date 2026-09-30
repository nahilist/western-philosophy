"use client";

import React, { useEffect, useState } from "react";

/**
 * 1px Razor-Thin Top Scroll Gauge
 * A museum-grade, minimal reading progress hairline that unobtrusively
 * tracks the reader's contemplation depth through the treatise.
 */
export default function ScrollGauge() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (windowHeight === 0) return;
      const scrollPercent = (totalScroll / windowHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[1.5px] bg-neutral-950 pointer-events-none"
    >
      <div
        className="h-full bg-white transition-[width] duration-150 ease-out will-change-[width] opacity-90 shadow-[0_0_8px_rgba(255,255,255,0.6)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

