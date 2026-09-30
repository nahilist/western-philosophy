"use client";

import React, { useState } from "react";
import { Swords, Sparkles, RefreshCw, ThumbsUp, Flame, ArrowRight, ShieldAlert, Award } from "lucide-react";

interface Duelist {
  id: string;
  name: string;
  era: string;
  school: string;
  axiom: string;
  stance: string;
}

interface DuelTopic {
  id: string;
  title: string;
  question: string;
  duelistA: Duelist;
  duelistB: Duelist;
  round1: { a: string; b: string; momentum: number }; // 0 to 100
  round2: { a: string; b: string; momentum: number };
  round3: { a: string; b: string; momentum: number };
  synthesis: {
    title: string;
    text: string;
    maxim: string;
  };
}

const DUEL_TOPICS: DuelTopic[] = [
  {
    id: "morality",
    title: "The Nature of Morality",
    question: "Is moral duty universal and absolute, or is it an invention of human power?",
    duelistA: {
      id: "kant",
      name: "Immanuel Kant",
      era: "1724–1804",
      school: "Deontological Idealism",
      axiom: "The Categorical Imperative",
      stance: "Morality is an immutable, universal law rooted in pure practical reason.",
    },
    duelistB: {
      id: "nietzsche",
      name: "Friedrich Nietzsche",
      era: "1844–1900",
      school: "Existential Iconoclasm",
      axiom: "Will to Power & Genealogy",
      stance: "Universal morality is a reactive weapon forged by the weak to tame natural greatness.",
    },
    round1: {
      a: "Act only according to that maxim whereby you can at the same time will that it should become a universal law. Morality cannot depend on whims, instincts, or consequences. A rational being possesses intrinsic dignity precisely because he can bind his subjective will to an objective moral duty.",
      b: "You speak of 'universal duty', Herr Kant, but your categorical imperative smells of stale theological residue! There are no moral phenomena at all, only a moral interpretation of phenomena. What you call 'universal duty' is merely herd instincts masquerading as cosmic truth.",
      momentum: 42,
    },
    round2: {
      a: "If morality is stripped of universality and reduced to mere 'instincts of power', you destroy the foundation of human freedom itself! Man becomes a mere animal driven by arbitrary appetites. Reason alone grants autonomy by liberating humanity from physiological enslavement.",
      b: "And what has your anaemic 'autonomy' produced? An exhausted, guilt-ridden, decadent spirit! Life is not a deduction of pure logic; it is the Will to Power! Great spirits forge their own values beyond good and evil; they do not kneel before an abstract imperative carved into the clouds.",
      momentum: 58,
    },
    round3: {
      a: "Yet even to condemn universal duty, you appeal to an unyielding standard of 'greatness' and 'authenticity'. Without the moral law within, the starry heavens above collapse into chaotic barbarism.",
      b: "Let them collapse, so that the higher human may build his own constellation! Amor fati—love your fate, carve your greatness, and leave the comforting chains of universal duty to the graveyard of illusions.",
      momentum: 52,
    },
    synthesis: {
      title: "The Hegelian Dialectical Synthesis",
      text: "Kant establishes the non-negotiable architecture of mutual respect and rational coherence, while Nietzsche injects the indispensable fire of vitality, preventing duty from degenerating into sterile dogmatism. Authentic virtue is neither mindless obedience nor arbitrary cruelty, but the self-mastered will that wills its principles with sovereign responsibility.",
      maxim: "Act with such sovereign excellence that your self-overcoming elevates humanity.",
    },
  },
  {
    id: "truth",
    title: "The Attainability of Truth",
    question: "Can human consciousness attain absolute bedrock certainty, or is all knowledge perspective?",
    duelistA: {
      id: "descartes",
      name: "René Descartes",
      era: "1596–1650",
      school: "Cartesian Rationalism",
      axiom: "Cogito, Ergo Sum",
      stance: "Through radical doubt, consciousness arrives at an undeniable, indubitable foundation of existence.",
    },
    duelistB: {
      id: "socrates",
      name: "Socrates of Athens",
      era: "470–399 BC",
      school: "Classical Dialectic",
      axiom: "I Know That I Know Nothing",
      stance: "True wisdom lies in the perpetual recognition and confession of human ignorance.",
    },
    round1: {
      a: "I resolved to doubt all things—even my senses, my body, and mathematical theorems. Yet in the very agony of doubting, I cannot doubt that I am doubting. 'Cogito, ergo sum'—I think, therefore I am. Here stands the unshakeable bedrock of truth!",
      b: "A splendid deduction, René! But tell me: when you declare 'I think', do you truly know what this 'I' is, or what 'thinking' entails? I have questioned poets, politicians, and artisans across Athens, and found that those who claimed absolute certainty were the most deeply deceived.",
      momentum: 48,
    },
    round2: {
      a: "My certainty does not end with the ego, Socrates. From the clear and distinct idea of an infinite, perfect being within my finite mind, reason demonstrates that an all-good God cannot be a deceiver. Hence, the mathematical order of nature is objectively real.",
      b: "Ah, but are you not using reason to prove the reliability of reason itself? Like a traveler who uses his own compass to verify that his compass does not lie! Wisdom does not consist in constructing a fortress of dogmatic certainty, but in remaining perpetually open to examination.",
      momentum: 62,
    },
    round3: {
      a: "Without an indubitable bedrock, philosophy dissolves into endless skepticism where no tower of science can ever be erected! Reason must discover where to stand.",
      b: "And philosophy must remember where it was born: in wonder, humility, and the midwife's confession that human knowledge is but a shadow before the divine.",
      momentum: 50,
    },
    synthesis: {
      title: "The Epistemic Bedrock Synthesis",
      text: "Descartes provides the anchor of conscious awareness that rescues knowledge from nihilistic abyss, while Socrates provides the perpetual safeguard against dogmatic arrogance. Certainty is not a stagnant monument, but an ongoing dialectical vigilance.",
      maxim: "Stand firmly upon the certainty of consciousness, while questioning every claim it builds.",
    },
  },
  {
    id: "statecraft",
    title: "Justice vs. Power in Statecraft",
    question: "Should a leader be governed by moral virtue or the effectual truth of raw political necessity?",
    duelistA: {
      id: "socrates-state",
      name: "Socrates (via Plato)",
      era: "Classical Greece",
      school: "Moral Idealism",
      axiom: "The Philosopher King",
      stance: "The just city exists only when wisdom and justice reign over ambition and force.",
    },
    duelistB: {
      id: "machiavelli",
      name: "Nicolau Maquiavel",
      era: "1469–1527",
      school: "Political Realism",
      axiom: "La Verità Effettuale",
      stance: "A ruler who tries to be good in all things will inevitably perish among the multitude who are not good.",
    },
    round1: {
      a: "A city or a soul governed by force rather than justice is like a ship captained by mutinous sailors. Power without virtue is not governance; it is merely armed robbery writ large. The ruler's duty is the moral perfection of the citizens.",
      b: "My dear Socrates, you dwell in imagined republics and principalities that have never been seen in truth! He who neglects what is done for what ought to be done effects his own ruin rather than his preservation. A prince must learn how not to be good, and use this knowledge according to necessity.",
      momentum: 35,
    },
    round2: {
      a: "To commit an injustice is worse than to suffer it. If a prince uses deceit, poison, and betrayal to maintain his throne, his soul becomes a diseased, tyrannical wasteland. What profit has a man if he gains an empire but loses his soul?",
      b: "If a prince allows his state to be invaded and his people butchered because of his private squeamishness about 'sin', is he truly virtuous? Fortune is a raging river—it must be governed with a lion's force and a fox's cunning. The glory of the state is the only true measure.",
      momentum: 68,
    },
    round3: {
      a: "An empire built on fear and slaughter will always rot from within. Tyranny is the weakest form of rule because it creates enemies out of its own citizens.",
      b: "It is much safer to be feared than loved, when one of the two must be dispensed with. For love is held by a chain of obligation which men break whenever it suits them; but fear is preserved by a dread of punishment which never fails.",
      momentum: 55,
    },
    synthesis: {
      title: "The Realpolitik & Ethics Synthesis",
      text: "Socrates preserves the transcendent teleology—reminding leaders that power without justice is hollow tyranny. Machiavelli preserves the pragmatic vigilance—reminding idealists that without strategic realism and state preservation, justice itself is erased by ruthless invaders.",
      maxim: "Cultivate the unyielding cunning of the fox to defend the noble justice of the soul.",
    },
  },
];

