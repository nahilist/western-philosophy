"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Sparkles, RefreshCw, MessageSquare, Play, Square, CornerDownLeft } from "lucide-react";

interface SocraticDialogueItem {
  speaker: "seeker" | "socrates";
  text: string;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionLike;
}

type SpeechWindow = Window &
  typeof globalThis & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

const PRESET_INQUIRIES = [
  "I seek wealth and status, but feel hollow inside.",
  "Why should I fear death if it is the natural end of all life?",
  "Is suffering merely evil, or does it hold meaning?",
  "How do I know if my moral beliefs are true or just conditioned by society?",
  "What is the point of seeking truth when everything can be doubted?",
  "Can an unjust action ever lead to a just society?",
];

// Socratic Elenchus dialectical response generator
function generateSocraticResponse(userText: string): string {
  const lower = userText.toLowerCase();

  if (lower.includes("wealth") || lower.includes("money") || lower.includes("rich") || lower.includes("status") || lower.includes("career")) {
    return "Tell me, friend: does wealth possess the power to make its possessor wise, or does wisdom alone make wealth beneficial? For if a foolish man commands an armada of gold, will he steer toward virtue or amplify his folly? Define for me first: what is true wealth if not the health of the soul?";
  }

  if (lower.includes("death") || lower.includes("die") || lower.includes("dying") || lower.includes("mortal")) {
    return "To fear death, noble stranger, is nothing other than to think oneself wise when one is not. It is to imagine that we know what we do not know. For no man knows whether death may not be the greatest of all human blessings—yet men fear it as though they were certain it were the supreme catastrophe. How can you fear that which you have never experienced?";
  }

  if (lower.includes("suffer") || lower.includes("pain") || lower.includes("grief") || lower.includes("struggle")) {
    return "Consider this: does suffering harm the soul's virtue, or merely the fragile vessel of the body? If injustice and ignorance are the only true ruin of a human being, can external adversity ever corrupt a mind that refuses to surrender its own integrity?";
  }

  if (lower.includes("doubt") || lower.includes("truth") || lower.includes("true") || lower.includes("know")) {
    return "You say you doubt. But observe: in the very act of doubting, are you not exercising an unquenchable thirst for certainty? The unexamined life is not worth living. Tell me: would you prefer the comfort of a painted illusion, or the stinging stingray of genuine perplexity?";
  }

  if (lower.includes("society") || lower.includes("people") || lower.includes("opinion") || lower.includes("others")) {
    return "Why should we pay such profound heed to the opinions of the many? In gymnastics, do we seek the counsel of the crowd, or the one physician who understands the body? Why then, concerning justice and the soul, should we consult the clamor of the populace rather than truth itself?";
  }

  if (lower.includes("justice") || lower.includes("moral") || lower.includes("right") || lower.includes("wrong")) {
    return "Is an act holy because the gods love it, or do the gods love it because it is holy? If justice were merely the advantage of the stronger, as the sophists claim, then tyranny would be wisdom. But does a physician heal for his own gain, or for the patient? Inquire with me into the essence of the Good.";
  }

  return `You ask concerning "${userText.trim()}". But let us examine the presupposition beneath your words: Do you believe this dilemma arises from the external world, or from an unexamined judgment within your own consciousness? State clearly what you truly seek, and together we shall test whether it withstands the crucible of inquiry.`;
}

