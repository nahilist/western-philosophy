"use client";

import React, { useState, useEffect } from "react";
import { X, Scale, Users, CheckCircle2, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface DilemmaModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDilemmaId?: string;
}

interface DilemmaOption {
  id: string;
  titleEn: string;
  titleHi: string;
  traditionEn: string;
  traditionHi: string;
  descEn: string;
  descHi: string;
}

interface DilemmaItem {
  id: string;
  titleEn: string;
  titleHi: string;
  philosopherEn: string;
  philosopherHi: string;
  scenarioEn: string;
  scenarioHi: string;
  options: [DilemmaOption, DilemmaOption];
}

const DILEMMAS: DilemmaItem[] = [
  {
    id: "trolley_problem",
    titleEn: "The Trolley Problem",
    titleHi: "ट्रॉली समस्या (The Trolley Problem)",
    philosopherEn: "Philippa Foot (1967) / Judith Jarvis Thomson",
    philosopherHi: "फिलिप्पा फुट (1967) / जूडिथ जार्विस थॉमसन",
    scenarioEn:
      "A runaway trolley is speeding down the tracks toward five unaware workers. You are standing beside a lever. If you pull it, the trolley diverts to a side track where only one person stands. Do you pull the lever?",
    scenarioHi:
      "एक अनियंत्रित ट्रॉली पटरी पर तेजी से दौड़ रही है, जहाँ आगे पाँच निर्दोष मजदूर काम कर रहे हैं। आप एक लीवर के पास खड़े हैं। यदि आप लीवर खींचते हैं, तो ट्रॉली एक दूसरी पटरी पर मुड़ जाएगी जहाँ केवल एक व्यक्ति खड़ा है। क्या आप लीवर खींचेंगे?",
    options: [
      {
        id: "pull_lever",
        titleEn: "Pull the Lever (Divert)",
        titleHi: "लीवर खींचें (दिशा बदलें)",
        traditionEn: "Consequentialism / Utilitarianism (Bentham, Mill)",
        traditionHi: "परिणामवाद / उपयोगितावाद (जेरेमी बेंथम, जे.एस. मिल)",
        descEn: "Maximize overall net well-being. Five lives outweigh one life mathematically.",
        descHi: "अधिकतम लोगों का अधिकतम कल्याण। गणितीय रूप से पाँच जीवन एक जीवन से अधिक मूल्यवान हैं।",
      },
      {
        id: "do_not_pull",
        titleEn: "Do Not Pull (Refrain)",
        titleHi: "लीवर न खींचें (हस्तक्षेप न करें)",
        traditionEn: "Deontology / Doctrine of Doing and Allowing (Kant)",
        traditionHi: "कर्तव्यशास्त्र / कांट का नैतिक विधान (इमैनुएल कांट)",
        descEn: "Killing is an active moral evil. Using an innocent person as a mere means violates duty.",
        descHi: "सक्रिय रूप से किसी को मारना अनैतिक है। किसी निर्दोष व्यक्ति को साधन बनाना कर्तव्य का उल्लंघन है।",
      },
    ],
  },
  {
    id: "ship_of_theseus",
    titleEn: "The Ship of Theseus",
    titleHi: "थीसियस का जहाज़ (Ship of Theseus)",
    philosopherEn: "Plutarch / Thomas Hobbes (400 BCE - 1655 CE)",
    philosopherHi: "प्लूटार्क / थॉमस हॉब्स (400 ई.पू. - 1655 ई.)",
    scenarioEn:
      "Over centuries of voyaging, every single timber and plank of Theseus's ship is replaced one by one until none of the original material remains. Separately, the rotting discarded planks are reassembled. Which one is the genuine Ship of Theseus?",
    scenarioHi:
      "सदियों की यात्रा में थीसियस के जहाज़ का हर एक तख्ता और शहतीर धीरे-धीरे बदलकर नया लगा दिया जाता है, यहाँ तक कि मूल लकड़ी का एक कण भी नहीं बचता। अलग से, निकाले गए पुराने तख्तों को जोड़कर फिर से एक जहाज़ खड़ा कर दिया जाता है। असली थीसियस का जहाज़ कौन सा है?",
    options: [
      {
        id: "continuous_ship",
        titleEn: "The Continuously Repaired Ship",
        titleHi: "लगातार मरम्मत किया गया नया जहाज़",
        traditionEn: "Functional Spatiotemporal Continuity (Locke)",
        traditionHi: "कार्यात्मक व देश-काल की निरंतरता (जॉन लॉक)",
        descEn: "Identity survives through dynamic spatiotemporal continuity and systemic function over time.",
        descHi: "पहचान समय के साथ उसके निरंतर उपयोग और कार्यात्मक स्वरूप में जीवित रहती है।",
      },
      {
        id: "reassembled_planks",
        titleEn: "The Reassembled Original Wood",
        titleHi: "मूल पुरानी लकड़ियों से बना जहाज़",
        traditionEn: "Mereological Essentialism (Material Identity)",
        traditionHi: "पदार्थवादी सारतत्व (Mereological Essentialism)",
        descEn: "An entity is fundamentally defined by the exact material substance that constituted it originally.",
        descHi: "किसी वस्तु की मूल पहचान उसके निर्माण में प्रयुक्त वास्तविक मौलिक पदार्थों से होती है।",
      },
    ],
  },
  {
    id: "ring_of_gyges",
    titleEn: "The Ring of Gyges",
    titleHi: "गाइजेस की अंगूठी (Ring of Gyges)",
    philosopherEn: "Plato, Republic (Book II)",
    philosopherHi: "प्लेटो, द रिपब्लिक (पुस्तक II)",
    scenarioEn:
      "A shepherd finds a gold ring that grants total invisibility at will, shielding him from any detection, law, or social retribution. Would an enlightened soul remain genuinely just and righteous, or is justice only obeyed out of fear of getting caught?",
    scenarioHi:
      "एक गड़ेरिये को एक जादुई सोने की अंगूठी मिलती है जो उसे इच्छानुसार पूर्णतः अदृश्य बना देती है। उस पर कोई कानून या समाज का भय लागू नहीं होता। क्या कोई प्रबुद्ध व्यक्ति बिना किसी दंड के भय के भी सदाचारी और न्यायी बना रहेगा?",
    options: [
      {
        id: "virtue_intrinsic",
        titleEn: "Justice is Intrinsic to Soul",
        titleHi: "न्याय व सदाचार आत्मा का स्वाभाविक गुण है",
        traditionEn: "Platonic Realism & Virtue Ethics (Socrates, Plato)",
        traditionHi: "सुकराती सद्गुण सिद्धांत (प्लेटो, सुकरात)",
        descEn: "Injustice inherently disorders and poisons the soul, regardless of whether external humans witness it.",
        descHi: "अन्याय मनुष्य की अंतरात्मा को भीतर से विषाक्त कर देता है, भले ही दुनिया में कोई न देख रहा हो।",
      },
      {
        id: "justice_social_contract",
        titleEn: "Justice is Enforced Conformity",
        titleHi: "न्याय केवल सामाजिक भय और अनुबंध है",
        traditionEn: "Psychological Egoism / Social Contract (Glaucon, Hobbes)",
        traditionHi: "मनोवैज्ञानिक स्वार्थवाद (ग्लौकोन, हॉब्स)",
        descEn: "Humans practice justice strictly out of mutual weakness and dread of suffering unpunished harm.",
        descHi: "मनुष्य केवल दंड के भय और सामाजिक दंड से बचने के लिए ही नियमों का पालन करते हैं।",
      },
    ],
  },
];

