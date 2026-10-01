"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Maximize2, 
  RotateCcw, 
  Layers, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Compass, 
  Info,
  X,
  Swords,
  BookOpen
} from "lucide-react";

// Types
export type NodeCategory = "all" | "epistemology" | "metaphysics" | "ethics";

export interface MatrixNode {
  id: string;
  name: string;
  sub: string;
  category: "epistemology" | "metaphysics" | "ethics";
  type: "thinker" | "concept";
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  axiom?: string;
  latinOrGreek?: string;
  summary: string;
  dialecticOpponent?: string;
  dialecticTension?: string;
  courseId?: string;
}

export interface MatrixEdge {
  source: string;
  target: string;
  relation: string;
  type: "lineage" | "conflict" | "synthesis";
}

const INITIAL_NODES: MatrixNode[] = [
  // --- Thinkers ---
  {
    id: "descartes",
    name: "René Descartes",
    sub: "1596–1650 • Rationalism",
    category: "epistemology",
    type: "thinker",
    x: 320,
    y: 280,
    vx: 0,
    vy: 0,
    radius: 32,
    axiom: "Cogito, Ergo Sum",
    latinOrGreek: "cogito, ergo sum",
    summary: "Dismantled scholastic dogma by treating doubt as an architectural scalpel until uncovering the indubitable bedrock of conscious existence.",
    dialecticOpponent: "Radical Skepticism & Sensory Illusion",
    dialecticTension: "Reason vs. Empiricism",
    courseId: "descartes",
  },
  {
    id: "nietzsche",
    name: "Friedrich Nietzsche",
    sub: "1844–1900 • Existentialism",
    category: "ethics",
    type: "thinker",
    x: 740,
    y: 320,
    vx: 0,
    vy: 0,
    radius: 34,
    axiom: "Amor Fati",
    latinOrGreek: "amor fati",
    summary: "Declared the death of metaphysical illusions; challenged humanity to re-evaluate all values, overcome reactive resentment, and love fate unconditionally.",
    dialecticOpponent: "Socratic Moralism & Ascetic Nihilism",
    dialecticTension: "Dionysian Vitality vs. Moral Dogmatism",
    courseId: "nietzsche",
  },
  {
    id: "socrates",
    name: "Socrates",
    sub: "470–399 BC • Classical Greek",
    category: "epistemology",
    type: "thinker",
    x: 480,
    y: 180,
    vx: 0,
    vy: 0,
    radius: 30,
    axiom: "Scio Me Nihil Scire",
    latinOrGreek: "ἓν οἶδα ὅτι οὐδὲν οἶδα",
    summary: "The gadfly of Athens who used ironical cross-examination to purge illusions of false certainty, proving that wisdom begins in recognizing one's ignorance.",
    dialecticOpponent: "Sophistic Relativism & Dogmatic Complacency",
    dialecticTension: "Dialectical Inquiry vs. Unexamined Dogma",
    courseId: "socrates",
  },
  {
    id: "machiavelli",
    name: "Nicolau Maquiavel",
    sub: "1469–1527 • Political Realism",
    category: "ethics",
    type: "thinker",
    x: 880,
    y: 480,
    vx: 0,
    vy: 0,
    radius: 28,
    axiom: "Virtù & Fortuna",
    latinOrGreek: "la verità effettuale",
    summary: "Separated political statecraft from theological morality; explored the ruthless mastery of unpredictable chance (Fortuna) through audacious human skill (Virtù).",
    dialecticOpponent: "Idealized Utopian Moralism",
    dialecticTension: "Effectual Truth vs. Imagined Republics",
    courseId: "machiavelli",
  },
  {
    id: "spinoza",
    name: "Baruch Spinoza",
    sub: "1632–1677 • Monism & Pantheism",
    category: "metaphysics",
    type: "thinker",
    x: 240,
    y: 490,
    vx: 0,
    vy: 0,
    radius: 28,
    axiom: "Deus Sive Natura",
    latinOrGreek: "sub specie aeternitatis",
    summary: "Proved geometrically that God and Nature are one singular, infinite, self-caused substance, reconciling radical determinism with intellectual beatitude.",
    dialecticOpponent: "Cartesian Dualism & Anthropomorphic Deity",
    dialecticTension: "Infinite Substance vs. Dualistic Splintering",
  },
  {
    id: "kant",
    name: "Immanuel Kant",
    sub: "1724–1804 • Transcendental Idealism",
    category: "epistemology",
    type: "thinker",
    x: 520,
    y: 440,
    vx: 0,
    vy: 0,
    radius: 30,
    axiom: "Sapere Aude",
    latinOrGreek: "noumenon vs phenomenon",
    summary: "Synthesized Rationalism and Empiricism by demonstrating that human cognition constructs experience through innate categories of space and time.",
    dialecticOpponent: "Humean Skepticism & Dogmatic Slumber",
    dialecticTension: "Limits of Reason vs. The Thing-in-Itself",
  },
  {
    id: "schopenhauer",
    name: "Arthur Schopenhauer",
    sub: "1788–1860 • Pessimism & Will",
    category: "metaphysics",
    type: "thinker",
    x: 620,
    y: 560,
    vx: 0,
    vy: 0,
    radius: 26,
    axiom: "The World as Will",
    latinOrGreek: "die Welt als Wille und Vorstellung",
    summary: "Discovered the blind, irrational, ceaselessly striving Will as the ultimate substrate of reality, finding reprieve through aesthetic contemplation and ascetic denial.",
    dialecticOpponent: "Hegelian Optimism & Rational Triumphalism",
    dialecticTension: "Blind Cosmic Will vs. Aesthetic Reprieve",
  },

  // --- Core Dialectical Concepts ---
  {
    id: "radical-doubt",
    name: "Methodological Doubt",
    sub: "Epistemic Bedrock",
    category: "epistemology",
    type: "concept",
    x: 180,
    y: 200,
    vx: 0,
    vy: 0,
    radius: 20,
    summary: "A rigorous intellectual purge that treats every unverified assumption as false until arriving at the indubitable proposition of one's own awareness.",
    dialecticTension: "Bedrock of Certainty",
  },
  {
    id: "will-to-power",
    name: "Will to Power",
    sub: "Cosmic Ontological Drive",
    category: "metaphysics",
    type: "concept",
    x: 880,
    y: 230,
    vx: 0,
    vy: 0,
    radius: 22,
    summary: "The primal dynamic drive of all existence to overcome inertia, master internal resistance, and radiate self-authored sovereignty.",
    dialecticTension: "Overcoming vs. Stagnation",
  },
  {
    id: "elenchus",
    name: "Elenctic Dialectic",
    sub: "Interrogative Purification",
    category: "epistemology",
    type: "concept",
    x: 380,
    y: 100,
    vx: 0,
    vy: 0,
    radius: 20,
    summary: "Exposing contradictions in accepted dogmas through surgical inquiry, dissolving pretenses of authority and waking the soul to philosophical wonder.",
    dialecticTension: "Purification of Pretense",
  },
  {
    id: "virtu-fortuna",
    name: "Virtù vs Fortuna",
    sub: "Pragmatic Sovereignty",
    category: "ethics",
    type: "concept",
    x: 980,
    y: 400,
    vx: 0,
    vy: 0,
    radius: 20,
    summary: "The dynamic collision between unpredictable historical destiny and resolute, audacious personal fortitude and tactical mastery.",
    dialecticTension: "Will vs. Circumstance",
  },
  {
    id: "pantheism",
    name: "Deus Sive Natura",
    sub: "Infinite Holistic Monism",
    category: "metaphysics",
    type: "concept",
    x: 140,
    y: 420,
    vx: 0,
    vy: 0,
    radius: 20,
    summary: "The unified reality where everything that exists is an immanent modification of one singular, divine, eternal nature.",
    dialecticTension: "Monism vs. Dualism",
  },
  {
    id: "categorical-imperative",
    name: "Universal Moral Duty",
    sub: "Autonomous Ethics",
    category: "ethics",
    type: "concept",
    x: 430,
    y: 530,
    vx: 0,
    vy: 0,
    radius: 20,
    summary: "An absolute ethical command derived strictly through pure practical reason, independent of consequential desire or self-interest.",
    dialecticTension: "Duty vs. Consequence",
  },
  {
    id: "nihilism",
    name: "Active Nihilism",
    sub: "The Great Abyss",
    category: "ethics",
    type: "concept",
    x: 820,
    y: 140,
    vx: 0,
    vy: 0,
    radius: 21,
    summary: "The dissolution of metaphysical foundations; a crucible where the spirit must either disintegrate into paralysis or forge autonomous new values.",
    dialecticTension: "Abyss vs. Creation",
  },
  {
    id: "amor-fati",
    name: "Amor Fati",
    sub: "The Supreme Affirmation",
    category: "ethics",
    type: "concept",
    x: 680,
    y: 190,
    vx: 0,
    vy: 0,
    radius: 22,
    summary: "Loving one's destiny in its entirety—joy and agony alike—wishing nothing to be different, neither backward nor forward through all eternity.",
    dialecticTension: "Total Affirmation",
  },
];

