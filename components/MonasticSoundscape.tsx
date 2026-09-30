"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Sparkles, Maximize2, Minimize2, Waves, CloudRain, Bell } from "lucide-react";

type SoundType = "drone" | "rain" | "bell";

export default function MonasticSoundscape() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundType, setSoundType] = useState<SoundType>("drone");
  const [volume, setVolume] = useState(0.35);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<{
    oscillators?: OscillatorNode[];
    rainSource?: AudioBufferSourceNode;
  }>({});

  // Initialize or resume AudioContext
  const getAudioContext = (): AudioContext => {
    if (!audioCtxRef.current) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Stop current audio generators
  const stopAudio = () => {
    if (activeNodesRef.current.oscillators) {
      activeNodesRef.current.oscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // already stopped
        }
      });
      activeNodesRef.current.oscillators = [];
    }

    if (activeNodesRef.current.rainSource) {
      try {
        activeNodesRef.current.rainSource.stop();
        activeNodesRef.current.rainSource.disconnect();
      } catch {
        // already stopped
      }
      activeNodesRef.current.rainSource = undefined;
    }
  };

  // Generate Monastic Drone (108Hz root with binaural 432Hz harmonic overtones)
  const startDrone = (ctx: AudioContext, masterGain: GainNode) => {
    stopAudio();

    const freqs = [108, 216, 432]; // Deep meditative harmonic series
    const oscillators: OscillatorNode[] = [];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = idx === 0 ? "sine" : "triangle";
      // Slight detune for warm analog binaural beating
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.detune.setValueAtTime((idx - 1) * 2.5, ctx.currentTime);

      // Lower volume for higher harmonics
      const gainValue = idx === 0 ? 0.6 : 0.25 / idx;
      oscGain.gain.setValueAtTime(gainValue, ctx.currentTime);

      // Low-pass filter for smooth warmth
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start();
      oscillators.push(osc);
    });

    activeNodesRef.current.oscillators = oscillators;
  };

  // Generate Organic Rain via synthesized pink noise buffer
  const startRain = (ctx: AudioContext, masterGain: GainNode) => {
    stopAudio();

    const bufferSize = ctx.sampleRate * 2; // 2 seconds of looping noise
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise algorithm (Paul Kellet's filtered approach)
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to evoke rain patter
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(masterGain);
    whiteNoise.start();

    activeNodesRef.current.rainSource = whiteNoise;
  };

  // Ring a contemplative temple chime
  const ringChime = (ctx: AudioContext, masterGain: GainNode) => {
    const osc = ctx.createOscillator();
    const chimeGain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(528, ctx.currentTime); // 528Hz Solfeggio frequency

    chimeGain.gain.setValueAtTime(0.4, ctx.currentTime);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);

    osc.connect(chimeGain);
    chimeGain.connect(masterGain);

    osc.start();
    osc.stop(ctx.currentTime + 3.6);
  };

  // Start or change playing sound
  const playSound = (type: SoundType) => {
    const ctx = getAudioContext();
    if (!gainNodeRef.current) {
      const g = ctx.createGain();
      g.gain.setValueAtTime(volume, ctx.currentTime);
      g.connect(ctx.destination);
      gainNodeRef.current = g;
    }

    if (type === "drone") {
      startDrone(ctx, gainNodeRef.current);
    } else if (type === "rain") {
      startRain(ctx, gainNodeRef.current);
    } else if (type === "bell") {
      ringChime(ctx, gainNodeRef.current);
    }

    setIsPlaying(true);
    setSoundType(type);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      playSound(soundType);
    }
  };

  // Volume slider change
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVol, audioCtxRef.current.currentTime);
    }
  };

  // Toggle Focus Mode (dims navigation and outer UI)
  const toggleFocusMode = () => {
    const nextState = !isFocusMode;
    setIsFocusMode(nextState);
    if (nextState) {
      document.body.classList.add("focus-monastery-active");
      // If audio isn't playing, start the drone automatically
      if (!isPlaying) {
        playSound("drone");
      }
    } else {
      document.body.classList.remove("focus-monastery-active");
    }
  };

  // Keyboard shortcut listener ('M' for Focus Mode, 'Esc' to exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleFocusMode();
      } else if (e.key === "Escape" && isFocusMode) {
        setIsFocusMode(false);
        document.body.classList.remove("focus-monastery-active");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFocusMode, isPlaying]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return (
    <>
      {/* Full-screen Focus Sanctuary Exit Pill (Appears when Focus Mode is ON) */}
      {isFocusMode && (
        <aside
          aria-label="Focus mode active"
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-2.5 bg-black/90 border border-neutral-800 backdrop-blur-md shadow-2xl animate-fade-in"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-300">
            SANCTUARY FOCUS ACTIVE • [M / ESC TO EXIT]
          </span>
          <button
            type="button"
            onClick={toggleFocusMode}
            className="p-1 hover:text-white text-neutral-400 transition-colors cursor-pointer"
            title="Exit Focus Mode"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* Floating Ambient Sound Controller (Bottom Left Corner) */}
      <aside
        aria-label="Ambient Sound Controller"
        className="fixed bottom-6 left-6 z-40 select-none"
      >
        <div className="relative">
          {/* Main Floating Pill Trigger */}
          <div className="flex items-center gap-1.5 p-1 bg-black/90 border border-neutral-800/90 backdrop-blur-md shadow-xl hover:border-neutral-600 transition-colors">
            <button
              type="button"
              onClick={togglePlay}
              title={isPlaying ? "Silence Ambience" : "Play Monastic Soundscape"}
              className={`p-2 transition-colors cursor-pointer flex items-center gap-2 ${
                isPlaying ? "text-white" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-white" />
                  {/* Subtle animated equalizer bars */}
                  <span className="flex items-end gap-0.5 h-3 w-3">
                    <span className="w-0.5 bg-white animate-[bounce_1s_infinite_100ms] h-full" />
                    <span className="w-0.5 bg-white animate-[bounce_1s_infinite_300ms] h-2/3" />
                    <span className="w-0.5 bg-white animate-[bounce_1s_infinite_200ms] h-4/5" />
                  </span>
                </>
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="py-1.5 px-2 text-[10px] uppercase font-mono tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>{isPlaying ? soundType.toUpperCase() : "AMBIENT"}</span>
              <span className="text-[9px] text-neutral-600">•</span>
              <span className="text-[9px] text-neutral-500">[M]</span>
            </button>
          </div>

          {/* Expanded Settings Popover */}
          {isOpen && (
            <div className="absolute bottom-12 left-0 w-72 p-4 bg-neutral-950 border border-neutral-800 text-white shadow-2xl space-y-4 animate-fade-in backdrop-blur-xl">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-900">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                    MONASTIC SOUNDSCAPE
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-500 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Sound Mode Buttons */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => playSound("drone")}
                  className={`py-2 px-1.5 border text-center font-mono text-[10px] tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    isPlaying && soundType === "drone"
                      ? "bg-white text-black border-white font-bold"
                      : "border-neutral-800 bg-black text-neutral-400 hover:text-white"
                  }`}
                >
                  <Waves className="w-3.5 h-3.5" />
                  <span>DRONE</span>
                </button>

                <button
                  type="button"
                  onClick={() => playSound("rain")}
                  className={`py-2 px-1.5 border text-center font-mono text-[10px] tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    isPlaying && soundType === "rain"
                      ? "bg-white text-black border-white font-bold"
                      : "border-neutral-800 bg-black text-neutral-400 hover:text-white"
                  }`}
                >
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>RAIN</span>
                </button>

                <button
                  type="button"
                  onClick={() => playSound("bell")}
                  className={`py-2 px-1.5 border text-center font-mono text-[10px] tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    isPlaying && soundType === "bell"
                      ? "bg-white text-black border-white font-bold"
                      : "border-neutral-800 bg-black text-neutral-400 hover:text-white"
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>CHIME</span>
                </button>
              </div>

              {/* Volume Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                  <span>VOLUME</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-1 bg-neutral-800 appearance-none cursor-pointer accent-white"
                />
              </div>

              {/* Sanctuary Focus Mode Toggle */}
              <div className="pt-2 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={toggleFocusMode}
                  className={`w-full py-2 px-3 border text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isFocusMode
                      ? "bg-neutral-900 border-white text-white"
                      : "border-neutral-800 hover:border-neutral-600 bg-black text-neutral-300 hover:text-white"
                  }`}
                >
                  {isFocusMode ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5" />
                      <span>Exit Sanctuary (M)</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Monastery Focus (M)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
