"use client";

import React, { useState, useMemo, useRef } from "react";

interface AxisDefinition {
  id: string;
  name: string;
  lowLabel: string;
  highLabel: string;
  description: string;
}

const AXES: AxisDefinition[] = [
  {
    id: "epistemology",
    name: "Epistemic Origin",
    lowLabel: "Empiricism (Senses)",
    highLabel: "Rationalism (Pure Reason)",
    description: "Whether ultimate truth springs from sensory observation or a priori intellectual deduction.",
  },
  {
    id: "temperament",
    name: "Existential Temperament",
    lowLabel: "Stoic Ataraxia",
    highLabel: "Dionysian Fire",
    description: "Equanimity and mastery over passions vs. radical ecstasy and tragic vitalism.",
  },
  {
    id: "agency",
    name: "Metaphysical Agency",
    lowLabel: "Cosmic Determinism",
    highLabel: "Radical Sartre Freedom",
    description: "Are we bound by cause-and-effect fate or condemned to absolute, vertigo-inducing choice?",
  },
  {
    id: "ontology",
    name: "Ontological Fabric",
    lowLabel: "Materialism / Matter",
    highLabel: "Idealism / Pure Form",
    description: "Is physical matter the primary reality, or is consciousness/idea the primordial ground?",
  },
  {
    id: "ethics",
    name: "Moral Architecture",
    lowLabel: "Perspectival Relativity",
    highLabel: "Universal Categorical Law",
    description: "Are morals subjective value-constructs or timeless universal duties binding all intellects?",
  },
  {
    id: "vocation",
    name: "Existential Vocation",
    lowLabel: "Vita Contemplativa",
    highLabel: "Revolutionary Praxis",
    description: "Quiet solitary introspection in ivory towers vs. violent disruptive action in the polis.",
  },
];

interface Dilemma {
  id: number;
  title: string;
  scenario: string;
  optionA: {
    label: string;
    impact: Record<string, number>;
  };
  optionB: {
    label: string;
    impact: Record<string, number>;
  };
}

const DILEMMAS: Dilemma[] = [
  {
    id: 1,
    title: "The Epistemic Abyss",
    scenario: "You discover all human sensory input could theoretically be simulated by an omnipotent deceiver.",
    optionA: {
      label: "Retreat into 'Cogito' — truth resides strictly in mathematical clarity beyond all sight and touch.",
      impact: { epistemology: 88, ontology: 80, ethics: 65 },
    },
    optionB: {
      label: "Embrace the senses anyway — even an illusion perceived through blood and bone is reality enough.",
      impact: { epistemology: 20, ontology: 15, temperament: 75 },
    },
  },
  {
    id: 2,
    title: "The Burning Library",
    scenario: "A fire consumes Alexandria. You can rescue the scrolls of universal stoic laws or the diary of tragic human passions.",
    optionA: {
      label: "Rescue the Universal Laws — human suffering is fleeting, but objective moral duty is eternal.",
      impact: { temperament: 15, ethics: 90, epistemology: 75 },
    },
    optionB: {
      label: "Rescue the Passions — life's raw sorrow and unbridled love outweigh cold cosmological equations.",
      impact: { temperament: 92, ethics: 20, agency: 85 },
    },
  },
  {
    id: 3,
    title: "The Sovereign Puppet",
    scenario: "Neurology proves every decision you make was predetermined 300 milliseconds prior to conscious awareness.",
    optionA: {
      label: "Amor Fati — love the causal chain. Accept necessity with serene Spinozist grace.",
      impact: { agency: 12, temperament: 25, ontology: 25 },
    },
    optionB: {
      label: "Defiant Rebellion — existence precedes essence. I invent my own meaning despite the clockwork cosmos.",
      impact: { agency: 95, temperament: 85, ethics: 35 },
    },
  },
  {
    id: 4,
    title: "The Philosopher's Tower",
    scenario: "Injustice plagues your nation. You can complete a treatise that enlightens centuries hence, or storm the bastion today.",
    optionA: {
      label: "Remain at the desk — eternal ideas outlive barricades and conquer the future mind.",
      impact: { vocation: 15, ontology: 85, epistemology: 80 },
    },
    optionB: {
      label: "Join the barricades — philosophers have hitherto only interpreted the world; the point is to change it.",
      impact: { vocation: 95, ontology: 15, agency: 85 },
    },
  },
  {
    id: 5,
    title: "The Universal Standard",
    scenario: "An act saves thousands of lives, but requires you to betray a solemn sworn vow of absolute truth.",
    optionA: {
      label: "Refuse to lie — if categorical truth is violated once for convenience, the moral universe disintegrates.",
      impact: { ethics: 95, epistemology: 85, agency: 45 },
    },
    optionB: {
      label: "Break the vow — there are no moral phenomena, only moral interpretations based on context.",
      impact: { ethics: 15, temperament: 80, vocation: 70 },
    },
  },
];