const EDGES: MatrixEdge[] = [
  { source: "descartes", target: "radical-doubt", relation: "Methodological Root", type: "lineage" },
  { source: "descartes", target: "spinoza", relation: "Dualism to Monism", type: "conflict" },
  { source: "descartes", target: "kant", relation: "Epistemic Inheritance", type: "lineage" },
  { source: "socrates", target: "elenchus", relation: "Dialectical Invention", type: "lineage" },
  { source: "socrates", target: "nietzsche", relation: "Hyper-Rationality Critique", type: "conflict" },
  { source: "spinoza", target: "pantheism", relation: "Geometric Proof", type: "lineage" },
  { source: "spinoza", target: "schopenhauer", relation: "Pantheism to Pessimism", type: "conflict" },
  { source: "kant", target: "categorical-imperative", relation: "Supreme Moral Law", type: "lineage" },
  { source: "kant", target: "schopenhauer", relation: "Thing-in-Itself as Will", type: "lineage" },
  { source: "schopenhauer", target: "nietzsche", relation: "Inversion of Pessimism", type: "conflict" },
  { source: "nietzsche", target: "will-to-power", relation: "Ontological Core", type: "lineage" },
  { source: "nietzsche", target: "nihilism", relation: "Confrontation & Crucible", type: "synthesis" },
  { source: "nietzsche", target: "amor-fati", relation: "Supreme Ethical Crown", type: "lineage" },
  { source: "machiavelli", target: "virtu-fortuna", relation: "Political Realism", type: "lineage" },
  { source: "machiavelli", target: "socrates", relation: "Realism vs. Moral Idealism", type: "conflict" },
  { source: "will-to-power", target: "nihilism", relation: "Overcoming Mechanism", type: "synthesis" },
];