export default function DialecticalDuel() {
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState<1 | 2 | 3>(1);
  const [votes, setVotes] = useState<{ a: number; b: number }>({ a: 142, b: 168 });
  const [hasVoted, setHasVoted] = useState(false);
  const [showSynthesis, setShowSynthesis] = useState(false);

  const topic = DUEL_TOPICS[activeTopicIndex];

  const handleVote = (side: "a" | "b") => {
    if (hasVoted) return;
    setVotes((prev) => ({
      ...prev,
      [side]: prev[side] + 1,
    }));
    setHasVoted(true);
  };

  const roundData =
    currentRound === 1 ? topic.round1 : currentRound === 2 ? topic.round2 : topic.round3;

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-900">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-neutral-400 tracking-widest uppercase">
              [ INSTRUMENTUM • 02 ]
            </span>
            <div className="w-8 h-px bg-neutral-800" />
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
              DIALECTICAL CLASH
            </span>
          </div>
          <h3 className="font-serif-classic text-2xl sm:text-4xl font-bold tracking-[0.12em] text-white uppercase">
            The Dialectical Duel
          </h3>
          <p className="font-garamond text-base sm:text-lg text-neutral-300 max-w-2xl font-light">
            Watch titanic philosophical minds clash turn-by-turn on the foundational questions of existence. Cast your vote or forge the Hegelian synthesis.
          </p>
        </div>

        {/* Topic Selector */}
        <div className="flex items-center gap-2">
          {DUEL_TOPICS.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setActiveTopicIndex(idx);
                setCurrentRound(1);
                setShowSynthesis(false);
                setHasVoted(false);
              }}
              className={`py-1.5 px-3 border text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeTopicIndex === idx
                  ? "border-white bg-white text-black font-bold"
                  : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"
              }`}
            >
              0{idx + 1} • {t.title.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Central Debate Stage */}
      <div className="border border-neutral-900 bg-black p-6 sm:p-10 space-y-8 relative shadow-2xl">
        <span className="absolute top-3 left-4 font-mono text-neutral-700 text-xs select-none pointer-events-none">+</span>
        <span className="absolute top-3 right-4 font-mono text-neutral-700 text-xs select-none pointer-events-none">+</span>

        {/* Central Dilemma Question */}
        <div className="text-center space-y-2 max-w-2xl mx-auto pb-6 border-b border-neutral-900">
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-400 font-semibold block">
            CENTRAL DIALECTICAL CONFLICT
          </span>
          <h4 className="font-serif-classic text-xl sm:text-2xl lg:text-3xl text-white font-light italic">
            &ldquo;{topic.question}&rdquo;
          </h4>
        </div>

        {/* Round Navigators & Momentum Gauge */}
        <div className="space-y-3 max-w-xl mx-auto">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-neutral-400">
            <span>{topic.duelistA.name.split(" ")[0]}</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setCurrentRound(r as 1 | 2 | 3)}
                  className={`px-2.5 py-0.5 border text-[11px] font-mono transition-colors cursor-pointer ${
                    currentRound === r
                      ? "border-white bg-white text-black font-bold"
                      : "border-neutral-800 text-neutral-500 hover:text-white"
                  }`}
                >
                  ROUND 0{r}
                </button>
              ))}
            </div>
            <span>{topic.duelistB.name.split(" ")[0]}</span>
          </div>

          {/* Dynamic Momentum Bar */}
          <div className="w-full h-1.5 bg-neutral-900 overflow-hidden flex">
            <div
              className="h-full bg-white transition-all duration-700 ease-out"
              style={{ width: `${100 - roundData.momentum}%` }}
            />
            <div
              className="h-full bg-rose-600 transition-all duration-700 ease-out"
              style={{ width: `${roundData.momentum}%` }}
            />
          </div>
        </div>

        {/* The Two Duelists Split Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          {/* Thinker A (Left Monolith) */}
          <div className="lg:col-span-6 p-6 sm:p-8 border border-neutral-800 bg-neutral-950/80 space-y-6 relative group hover:border-neutral-700 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-semibold">
                  THESIS • {topic.duelistA.era}
                </span>
                <h5 className="font-serif-classic text-2xl sm:text-3xl font-bold text-white uppercase tracking-wide">
                  {topic.duelistA.name}
                </h5>
                <span className="text-xs font-mono text-neutral-400 uppercase">
                  {topic.duelistA.school}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleVote("a")}
                disabled={hasVoted}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-800 hover:border-white text-xs font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{votes.a}</span>
              </button>
            </div>

            <div className="w-10 h-px bg-white/40" />

            <div className="space-y-3 font-garamond text-base sm:text-lg text-neutral-200 leading-relaxed font-light min-h-[140px]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block not-italic">
                ARGUMENT (ROUND 0{currentRound})
              </span>
              <p>&ldquo;{roundData.a}&rdquo;</p>
            </div>

            <div className="pt-2 border-t border-neutral-900 text-xs font-mono text-neutral-400">
              AXIOM: {topic.duelistA.axiom}
            </div>
          </div>

          {/* Thinker B (Right Monolith) */}
          <div className="lg:col-span-6 p-6 sm:p-8 border border-neutral-800 bg-neutral-950/80 space-y-6 relative group hover:border-neutral-700 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest block font-semibold">
                  ANTITHESIS • {topic.duelistB.era}
                </span>
                <h5 className="font-serif-classic text-2xl sm:text-3xl font-bold text-white uppercase tracking-wide">
                  {topic.duelistB.name}
                </h5>
                <span className="text-xs font-mono text-neutral-400 uppercase">
                  {topic.duelistB.school}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleVote("b")}
                disabled={hasVoted}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-800 hover:border-rose-500 text-xs font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{votes.b}</span>
              </button>
            </div>

            <div className="w-10 h-px bg-rose-500/40" />

            <div className="space-y-3 font-garamond text-base sm:text-lg text-neutral-200 leading-relaxed font-light min-h-[140px]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block not-italic">
                ARGUMENT (ROUND 0{currentRound})
              </span>
              <p>&ldquo;{roundData.b}&rdquo;</p>
            </div>

            <div className="pt-2 border-t border-neutral-900 text-xs font-mono text-neutral-400">
              AXIOM: {topic.duelistB.axiom}
            </div>
          </div>
        </div>

        {/* Synthesis Revealer */}
        <div className="pt-4 flex flex-col items-center justify-center text-center space-y-6">
          {!showSynthesis ? (
            <button
              type="button"
              onClick={() => setShowSynthesis(true)}
              className="py-3 px-8 bg-neutral-900 border border-neutral-700 hover:border-white text-white font-serif-classic text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-800 transition-all flex items-center gap-2 cursor-pointer shadow-xl"
            >
              <Sparkles className="w-4 h-4 text-neutral-300" />
              <span>Synthesize Higher Truth (Hegelian Reconciliation)</span>
            </button>
          ) : (
            <div className="w-full max-w-3xl p-8 border border-neutral-800 bg-neutral-950 text-left space-y-4 animate-fade-in relative">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-900">
                <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>{topic.synthesis.title}</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-500 uppercase">AUFHEBUNG</span>
              </div>

              <p className="font-garamond text-base sm:text-lg text-neutral-200 leading-relaxed font-light">
                {topic.synthesis.text}
              </p>

              <div className="p-4 border-l-2 border-emerald-400 bg-black space-y-1">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                  SYNTHESIS MAXIM
                </span>
                <p className="font-serif-classic text-base sm:text-lg text-white font-medium">
                  &ldquo;{topic.synthesis.maxim}&rdquo;
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