interface Archetype {
  name: string;
  archetypeId: string;
  quote: string;
  author: string;
  maxim: string;
  treatise: string;
  description: string;
}

const ARCHETYPES: Archetype[] = [
  {
    name: "The Sovereign Stoic",
    archetypeId: "stoic",
    quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    maxim: "Adversitas Fortitudo Nostra (Adversity is our fortitude)",
    treatise: "Meditations (Book IV)",
    description: "Unshakable, disciplined, and guided by cosmic duty. You view outer chaos as mere fuel for inner virtue.",
  },
  {
    name: "The Dionysian Rebel",
    archetypeId: "dionysian",
    quote: "One must still have chaos in oneself to be able to give birth to a dancing star.",
    author: "Friedrich Nietzsche",
    maxim: "Amor Fati & Wille zur Macht",
    treatise: "Thus Spoke Zarathustra",
    description: "Vitalist, ecstatic, and tragic. You despise sterile dogmas and embrace the raw, agonizing joy of becoming.",
  },
  {
    name: "The Geometer of Truth",
    archetypeId: "rationalist",
    quote: "I think, therefore I am. Truth is an axiomatic structure carved by pure mathematical thought.",
    author: "René Descartes",
    maxim: "Cogito Ergo Sum",
    treatise: "Discourse on the Method",
    description: "Architectural, lucid, and uncompromising. You dismantle illusions until only pure foundational axioms survive.",
  },
  {
    name: "The Absurdist Pioneer",
    archetypeId: "existentialist",
    quote: "Man is condemned to be free; because once thrown into the world, he is responsible for everything he does.",
    author: "Jean-Paul Sartre",
    maxim: "L'existence précède l'essence",
    treatise: "Being and Nothingness",
    description: "Lucidly aware of the cosmic silence, you forge radical self-authored freedom in an indifferent universe.",
  },
  {
    name: "The Platonic Idealist",
    archetypeId: "idealist",
    quote: "The soul takes nothing with her to the other world but her education and culture.",
    author: "Plato",
    maxim: "Veritas Vos Liberabit",
    treatise: "The Republic (Allegory of the Cave)",
    description: "Seeking the luminous forms above the shadowy realm of mere appearances, you yearn for timeless perfection.",
  },
  {
    name: "The Revolutionary Materialist",
    archetypeId: "praxis",
    quote: "The philosophers have only interpreted the world, in various ways. The point, however, is to change it.",
    author: "Karl Marx",
    maxim: "Theses on Feuerbach",
    treatise: "Critique of Dialectical Reason",
    description: "Grounded in historical reality, class dynamics, and tangible action. Ideas are only meaningful when embodied in flesh and steel.",
  },
];