export default function SocraticVoiceOracle() {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voiceSynthesisSupported, setVoiceSynthesisSupported] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [history, setHistory] = useState<SocraticDialogueItem[]>([
    {
      speaker: "socrates",
      text: "Greetings, traveler of the mind. I am Socrates of Athens. I possess no wisdom of my own, but like a midwife, I can assist you in delivering the truth that lies dormant within your soul. Speak or inscribe: what belief or burden vexes your conscience today?",
    },
  ]);

  // Speech Recognition reference
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const dialogueEndRef = useRef<HTMLDivElement | null>(null);

  // Check speech capabilities
  useEffect(() => {
    const setupTimer = window.setTimeout(() => {
      const speechWindow = window as SpeechWindow;
      const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = false;
        recog.lang = "en-US";

        recog.onresult = (event: SpeechRecognitionEventLike) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            handleUserSubmit(transcript);
          }
          setIsListening(false);
        };

        recog.onerror = () => {
          setIsListening(false);
        };

        recog.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recog;
      }

      if ("speechSynthesis" in window) {
        setVoiceSynthesisSupported(true);
      }
    }, 0);

    return () => window.clearTimeout(setupTimer);
  }, []);

  // Auto-scroll to bottom of dialogue
  useEffect(() => {
    dialogueEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Socrates Vocal Recitation
  const speakSocratesText = (text: string) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88;
    utterance.pitch = 0.82; // Deep gravitas

    const voices = window.speechSynthesis.getVoices();
    const deepVoice =
      voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Male") || v.name.includes("Natural") || v.name.includes("David") || v.name.includes("George"))) ||
      voices.find((v) => v.lang.startsWith("en"));

    if (deepVoice) utterance.voice = deepVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  function handleUserSubmit(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return;

    // 1. Add user message
    const userMsg: SocraticDialogueItem = { speaker: "seeker", text: trimmed };
    const socratesReply = generateSocraticResponse(trimmed);
    const socratesMsg: SocraticDialogueItem = { speaker: "socrates", text: socratesReply };

    setHistory((prev) => [...prev, userMsg, socratesMsg]);
    setInputText("");

    // 2. Vocalize response after small contemplation pause
    setTimeout(() => {
      speakSocratesText(socratesReply);
    }, 400);
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUserSubmit(inputText);
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Top Instrument Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-900">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-neutral-400 tracking-widest uppercase">
              [ INSTRUMENTUM • 01 ]
            </span>
            <div className="w-8 h-px bg-neutral-800" />
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
              VOICE ELENCHUS
            </span>
          </div>
          <h3 className="font-serif-classic text-2xl sm:text-4xl font-bold tracking-[0.12em] text-white uppercase">
            The Socratic Voice Oracle
          </h3>
          <p className="font-garamond text-base sm:text-lg text-neutral-300 max-w-2xl font-light">
            Converse directly with Socrates of Athens through spoken inquiry. No dogma, no pretense—only the surgical cross-examination of your core assumptions.
          </p>
        </div>

        {/* Vocal Settings */}
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              className="px-3 py-1.5 border border-rose-900 bg-rose-950/40 text-rose-300 font-mono text-xs flex items-center gap-1.5 cursor-pointer hover:border-rose-600 transition-colors"
            >
              <Square className="w-3 h-3 fill-rose-300" />
              <span>Halt Voice</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (voiceEnabled) stopSpeaking();
              setVoiceEnabled(!voiceEnabled);
            }}
            title={voiceEnabled ? "Mute Socrates Vocal Recitation" : "Enable Vocal Recitation"}
            className={`p-2 border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono uppercase ${
              voiceEnabled
                ? "border-neutral-700 bg-neutral-900 text-white"
                : "border-neutral-800 bg-black text-neutral-500 hover:text-white"
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{voiceEnabled ? "Voice ON" : "Voice OFF"}</span>
          </button>
        </div>
      </div>

      {/* Main Chamber: Visual Voice Sphere & Dialogue Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Pulsing Socratic Audio Sphere & Quick Inquiries */}
        <div className="lg:col-span-4 p-8 border border-neutral-900 bg-neutral-950/80 flex flex-col items-center text-center space-y-8 relative">
          <span className="absolute top-3 left-4 font-mono text-neutral-700 text-xs select-none pointer-events-none">+</span>
          <span className="absolute top-3 right-4 font-mono text-neutral-700 text-xs select-none pointer-events-none">+</span>

          {/* Central Pulsing Audio Sphere */}
          <div className="relative my-4 flex items-center justify-center">
            {/* Outer animated halo rings */}
            <div
              className={`absolute w-36 h-36 rounded-full border border-neutral-800 transition-all duration-700 ${
                isListening
                  ? "border-rose-500 scale-125 animate-ping opacity-30"
                  : isSpeaking
                  ? "border-white scale-110 animate-pulse opacity-40"
                  : "opacity-20"
              }`}
            />
            <div
              className={`absolute w-28 h-28 rounded-full border border-neutral-700 transition-all duration-500 ${
                isSpeaking ? "scale-105 border-neutral-400" : ""
              }`}
            />

            {/* Core Interaction Sphere */}
            <button
              type="button"
              onClick={speechSupported ? toggleListening : undefined}
              disabled={!speechSupported}
              title={speechSupported ? "Tap to speak with Socrates" : "Speech recognition unavailable in this browser"}
              className={`relative z-10 w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
                isListening
                  ? "bg-rose-950 border-rose-500 text-rose-200 shadow-[0_0_30px_rgba(244,63,94,0.4)]"
                  : isSpeaking
                  ? "bg-neutral-900 border-white text-white shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                  : "bg-black border-neutral-700 text-neutral-400 hover:border-white hover:text-white"
              }`}
            >
              {isListening ? (
                <Mic className="w-7 h-7 animate-pulse text-rose-400" />
              ) : isSpeaking ? (
                <Volume2 className="w-7 h-7 text-white animate-bounce" />
              ) : (
                <Mic className="w-7 h-7" />
              )}
            </button>
          </div>

          {/* Status Label */}
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-white block font-semibold">
              {isListening
                ? "LISTENING • SPEAK NOW..."
                : isSpeaking
                ? "SOCRATES ORATING..."
                : speechSupported
                ? "PRESS TO SPEAK"
                : "TYPE INQUIRY BELOW"}
            </span>
            <p className="font-garamond italic text-xs text-neutral-400 max-w-xs">
              {speechSupported
                ? "Microphone operates 100% in-browser with zero latency."
                : "Web speech microphone not supported in your browser; type below."}
            </p>
          </div>

          {/* Quick Philosophical Sparks */}
          <div className="w-full space-y-2.5 pt-4 border-t border-neutral-900 text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">
              DIALECTICAL CATALYSTS
            </span>
            <div className="space-y-1.5">
              {PRESET_INQUIRIES.slice(0, 4).map((query, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleUserSubmit(query)}
                  className="w-full text-left p-2.5 border border-neutral-900 hover:border-neutral-700 bg-black/60 hover:bg-neutral-900 text-xs text-neutral-300 hover:text-white font-garamond italic transition-colors cursor-pointer group"
                >
                  <span className="text-neutral-500 not-italic font-mono text-[9px] mr-2">0{idx + 1}</span>
                  &ldquo;{query}&rdquo;
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Scrollable Ancient Dialogue Transcript & Input Box */}
        <div className="lg:col-span-8 space-y-4 flex flex-col h-[580px]">
          {/* Dialogue Log */}
          <div className="flex-1 p-6 border border-neutral-900 bg-black overflow-y-auto space-y-6 shadow-inner">
            {history.map((msg, idx) => (
              <div
                key={idx}
                className={`space-y-1.5 ${
                  msg.speaker === "seeker" ? "pl-8 text-right" : "pr-8 text-left"
                }`}
              >
                <div
                  className={`flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest ${
                    msg.speaker === "seeker" ? "justify-end text-neutral-400" : "text-neutral-500"
                  }`}
                >
                  {msg.speaker === "socrates" ? (
                    <>
                      <Sparkles className="w-3 h-3 text-neutral-400" />
                      <span className="text-white font-semibold">SOCRATES • ATHENS 399 BC</span>
                    </>
                  ) : (
                    <span>SEEKER OF TRUTH</span>
                  )}
                </div>

                <div
                  className={`inline-block p-4 border text-sm sm:text-base leading-relaxed ${
                    msg.speaker === "seeker"
                      ? "bg-neutral-950 border-neutral-800 text-neutral-200 font-garamond"
                      : "bg-neutral-950/90 border-neutral-800/80 text-white font-garamond italic border-l-2 border-l-white"
                  }`}
                >
                  {msg.speaker === "socrates" ? `“${msg.text}”` : msg.text}
                </div>
              </div>
            ))}
            <div ref={dialogueEndRef} />
          </div>

          {/* Text Submission Box */}
          <form
            onSubmit={handleFormSubmit}
            className="flex items-center border border-neutral-800 bg-neutral-950 focus-within:border-white transition-colors"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Inscribe your personal dilemma or question for Socrates..."
              className="flex-1 bg-transparent px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none font-garamond"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-3.5 bg-white text-black font-serif-classic text-xs uppercase tracking-widest font-bold hover:bg-neutral-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
            >
              <span>Inquire</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