export default function DilemmaModal({
  isOpen,
  onClose,
  defaultDilemmaId = "trolley_problem",
}: DilemmaModalProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [activeDilemmaId, setActiveDilemmaId] = useState(defaultDilemmaId);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState<{
    total: number;
    stats: { choice: string; count: number; percentage: number }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeDilemma =
    DILEMMAS.find((d) => d.id === activeDilemmaId) || DILEMMAS[0];

  // Fetch current community stats when modal opens or dilemma changes
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    async function loadStats() {
      try {
        setError(null);
        const res = await fetch(`/api/dilemma/vote?dilemmaId=${activeDilemmaId}`);
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setStats(json.data);
        }
      } catch (err) {
        console.warn("Failed to load dilemma stats:", err);
      }
    }

    loadStats();

    // Check if user previously voted in localStorage
    try {
      const stored = localStorage.getItem(`dilemma_vote_${activeDilemmaId}`);
      if (stored && isMounted) {
        setSelectedChoice(stored);
      } else if (isMounted) {
        setSelectedChoice(null);
      }
    } catch {
      // ignore
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, activeDilemmaId]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleVote = async (choiceId: string) => {
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/dilemma/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dilemma_id: activeDilemmaId,
          selected_choice: choiceId,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setSelectedChoice(choiceId);
        try {
          localStorage.setItem(`dilemma_vote_${activeDilemmaId}`, choiceId);
        } catch {
          // ignore
        }
        if (json.data?.stats) {
          setStats(json.data.stats);
        }
      } else {
        setError(json.error?.message || "Failed to record vote.");
      }
    } catch {
      setError("Network error while transmitting vote.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const getPercentageForChoice = (choiceId: string): number => {
    if (!stats || !stats.stats || stats.stats.length === 0) return 50;
    const item = stats.stats.find((s) => s.choice === choiceId);
    return item ? item.percentage : 0;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 shadow-[0_25px_80px_rgba(0,0,0,0.95)] max-h-[92vh] flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-900 bg-black">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-neutral-800 bg-neutral-900">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-widest text-neutral-400 font-semibold">
                  {isHi ? "दार्शनिक दुविधा" : "PHILOSOPHICAL DILEMMA"}
                </span>
                <span className="text-neutral-700">•</span>
                <span className="text-xs font-mono text-neutral-400">
                  {stats?.total ? `${stats.total.toLocaleString()} ${isHi ? "वोट दर्ज" : "VOTES"}` : "LIVE POLL"}
                </span>
              </div>
              <h2 className="font-serif-classic text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
                {isHi ? activeDilemma.titleHi : activeDilemma.titleEn}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher for Dilemmas */}
        <div className="flex border-b border-neutral-900 bg-neutral-950/70 overflow-x-auto text-xs font-mono">
          {DILEMMAS.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDilemmaId(d.id)}
              className={`px-5 py-3 border-r border-neutral-900 transition-colors whitespace-nowrap cursor-pointer uppercase tracking-wider ${
                activeDilemmaId === d.id
                  ? "bg-white text-black font-semibold"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              {isHi ? d.titleHi.split("(")[0] : d.titleEn}
            </button>
          ))}
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 font-garamond leading-relaxed">
          {/* Philosopher Attribution */}
          <div className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
            {isHi ? "विचारक / संदर्भ:" : "Origin & Canon:"}{" "}
            <span className="text-neutral-200">
              {isHi ? activeDilemma.philosopherHi : activeDilemma.philosopherEn}
            </span>
          </div>

          {/* Scenario Narrative Box */}
          <div className="p-6 border border-neutral-800 bg-black/60 relative">
            <div className="absolute -top-3 left-6 px-3 bg-neutral-900 border border-neutral-800 text-[10px] font-mono uppercase tracking-widest text-neutral-300">
              {isHi ? "नैतिक परिदृश्य" : "THOUGHT EXPERIMENT"}
            </div>
            <p className="text-base sm:text-lg text-neutral-200 pt-2 font-light">
              {isHi ? activeDilemma.scenarioHi : activeDilemma.scenarioEn}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Choice Cards (A / B) */}
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 flex items-center justify-between">
              <span>{isHi ? "अपना दार्शनिक निर्णय चुनें:" : "Cast Your Dialectical Choice:"}</span>
              {selectedChoice && (
                <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isHi ? "वोट दर्ज हुआ" : "Decision Recorded"}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeDilemma.options.map((opt) => {
                const isSelected = selectedChoice === opt.id;
                const percentage = getPercentageForChoice(opt.id);

                return (
                  <div
                    key={opt.id}
                    onClick={() => !isSubmitting && handleVote(opt.id)}
                    className={`p-6 border transition-all cursor-pointer relative flex flex-col justify-between group ${
                      isSelected
                        ? "border-white bg-neutral-900/90 shadow-[0_0_30px_rgba(255,255,255,0.08)]"
                        : "border-neutral-800 bg-black hover:border-neutral-600 hover:bg-neutral-950"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-neutral-400 uppercase tracking-wider">
                          {isHi ? opt.traditionHi : opt.traditionEn}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 border border-white bg-white text-black font-bold">
                            {isHi ? "आपका चयन" : "YOUR CHOICE"}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif-classic text-xl font-bold uppercase tracking-wider text-white">
                        {isHi ? opt.titleHi : opt.titleEn}
                      </h3>

                      <p className="text-sm text-neutral-300 font-light">
                        {isHi ? opt.descHi : opt.descEn}
                      </p>
                    </div>

                    {/* Voting Percentage Bar */}
                    <div className="pt-6 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-neutral-400 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          {isHi ? "समुदाय अनुपात" : "Community Consensus"}
                        </span>
                        <span className="font-bold text-white text-sm">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-900 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 ${
                            isSelected ? "bg-white" : "bg-neutral-500 group-hover:bg-neutral-300"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-900 bg-black flex items-center justify-between text-xs font-mono">
          <div className="text-neutral-400 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
            <span>
              {isHi
                ? "सभी वोट क्रिप्टोग्राफिक पहचान द्वारा एन्क्रिप्टेड हैं।"
                : "Votes are cryptographically deduplicated with zero tracking."}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 border border-neutral-700 hover:border-white text-neutral-200 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
          >
            {isHi ? "संवाद बंद करें" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