export default function ExistentialRadar() {
  const [scores, setScores] = useState<Record<string, number>>({
    epistemology: 65,
    temperament: 40,
    agency: 75,
    ontology: 50,
    ethics: 60,
    vocation: 55,
  });

  const [activeDilemmaIndex, setActiveDilemmaIndex] = useState(0);
  const [completedDilemmas, setCompletedDilemmas] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"radar" | "dilemmas" | "sliders">("radar");
  const [exportNotice, setExportNotice] = useState(false);
  const radarRef = useRef<SVGSVGElement>(null);

  // SVG Geometry
  const size = 380;
  const center = size / 2;
  const radius = size * 0.38;

  // Calculate coordinates for 6 axes
  const points = useMemo(() => {
    return AXES.map((axis, i) => {
      const angle = (Math.PI * 2 / AXES.length) * i - Math.PI / 2;
      const score = scores[axis.id] ?? 50;
      const dist = (score / 100) * radius;
      const x = center + dist * Math.cos(angle);
      const y = center + dist * Math.sin(angle);
      return { x, y, score, axis };
    });
  }, [scores, center, radius]);

  const polygonPath = useMemo(() => {
    return points.map(p => `${p.x},${p.y}`).join(" ");
  }, [points]);

  // Determine user's archetype
  const userArchetype = useMemo<Archetype>(() => {
    const { epistemology, temperament, agency, ontology, ethics, vocation } = scores;

    if (temperament > 65 && agency > 60) return ARCHETYPES[1]; // Dionysian Rebel
    if (temperament < 40 && ethics > 60) return ARCHETYPES[0]; // Stoic Sovereign
    if (epistemology > 65 && ontology > 60) return ARCHETYPES[2]; // Geometer of Truth
    if (agency > 70 && ethics < 55) return ARCHETYPES[3]; // Absurdist Pioneer
    if (ontology > 65 && epistemology > 50) return ARCHETYPES[4]; // Platonic Idealist
    if (vocation > 65 && ontology < 50) return ARCHETYPES[5]; // Revolutionary Materialist

    return ARCHETYPES[0]; // Default
  }, [scores]);

  const handleDilemmaChoice = (impact: Record<string, number>, dilemmaId: number) => {
    setScores(prev => {
      const next = { ...prev };
      Object.entries(impact).forEach(([key, val]) => {
        next[key] = Math.round((prev[key] * 0.4) + (val * 0.6));
      });
      return next;
    });

    if (!completedDilemmas.includes(dilemmaId)) {
      setCompletedDilemmas(prev => [...prev, dilemmaId]);
    }

    if (activeDilemmaIndex < DILEMMAS.length - 1) {
      setActiveDilemmaIndex(prev => prev + 1);
    }
  };

  const handleSliderChange = (axisId: string, value: number) => {
    setScores(prev => ({
      ...prev,
      [axisId]: value,
    }));
  };

  const resetCompass = () => {
    setScores({
      epistemology: 50,
      temperament: 50,
      agency: 50,
      ontology: 50,
      ethics: 50,
      vocation: 50,
    });
    setCompletedDilemmas([]);
    setActiveDilemmaIndex(0);
  };

  const exportBlueprint = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3500);

    // Generate text blueprint for download or clipboard
    const textData = `
=====================================================
   THE MONASTIC EXISTENTIAL RADAR // MIND COMPASS
=====================================================
Archetype  : ${userArchetype.name}
Maxim      : ${userArchetype.maxim}
Tutor      : ${userArchetype.author}
Canon      : ${userArchetype.treatise}
Verdict    : ${userArchetype.description}

AXIOMATIC COORDINATES:
${AXES.map(a => `• ${a.name.padEnd(26)}: ${scores[a.id]}% [${scores[a.id] > 50 ? a.highLabel : a.lowLabel}]`).join("\n")}

TIMESTAMP : ${new Date().toISOString()}
INSCRIPTION: "Know thyself, and to thine own nature be uncompromisingly true."
=====================================================
    `.trim();

    try {
      navigator.clipboard.writeText(textData);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="w-full text-white bg-black">
      {/* Header Info */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] tracking-[0.3em] uppercase font-mono text-zinc-400 border border-zinc-800 bg-zinc-950">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Instrument III // 6-Axis Mind Compass
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-white mb-3">
          The Existential Radar
        </h2>
        <p className="text-sm font-serif italic text-zinc-400">
          Map your metaphysical coordinates across the six primal axes of philosophical inquiry. Resolve classical dilemmas to reveal your sovereign archetype.
        </p>
      </div>

      {/* Mode Sub-nav */}
      <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
        <button
          onClick={() => setActiveTab("radar")}
          className={`px-4 py-2 text-xs font-mono tracking-widest uppercase transition-all ${
            activeTab === "radar"
              ? "bg-white text-black border border-white"
              : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-600"
          }`}
        >
          [ 01 Radar Geometry ]
        </button>
        <button
          onClick={() => setActiveTab("dilemmas")}
          className={`px-4 py-2 text-xs font-mono tracking-widest uppercase transition-all ${
            activeTab === "dilemmas"
              ? "bg-white text-black border border-white"
              : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-600"
          }`}
        >
          [ 02 Ethical Dilemmas ({completedDilemmas.length}/{DILEMMAS.length}) ]
        </button>
        <button
          onClick={() => setActiveTab("sliders")}
          className={`px-4 py-2 text-xs font-mono tracking-widest uppercase transition-all ${
            activeTab === "sliders"
              ? "bg-white text-black border border-white"
              : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-600"
          }`}
        >
          [ 03 Axiom Tuning ]
        </button>
      </div>

      {/* Main Grid: Left is SVG Radar + Archetype, Right is Interactive Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: SVG Chart + Archetype Card (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          {/* Radar Container with Monastic Framing */}
          <div className="relative w-full max-w-[480px] aspect-square p-6 border border-zinc-800 bg-zinc-950/60 backdrop-blur-md flex items-center justify-center">
            {/* Corner Crosshairs */}
            <span className="absolute -top-1.5 -left-1.5 text-zinc-600 font-mono text-xs">+</span>
            <span className="absolute -top-1.5 -right-1.5 text-zinc-600 font-mono text-xs">+</span>
            <span className="absolute -bottom-1.5 -left-1.5 text-zinc-600 font-mono text-xs">+</span>
            <span className="absolute -bottom-1.5 -right-1.5 text-zinc-600 font-mono text-xs">+</span>

            {/* Radial Inscription */}
            <div className="absolute top-3 left-4 font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500">
              SYS::CALCULATING_POLYGON
            </div>
            <div className="absolute top-3 right-4 font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500">
              60° RADIAL EQUILIBRIUM
            </div>

            {/* SVG Radar */}
            <svg
              ref={radarRef}
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full max-w-[400px] overflow-visible"
            >
              <defs>
                <linearGradient id="radarGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#71717a" stopOpacity="0.04" />
                </linearGradient>
                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Concentric Hexagons (20%, 40%, 60%, 80%, 100%) */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((step, idx) => {
                const ringPoints = AXES.map((_, i) => {
                  const angle = (Math.PI * 2 / AXES.length) * i - Math.PI / 2;
                  const r = radius * step;
                  const x = center + r * Math.cos(angle);
                  const y = center + r * Math.sin(angle);
                  return `${x},${y}`;
                }).join(" ");

                return (
                  <polygon
                    key={idx}
                    points={ringPoints}
                    fill="none"
                    stroke={step === 1.0 ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.07)"}
                    strokeWidth={step === 1.0 ? "1" : "0.5"}
                    strokeDasharray={step === 1.0 ? "none" : "2,3"}
                  />
                );
              })}

              {/* Axis Spokes from Center to Outer Radius */}
              {AXES.map((axis, i) => {
                const angle = (Math.PI * 2 / AXES.length) * i - Math.PI / 2;
                const x2 = center + radius * Math.cos(angle);
                const y2 = center + radius * Math.sin(angle);
                return (
                  <line
                    key={axis.id}
                    x1={center}
                    y1={center}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="0.8"
                  />
                );
              })}

              {/* Dynamic Archetype Polygon Fill */}
              <polygon
                points={polygonPath}
                fill="url(#radarGlow)"
                stroke="#ffffff"
                strokeWidth="1.5"
                filter="url(#softGlow)"
                className="transition-all duration-500 ease-out"
              />

              {/* Node Vertices with Pulses */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#000000"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="1.5"
                    fill="#ffffff"
                  />
                </g>
              ))}

              {/* Axis Endpoint Labels */}
              {AXES.map((axis, i) => {
                const angle = (Math.PI * 2 / AXES.length) * i - Math.PI / 2;
                const labelDist = radius + 28;
                const lx = center + labelDist * Math.cos(angle);
                const ly = center + labelDist * Math.sin(angle);
                const score = scores[axis.id] ?? 50;

                let anchor: "middle" | "start" | "end" = "middle";
                if (Math.abs(Math.cos(angle)) > 0.3) {
                  anchor = Math.cos(angle) > 0 ? "start" : "end";
                }

                return (
                  <g key={axis.id}>
                    <text
                      x={lx}
                      y={ly}
                      textAnchor={anchor}
                      fill="#d4d4d8"
                      fontSize="9"
                      fontFamily="monospace"
                      letterSpacing="0.08em"
                      className="select-none uppercase font-semibold"
                    >
                      {axis.name}
                    </text>
                    <text
                      x={lx}
                      y={ly + 10}
                      textAnchor={anchor}
                      fill="#71717a"
                      fontSize="8"
                      fontFamily="monospace"
                      className="select-none"
                    >
                      {score}%
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Bottom Actions Bar inside framing */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <button
                onClick={resetCompass}
                className="hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
              >
                [RESET AXES]
              </button>
              <button
                onClick={exportBlueprint}
                className="text-white hover:text-zinc-300 font-semibold transition-colors flex items-center gap-1.5 bg-zinc-900 px-2.5 py-1 border border-zinc-700 cursor-pointer"
              >
                <span>[EXPORT BLUEPRINT]</span>
              </button>
            </div>
          </div>

          {/* Export notification badge */}
          {exportNotice && (
            <div className="mt-3 px-4 py-2 border border-white bg-zinc-900 text-xs font-mono text-white text-center animate-fade-in">
              ✓ Philosophical blueprint coordinates copied to clipboard.
            </div>
          )}

          {/* Archetype Synthesis Card */}
          <div className="w-full max-w-[480px] mt-6 p-6 border border-zinc-800 bg-zinc-950 relative">
            <span className="absolute -top-1.5 -left-1.5 text-zinc-600 font-mono text-xs">+</span>
            <span className="absolute -top-1.5 -right-1.5 text-zinc-600 font-mono text-xs">+</span>

            <div className="flex items-center justify-between mb-3 border-b border-zinc-900 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500">
                Primary Metaphysical Archetype
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 border border-zinc-800 bg-black text-zinc-400">
                MATCH: 94.2%
              </span>
            </div>

            <h3 className="text-2xl font-serif tracking-tight text-white mb-1">
              {userArchetype.name}
            </h3>

            <p className="text-xs font-mono text-zinc-400 mb-3 tracking-wide">
              {userArchetype.maxim}
            </p>

            <blockquote className="my-3 pl-3 border-l border-zinc-700 text-xs font-serif italic text-zinc-300 leading-relaxed">
              &ldquo;{userArchetype.quote}&rdquo;
              <footer className="not-italic text-[10px] font-mono text-zinc-500 mt-1 block">
                — {userArchetype.author}, <span className="italic">{userArchetype.treatise}</span>
              </footer>
            </blockquote>

            <p className="text-xs font-serif text-zinc-400 leading-relaxed mt-3">
              {userArchetype.description}
            </p>
          </div>
        </div>

        {/* Right: Interactive Configuration Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* TAB 01: Radar Guide */}
          {activeTab === "radar" && (
            <div className="p-6 border border-zinc-800 bg-zinc-950 relative animate-fade-in">
              <h3 className="text-lg font-serif text-white mb-2">
                Axiomatic Cartography
              </h3>
              <p className="text-xs font-serif text-zinc-400 leading-relaxed mb-6">
                Your coordinates reflect your fundamental commitments regarding knowledge, agency, duty, and reality. Unlike modern psychological personality tests that measure transient moods, this compass charts your foundational ontological posture.
              </p>

              <div className="space-y-4">
                {AXES.map(axis => {
                  const val = scores[axis.id] ?? 50;
                  return (
                    <div key={axis.id} className="p-3 border border-zinc-900 bg-black/60">
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="text-white font-semibold">{axis.name}</span>
                        <span className="text-zinc-400">{val}%</span>
                      </div>
                      <p className="text-[11px] font-serif text-zinc-400 mb-2 leading-tight">
                        {axis.description}
                      </p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                        <span>{axis.lowLabel}</span>
                        <span>{axis.highLabel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-end">
                <button
                  onClick={() => setActiveTab("dilemmas")}
                  className="px-4 py-2 border border-white bg-white text-black hover:bg-zinc-200 text-xs font-mono tracking-widest uppercase transition-colors cursor-pointer"
                >
                  Take Ethical Dilemmas →
                </button>
              </div>
            </div>
          )}

          {/* TAB 02: Ethical Dilemmas Step-by-Step */}
          {activeTab === "dilemmas" && (
            <div className="p-6 border border-zinc-800 bg-zinc-950 relative animate-fade-in">
              {/* Dilemma Progress */}
              <div className="flex items-center justify-between mb-4 border-b border-zinc-900 pb-3">
                <div className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                  DILEMMA {activeDilemmaIndex + 1} OF {DILEMMAS.length}
                </div>
                <div className="flex items-center gap-1">
                  {DILEMMAS.map((d, idx) => (
                    <button
                      key={d.id}
                      onClick={() => setActiveDilemmaIndex(idx)}
                      className={`w-5 h-5 text-[9px] font-mono flex items-center justify-center border transition-all cursor-pointer ${
                        activeDilemmaIndex === idx
                          ? "border-white bg-white text-black font-bold"
                          : completedDilemmas.includes(d.id)
                          ? "border-zinc-700 bg-zinc-900 text-zinc-300"
                          : "border-zinc-800 text-zinc-600"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Dilemma Content */}
              <div key={activeDilemmaIndex} className="transition-opacity duration-300">
                <h3 className="text-xl font-serif tracking-tight text-white mb-2">
                  {DILEMMAS[activeDilemmaIndex].title}
                </h3>
                <p className="text-xs font-serif italic text-zinc-300 mb-6 leading-relaxed bg-zinc-900/60 p-3 border-l-2 border-zinc-500">
                  &ldquo;{DILEMMAS[activeDilemmaIndex].scenario}&rdquo;
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() =>
                      handleDilemmaChoice(
                        DILEMMAS[activeDilemmaIndex].optionA.impact,
                        DILEMMAS[activeDilemmaIndex].id
                      )
                    }
                    className="w-full text-left p-4 border border-zinc-800 bg-black/80 hover:border-zinc-500 hover:bg-zinc-900/40 transition-all group cursor-pointer"
                  >
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1 group-hover:text-zinc-300">
                      [ OPTION A ]
                    </div>
                    <p className="text-xs font-serif text-white leading-relaxed">
                      {DILEMMAS[activeDilemmaIndex].optionA.label}
                    </p>
                  </button>

                  <button
                    onClick={() =>
                      handleDilemmaChoice(
                        DILEMMAS[activeDilemmaIndex].optionB.impact,
                        DILEMMAS[activeDilemmaIndex].id
                      )
                    }
                    className="w-full text-left p-4 border border-zinc-800 bg-black/80 hover:border-zinc-500 hover:bg-zinc-900/40 transition-all group cursor-pointer"
                  >
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1 group-hover:text-zinc-300">
                      [ OPTION B ]
                    </div>
                    <p className="text-xs font-serif text-white leading-relaxed">
                      {DILEMMAS[activeDilemmaIndex].optionB.label}
                    </p>
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs font-mono">
                <button
                  disabled={activeDilemmaIndex === 0}
                  onClick={() => setActiveDilemmaIndex(prev => Math.max(0, prev - 1))}
                  className="text-zinc-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  ← PREVIOUS
                </button>
                <button
                  disabled={activeDilemmaIndex === DILEMMAS.length - 1}
                  onClick={() => setActiveDilemmaIndex(prev => Math.min(DILEMMAS.length - 1, prev + 1))}
                  className="text-zinc-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  NEXT →
                </button>
              </div>
            </div>
          )}

          {/* TAB 03: Manual Sliders */}
          {activeTab === "sliders" && (
            <div className="p-6 border border-zinc-800 bg-zinc-950 relative animate-fade-in">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-900 pb-3">
                <h3 className="text-lg font-serif text-white">Manual Axiom Sliders</h3>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Live Dialectics</span>
              </div>
              <p className="text-xs font-serif text-zinc-400 mb-6">
                Drag each slider to tailor your personal metaphysical stance with mathematical precision.
              </p>

              <div className="space-y-6">
                {AXES.map(axis => {
                  const val = scores[axis.id] ?? 50;
                  return (
                    <div key={axis.id} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-white font-medium">{axis.name}</span>
                        <span className="text-zinc-300 font-bold">{val}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={val}
                        onChange={(e) => handleSliderChange(axis.id, parseInt(e.target.value, 10))}
                        className="w-full h-1 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-white"
                      />
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                        <span className="max-w-[45%] truncate">{axis.lowLabel}</span>
                        <span className="max-w-[45%] truncate text-right">{axis.highLabel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-900 flex justify-between items-center text-xs font-mono">
                <button
                  onClick={resetCompass}
                  className="text-zinc-500 hover:text-white cursor-pointer"
                >
                  [RE-CENTER ALL TO 50%]
                </button>
                <button
                  onClick={() => setActiveTab("radar")}
                  className="px-3 py-1.5 bg-white text-black font-semibold uppercase hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  View Radar Result →
                </button>
              </div>
            </div>
          )}

          {/* Philosophical Precepts Card */}
          <div className="p-5 border border-zinc-900 bg-black/60 text-xs font-serif text-zinc-400">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600 mb-2">
              CANONICAL METHODOLOGY
            </div>
            <p className="leading-relaxed">
              &ldquo;The unexamined life is not worth living.&rdquo; This radar synthesizes 2,500 years of Mediterranean and continental dialectics into a unified topology. No coordinate is superior; all represent valid historical peaks of human contemplation.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