const BASE_W = 1050;
const BASE_H = 650;

function calculateResponsiveNodes(width: number, height: number): MatrixNode[] {
  const isMobile = width < 768;
  const paddingX = isMobile ? 32 : 60;
  const paddingY = isMobile ? 40 : 60;
  const usableW = Math.max(width - paddingX * 2, 280);
  const usableH = Math.max(height - paddingY * 2, 380);

  return INITIAL_NODES.map((n) => {
    const rx = (n.x / BASE_W) * usableW + paddingX;
    const ry = (n.y / BASE_H) * usableH + paddingY;
    const rRadius = isMobile ? Math.max(n.radius * 0.72, 17) : n.radius;
    return {
      ...n,
      x: rx,
      y: ry,
      radius: rRadius,
      vx: 0,
      vy: 0,
    };
  });
}

export default function ThoughtMatrix() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasSizeRef = useRef({ width: 0, height: 0, dpr: 0 });

  const [nodes, setNodes] = useState<MatrixNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("nietzsche");
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<NodeCategory>("all");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  // Interaction and animation tracking
  const hasUserInteractedRef = useRef(false);
  const dragNodeRef = useRef<MatrixNode | null>(null);
  const isDraggingRef = useRef(false);
  const panRef = useRef({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Web Audio subtle harmonic click
  const playNodeChime = useCallback((freq = 528) => {
    if (!soundEnabled) return;
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch {
      // audio disabled/blocked
    }
  }, [soundEnabled]);

  // Reset viewport pan
  const handleResetView = () => {
    panRef.current = { x: 0, y: 0 };
    hasUserInteractedRef.current = false;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setNodes(calculateResponsiveNodes(rect.width, rect.height));
    } else {
      setNodes(INITIAL_NODES.map((n) => ({ ...n, vx: 0, vy: 0 })));
    }
    playNodeChime(440);
  };

  // Canvas main rendering & interactive loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      const previousSize = canvasSizeRef.current;

      // This effect also depends on `nodes`. Avoid setting node state again when
      // the effect restarts but the viewport dimensions have not changed.
      if (
        previousSize.width === width &&
        previousSize.height === height &&
        previousSize.dpr === dpr
      ) {
        return;
      }

      canvasSizeRef.current = { width, height, dpr };
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.scale(dpr, dpr);

      // On initial mount or screen orientation change, adjust coordinates if user hasn't moved them
      if (!hasUserInteractedRef.current) {
        setNodes(calculateResponsiveNodes(width, height));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Dynamic Physics & Drawing Engine
    let stepCount = 0;
    const render = () => {
      stepCount++;
      const rect = containerRef.current?.getBoundingClientRect();
      const w = rect?.width || 1000;
      const h = rect?.height || 650;

      ctx.clearRect(0, 0, w, h);

      // Save transform for pan
      ctx.save();
      ctx.translate(panRef.current.x, panRef.current.y);

      // 1. Draw Architectural Celestial Coordinate Grid & Rings
      const centerX = w / 2;
      const centerY = h / 2;

      ctx.strokeStyle = "#161616";
      ctx.lineWidth = 1;

      // Coordinate axes
      ctx.beginPath();
      ctx.moveTo(-1000, centerY);
      ctx.lineTo(2000, centerY);
      ctx.moveTo(centerX, -1000);
      ctx.lineTo(centerX, 2000);
      ctx.stroke();

      // Astrolabe Concentric Rings
      const rings = [140, 280, 440, 620];
      rings.forEach((r) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = "#141414";
        ctx.setLineDash([4, 12]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Subtle slow rotating celestial ticks
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(stepCount * 0.0003);
      for (let deg = 0; deg < 360; deg += 30) {
        const rad = (deg * Math.PI) / 180;
        const x1 = Math.cos(rad) * 270;
        const y1 = Math.sin(rad) * 270;
        const x2 = Math.cos(rad) * 280;
        const y2 = Math.sin(rad) * 280;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "#262626";
        ctx.stroke();
      }
      ctx.restore();

      // 2. Physics Simulation update (Gentle organic breathing)
      nodes.forEach((n) => {
        if (dragNodeRef.current?.id === n.id) return;
        // Subtle orbital breath
        n.x += Math.sin(stepCount * 0.02 + n.radius) * 0.15;
        n.y += Math.cos(stepCount * 0.02 + n.radius) * 0.15;
      });

      // 3. Draw Connecting Dialectical Edges
      EDGES.forEach((edge) => {
        const sNode = nodes.find((n) => n.id === edge.source);
        const tNode = nodes.find((n) => n.id === edge.target);
        if (!sNode || !tNode) return;

        const isHighlighted =
          selectedNodeId === sNode.id ||
          selectedNodeId === tNode.id ||
          hoveredNodeId === sNode.id ||
          hoveredNodeId === tNode.id;

        const isDimmed =
          (selectedNodeId && selectedNodeId !== sNode.id && selectedNodeId !== tNode.id) ||
          (activeCategory !== "all" &&
            sNode.category !== activeCategory &&
            tNode.category !== activeCategory);

        ctx.beginPath();
        ctx.moveTo(sNode.x, sNode.y);
        ctx.lineTo(tNode.x, tNode.y);

        if (edge.type === "conflict") {
          ctx.strokeStyle = isHighlighted ? "#f43f5e" : isDimmed ? "#261317" : "#571622";
          ctx.lineWidth = isHighlighted ? 2 : 1;
          ctx.setLineDash([3, 5]);
        } else if (edge.type === "synthesis") {
          ctx.strokeStyle = isHighlighted ? "#38bdf8" : isDimmed ? "#0f2333" : "#1e3a5f";
          ctx.lineWidth = isHighlighted ? 2 : 1;
          ctx.setLineDash([6, 6]);
        } else {
          ctx.strokeStyle = isHighlighted ? "#ffffff" : isDimmed ? "#1f1f1f" : "#333333";
          ctx.lineWidth = isHighlighted ? 1.8 : 0.8;
          ctx.setLineDash([]);
        }

        ctx.stroke();
        ctx.setLineDash([]);

        // Dialectical relation badge along the midpoint when highlighted
        if (isHighlighted) {
          const midX = (sNode.x + tNode.x) / 2;
          const midY = (sNode.y + tNode.y) / 2;
          ctx.fillStyle = "#0a0a0a";
          ctx.fillRect(midX - 35, midY - 9, 70, 18);
          ctx.strokeStyle = "#262626";
          ctx.strokeRect(midX - 35, midY - 9, 70, 18);

          ctx.fillStyle = edge.type === "conflict" ? "#f43f5e" : "#a3a3a3";
          ctx.font = "600 8px 'Courier New', monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(edge.relation.toUpperCase(), midX, midY);
        }
      });

      // 4. Draw Nodes
      nodes.forEach((n) => {
        const isSelected = selectedNodeId === n.id;
        const isHovered = hoveredNodeId === n.id;
        const isDimmed =
          (selectedNodeId &&
            !isSelected &&
            !EDGES.some(
              (e) =>
                (e.source === selectedNodeId && e.target === n.id) ||
                (e.target === selectedNodeId && e.source === n.id)
            )) ||
          (activeCategory !== "all" && n.category !== activeCategory);

        const currentRadius = isSelected ? n.radius * 1.15 : isHovered ? n.radius * 1.08 : n.radius;

        // Outer glow on active
        if (isSelected || isHovered) {
          const glow = ctx.createRadialGradient(
            n.x,
            n.y,
            currentRadius * 0.6,
            n.x,
            n.y,
            currentRadius * 2.2
          );
          glow.addColorStop(0, n.type === "thinker" ? "rgba(255,255,255,0.25)" : "rgba(244,63,94,0.25)");
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(n.x, n.y, currentRadius * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Base circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = isDimmed ? "#050505" : "#0d0d0d";
        ctx.fill();

        // Border ring
        ctx.lineWidth = isSelected ? 2.5 : isHovered ? 2 : 1;
        ctx.strokeStyle = isSelected
          ? "#ffffff"
          : isHovered
          ? "#e5e5e5"
          : isDimmed
          ? "#1c1c1c"
          : n.type === "thinker"
          ? "#525252"
          : "#383838";
        ctx.stroke();

        // Inner insignia or Latin initials
        ctx.fillStyle = isSelected
          ? "#ffffff"
          : isDimmed
          ? "#404040"
          : n.type === "thinker"
          ? "#e5e5e5"
          : "#a3a3a3";
        ctx.font =
          n.type === "thinker"
            ? `bold ${Math.round(currentRadius * 0.42)}px 'Times New Roman', Georgia, serif`
            : `600 ${Math.round(currentRadius * 0.38)}px 'Courier New', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const label =
          n.type === "thinker"
            ? n.name
                .split(" ")
                .map((w) => w[0])
                .join("")
            : "Φ";
        ctx.fillText(label, n.x, n.y);

        // Precision corner tick mark
        ctx.fillStyle = isSelected ? "#ffffff" : "#525252";
        ctx.font = "8px 'Courier New', monospace";
        ctx.fillText("+", n.x + currentRadius + 3, n.y - currentRadius + 3);

        // Name Typography below node
        ctx.fillStyle = isSelected
          ? "#ffffff"
          : isHovered
          ? "#f5f5f5"
          : isDimmed
          ? "#383838"
          : "#d4d4d4";
        ctx.font =
          n.type === "thinker"
            ? "600 11px 'Times New Roman', Georgia, serif"
            : "500 10px 'Courier New', monospace";
        ctx.letterSpacing = "1px";
        ctx.fillText(n.name, n.x, n.y + currentRadius + 14);

        // Axiom / subtext on selected/hovered
        if (isSelected || isHovered) {
          ctx.fillStyle = "#8a8a8a";
          ctx.font = "italic 9px Georgia, serif";
          ctx.fillText(n.axiom || n.sub, n.x, n.y + currentRadius + 26);
        }
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [nodes, selectedNodeId, hoveredNodeId, activeCategory]);

  // Pointer interaction: finding clicked node
  const getNodeAtPos = (clientX: number, clientY: number): MatrixNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left - panRef.current.x;
    const mouseY = clientY - rect.top - panRef.current.y;

    for (const node of nodes) {
      const dist = Math.hypot(node.x - mouseX, node.y - mouseY);
      if (dist <= node.radius + 10) {
        return node;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    hasUserInteractedRef.current = true;
    const node = getNodeAtPos(e.clientX, e.clientY);
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    if (node) {
      dragNodeRef.current = node;
      isDraggingRef.current = true;
      setSelectedNodeId(node.id);
      setIsInspectorOpen(true);
      playNodeChime(node.type === "thinker" ? 640 : 440);
    } else {
      isPanningRef.current = true;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    if (isDraggingRef.current && dragNodeRef.current) {
      hasUserInteractedRef.current = true;
      dragNodeRef.current.x += dx;
      dragNodeRef.current.y += dy;
      setNodes([...nodes]);
    } else if (isPanningRef.current) {
      panRef.current.x += dx;
      panRef.current.y += dy;
    } else {
      const node = getNodeAtPos(e.clientX, e.clientY);
      setHoveredNodeId(node ? node.id : null);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    isPanningRef.current = false;
    dragNodeRef.current = null;
  };

  // Full Mobile Touch Gestures
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    hasUserInteractedRef.current = true;
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const node = getNodeAtPos(touch.clientX, touch.clientY);
      lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };

      if (node) {
        dragNodeRef.current = node;
        isDraggingRef.current = true;
        setSelectedNodeId(node.id);
        setIsInspectorOpen(true);
        playNodeChime(node.type === "thinker" ? 640 : 440);
      } else {
        isPanningRef.current = true;
      }
    } else if (e.touches.length === 2) {
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      lastMousePosRef.current = { x: midX, y: midY };
      isPanningRef.current = true;
      isDraggingRef.current = false;
      dragNodeRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const dx = touch.clientX - lastMousePosRef.current.x;
      const dy = touch.clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };

      if (isDraggingRef.current && dragNodeRef.current) {
        hasUserInteractedRef.current = true;
        dragNodeRef.current.x += dx;
        dragNodeRef.current.y += dy;
        setNodes([...nodes]);
      } else if (isPanningRef.current) {
        panRef.current.x += dx;
        panRef.current.y += dy;
      }
    } else if (e.touches.length === 2) {
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const dx = midX - lastMousePosRef.current.x;
      const dy = midY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: midX, y: midY };

      panRef.current.x += dx;
      panRef.current.y += dy;
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    isPanningRef.current = false;
    dragNodeRef.current = null;
  };

  const activeSelectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  // Connected thinkers/concepts
  const connectedEdges = EDGES.filter(
    (e) => e.source === activeSelectedNode.id || e.target === activeSelectedNode.id
  );

  return (
    <section id="matrix" className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-black relative select-none">
      {/* Precision Corner Crosshairs */}
      <span className="absolute top-4 left-6 sm:left-12 font-mono text-neutral-600 text-xs select-none pointer-events-none">+</span>
      <span className="absolute top-4 right-6 sm:right-12 font-mono text-neutral-600 text-xs select-none pointer-events-none">+</span>

      <div className="w-full space-y-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-neutral-900">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
                [ CONSTELLATIO MENTIS ]
              </span>
              <div className="w-8 h-px bg-neutral-800" />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-500">
                COSMIC MATRIX
              </span>
            </div>
            <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.12em] text-white uppercase">
              The Thought Matrix
            </h2>
            <p className="font-garamond text-base sm:text-lg text-neutral-300 max-w-2xl font-light">
              An interactive celestial chart mapping 2,500 years of Western philosophy. Drag nodes, trace dialectical conflicts, and uncover the intellectual lineage connecting great minds.
            </p>
          </div>

          {/* Interactive Controls & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center border border-neutral-800 bg-neutral-950 p-1">
              {(["all", "epistemology", "metaphysics", "ethics"] as NodeCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    playNodeChime(480);
                  }}
                  className={`py-1 px-3 text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-white text-black font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleResetView}
              title="Reset Celestial Canvas"
              className="p-2 border border-neutral-800 hover:border-white bg-neutral-950 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Disable Chime" : "Enable Chime"}
              className="p-2 border border-neutral-800 hover:border-white bg-neutral-950 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-white" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Matrix Canvas Container */}
        <div
          ref={containerRef}
          className="relative w-full h-[520px] sm:h-[620px] lg:h-[700px] border border-neutral-900 bg-black overflow-hidden group shadow-2xl cursor-grab active:cursor-grabbing touch-none"
        >
          {/* Subtle Astrolabe Ambient Coordinate Legend */}
          <div className="absolute top-3 left-4 sm:top-4 sm:left-6 pointer-events-none flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-mono text-neutral-600 tracking-widest">
            <Compass className="w-3.5 h-3.5 text-neutral-600" />
            <span className="hidden sm:inline">ORIGIN: ATHENS • LAT: 37.98° N</span>
            <span className="sm:hidden">COSMIC MATRIX</span>
          </div>

          <div className="absolute top-3 right-4 sm:top-4 sm:right-6 pointer-events-none text-[9px] sm:text-[10px] font-mono text-neutral-600 tracking-widest">
            <span className="hidden sm:inline">DRAG NODES • PAN VOID</span>
            <span className="sm:hidden">TOUCH &amp; DRAG NODES</span>
          </div>

          {/* HTML5 Dynamic Matrix Canvas */}
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            className="w-full h-full block touch-none"
          />

          {/* Slide-over HUD Inspection Monograph Drawer */}
          {isInspectorOpen && activeSelectedNode && (
            <div className="absolute inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-auto sm:top-6 sm:right-6 w-auto sm:w-96 max-h-[50vh] sm:max-h-[90%] overflow-y-auto bg-black/95 border border-neutral-800 p-4 sm:p-6 text-white shadow-2xl space-y-4 sm:space-y-5 backdrop-blur-xl animate-fade-in z-20">
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400">
                    {activeSelectedNode.type === "thinker" ? "THINKER DOSSIER" : "DIALECTICAL AXIOM"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsInspectorOpen(false)}
                  className="p-1 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Latin Axiom */}
              <div className="space-y-1.5">
                <h3 className="font-serif-classic text-2xl font-bold uppercase tracking-wide text-white leading-tight">
                  {activeSelectedNode.name}
                </h3>
                <p className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  {activeSelectedNode.sub}
                </p>
                {activeSelectedNode.latinOrGreek && (
                  <p className="font-garamond italic text-sm text-neutral-300 pt-1">
                    &ldquo;{activeSelectedNode.latinOrGreek}&rdquo;
                  </p>
                )}
              </div>

              <div className="w-10 h-px bg-neutral-800" />

              {/* Summary */}
              <p className="font-garamond text-sm text-neutral-300 leading-relaxed font-light">
                {activeSelectedNode.summary}
              </p>

              {/* Dialectical Tension / Opponent */}
              {activeSelectedNode.dialecticOpponent && (
                <div className="p-3.5 border border-neutral-900 bg-neutral-950 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-rose-400">
                    <Swords className="w-3 h-3" />
                    <span>DIALECTICAL ANTAGONIST</span>
                  </div>
                  <p className="text-xs font-serif-classic text-neutral-200">
                    {activeSelectedNode.dialecticOpponent}
                  </p>
                </div>
              )}

              {/* Connected Lineage Links */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">
                  CONNECTED PATHWAYS ({connectedEdges.length})
                </span>
                <div className="space-y-1.5">
                  {connectedEdges.map((e, idx) => {
                    const otherId = e.source === activeSelectedNode.id ? e.target : e.source;
                    const otherNode = nodes.find((n) => n.id === otherId);
                    if (!otherNode) return null;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedNodeId(otherNode.id);
                          playNodeChime(560);
                        }}
                        className="w-full p-2 border border-neutral-900 hover:border-neutral-700 bg-neutral-950/70 text-left flex items-center justify-between text-xs transition-colors cursor-pointer group"
                      >
                        <span className="font-serif-classic text-neutral-300 group-hover:text-white">
                          {otherNode.name}
                        </span>
                        <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider">
                          {e.relation}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direct Course Warp Link if thinker */}
              {activeSelectedNode.courseId && (
                <div className="pt-2">
                  <Link
                    href={`/course/${activeSelectedNode.courseId}`}
                    className="w-full py-3 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.2em] font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>Enter Full Monograph</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
