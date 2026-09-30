"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Download, Share2, Copy, Check, Sparkles, Sliders } from "lucide-react";

export interface PosterQuoteData {
  quote: string;
  author: string;
  school?: string;
  era?: string;
  axiom?: string;
  latinOrGreek?: string;
}

interface TypographicPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PosterQuoteData | null;
}

type AspectRatio = "1:1" | "9:16" | "4:5";
type ThemeMode = "obsidian" | "monastic" | "parchment";

export default function TypographicPosterModal({
  isOpen,
  onClose,
  data,
}: TypographicPosterModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ratio, setRatio] = useState<AspectRatio>("9:16");
  const [theme, setTheme] = useState<ThemeMode>("obsidian");
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Canvas dimensions based on ratio
  const getDimensions = useCallback((r: AspectRatio) => {
    switch (r) {
      case "9:16":
        return { width: 1080, height: 1920, previewAspect: "aspect-[9/16]" };
      case "4:5":
        return { width: 1080, height: 1350, previewAspect: "aspect-[4/5]" };
      case "1:1":
      default:
        return { width: 1200, height: 1200, previewAspect: "aspect-square" };
    }
  }, []);

  // Word wrap helper for canvas
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = words[0] || "";

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  };

  // Render canvas
  const renderCanvas = useCallback(() => {
    if (!data || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = getDimensions(ratio);
    canvas.width = width;
    canvas.height = height;

    // Theme color palettes
    let bg = "#000000";
    let borderCol = "#1f1f1f";
    let textPrimary = "#ffffff";
    let textSecondary = "#a3a3a3";
    let textMuted = "#737373";
    let accent = "#ffffff";

    if (theme === "monastic") {
      bg = "#070404";
      borderCol = "#3b1116";
      textPrimary = "#ffffff";
      textSecondary = "#c4b5b8";
      textMuted = "#8c6b71";
      accent = "#e11d48"; // Crimson
    } else if (theme === "parchment") {
      bg = "#0c0a09";
      borderCol = "#292524";
      textPrimary = "#fafaf9";
      textSecondary = "#d6d3d1";
      textMuted = "#78716c";
      accent = "#d97706"; // Amber / Golden ratio
    }

    // 1. Background
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Subtle architectural grid background
    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 1;
    const gridSize = 80;
    ctx.beginPath();
    for (let x = 0; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Subtle dark gradient wash to prioritize typography legibility
    const grad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      100,
      width / 2,
      height / 2,
      Math.max(width, height) / 1.1
    );
    grad.addColorStop(0, bg + "fa");
    grad.addColorStop(1, bg + "ee");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Framing lines & Architectural Crosshairs
    const pad = width * 0.08;
    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 2;
    ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

    // Corner crosshair markers
    const crossSize = 24;
    ctx.strokeStyle = textMuted;
    ctx.lineWidth = 2;

    const corners = [
      [pad, pad],
      [width - pad, pad],
      [pad, height - pad],
      [width - pad, height - pad],
    ];

    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.moveTo(cx - crossSize, cy);
      ctx.lineTo(cx + crossSize, cy);
      ctx.moveTo(cx, cy - crossSize);
      ctx.lineTo(cx, cy + crossSize);
      ctx.stroke();
    });

    // 3. Header Metadata
    ctx.fillStyle = textMuted;
    ctx.font = "600 22px 'Courier New', monospace";
    ctx.letterSpacing = "6px";
    ctx.textAlign = "left";
    ctx.fillText("[ ARCHIVUM PHILOSOPHIAE • MONOGRAPHIA ]", pad + 28, pad + 60);

    ctx.textAlign = "right";
    const yearStr = new Date().getFullYear().toString();
    ctx.fillText(`CODEX • ${yearStr}`, width - pad - 28, pad + 60);

    // Divider line below header
    ctx.strokeStyle = borderCol;
    ctx.beginPath();
    ctx.moveTo(pad + 28, pad + 84);
    ctx.lineTo(width - pad - 28, pad + 84);
    ctx.stroke();

    // 4. Accent Axiom / Greek / Latin Subtitle
    let cursorY = pad + 150;
    if (data.latinOrGreek || data.axiom) {
      const axiomText = data.latinOrGreek || data.axiom || "";
      ctx.fillStyle = accent;
      ctx.font = "italic 400 32px Georgia, 'Times New Roman', serif";
      ctx.letterSpacing = "3px";
      ctx.textAlign = "center";
      ctx.fillText(`— ${axiomText} —`, width / 2, cursorY);
      cursorY += 60;
    }

    // 5. Main Quote
    const maxContentWidth = width - pad * 2 - 120;
    // Dynamic quote font size depending on quote length and aspect ratio
    const quoteLength = data.quote.length;
    let quoteFontSize = 54;
    if (quoteLength > 200) {
      quoteFontSize = 40;
    } else if (quoteLength > 120) {
      quoteFontSize = 48;
    } else if (quoteLength < 70 && ratio !== "1:1") {
      quoteFontSize = 64;
    }

    ctx.font = `italic 300 ${quoteFontSize}px Georgia, 'Cormorant Garamond', 'Times New Roman', serif`;
    ctx.letterSpacing = "1px";
    const quoteLines = wrapText(ctx, `“${data.quote}”`, maxContentWidth);
    const lineHeight = quoteFontSize * 1.5;
    const totalQuoteHeight = quoteLines.length * lineHeight;

    // Center vertically in remaining area
    const availableAreaCenter = (height - pad * 2) / 2 + pad - 20;
    let startQuoteY = availableAreaCenter - totalQuoteHeight / 2;
    if (startQuoteY < cursorY + 40) startQuoteY = cursorY + 40;

    ctx.fillStyle = textPrimary;
    ctx.textAlign = "center";
    quoteLines.forEach((line, idx) => {
      ctx.fillText(line, width / 2, startQuoteY + idx * lineHeight);
    });

    // 6. Author Section
    const authorY = startQuoteY + totalQuoteHeight + 70;

    // Small divider
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 40, authorY - 30);
    ctx.lineTo(width / 2 + 40, authorY - 30);
    ctx.stroke();

    ctx.fillStyle = textPrimary;
    ctx.font = "bold 38px 'Times New Roman', Georgia, serif";
    ctx.letterSpacing = "8px";
    ctx.textAlign = "center";
    ctx.fillText(data.author.toUpperCase(), width / 2, authorY + 20);

    // School / Era badge
    if (data.school || data.era) {
      const meta = [data.school, data.era].filter(Boolean).join(" • ");
      ctx.fillStyle = textSecondary;
      ctx.font = "400 22px 'Courier New', monospace";
      ctx.letterSpacing = "4px";
      ctx.fillText(meta.toUpperCase(), width / 2, authorY + 68);
    }

    // 7. Footer Seal & Monogram
    const footerY = height - pad - 50;
    ctx.strokeStyle = borderCol;
    ctx.beginPath();
    ctx.moveTo(pad + 28, footerY - 30);
    ctx.lineTo(width - pad - 28, footerY - 30);
    ctx.stroke();

    ctx.fillStyle = textMuted;
    ctx.font = "500 20px 'Courier New', monospace";
    ctx.letterSpacing = "4px";
    ctx.textAlign = "left";
    ctx.fillText("PHILOSOPHIA • WESTERN ARCHIVE", pad + 28, footerY);

    ctx.textAlign = "right";
    ctx.fillText("VERITAS ET SAPIENTIA", width - pad - 28, footerY);

    // Update preview URL for the image view
    const dataUrl = canvas.toDataURL("image/png");
    setPreviewUrl(dataUrl);
  }, [data, ratio, theme, getDimensions]);

  useEffect(() => {
    if (isOpen && data) {
      // Allow browser to mount modal then render
      const timer = setTimeout(renderCanvas, 80);
      return () => clearTimeout(timer);
    }
  }, [isOpen, data, renderCanvas]);

  if (!isOpen || !data) return null;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    setIsDownloading(true);
    try {
      const link = document.createElement("a");
      const cleanAuthor = data.author.toLowerCase().replace(/[^a-z0-9]/g, "-");
      link.download = `codex-${cleanAuthor}-${ratio.replace(":", "x")}.png`;
      link.href = canvasRef.current.toDataURL("image/png");
      link.click();
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2500);
        } else {
          // Fallback to direct download if clipboard API is not available
          handleDownload();
        }
      });
    } catch {
      handleDownload();
    }
  };

  const handleNativeShare = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `${data.author.toLowerCase()}-quote.png`, {
          type: "image/png",
        });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `${data.author} — Western Philosophy Archive`,
            text: `“${data.quote}” — ${data.author}`,
          });
        } else {
          handleDownload();
        }
      });
    } catch {
      handleDownload();
    }
  };

  const { previewAspect } = getDimensions(ratio);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Export Typographic Codex Card"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in"
    >
      {/* Hidden high-res canvas used for rasterization */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative w-full max-w-5xl bg-neutral-950 border border-neutral-800 text-white shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Minimal Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 bg-black">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400">
              CODEX POSTER EXPORTER
            </span>
            <span className="text-neutral-700">•</span>
            <span className="text-xs uppercase font-serif-classic text-neutral-300">
              {data.author}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split into Interactive Controls & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Column: Interactive Controls */}
          <div className="lg:col-span-5 p-6 sm:p-8 space-y-8 border-b lg:border-b-0 lg:border-r border-neutral-900 bg-neutral-950/60 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Aspect Ratio Selector */}
              <div className="space-y-3">
                <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 block font-semibold">
                  1. Aspect Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["9:16", "4:5", "1:1"] as AspectRatio[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRatio(r)}
                      className={`py-2.5 px-3 border text-xs font-mono tracking-wider transition-all cursor-pointer text-center ${
                        ratio === r
                          ? "bg-white text-black border-white font-bold"
                          : "bg-black border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white"
                      }`}
                    >
                      {r}
                      <span className="block text-[9px] font-sans opacity-70 mt-0.5">
                        {r === "9:16" ? "Story" : r === "4:5" ? "Portrait" : "Square"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Palette Selector */}
              <div className="space-y-3">
                <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 block font-semibold">
                  2. Aesthetic Palette
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme("obsidian")}
                    className={`p-3 border text-left text-xs font-mono transition-all cursor-pointer ${
                      theme === "obsidian"
                        ? "border-white bg-black ring-1 ring-white"
                        : "border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className="w-3 h-3 bg-neutral-100 mb-2 border border-white" />
                    <span className="font-semibold block text-white text-[11px]">Obsidian</span>
                    <span className="text-[9px] text-neutral-500 block">Pure Noir</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme("monastic")}
                    className={`p-3 border text-left text-xs font-mono transition-all cursor-pointer ${
                      theme === "monastic"
                        ? "border-rose-400 bg-black ring-1 ring-rose-500"
                        : "border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className="w-3 h-3 bg-rose-600 mb-2 border border-rose-500" />
                    <span className="font-semibold block text-white text-[11px]">Monastic</span>
                    <span className="text-[9px] text-neutral-500 block">Crimson Line</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme("parchment")}
                    className={`p-3 border text-left text-xs font-mono transition-all cursor-pointer ${
                      theme === "parchment"
                        ? "border-amber-400 bg-black ring-1 ring-amber-500"
                        : "border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className="w-3 h-3 bg-amber-500 mb-2 border border-amber-400" />
                    <span className="font-semibold block text-white text-[11px]">Papyrus</span>
                    <span className="text-[9px] text-neutral-500 block">Amber Ink</span>
                  </button>
                </div>
              </div>

              {/* Quote Snippet Preview Info */}
              <div className="p-4 border border-neutral-900 bg-black/60 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">
                  INSCRIPTION TEXT
                </span>
                <p className="font-garamond italic text-sm text-neutral-300 line-clamp-3">
                  &ldquo;{data.quote}&rdquo;
                </p>
                <span className="text-[11px] font-serif-classic text-neutral-400 block">
                  — {data.author}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full py-3.5 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isDownloading ? "Rasterizing..." : "Download High-Res PNG"}
                </span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="py-2.5 px-3 border border-neutral-800 hover:border-neutral-600 bg-black text-neutral-300 hover:text-white font-mono text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Image</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="py-2.5 px-3 border border-neutral-800 hover:border-neutral-600 bg-black text-neutral-300 hover:text-white font-mono text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Card Preview */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex items-center justify-center bg-black/90 min-h-[420px]">
            {previewUrl ? (
              <div
                className={`relative w-full max-w-[340px] sm:max-w-[380px] ${previewAspect} shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-neutral-800 overflow-hidden transition-all duration-300`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={`${data.author} quote poster`}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-neutral-600 font-mono text-xs">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span>Illuminating Manuscript Card...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
