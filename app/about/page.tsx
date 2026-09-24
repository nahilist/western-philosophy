"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  BookOpen,
  Sparkles,
  Scale,
  Brain,
  Layers,
  ScrollText,
  ShieldCheck,
  Quote,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DailyWisdomModal from "@/components/DailyWisdomModal";
import AuthModal from "@/components/AuthModal";
import { AuthProvider } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

function AboutPageContent() {
  const { t, language } = useLanguage();
  const isHi = language === "hi";
  const [dailyWisdomOpen, setDailyWisdomOpen] = useState(false);

  // Four Historical Epochs of Western Thought
  const epochs = [
    {
      num: "01",
      period: isHi ? "शास्त्रीय प्राचीन काल (600 ईसा पूर्व – 400 ईस्वी)" : "Classical Antiquity (600 BCE – 400 CE)",
      title: isHi ? "आयोनिआ से एथेंस: मिथक से विवेक की ओर" : "From Mythos to Logos: Athens & Rome",
      thinkers: isHi ? "सुकरात, प्लेटो, अरस्तू, हेराक्लिटस, सेनेका, मार्कस ऑरेलियस" : "Socrates, Plato, Aristotle, Heraclitus, Seneca, Marcus Aurelius",
      focus: isHi
        ? "अलौकिक मान्यताओं और देवी-देवताओं के मिथकों के स्थान पर प्राकृतिक कारणों की खोज। सुकरात ने नीतिशास्त्र और सत्य की खोज को जन्म दिया; प्लेटो ने प्रत्यय सिद्धांत (Theory of Forms) रचा; और अरस्तू ने तर्कशास्त्र तथा भौतिक संसार के वर्गीकरण की नींव रखी।"
        : "The radical rupture with mythological explanation. Pre-Socratics sought the arche (first principle of the universe); Socrates relocated philosophy into the human soul and civic virtue; Plato constructed ideal metaphysical Forms; and Aristotle formalized classical logic and biology.",
      axiom: isHi ? "‘परीक्षणहीन जीवन जीने योग्य नहीं है।’ — सुकरात" : "‘The unexamined life is not worth living.’ — Socrates",
    },
    {
      num: "02",
      period: isHi ? "मध्यकालीन पांडित्य परंपरा (400 – 1400 ईस्वी)" : "Medieval Scholasticism (400 – 1400 CE)",
      title: isHi ? "श्रद्धा और तर्क का समन्वय" : "The Synthesis of Faith & Reason",
      thinkers: isHi ? "संत ऑगस्टीन, थॉमस एक्विनास, विलियम ऑफ ओकम, एन्सेल्म" : "St. Augustine, Thomas Aquinas, William of Ockham, Anselm",
      focus: isHi
        ? "यूनानी दर्शन (विशेषकर अरस्तू) का ईसाई धर्मशास्त्र के साथ मिलन। ईश्वर के अस्तित्व के तार्किक प्रमाण, सार्वभौमिक सत्यों की प्रकृति, और 'ओकम के उस्तरे' (Ockham's Razor) जैसे मितव्ययी तार्किक नियमों का विकास हुआ।"
        : "A monumental synthesis integrating Greek classical rationalism with Christian theology. Thinkers formulated cosmological proofs for existence, debated the ontological status of universals, and codified razor-sharp analytical distinctions.",
      axiom: isHi ? "‘बिना आवश्यकता के व्याख्याओं को जटिल न करें।’ — विलियम ऑफ ओकम" : "‘Entities should not be multiplied beyond necessity.’ — Ockham",
    },
    {
      num: "03",
      period: isHi ? "प्रबोधन एवं प्रारंभिक आधुनिकता (1500 – 1800 ईस्वी)" : "The Enlightenment & Early Modernity (1500 – 1800 CE)",
      title: isHi ? "संशय, विज्ञान एवं ज्ञानमीमांसक क्रांति" : "The Epistemological Revolution",
      thinkers: isHi ? "देकार्त, स्पिनोज़ा, लॉक, ह्यूम, कांट, रूसो, हॉब्स" : "Descartes, Spinoza, Locke, Hume, Kant, Rousseau, Hobbes",
      focus: isHi
        ? "आधुनिक वैज्ञानिक क्रांति के साथ दर्शन ने पूछा: 'हम क्या जान सकते हैं?' तर्कवादियों (देकार्त) ने बुद्धि को सत्य का स्रोत माना, जबकि अनुभववादियों (लॉक, ह्यूम) ने इंद्रिय-अनुभव को। अंततः इमैनुएल कांट ने इन दोनों का ऐतिहासिक समन्वय किया।"
        : "Spurred by the Scientific Revolution, inquiry shifted to epistemology: What can the mind reliably know? Continental Rationalism battled British Empiricism, resolved when Immanuel Kant achieved his Copernican critique of human cognitive limits.",
      axiom: isHi ? "‘मैं सोचता हूँ, इसलिए मैं हूँ।’ — रेने देकार्त" : "‘Cogito, ergo sum.’ (I think, therefore I am.) — Descartes",
    },
    {
      num: "04",
      period: isHi ? "19वीं व 20वीं सदी: आधुनिक युग (1800 – वर्तमान)" : "Modernity & Post-Idealism (1800 – Present)",
      title: isHi ? "अस्तित्व का संकट, द्वंद्व एवं अर्थ की खोज" : "Existentialism, Dialectics & Critique",
      thinkers: isHi ? "हेगेल, मार्क्स, नीत्शे, रसेल, कामू, सार्त्र, विट्गेन्स्टाइन" : "Hegel, Marx, Nietzsche, Russell, Camus, Sartre, Wittgenstein",
      focus: isHi
        ? "पारंपरिक तत्वमीमांसा का विखंडन। हेगेल का ऐतिहासिक द्वंद्व, मार्क्स का भौतिकवाद, नीत्शे की 'ईश्वर की मृत्यु' की चेतावनी, और अल्बर्ट कामू का 'एब्सर्ड' (विसंगतिवाद)। बीसवीं सदी में भाषा के विश्लेषण और व्यक्तिगत स्वतंत्रता पर गहरा विमर्श हुआ।"
        : "The shattering of transcendent absolutes. Hegelian historical dialectics catalyzed Marxian social revolution, Nietzsche proclaimed the collapse of theological metaphysics, Camus and Sartre explored the Absurd, and Russell anchored philosophy in mathematical logic.",
      axiom: isHi ? "‘वही बनो जो तुम वास्तव में हो।’ — फ्रेडरिक नीत्शे" : "‘Become who you are.’ — Friedrich Nietzsche",
    },
  ];

  // The 5 Core Pillars (Taxonomy of Western Reason)
  const pillars = [
    {
      code: "MET",
      title: isHi ? "तत्वमीमांसा (Metaphysics & Ontology)" : "Metaphysics & Ontology",
      question: isHi ? "वास्तविकता और अस्तित्व का मूल स्वरूप क्या है?" : "What is the ultimate nature of being and reality?",
      desc: isHi
        ? "अस्तित्व, समय, द्रव्य, चेतना, और कारण-कार्य संबंध का अध्ययन। यह भौतिक विज्ञान से परे जाकर पूछता है कि 'शून्य के स्थान पर कुछ क्यों अस्तित्वमान है?'"
        : "The systematic study of reality beyond the physical world: being, substance, time, causality, identity, and the relationship between consciousness and the cosmos.",
    },
    {
      code: "EPI",
      title: isHi ? "ज्ञानमीमांसा (Epistemology)" : "Epistemology",
      question: isHi ? "सच्चा ज्ञान क्या है, और हम इसे कैसे प्राप्त करते हैं?" : "What is knowledge, and how is belief justified?",
      desc: isHi
        ? "सत्य, विश्वास और प्रमाण के मानकों की परीक्षा। संशयवाद, तर्कवाद (विवेक द्वारा ज्ञान) और अनुभववाद (इंद्रियों द्वारा ज्ञान) के बीच का ऐतिहासिक विमर्श।"
        : "The inquiry into the nature, sources, and scope of knowledge. It interrogates sensory perception, methodological skepticism, and the boundary between opinion and justified truth.",
    },
    {
      code: "ETH",
      title: isHi ? "नीतिशास्त्र (Ethics & Moral Duty)" : "Ethics & Moral Duty",
      question: isHi ? "सद्गुणी जीवन क्या है, और हमारा नैतिक कर्तव्य क्या है?" : "What is the good, and what ought we to do?",
      desc: isHi
        ? "मानव आचरण और शुभ-अशुभ का परीक्षण। अरस्तू का सद्गुण नीतिशास्त्र (Virtue Ethics), कांट का कर्तव्यशास्त्र (Deontology), और मिल का उपयोगितावाद (Utilitarianism)।"
        : "The rigorous examination of moral value and obligation. Major frameworks include Aristotelian virtue, Kantian universal duty (Categorical Imperative), and Utilitarian outcomes.",
    },
    {
      code: "LOG",
      title: isHi ? "तर्कशास्त्र व द्वंद्व (Logic & Dialectics)" : "Logic & Dialectics",
      question: isHi ? "सही और सुसंगत विचार कैसे निर्मित किए जाते हैं?" : "What constitutes valid inference and sound reasoning?",
      desc: isHi
        ? "तार्किक निगमनों, हेत्वाभासों (fallacies), और द्वंद्वात्मक संश्लेषण का विज्ञान। यह दार्शनिक तर्कों को सत्य की कसौटी पर कसने का गणितीय यंत्र है।"
        : "The formal discipline governing valid deduction, induction, conceptual consistency, and dialectical tension—the fundamental instrument through which all philosophy is verified.",
    },
    {
      code: "POL",
      title: isHi ? "राजनीतिक दर्शन (Political Philosophy)" : "Political Philosophy",
      question: isHi ? "राज्य की सत्ता, न्याय और स्वतंत्रता का आधार क्या है?" : "What justifies political authority and social order?",
      desc: isHi
        ? "न्याय, संप्रभुता, स्वतंत्रता और सामाजिक अनुबंध (Social Contract) का विश्लेषण। मेकियावेली के यथार्थवाद से लेकर हॉब्स, लॉक और मार्क्स के राजनीतिक सिद्धांतों तक।"
        : "The philosophical investigation of justice, power, natural rights, liberty, and the Social Contract, analyzing how free individuals construct legitimate governing commonwealths.",
    },
  ];

  // The 4 Dialectical Instruments (Methodology)
  const instruments = [
    {
      title: isHi ? "सुकराती प्रश्नोत्तरी (Socratic Elenchus)" : "The Socratic Elenchus",
      origin: "Athens • 400 BCE",
      desc: isHi
        ? "सतही उत्तरों पर निरंतर प्रतिप्रश्न पूछकर छिपे हुए अंतर्विरोधों और पूर्वाग्रहों को उजागर करना। यह विधि अज्ञानता की स्वीकृति से ज्ञान की शुरुआत करती है।"
        : "A cooperative dialogue technique of sustained cross-examination. By dissecting foundational premises, it systematically exposes internal contradictions in unexamined assumptions.",
    },
    {
      title: isHi ? "कार्तेशियन चरम संशय (Cartesian Radical Doubt)" : "Cartesian Methodological Doubt",
      origin: "France / Holland • 1641",
      desc: isHi
        ? "हर उस बात पर जानबूझकर संदेह करना जिसे झुठलाया जा सकता हो, जब तक कि कोई ऐसा अटल सत्य न मिल जाए जिस पर संदेह करना तर्कतः असंभव हो (मैं सोचता हूँ, इसलिए मैं हूँ)।"
        : "Systematically rejecting any belief that carries even the slightest shadow of uncertainty, stripping away illusions to uncover an indubitable ontological foundation.",
    },
    {
      title: isHi ? "द्वंद्वात्मक संश्लेषण (Hegelian Dialectic)" : "The Dialectical Triad",
      origin: "Germany • 1807",
      desc: isHi
        ? "विचारों का ऐतिहासिक विकास: एक मूल विचार (वाद/Thesis) अपने विरोधी विचार (प्रतिवाद/Antithesis) से टकराता है, जिससे एक उच्चतर समाधान (संवाद/Synthesis) जन्म लेता है।"
        : "Intellectual evolution through structural tension: a Proposition (Thesis) encounters its contradiction (Antithesis), resolving into a higher, reconciled comprehension (Synthesis).",
    },
    {
      title: isHi ? "ओकम का उस्तरा (Ockham’s Razor)" : "Principle of Parsimony (Ockham's Razor)",
      origin: "England • 1320",
      desc: isHi
        ? "जब किसी घटना की व्याख्या के लिए कई सिद्धांत हों, तो सबसे सरल और सबसे कम कल्पनाओं वाला सिद्धांत ही स्वीकार्य होना चाहिए।"
        : "The epistemological rule that among competing hypotheses explaining the same phenomenon, the explanation requiring the fewest unwarranted assumptions is to be preferred.",
    },
  ];

  // Foundational Latin & Greek Maxims
  const maxims = [
    {
      original: "Γνῶθι Σεαυτόν (Gnōthi Seauton)",
      translation: isHi ? "स्वयं को जानो।" : "Know Thyself.",
      source: isHi ? "डेल्फी का मंदिर • सुकरात" : "Temple of Apollo, Delphi • Socrates",
    },
    {
      original: "Cogito, Ergo Sum",
      translation: isHi ? "मैं सोचता हूँ, इसलिए मैं हूँ।" : "I think, therefore I am.",
      source: isHi ? "रेने देकार्त (1637)" : "René Descartes (1637)",
    },
    {
      original: "Sapere Aude",
      translation: isHi ? "अपनी बुद्धि का उपयोग करने का साहस करो।" : "Dare to know; have courage to use your own reason.",
      source: isHi ? "होरेस • इमैनुएल कांट (1784)" : "Horace • Immanuel Kant (1784)",
    },
    {
      original: "Amor Fati",
      translation: isHi ? "अपनी नियति से प्रेम करो।" : "Love of one's fate; embrace necessity.",
      source: isHi ? "फ्रेडरिक नीत्शे (1882)" : "Friedrich Nietzsche (1882)",
    },
    {
      original: "Tabula Rasa",
      translation: isHi ? "कोरी पट्टिका (अनुभव से पूर्व मस्तिष्क खाली स्लेट है)।" : "The blank slate (mind born without innate ideas).",
      source: isHi ? "जॉन लॉक (1689)" : "John Locke (1689)",
    },
    {
      original: "Panta Rhei (Πάντα ῥεῖ)",
      translation: isHi ? "सब कुछ निरंतर प्रवाहमान और परिवर्तनशील है।" : "Everything flows; nothing stands still.",
      source: isHi ? "हेराक्लिटस (500 ईसा पूर्व)" : "Heraclitus (c. 500 BCE)",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-black text-white selection:bg-white selection:text-black overflow-x-hidden">
      {/* Sticky Header */}
      <Navbar onOpenDailyWisdom={() => setDailyWisdomOpen(true)} />

      {/* Top Full-Bleed Breadcrumb Bar */}
      <div className="pt-28 pb-6 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 w-full flex items-center justify-between border-b border-neutral-900 bg-black">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] text-neutral-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>{isHi ? "अकादमी मुख्य पृष्ठ" : "Return to Academy"}</span>
        </Link>
        <div className="flex items-center gap-4 text-xs tracking-widest text-neutral-400 uppercase font-mono">
          <span>{isHi ? "दर्शन परिचय" : "Philosophia"}</span>
          <span className="text-neutral-600">•</span>
          <span>EST. 600 BCE</span>
        </div>
      </div>

      {/* ========================================================
          1. HERO SECTION: WHAT IS WESTERN PHILOSOPHY? (Full-Bleed)
         ======================================================== */}
      <section className="w-full py-20 sm:py-28 lg:py-36 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-black relative">
        <div className="w-full max-w-6xl space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-neutral-800 bg-neutral-950 text-xs uppercase tracking-[0.2em] text-neutral-200 font-mono font-medium">
              <Compass className="w-3.5 h-3.5 text-neutral-300" />
              <span>{t.aboutPage?.tag || "THE TRADITION OF FREE INQUIRY"}</span>
            </div>

            <h1 className="font-serif-classic text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-[0.12em] text-white uppercase leading-none">
              {t.aboutPage?.title || "WHAT IS WESTERN PHILOSOPHY?"}
            </h1>
          </div>

          <div className="w-24 h-px bg-neutral-800" />

          {/* Core Definition Typography */}
          <p className="font-garamond text-xl sm:text-2xl lg:text-3xl text-neutral-200 leading-relaxed font-light max-w-5xl">
            {t.aboutPage?.subtitle ||
              "Western philosophy began not as an academic dogma, but as humanity’s daring transition from myth to reason. It is the systematic pursuit of truth through critical questioning, logical rigor, and unrelenting skepticism."}
          </p>

          {/* Etymological & Methodological Monograph Box (Minimal, No Realistic Gimmicks) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-neutral-900 text-xs">
            <div className="p-6 border border-neutral-800 bg-neutral-950/80 space-y-2">
              <span className="font-mono text-neutral-300 uppercase tracking-wider text-xs font-medium block">
                01. ETYMOLOGY
              </span>
              <h3 className="font-serif-classic text-base font-bold text-white uppercase">
                Φιλοσοφία (Philosophia)
              </h3>
              <p className="font-garamond text-base text-neutral-300 leading-relaxed">
                {isHi
                  ? "यूनानी शब्द 'फ़िलोस' (प्रेम) और 'सोफ़िया' (बुद्धि)। इसका शाब्दिक अर्थ है 'ज्ञान के प्रति अगाध प्रेम'।"
                  : "From the ancient Greek 'philos' (love) and 'sophia' (wisdom)—literally: 'the enduring love of wisdom'."}
              </p>
            </div>

            <div className="p-6 border border-neutral-800 bg-neutral-950/80 space-y-2">
              <span className="font-mono text-neutral-300 uppercase tracking-wider text-xs font-medium block">
                02. COGNITIVE REVOLUTION
              </span>
              <h3 className="font-serif-classic text-base font-bold text-white uppercase">
                Mythos to Logos
              </h3>
              <p className="font-garamond text-base text-neutral-300 leading-relaxed">
                {isHi
                  ? "अलौकिक मिथकों और अंधविश्वासों के स्थान पर प्राकृतिक प्रमाणों और तर्कसंगत तर्कों (Logos) की सार्वभौमिक स्वीकार्यता।"
                  : "The historical pivot from accepting mythological folklore to demanding systematic, reasoned justification (Logos)."}
              </p>
            </div>

            <div className="p-6 border border-neutral-800 bg-neutral-950/80 space-y-2">
              <span className="font-mono text-neutral-300 uppercase tracking-wider text-xs font-medium block">
                03. ESSENCE
              </span>
              <h3 className="font-serif-classic text-base font-bold text-white uppercase">
                Radical Inquiry
              </h3>
              <p className="font-garamond text-base text-neutral-300 leading-relaxed">
                {isHi
                  ? "कोई भी मान्यता इतनी पवित्र नहीं कि उस पर प्रश्न न उठाया जा सके। प्रत्येक विचार को निष्पक्ष परीक्षा से गुजरना पड़ता है।"
                  : "No belief is too sacred or customary to escape interrogation. Certainty must be earned through critical dialogue."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. SECTION 01: THE FOUR GREAT HISTORICAL EPOCHS (Timeline)
         ======================================================== */}
      <section className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-black">
        <div className="w-full space-y-16">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-900">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-neutral-400 tracking-widest font-semibold">
                  01
                </span>
                <div className="w-8 h-px bg-neutral-800" />
                <span className="text-xs uppercase tracking-[0.35em] text-neutral-400">
                  {t.aboutPage?.epochsBadge || "CHRONOLOGICAL REVOLUTION"}
                </span>
              </div>
              <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.12em] text-white uppercase">
                {t.aboutPage?.epochsTitle || "THE FOUR GREAT EPOCHS"}
              </h2>
            </div>
            <p className="text-xs text-neutral-400 tracking-widest uppercase font-mono">
              2,500 YEARS OF DIALECTIC
            </p>
          </div>

          {/* Minimal 4-Column Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 xl:gap-12">
            {epochs.map((epoch, idx) => (
              <div
                key={idx}
                className="space-y-5 pb-8 border-b lg:border-b-0 lg:border-r border-neutral-900 lg:pr-8 xl:pr-10 last:border-r-0 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-neutral-300 tracking-wider font-semibold">
                      EPOCH {epoch.num}
                    </span>
                    <span className="text-xs font-mono text-neutral-400 uppercase font-medium">
                      Era
                    </span>
                  </div>

                  <span className="text-xs font-mono text-neutral-300 tracking-wider font-medium block">
                    {epoch.period}
                  </span>

                  <h3 className="font-serif-classic text-xl font-bold text-white uppercase tracking-wide leading-snug">
                    {epoch.title}
                  </h3>

                  <div className="w-10 h-px bg-neutral-800" />

                  <div className="space-y-1">
                    <span className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-medium block">
                      {isHi ? "प्रमुख चिंतक" : "Prominent Thinkers"}
                    </span>
                    <p className="font-serif-classic text-sm text-neutral-200 font-medium">
                      {epoch.thinkers}
                    </p>
                  </div>

                  <p className="font-garamond text-base text-neutral-300 leading-relaxed font-light pt-1">
                    {epoch.focus}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800">
                  <span className="text-xs sm:text-sm font-garamond italic text-neutral-200 block">
                    {epoch.axiom}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SECTION 02: THE FIVE CARDINAL PILLARS (Minimal Grid)
         ======================================================== */}
      <section className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-neutral-950">
        <div className="w-full space-y-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-900">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-neutral-400 tracking-widest font-semibold">
                  02
                </span>
                <div className="w-8 h-px bg-neutral-800" />
                <span className="text-xs uppercase tracking-[0.35em] text-neutral-400">
                  {t.aboutPage?.branchesBadge || "TAXONOMY OF REASON"}
                </span>
              </div>
              <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.12em] text-white uppercase">
                {t.aboutPage?.branchesTitle || "THE FIVE CARDINAL BRANCHES"}
              </h2>
            </div>
            <p className="text-xs text-neutral-400 tracking-widest uppercase font-mono">
              SYSTEMATIC ARCHITECTURE
            </p>
          </div>

          {/* Minimal Clean 5-Card Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-6 border border-neutral-900 bg-black/60 space-y-4 hover:border-neutral-700 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 font-medium">
                    <span className="border border-neutral-800 px-2 py-0.5 text-neutral-300 font-semibold">
                      {pillar.code}
                    </span>
                    <span>0{idx + 1}</span>
                  </div>

                  <h3 className="font-serif-classic text-lg font-bold text-white uppercase tracking-wider">
                    {pillar.title}
                  </h3>

                  <p className="font-garamond text-xs italic text-neutral-300 border-l border-neutral-800 pl-2.5">
                    &ldquo;{pillar.question}&rdquo;
                  </p>

                  <p className="font-garamond text-sm text-neutral-400 leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. SECTION 03: DIALECTICAL INSTRUMENTS (Methodology)
         ======================================================== */}
      <section className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-black">
        <div className="w-full space-y-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-900">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-neutral-400 tracking-widest font-semibold">
                  03
                </span>
                <div className="w-8 h-px bg-neutral-800" />
                <span className="text-xs uppercase tracking-[0.35em] text-neutral-400">
                  {t.aboutPage?.methodsBadge || "HOW PHILOSOPHY THINKS"}
                </span>
              </div>
              <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.12em] text-white uppercase">
                {t.aboutPage?.methodsTitle || "THE DIALECTICAL INSTRUMENTS"}
              </h2>
            </div>
            <p className="text-xs text-neutral-400 tracking-widest uppercase font-mono">
              RIGOR &amp; LOGICAL CRITIQUE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {instruments.map((inst, idx) => (
              <div
                key={idx}
                className="p-6 border border-neutral-900 bg-neutral-950/70 space-y-3 hover:border-neutral-800 transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 font-medium">
                  <span className="tracking-widest">INSTRUMENT 0{idx + 1}</span>
                  <span className="text-neutral-300">{inst.origin}</span>
                </div>

                <h3 className="font-serif-classic text-lg font-bold text-white uppercase tracking-wider">
                  {inst.title}
                </h3>

                <div className="w-8 h-px bg-neutral-800" />

                <p className="font-garamond text-base text-neutral-400 leading-relaxed font-light">
                  {inst.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. SECTION 04: IMMORTAL MAXIMS & AXIOMS (Minimalist Quotes)
         ======================================================== */}
      <section className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-neutral-950">
        <div className="w-full space-y-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-900">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-neutral-400 tracking-widest font-semibold">
                  04
                </span>
                <div className="w-8 h-px bg-neutral-800" />
                <span className="text-xs uppercase tracking-[0.35em] text-neutral-400">
                  {t.aboutPage?.axiomsBadge || "TIMELESS PRINCIPLES"}
                </span>
              </div>
              <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.12em] text-white uppercase">
                {t.aboutPage?.axiomsTitle || "FOUNDATIONAL AXIOMS & MAXIMS"}
              </h2>
            </div>
            <p className="text-xs text-neutral-400 tracking-widest uppercase font-mono">
              CLASSICAL PRECEPTS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {maxims.map((maxim, idx) => (
              <div
                key={idx}
                className="p-6 border border-neutral-900 bg-black/60 space-y-4 hover:border-neutral-800 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-medium block">
                    AXIOM 0{idx + 1}
                  </span>
                  <h3 className="font-serif-classic text-xl font-bold text-white tracking-wide">
                    {maxim.original}
                  </h3>
                  <p className="font-garamond text-base text-neutral-200 italic">
                    &ldquo;{maxim.translation}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-900 text-xs font-mono text-neutral-400">
                  {maxim.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. SECTION 05: CALL TO DIALECTICAL INQUIRY (Full-Bleed CTA)
         ======================================================== */}
      <section className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-black text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-xs uppercase font-mono tracking-[0.2em] text-neutral-300 font-medium">
            {isHi ? "दार्शनिक परंपरा में प्रवेश करें" : "CONTINUE YOUR INTELLECTUAL EXPEDITION"}
          </span>

          <h2 className="font-serif-classic text-3xl sm:text-5xl font-bold tracking-[0.15em] text-white uppercase leading-tight">
            {t.aboutPage?.ctaTitle || "BEGIN YOUR DIALECTICAL INQUIRY"}
          </h2>

          <p className="font-garamond text-base sm:text-xl text-neutral-300 leading-relaxed font-light">
            {t.aboutPage?.ctaBody ||
              "Examine our curated monographs on 14 legendary thinkers spanning from Antiquity to Modernity."}
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/#courses"
              className="px-10 py-3.5 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-200 transition-colors shadow-lg"
            >
              {t.aboutPage?.ctaButton || "EXPLORE THE 14 THINKERS"}
            </Link>
            <Link
              href="/"
              className="px-8 py-3.5 border border-neutral-800 hover:border-white text-neutral-300 hover:text-white text-xs uppercase tracking-[0.25em] font-mono transition-colors"
            >
              {isHi ? "होम पेज" : "Back to Home"}
            </Link>
          </div>
        </div>
      </section>

      {/* Minimal Editorial Footer */}
      <Footer />

      {/* Secondary Modals */}
      <DailyWisdomModal
        isOpen={dailyWisdomOpen}
        onClose={() => setDailyWisdomOpen(false)}
      />
      <AuthModal />
    </div>
  );
}

export default function AboutPage() {
  return (
    <AuthProvider>
      <AboutPageContent />
    </AuthProvider>
  );
}
