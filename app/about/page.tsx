"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Compass,
  ScrollText,
  Quote,
  Clock,
  Bookmark,
  Share2,
  Check,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  Search,
  Scale,
  Brain,
  Hash,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DailyWisdomModal from "@/components/DailyWisdomModal";
import AuthModal from "@/components/AuthModal";
import { AuthProvider } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface EpochData {
  num: string;
  roman: string;
  period: string;
  title: string;
  focus: string;
  axiom: string;
  thinkers: { name: string; id?: string; role: string }[];
}

interface PillarData {
  code: string;
  num: string;
  title: string;
  greekTerm: string;
  question: string;
  desc: string;
  keyProblems: string[];
}

interface InstrumentData {
  id: string;
  name: string;
  originalName: string;
  origin: string;
  philosopher: string;
  philosopherId?: string;
  definition: string;
  steps: string[];
  impact: string;
}

interface MaximData {
  original: string;
  transliteration: string;
  translation: string;
  language: string;
  author: string;
  authorId?: string;
  date: string;
  context: string;
}

function AboutPageContent() {
  const { t, language } = useLanguage();
  const isHi = language === "hi";

  const [dailyWisdomOpen, setDailyWisdomOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [copiedMaxim, setCopiedMaxim] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll listener for reading progress bar and active TOC section
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      // Check section in view
      const sections = [
        "overview",
        "epochs",
        "branches",
        "instruments",
        "maxims",
        "thinkers",
        "glossary",
      ];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 150) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyMaxim = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedMaxim(key);
      setTimeout(() => setCopiedMaxim(null), 2000);
    }
  };

  // Four Historical Epochs
  const epochs: EpochData[] = [
    {
      num: "01",
      roman: "I",
      period: isHi
        ? "शास्त्रीय प्राचीन काल (600 ईसा पूर्व – 400 ईस्वी)"
        : "Classical Antiquity (600 BCE – 400 CE)",
      title: isHi
        ? "आयोनिआ से एथेंस: मिथक से विवेक की ओर"
        : "From Mythos to Logos: The Ionian & Athenian Dawn",
      focus: isHi
        ? "अलौकिक मान्यताओं और देवी-देवताओं के मिथकों के स्थान पर प्राकृतिक कारणों की खोज। पूर्व-सुकराती विचारकों (थेल्स, एनाक्सिमेंडर) ने 'आर्के' (विश्व का मूल तत्व) खोजा; सुकरात ने दर्शन को स्वर्ग से उतारकर मानव अंतःकरण और सद्गुण में स्थापित किया; प्लेटो ने शाश्वत प्रत्ययों (Theory of Forms) का जगत् रचा; और अरस्तू ने शास्त्रीय तर्कशास्त्र, जीवविज्ञान एवं आचारशास्त्र की सार्वभौमिक रूपरेखा तैयार की।"
        : "The radical rupture with mythological explanation. Pre-Socratic thinkers sought the natural arche (primordial principle) behind the cosmos without recourse to Olympus; Socrates radically repositioned philosophy into human conscience, civic virtue, and self-interrogation; Plato constructed the transcendent metaphysical realm of Forms; and Aristotle formalized formal deductive logic, teleology, physics, and empirical taxonomy.",
      axiom: isHi
        ? "‘परीक्षणहीन जीवन मनुष्य के लिए जीने योग्य नहीं है।’ — सुकरात"
        : "‘The unexamined life is not worth living.’ — Socrates",
      thinkers: [
        { name: "Socrates", id: "socrates", role: "Virtue Ethics & Dialectics" },
        { name: "Plato", id: "plato", role: "Idealism & The Republic" },
        { name: "Aristotle", id: "aristotle", role: "Organon & Nichomachean Ethics" },
        { name: "Heraclitus", role: "Doctrine of Eternal Flux" },
        { name: "Seneca", role: "Roman Stoicism & Epistles" },
        { name: "Marcus Aurelius", role: "Imperial Meditations" },
      ],
    },
    {
      num: "02",
      roman: "II",
      period: isHi
        ? "मध्यकालीन पांडित्य परंपरा (400 – 1400 ईस्वी)"
        : "Medieval Scholasticism (400 – 1400 CE)",
      title: isHi
        ? "श्रद्धा और तर्क का समन्वय"
        : "The Grand Synthesis of Faith & Rationality",
      focus: isHi
        ? "यूनानी शास्त्रीय तर्कवाद और ईसाई, यहूदी व इस्लामी धर्मशास्त्र का ऐतिहासिक मिलन। सेंट ऑगस्टीन ने प्लेटोवाद को ईसाई दर्शन में समाहित किया; थॉमस एक्विनास ने अरस्तू के दर्शन को कैथोलिक धर्ममीमांसा के साथ संश्लेषित कर ईश्वर के अस्तित्व के पांच अकाट्य प्रमाण दिए; और विलियम ऑफ ओकम ने 'ओकम के उस्तरे' द्वारा अनावश्यक वैचारिक कल्पनाओं को छांटने का नियम दिया।"
        : "A monumental synthesis integrating Greek classical rationalism with Abrahamic theology. St. Augustine harmonized Platonic idealism with spiritual inwardness; St. Thomas Aquinas accomplished an intellectual feat by weaving Aristotelian natural philosophy into Christian dogma, formulating the Quinque Viae (Five Proofs); and William of Ockham laid the bedrock of nominalism with his razor-sharp parsimony.",
      axiom: isHi
        ? "‘बिना आवश्यकता के व्याख्याओं को जटिल न करें।’ — विलियम ऑफ ओकम"
        : "‘Entities should not be multiplied beyond necessity.’ — William of Ockham",
      thinkers: [
        { name: "St. Augustine", role: "Neo-Platonic Christianity & The City of God" },
        { name: "Thomas Aquinas", role: "Summa Theologiae & Aristotelian Synthesis" },
        { name: "William of Ockham", role: "Nominalism & Methodological Parsimony" },
        { name: "Anselm of Canterbury", role: "Ontological Argument" },
      ],
    },
    {
      num: "03",
      roman: "III",
      period: isHi
        ? "प्रबोधन एवं प्रारंभिक आधुनिकता (1500 – 1800 ईस्वी)"
        : "The Enlightenment & Early Modernity (1500 – 1800 CE)",
      title: isHi
        ? "संशय, विज्ञान एवं ज्ञानमीमांसक क्रांति"
        : "The Epistemological Revolution & The Age of Reason",
      focus: isHi
        ? "वैज्ञानिक क्रांति के साथ दर्शन का केंद्र 'वास्तविकता क्या है' से बदलकर 'हम क्या निश्चित जान सकते हैं' बन गया। देकार्त के चरम संशय और 'कोगितो' (Cogito) ने आधुनिक व्यक्तिपरक चेतना को जन्म दिया; स्पिनोज़ा ने सर्वेश्वरवादी अद्वैतवाद रचा; लॉक और ह्यूम ने ब्रिटिश अनुभववाद की नींव रखी; और इमैनुएल कांट ने 'शुद्ध तर्क की आलोचना' में तर्कवाद और अनुभववाद का ऐतिहासिक समन्वय कर आधुनिक ज्ञानमीमांसा को पुनर्परिभाषित किया।"
        : "Galvanized by the Copernican and Newtonian scientific breakthroughs, Western thought turned inward to epistemological sovereignty: How does human consciousness reliably comprehend truth? Continental Rationalism (Descartes, Spinoza, Leibniz) clashed with British Empiricism (Locke, Berkeley, Hume), reaching a Copernican resolution when Immanuel Kant delineated the precise boundaries of human cognitive faculties.",
      axiom: isHi
        ? "‘मैं सोचता हूँ, इसलिए मैं हूँ।’ — रेने देकार्त"
        : "‘Cogito, ergo sum.’ (I think, therefore I am.) — René Descartes",
      thinkers: [
        { name: "René Descartes", id: "descartes", role: "Radical Doubt & Dualism" },
        { name: "Baruch Spinoza", id: "spinoza", role: "Substance Monism & Ethics" },
        { name: "David Hume", id: "hume", role: "Empiricism & Skepticism" },
        { name: "Immanuel Kant", id: "kant", role: "Critical Philosophy & Deontology" },
        { name: "Nicolò Machiavelli", id: "machiavelli", role: "Political Realism" },
      ],
    },
    {
      num: "04",
      roman: "IV",
      period: isHi
        ? "19वीं व 20वीं सदी: आधुनिक युग (1800 – वर्तमान)"
        : "Modernity, Crisis & Linguistic Critique (1800 – Present)",
      title: isHi
        ? "अस्तित्ववाद, ऐतिहासिक द्वंद्व एवं विखंडन"
        : "Dialectics, Existential Anguish & Language",
      focus: isHi
        ? "पारंपरिक तत्वमीमांसीय प्रणालियों का विखंडन। हेगेल ने इतिहास को आत्मा के द्वंद्वात्मक आत्म-विकास के रूप में देखा; मार्क्स ने इसे भौतिक उत्पादन और वर्ग-संघर्ष में रूपांतरित किया; शोपेनहावर और नीत्शे ने अंध तर्कवाद को चुनौती देकर 'जीने की इच्छा' और 'शक्ति की इच्छा' की घोषणा की; 20वीं सदी में कामू और सार्त्र ने अस्तित्ववादी स्वतंत्रता व विसंगतिवाद (Absurdism) का अन्वेषण किया, जबकि रसेल और विट्गेन्स्टाइन ने भाषा और गणितीय तर्क को दर्शन का केंद्र बनाया।"
        : "The fracturing of grand transcendent systems. G.W.F. Hegel conceptualized history as the dialectical progression of Spirit; Karl Marx inverted this into historical materialism and class struggle; Arthur Schopenhauer and Friedrich Nietzsche dismantled teleological optimism, declaring the Primacy of the Will and the Death of God; the 20th century grappled with Sartrean freedom, Camusian absurdity, and Russell-Wittgenstein linguistic analysis.",
      axiom: isHi
        ? "‘वही बनो जो तुम वास्तव में हो।’ — फ्रेडरिक नीत्शे"
        : "‘Become who you are.’ — Friedrich Nietzsche",
      thinkers: [
        { name: "G.W.F. Hegel", id: "hegel", role: "Historical Dialectic & Absolute Spirit" },
        { name: "Arthur Schopenhauer", id: "schopenhauer", role: "World as Will & Representation" },
        { name: "Karl Marx", id: "marx", role: "Historical Materialism" },
        { name: "Friedrich Nietzsche", id: "nietzsche", role: "Will to Power & Revaluation" },
        { name: "Bertrand Russell", id: "russell", role: "Mathematical Logic & Analytic Philosophy" },
        { name: "Albert Camus", id: "camus", role: "Absurdism & Rebellion" },
      ],
    },
  ];

  // Five Cardinal Pillars (Taxonomy of Western Reason)
  const pillars: PillarData[] = [
    {
      code: "MET",
      num: "01",
      title: isHi ? "तत्वमीमांसा (Metaphysics & Ontology)" : "Metaphysics & Ontology",
      greekTerm: "τὰ μετὰ τὰ φυσικά • Ὄν (Being)",
      question: isHi
        ? "शून्य के स्थान पर कुछ अस्तित्वमान क्यों है? वास्तविकता का मूल स्वरूप क्या है?"
        : "Why is there something rather than nothing? What is the fundamental architecture of reality?",
      desc: isHi
        ? "यह भौतिक विज्ञान की सीमाओं से परे जाकर अस्तित्व (Being), द्रव्य (Substance), कारणत्व (Causality), समय, अवकाश और चेतना की अंतिम प्रकृति की परीक्षा करता है।"
        : "The foundational inquiry into reality beyond empirical appearance: substance, identity, time, modal possibility, mind-matter duality, and the ontological conditions under which anything can exist at all.",
      keyProblems: [
        isHi ? "द्रव्य एवं गुण (Substance vs. Accidents)" : "Substance vs. Properties",
        isHi ? "चेतना एवं भौतिक मन (Mind-Body Problem)" : "The Mind-Body Dualism",
        isHi ? "सार्वभौमिक सत्य बनाम नाममात्रवाद (Universals)" : "The Problem of Universals",
        isHi ? "नियतिवाद बनाम स्वतंत्र इच्छा (Free Will)" : "Determinism vs. Free Agency",
      ],
    },
    {
      code: "EPI",
      num: "02",
      title: isHi ? "ज्ञानमीमांसा (Epistemology)" : "Epistemology",
      greekTerm: "ἐπιστήμη (Knowledge) + λόγος (Account)",
      question: isHi
        ? "सच्चा ज्ञान क्या है, और हम किसी विश्वास को सत्य कैसे सिद्ध करते हैं?"
        : "What constitutes justified true belief, and how are the limits of human knowledge demarcated?",
      desc: isHi
        ? "सत्य, विश्वास और प्रमाण के मानकों की परीक्षा। तर्कवाद (विवेक द्वारा ज्ञान) और अनुभववाद (इंद्रियों द्वारा ज्ञान) के बीच का ऐतिहासिक विमर्श, तथा संशयवाद की सीमाएं।"
        : "The rigorous dissection of cognitive claims: sensory perception, methodological skepticism, inductive justification, and the boundary separating subjective opinion from verified objective truth.",
      keyProblems: [
        isHi ? "तर्कवाद बनाम अनुभववाद (Rationalism vs. Empiricism)" : "Rationalism vs. Empiricism",
        isHi ? "कार्तेशियन संशयवाद (Hyperbolic Doubt)" : "Methodological Skepticism",
        isHi ? "प्राक्-अनुभव बनाम अनुभवाश्रित (A Priori vs. A Posteriori)" : "A Priori vs. A Posteriori",
        isHi ? "गेटीयर समस्या (Gettier Justification Problem)" : "The Justification Crisis",
      ],
    },
    {
      code: "ETH",
      num: "03",
      title: isHi ? "नीतिशास्त्र (Ethics & Moral Philosophy)" : "Ethics & Moral Duty",
      greekTerm: "ἦθος (Character / Custom)",
      question: isHi
        ? "सद्गुणी जीवन क्या है, और हमारा दूसरों के प्रति सार्वभौमिक नैतिक कर्तव्य क्या है?"
        : "What is the Good, and by what universal standard ought human beings conduct their actions?",
      desc: isHi
        ? "मानव आचरण, शुभ-अशुभ और नैतिक मूल्यों की दार्शनिक परीक्षा। अरस्तू का सद्गुण नीतिशास्त्र, कांट का निरपेक्ष आदेश (Categorical Imperative), और मिल का अधिकतम सुख सिद्धांत।"
        : "The normative evaluation of human conduct, moral value, and duty. It spans Aristotelian eudaimonia (flourishing), Kantian deontological imperative, and Bentham-Mill utilitarian calculus.",
      keyProblems: [
        isHi ? "सद्गुण नीतिशास्त्र (Aristotelian Virtue)" : "Virtue Ethics (Eudaimonia)",
        isHi ? "कर्तव्यशास्त्र (Kantian Deontology)" : "Categorical Imperative (Duty)",
        isHi ? "उपयोगितावाद (Utilitarian Maximization)" : "Utilitarian Consequentialism",
        isHi ? "नीतिशास्त्रीय सापेक्षतावाद (Moral Nihilism vs. Realism)" : "Moral Relativism & Nihilism",
      ],
    },
    {
      code: "LOG",
      num: "04",
      title: isHi ? "तर्कशास्त्र व द्वंद्व (Logic & Dialectics)" : "Logic & Dialectics",
      greekTerm: "λογική (Art of Reason)",
      question: isHi
        ? "सही, सुसंगत और अकाट्य विचार कैसे निर्मित किए जाते हैं?"
        : "What governs valid inference, conceptual soundness, and rigorous dialectical synthesis?",
      desc: isHi
        ? "निगमन और आगमन तर्क, हेत्वाभासों (fallacies) की पहचान, और द्वंद्वात्मक संवाद का विज्ञान। यह दर्शन का मौलिक गणितीय औजार है जिसके द्वारा सभी दावों की परीक्षा होती है।"
        : "The formal calculus of sound thinking. From Aristotle’s syllogistic Organon to Frege and Russell’s symbolic logic, it provides the deductive scaffolding through which all philosophy is validated.",
      keyProblems: [
        isHi ? "अरस्तू का निगमन तर्क (Syllogistic Deduction)" : "Syllogistic Deduction",
        isHi ? "तार्किक विसंगतियां व हेत्वाभास (Formal & Informal Fallacies)" : "Logical Fallacies Identification",
        isHi ? "हेगेलियन द्वंद्व (Dialectical Triad)" : "Dialectical Movement",
        isHi ? "प्रतीकात्मक तर्कशास्त्र (Mathematical & Symbolic Logic)" : "Mathematical Propositional Logic",
      ],
    },
    {
      code: "POL",
      num: "05",
      title: isHi ? "राजनीतिक दर्शन (Political Philosophy)" : "Political Philosophy",
      greekTerm: "πολιτικά (Affairs of the Polis)",
      question: isHi
        ? "राज्य की संप्रभु सत्ता, न्याय और व्यक्तिगत स्वतंत्रता का वैध आधार क्या है?"
        : "What legitimates political authority, and how should justice, power, and freedom be structured?",
      desc: isHi
        ? "न्याय, संप्रभुता, कानून का शासन, प्राकृतिक अधिकार और सामाजिक अनुबंध (Social Contract) का विश्लेषण—प्लेटो के आदर्श दार्शनिक राजा से लेकर आधुनिक संवैधानिक लोकतंत्र तक।"
        : "The philosophical investigation of sovereign power, liberty, law, and human rights. It examines how autonomous individuals negotiate the Social Contract to erect just civic commonwealths.",
      keyProblems: [
        isHi ? "सामाजिक अनुबंध सिद्धांत (Hobbes, Locke, Rousseau)" : "The Social Contract Theory",
        isHi ? "राजनीतिक यथार्थवाद बनाम आदर्शवाद (Machiavellian Realism)" : "Machiavellian Realpolitik",
        isHi ? "वितरणात्मक न्याय (Rawlsian Justice as Fairness)" : "Distributive Justice & Rights",
        isHi ? "व्यक्तिगत स्वतंत्रता बनाम राज्य सत्ता (Liberty vs. Authority)" : "Individual Liberty vs. Authority",
      ],
    },
  ];

  // The Dialectical Instruments (Methods of Inquiry)
  const instruments: InstrumentData[] = [
    {
      id: "elenchus",
      name: isHi ? "सुकराती प्रश्नोत्तरी" : "The Socratic Elenchus",
      originalName: "ἔλεγχος (Elenchos)",
      origin: "Athens, c. 400 BCE",
      philosopher: "Socrates",
      philosopherId: "socrates",
      definition: isHi
        ? "सतही उत्तरों पर निरंतर तर्कपूर्ण प्रतिप्रश्न पूछकर विरोधी के मूल विश्वासों में छिपे अंतर्विरोधों को उजागर करना, ताकि वह अपनी अज्ञानता स्वीकार कर सच्चे ज्ञान की ओर अग्रसर हो।"
        : "A method of sustained cooperative interrogative dialogue. By systematically cross-examining foundational premises, it exposes latent inconsistencies in unexamined dogma, reducing assumptions to intellectual aporia (productive perplexity).",
      steps: [
        isHi ? "प्रारंभिक दावा (थीसिस)" : "Initial Proposition Offered",
        isHi ? "तार्किक प्रतिपरीक्षण (क्रॉस-एग्जामिनेशन)" : "Sustained Counter-Examination",
        isHi ? "आंतरिक अंतर्विरोध का प्रकटीकरण (Aporia)" : "Identification of Contradiction",
        isHi ? "शुद्धतर ज्ञान की खोज" : "Refinement of Definition",
      ],
      impact: isHi
        ? "नैतिक प्रश्नों पर पश्चिमी संवाद और आलोचनात्मक चिंतन की नींव।"
        : "The bedrock of Western critical inquiry, trial law, and pedagogical dialectic.",
    },
    {
      id: "cartesian-doubt",
      name: isHi ? "कार्तेशियन चरम संशय" : "Cartesian Methodological Doubt",
      originalName: "Dubito, ergo cogito",
      origin: "France / Holland, 1641",
      philosopher: "René Descartes",
      philosopherId: "descartes",
      definition: isHi
        ? "हर उस धारणा को जानबूझकर असत्य मान लेना जिस पर रत्ती भर भी संदेह संभव हो—इंद्रियों के भ्रम से लेकर गणितीय सिद्धांतों तक—ताकि कोई ऐसा अकाट्य सत्य मिले जो हर संशय से परे हो।"
        : "The deliberate hyperbolic dismantling of all prior beliefs that can sustain even the slightest theoretical uncertainty. By sweeping away deceptive sensory data, it uncovers the indubitable bedrock of conscious existence: the thinking self.",
      steps: [
        isHi ? "इंद्रिय-भ्रम का संशय (Sensory Deception)" : "Skepticism of Sensory Data",
        isHi ? "स्वप्न एवं दुष्ट दानव परिकल्पना (Evil Demon)" : "The Malicious Demon Hypothesis",
        isHi ? "हर संदेहास्पद विचार का उन्मूलन" : "Total Epistemic Stripping",
        isHi ? "अकाट्य सत्य की प्राप्ति: 'मैं सोचता हूँ, इसलिए मैं हूँ'" : "The Cogito: Indubitable Bedrock",
      ],
      impact: isHi
        ? "आधुनिक वैज्ञानिक पद्धति और ज्ञानमीमांसा का प्रारंभिक बिंदु।"
        : "Founded modern subjective rationalism and foundationalist epistemology.",
    },
    {
      id: "hegelian-dialectic",
      name: isHi ? "हेगेलियन द्वंद्वात्मक त्रयी" : "The Dialectical Triad",
      originalName: "Aufhebung (Sublation)",
      origin: "Jena & Berlin, 1807",
      philosopher: "G.W.F. Hegel",
      philosopherId: "hegel",
      definition: isHi
        ? "विचारों और ऐतिहासिक शक्तियों का द्वंद्वात्मक विकास: एक मूल विचार (वाद/Thesis) अपनी आंतरिक सीमाओं से एक विरोधी विचार (प्रतिवाद/Antithesis) को जन्म देता है, जिसका टकराव एक उच्चतर समन्वय (संवाद/Synthesis) में परिणत होता है।"
        : "The developmental movement of thought and historical reality. A proposition (Thesis) generates its internal contradiction (Antithesis); their dynamic tension resolves into an integrated, higher comprehension (Synthesis) that preserves the truth of both while transcending their limitations.",
      steps: [
        isHi ? "वाद (Thesis / मूल स्थिति)" : "Thesis: Initial Affirmation",
        isHi ? "प्रतिवाद (Antithesis / आंतरिक विरोध)" : "Antithesis: Necessary Negation",
        isHi ? "संवाद (Synthesis / Aufhebung)" : "Synthesis: Higher Integration",
        isHi ? "नया वाद (अनवरत ऐतिहासिक प्रवाह)" : "Genesis of the Next Dialectical Cycle",
      ],
      impact: isHi
        ? "इतिहास के दर्शन, मार्क्सवादी द्वंद्व, और समाजशास्त्रीय विकास की रीढ़।"
        : "Supplied the engine for 19th-century philosophy of history and political economy.",
    },
    {
      id: "ockhams-razor",
      name: isHi ? "ओकम का उस्तरा (मितव्ययिता का नियम)" : "Principle of Parsimony (Ockham's Razor)",
      originalName: "Lex Parsimoniae",
      origin: "Oxford & Munich, c. 1320",
      philosopher: "William of Ockham",
      definition: isHi
        ? "जब किसी परिघटना की व्याख्या करने के लिए एक से अधिक सिद्धांत उपलब्ध हों, तो बिना पर्याप्त प्रमाण के अतिरिक्त तत्वों या पूर्वधारणाओं की कल्पना नहीं करनी चाहिए। सबसे सरल व्याख्या ही श्रेष्ठ है।"
        : "The methodological heuristic dictating that among competing hypotheses explaining the same phenomenon, the model requiring the fewest unwarranted assumptions is to be preferred. Redundant explanatory entities must be surgically excised.",
      steps: [
        isHi ? "परिघटना का निरीक्षण" : "Empirical Observation of Phenomenon",
        isHi ? "प्रतिद्वंद्वी परिकल्पनाओं की तुलना" : "Comparison of Competing Explanations",
        isHi ? "अनावश्यक धारणाओं का विखंडन" : "Excising Redundant Postulates",
        isHi ? "न्यूनतम एवं पुष्ट सिद्धांत का चयन" : "Adoption of Most Parsimonious Model",
      ],
      impact: isHi
        ? "आधुनिक वैज्ञानिक पद्धति, गणितीय प्रमाण और विश्लेषणात्मक दर्शन का स्वर्ण नियम।"
        : "Standard methodological pillar of theoretical physics, statistics, and logic.",
    },
  ];

  // Immortal Maxims & Axioms
  const maxims: MaximData[] = [
    {
      original: "Γνῶθι Σεαυτόν",
      transliteration: "Gnōthi Seauton",
      translation: isHi ? "स्वयं को जानो।" : "Know Thyself.",
      language: "Classical Greek",
      author: "Socrates / Temple of Delphi",
      authorId: "socrates",
      date: "c. 500 BCE",
      context: isHi
        ? "डेल्फी के अपोलो मंदिर पर अंकित यह सूत्र सुकराती दर्शन का केंद्र बिंदु बना—बाहरी जगत् को जानने से पहले अपने आंतरिक मन, अज्ञान और सीमाओं की पहचान अनिवार्य है।"
        : "Inscribed upon the Temple of Apollo at Delphi, this precept became Socrates' moral imperative: all authentic wisdom originates in discerning one's own ignorance and inner nature.",
    },
    {
      original: "Cogito, Ergo Sum",
      transliteration: "Cogito, Ergo Sum",
      translation: isHi ? "मैं सोचता हूँ, इसलिए मैं हूँ।" : "I think, therefore I am.",
      language: "Latin",
      author: "René Descartes",
      authorId: "descartes",
      date: "1637 / 1641 CE",
      context: isHi
        ? "देकार्त का प्रथम अकाट्य सत्य: यदि मैं किसी बात पर संदेह कर रहा हूँ, तो यह संदेह स्वयं सिद्ध करता है कि एक सोचने वाला मन अवश्य अस्तित्वमान है।"
        : "The Archimedean point of Modern Epistemology. Even if an evil demon deceives every sensation, the very act of doubting inescapably confirms the presence of a doubting mind.",
    },
    {
      original: "Sapere Aude",
      transliteration: "Sapere Aude",
      translation: isHi
        ? "अपनी बुद्धि का उपयोग करने का साहस करो।"
        : "Dare to know; have courage to use your own understanding.",
      language: "Latin",
      author: "Horace / Immanuel Kant",
      authorId: "kant",
      date: "1784 CE",
      context: isHi
        ? "कांट ने प्रबोधन (Enlightenment) को परिभाषित करते हुए इसे उसका आदर्श वाक्य बनाया: पराई बौद्धिक निर्भरता त्यागकर स्वतंत्र विवेक से सोचने का साहस जुटाना।"
        : "Chosen by Kant as the supreme motto of the Enlightenment (Aufklärung)—emancipation from self-incurred immaturity by wielding reason without dogmatic external guidance.",
    },
    {
      original: "Amor Fati",
      transliteration: "Amor Fati",
      translation: isHi
        ? "अपनी नियति से प्रेम करो; हर क्षण को अंगीकार करो।"
        : "Love of fate; embrace necessity with joyful defiance.",
      language: "Latin",
      author: "Friedrich Nietzsche",
      authorId: "nietzsche",
      date: "1882 CE",
      context: isHi
        ? "नीत्शे का सर्वोच्च दार्शनिक संकल्प: जीवन के कष्टों, असफलताओं और अनिवार्यता को केवल सहन न करना, बल्कि उसे अपने आत्म-विकास का आवश्यक अंग मानकर प्रेम करना।"
        : "Nietzsche’s formula for human greatness: that one wants nothing to be different, neither backward nor forward, not for all eternity. Not merely enduring pain, but loving it.",
    },
    {
      original: "Tabula Rasa",
      transliteration: "Tabula Rasa",
      translation: isHi
        ? "कोरी पट्टिका (मस्तिष्क जन्म के समय खाली स्लेट होता है)।"
        : "A blank slate (the human mind free of innate concepts at birth).",
      language: "Latin",
      author: "John Locke",
      date: "1689 CE",
      context: isHi
        ? "ब्रिटिश अनुभववाद का आधार: मनुष्य के मन में जन्मजात विचार नहीं होते; हमारा सारा ज्ञान केवल संवेदी अनुभव और आत्म-चिंतन से लिखा जाता है।"
        : "The foundation of British Empiricism: countering Platonic and Cartesian innate ideas by positing that all knowledge, reason, and moral sentiments derive solely from experiential impression.",
    },
    {
      original: "Πάντα ῥεῖ",
      transliteration: "Panta Rhei",
      translation: isHi
        ? "सब कुछ निरंतर प्रवाहमान है; कुछ भी स्थिर नहीं।"
        : "Everything flows; nothing remains identical or stationary.",
      language: "Ancient Greek",
      author: "Heraclitus of Ephesus",
      date: "c. 500 BCE",
      context: isHi
        ? "द्वंद्वात्मक तत्वमीमांसा का मूल: संसार कोई स्थिर वस्तु नहीं बल्कि निरंतर परिवर्तन की प्रक्रिया है। 'आप एक ही नदी में दो बार पैर नहीं रख सकते।'"
        : "The cosmological axiom that dynamic strife and flux are the fundamental conditions of being. Stability is an illusion; the universe is an eternal, living, self-consuming flame.",
    },
  ];

  // The 14 Canonical Thinkers with routes to their dossiers
  const thinkersCatalog = [
    { id: "socrates", name: "Socrates", dates: "470 – 399 BCE", era: "Classical Antiquity", school: "Virtue Ethics & Elenchus" },
    { id: "plato", name: "Plato", dates: "428 – 348 BCE", era: "Classical Antiquity", school: "Theory of Forms & Ideal State" },
    { id: "aristotle", name: "Aristotle", dates: "384 – 322 BCE", era: "Classical Antiquity", school: "Classical Logic & Teleology" },
    { id: "machiavelli", name: "Nicolò Machiavelli", dates: "1469 – 1527 CE", era: "Renaissance", school: "Political Realism & Virtù" },
    { id: "descartes", name: "René Descartes", dates: "1596 – 1650 CE", era: "Early Modernity", school: "Rationalism & Cartesian Doubt" },
    { id: "spinoza", name: "Baruch Spinoza", dates: "1632 – 1677 CE", era: "Early Modernity", school: "Substance Monism & Pantheism" },
    { id: "hume", name: "David Hume", dates: "1711 – 1776 CE", era: "Enlightenment", school: "Radical Empiricism & Skepticism" },
    { id: "kant", name: "Immanuel Kant", dates: "1724 – 1804 CE", era: "Enlightenment", school: "Critical Philosophy & Deontology" },
    { id: "hegel", name: "G.W.F. Hegel", dates: "1770 – 1831 CE", era: "German Idealism", school: "Absolute Spirit & Historicism" },
    { id: "schopenhauer", name: "Arthur Schopenhauer", dates: "1788 – 1860 CE", era: "19th Century", school: "World as Will & Pessimism" },
    { id: "marx", name: "Karl Marx", dates: "1818 – 1883 CE", era: "19th Century", school: "Historical Materialism" },
    { id: "nietzsche", name: "Friedrich Nietzsche", dates: "1844 – 1900 CE", era: "19th Century", school: "Perspectivism & Übermensch" },
    { id: "russell", name: "Bertrand Russell", dates: "1872 – 1970 CE", era: "20th Century", school: "Analytic Philosophy & Logic" },
    { id: "camus", name: "Albert Camus", dates: "1913 – 1960 CE", era: "20th Century", school: "Absurdism & Heroic Defiance" },
  ];

  // Encyclopedic Glossary Terms
  const glossaryTerms = [
    {
      term: "Logos (λόγος)",
      trans: isHi ? "विवेक, तार्किक नियम या सार्वभौमिक बौद्धिक व्यवस्था" : "Reason, Discourse & Cosmic Law",
      desc: isHi
        ? "प्राचीन यूनानी दर्शन में मिथक (Mythos) के विपरीत तर्कसंगत, व्यवस्थित विचार और ब्रह्मांडीय संतुलन का सिद्धांत।"
        : "The rational principle governing the universe; reasoned discourse that replaces myth with verifiable argument.",
    },
    {
      term: "Arche (ἀρχή)",
      trans: isHi ? "प्रथम कारण या ब्रह्मांड का मूल तत्व" : "First Principle / Primordial Origin",
      desc: isHi
        ? "पूर्व-सुकराती विचारकों द्वारा खोजी गई वह मौलिक सत्ता जिससे संपूर्ण विश्व उत्पन्न हुआ (जैसे थेल्स का जल, या हेराक्लिटस की अग्नि)।"
        : "The originating source and underlying substance of all physical reality sought by the early Ionian naturalists.",
    },
    {
      term: "Aporia (ἀπορία)",
      trans: isHi ? "दार्शनिक असमंजस या तार्किक गतिरोध" : "Impasse, Perplexity & Productive Puzzle",
      desc: isHi
        ? "सुकराती संवाद में वह क्षण जब पूर्वाग्रह टूट जाते हैं और व्यक्ति अपनी अज्ञानता स्वीकार कर सच्ची जिज्ञासा में प्रवेश करता है।"
        : "The state of intellectual disorientation achieved when existing definitions contradict themselves, marking the birth of true philosophical inquiry.",
    },
    {
      term: "Eudaimonia (εὐδαιμονία)",
      trans: isHi ? "मानवीय उत्कर्ष या सर्वोच्च आनंद" : "Flourishing, Fulfillment & Highest Good",
      desc: isHi
        ? "अरस्तू के नीतिशास्त्र में सद्गुणी जीवन जीने से प्राप्त होने वाला समग्र मानव कल्याण—यह मात्र क्षणिक सुख नहीं बल्कि चरित्र का पूर्ण विकास है।"
        : "Aristotle’s ultimate human end (telos): the realization of one’s rational potential through active virtue across a complete lifetime.",
    },
    {
      term: "A Priori / A Posteriori",
      trans: isHi ? "अनुभव-पूर्व बनाम अनुभवाश्रित ज्ञान" : "Prior to Experience vs. Derived from Senses",
      desc: isHi
        ? "कांट के दर्शन में गणित और शुद्ध तर्क 'ए प्रायरी' (अनुभव से स्वतंत्र) हैं, जबकि वैज्ञानिक परीक्षण 'ए पोस्टीरियोरी' (इंद्रिय-अनुभव पर आधारित) हैं।"
        : "Epistemic distinction: propositions knowable independently of sensory input versus those verified strictly through observation.",
    },
    {
      term: "Categorical Imperative",
      trans: isHi ? "कांट का निरपेक्ष नैतिक आदेश" : "Unconditional Moral Duty",
      desc: isHi
        ? "वह नैतिक नियम जो बिना किसी शर्त के हर विवेकशील प्राणी पर लागू होता है: 'केवल उसी नियम के अनुसार कार्य करो जिसे तुम सार्वभौमिक नियम बना सको।'"
        : "Kant’s supreme moral principle requiring individuals to act only according to maxims they could rationally will to become universal laws.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-black text-neutral-100 selection:bg-neutral-200 selection:text-black">
      {/* Dynamic Top Reading Progress Indicator */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-white z-[9999] transition-[width] duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Global Navbar */}
      <Navbar onOpenDailyWisdom={() => setDailyWisdomOpen(true)} />

      {/* Academic Meta Header Bar */}
      <header className="pt-28 pb-4 border-b border-neutral-900 bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono tracking-widest text-neutral-400">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 uppercase text-neutral-300 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>{isHi ? "अकादमी मुख्य पृष्ठ" : "Academy Index"}</span>
            </Link>
            <span className="text-neutral-700">/</span>
            <span className="text-neutral-400 uppercase">
              {isHi ? "पाश्चात्य दर्शन संदर्भ ग्रंथ" : "Compendium • Treatises"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <span>{isHi ? "अनुमानित पठन: 8 मिनट" : "~8 min reading time"}</span>
            </span>
            <span className="text-neutral-700">•</span>
            <span className="text-neutral-400">EST. 600 BCE</span>
            <span className="text-neutral-700">•</span>
            <span className="text-neutral-400 uppercase">
              {isHi ? "द्विभाषी संस्करण" : "Peer Curated"}
            </span>
          </div>
        </div>
      </header>

      {/* Quick-Jump Section Anchor Bar (Wikipedia Sticky Contents) */}
      <nav
        aria-label="Table of contents"
        className="sticky top-0 z-40 w-full border-b border-neutral-900 bg-black/90 backdrop-blur-md transition-all py-3 px-6 sm:px-10 lg:px-12"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar text-xs font-mono uppercase tracking-wider">
          <div className="flex items-center gap-1.5 text-neutral-500 shrink-0">
            <ScrollText className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-400 font-semibold">
              {isHi ? "अनुक्रमणिका:" : "Contents:"}
            </span>
          </div>

          <div className="flex items-center gap-6 shrink-0 text-neutral-400">
            <a
              href="#overview"
              className={`hover:text-white transition-colors ${
                activeSection === "overview"
                  ? "text-white underline underline-offset-8 decoration-white font-medium"
                  : ""
              }`}
            >
              § 01 {isHi ? "अवधारणा" : "Overview"}
            </a>
            <a
              href="#epochs"
              className={`hover:text-white transition-colors ${
                activeSection === "epochs"
                  ? "text-white underline underline-offset-8 decoration-white font-medium"
                  : ""
              }`}
            >
              § 02 {isHi ? "चार ऐतिहासिक युग" : "Four Epochs"}
            </a>
            <a
              href="#branches"
              className={`hover:text-white transition-colors ${
                activeSection === "branches"
                  ? "text-white underline underline-offset-8 decoration-white font-medium"
                  : ""
              }`}
            >
              § 03 {isHi ? "ज्ञान की 5 शाखाएं" : "Taxonomy of Reason"}
            </a>
            <a
              href="#instruments"
              className={`hover:text-white transition-colors ${
                activeSection === "instruments"
                  ? "text-white underline underline-offset-8 decoration-white font-medium"
                  : ""
              }`}
            >
              § 04 {isHi ? "चिंतन पद्धतियां" : "Methods"}
            </a>
            <a
              href="#maxims"
              className={`hover:text-white transition-colors ${
                activeSection === "maxims"
                  ? "text-white underline underline-offset-8 decoration-white font-medium"
                  : ""
              }`}
            >
              § 05 {isHi ? "शाश्वत सूत्र" : "Maxims"}
            </a>
            <a
              href="#thinkers"
              className={`hover:text-white transition-colors ${
                activeSection === "thinkers"
                  ? "text-white underline underline-offset-8 decoration-white font-medium"
                  : ""
              }`}
            >
              § 06 {isHi ? "14 दार्शनिक" : "14 Thinkers"}
            </a>
            <a
              href="#glossary"
              className={`hover:text-white transition-colors ${
                activeSection === "glossary"
                  ? "text-white underline underline-offset-8 decoration-white font-medium"
                  : ""
              }`}
            >
              § 07 {isHi ? "शब्दावली" : "Glossary"}
            </a>
          </div>
        </div>
      </nav>

      {/* Main Encyclopedic Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12 lg:py-20">
        {/* ========================================================
            SECTION 01: HERO & ENCYCLOPEDIC DOSSIER
           ======================================================== */}
        <section id="overview" className="scroll-mt-20 pb-20 border-b border-neutral-900">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left 7 Columns: Core Monograph Essay */}
            <article className="lg:col-span-8 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>
                    {t.aboutPage?.tag || "THE TRADITION OF FREE INQUIRY • 2,500 YEARS OF THOUGHT"}
                  </span>
                </div>

                <h1 className="font-serif-classic text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-[0.06em] text-white leading-[1.05] uppercase">
                  {t.aboutPage?.title || "WHAT IS WESTERN PHILOSOPHY?"}
                </h1>

                <p className="text-xs font-mono text-neutral-400 tracking-widest uppercase">
                  Philosophia Occidentalis • Φιλοσοφία • The Systematic Pursuit of Truth
                </p>
              </div>

              {/* Literary Lead Paragraph with Classical Styling */}
              <div className="space-y-6 pt-4 text-neutral-200">
                <p className="font-garamond text-xl sm:text-2xl text-neutral-200 leading-relaxed font-light">
                  <span className="float-left text-5xl sm:text-6xl font-serif-classic text-white pr-3 pt-1 leading-none font-bold">
                    W
                  </span>
                  {t.aboutPage?.subtitle ||
                    "Western philosophy began not as an academic dogma, but as humanity’s daring transition from myth to reason. It is the systematic pursuit of truth through critical questioning, logical rigor, and unrelenting skepticism."}
                </p>

                <p className="font-garamond text-lg sm:text-xl text-neutral-300 leading-relaxed font-light">
                  {isHi
                    ? "एथेंस के सार्वजनिक बाजारों से लेकर आधुनिक यूरोपीय विश्वविद्यालयों तक, पश्चिमी दर्शन ने कभी किसी विचार को केवल इसलिए स्वीकार नहीं किया कि वह परंपरा या सत्ता द्वारा समर्थित था। प्रत्येक विचार को निष्पक्ष संवाद, अनुभवजन्य प्रमाण और तार्किक संगति की कसौटी पर परखा जाना अनिवार्य माना गया। यह संशयवाद केवल विनाशकारी नहीं था; यह निश्चितता की खोज में एक बौद्धिक शुद्धि थी।"
                    : "Unlike mythological traditions that explained cosmic phenomena through divine caprice, the Western philosophical lineage originated with a bold metaphysical premise: the universe is inherently rational, intelligible, and governed by underlying principles (Logos) accessible to the disciplined human mind. It demands that assertions survive relentless cross-examination before earning the title of knowledge."}
                </p>

                <blockquote className="my-8 pl-6 border-l-2 border-white py-2 space-y-2">
                  <p className="font-serif-classic text-lg sm:text-xl text-white italic tracking-wide">
                    {t.aboutPage?.leadQuote || "“The unexamined life is not worth living.”"}
                  </p>
                  <cite className="block text-xs font-mono uppercase tracking-widest text-neutral-400 not-italic">
                    {t.aboutPage?.leadQuoteAuthor || "— Socrates (470 – 399 BCE)"}
                  </cite>
                </blockquote>

                <div className="space-y-4 pt-4">
                  <h3 className="font-serif-classic text-lg font-bold uppercase tracking-wider text-white">
                    {isHi ? "व्युत्पत्ति एवं दार्शनिक आधार" : "Etymology & The Axiomatic Triad"}
                  </h3>
                  <p className="font-garamond text-lg text-neutral-300 leading-relaxed font-light">
                    {isHi
                      ? "शब्द 'दर्शन' के यूनानी मूल 'फ़िलोस' (φίλος - प्रेम या अनुराग) और 'सोफ़िया' (σοφία - विवेक या गहन ज्ञान) से मिलकर बना है। इसका शाब्दिक अर्थ है 'ज्ञान के प्रति अगाध प्रेम'। पाइथागोरस ने सर्वप्रथम स्वयं को 'सोफ़ोस' (ज्ञानी) कहने के स्थान पर विनम्रतापूर्वक 'फ़िलोसोफ़ोस' (ज्ञान का प्रेमी) कहा।"
                      : "The word philosophy derives from the Ancient Greek compound philosophia (φιλοσοφία)—from phílos (φίλος, beloved or dear) and sophía (σοφία, wisdom). Traditionally attributed to Pythagoras, the title was an act of intellectual humility: humans cannot possess absolute wisdom, but they can dedicate their lives to its perpetual pursuit."}
                  </p>
                </div>
              </div>
            </article>

            {/* Right 4 Columns: The Next-Gen Encyclopedic Dossier (Infobox) */}
            <aside className="lg:col-span-4 sticky top-20 border-t lg:border-t-0 lg:border-l border-neutral-900 lg:pl-10 pt-8 lg:pt-0">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
                  <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 font-semibold">
                    {isHi ? "दार्शनिक सार-संक्षेप" : "Encyclopedia Dossier"}
                  </span>
                  <span className="text-xs font-mono text-neutral-400">REF: Φ-600BCE</span>
                </div>

                <div className="space-y-1">
                  <h2 className="font-serif-classic text-2xl font-bold uppercase tracking-wide text-white">
                    {isHi ? "पाश्चात्य दर्शन" : "Western Philosophy"}
                  </h2>
                  <p className="font-garamond italic text-sm text-neutral-400">
                    Traditio Philosophica Occidentalis
                  </p>
                </div>

                {/* Minimalist Data Rows (No Heavy Box, Pure Hairline Editorial Structure) */}
                <dl className="divide-y divide-neutral-900 text-xs font-mono">
                  <div className="py-3 flex justify-between gap-4">
                    <dt className="text-neutral-400 uppercase tracking-wider">
                      {isHi ? "ऐतिहासिक उद्गम" : "Historical Origin"}
                    </dt>
                    <dd className="text-neutral-200 text-right">
                      {isHi ? "आयोनिआ एवं एथेंस (लगभग 600 ईसा पूर्व)" : "Miletus & Athens, c. 600 BCE"}
                    </dd>
                  </div>

                  <div className="py-3 flex justify-between gap-4">
                    <dt className="text-neutral-400 uppercase tracking-wider">
                      {isHi ? "प्रथम दार्शनिक" : "First Thinker"}
                    </dt>
                    <dd className="text-neutral-200 text-right">
                      {isHi ? "थेल्स ऑफ मिलेटस (Thales)" : "Thales of Miletus"}
                    </dd>
                  </div>

                  <div className="py-3 flex justify-between gap-4">
                    <dt className="text-neutral-400 uppercase tracking-wider">
                      {isHi ? "मुख्य कालखंड" : "Eras"}
                    </dt>
                    <dd className="text-neutral-200 text-right">
                      Antiquity • Scholasticism • Enlightenment • Modernity
                    </dd>
                  </div>

                  <div className="py-3 flex justify-between gap-4">
                    <dt className="text-neutral-400 uppercase tracking-wider">
                      {isHi ? "मूल भाषाएं" : "Canonical Tongues"}
                    </dt>
                    <dd className="text-neutral-200 text-right">
                      Greek • Latin • French • German • English
                    </dd>
                  </div>

                  <div className="py-3 flex justify-between gap-4">
                    <dt className="text-neutral-400 uppercase tracking-wider">
                      {isHi ? "प्रमुख शाखाएं" : "Branches"}
                    </dt>
                    <dd className="text-neutral-200 text-right">
                      Metaphysics, Epistemology, Ethics, Logic, Politics
                    </dd>
                  </div>

                  <div className="py-3 flex justify-between gap-4">
                    <dt className="text-neutral-400 uppercase tracking-wider">
                      {isHi ? "प्राथमिक पद्धति" : "Core Methods"}
                    </dt>
                    <dd className="text-neutral-200 text-right">
                      Socratic Elenchus • Dialectic • Cartesian Doubt
                    </dd>
                  </div>

                  <div className="py-3 flex justify-between gap-4">
                    <dt className="text-neutral-400 uppercase tracking-wider">
                      {isHi ? "अकादमी संग्रह" : "Academy Catalog"}
                    </dt>
                    <dd className="text-neutral-200 text-right">
                      <Link
                        href="/#courses"
                        className="text-white underline hover:text-neutral-300 transition-colors"
                      >
                        {isHi ? "14 पूर्ण दार्शनिक पाठ्यक्रम" : "14 Master Dossiers →"}
                      </Link>
                    </dd>
                  </div>
                </dl>

                {/* Micro Action Buttons */}
                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    onClick={() => setDailyWisdomOpen(true)}
                    className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-neutral-800 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isHi ? "आज का दैनिक सुविचार खोलें" : "Consult Daily Aphorism"}</span>
                  </button>

                  <Link
                    href="/#courses"
                    className="w-full py-2.5 px-4 bg-white hover:bg-neutral-200 text-black font-serif-classic text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>{isHi ? "14 दार्शनिक देखें" : "Explore The 14 Thinkers"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* ========================================================
            SECTION 02: THE FOUR HISTORICAL EPOCHS (Timeline Stream)
           ======================================================== */}
        <section id="epochs" className="scroll-mt-20 py-20 border-b border-neutral-900">
          <div className="space-y-16">
            {/* Section Heading */}
            <div className="space-y-3 pb-8 border-b border-neutral-900">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-neutral-400 tracking-widest font-bold">
                  § 02
                </span>
                <span className="text-neutral-700">•</span>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
                  {t.aboutPage?.epochsBadge || "CHRONOLOGICAL REVOLUTION"}
                </span>
              </div>
              <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.08em] text-white uppercase">
                {t.aboutPage?.epochsTitle || "THE FOUR GREAT EPOCHS"}
              </h2>
              <p className="font-garamond text-lg text-neutral-400 italic">
                {isHi
                  ? "2,500 वर्षों का बौद्धिक संघर्ष: मिथक से लेकर आधुनिक अस्तित्व संकट तक"
                  : "A continuous 2,500-year dialectical trajectory from mythological dawn to existential deconstruction."}
              </p>
            </div>

            {/* Continuous Editorial Lineage (No Square Cards!) */}
            <div className="space-y-16 lg:space-y-24">
              {epochs.map((epoch, idx) => (
                <div
                  key={epoch.num}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start relative group"
                >
                  {/* Left Column: Epoch Index & Period */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="flex items-baseline gap-3">
                      <span className="font-serif-classic text-4xl sm:text-5xl font-bold text-neutral-400 group-hover:text-white transition-colors">
                        {epoch.roman}
                      </span>
                      <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
                        Epoch {epoch.num}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-serif-classic text-xl sm:text-2xl font-bold text-white uppercase tracking-wide leading-snug">
                        {epoch.title}
                      </h3>
                      <p className="font-mono text-xs text-neutral-400 tracking-wider">
                        {epoch.period}
                      </p>
                    </div>

                    {/* Thinkers List with Wikipedia-style Wikilinks */}
                    <div className="pt-3 border-t border-neutral-900 space-y-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
                        {isHi ? "प्रमुख दार्शनिक एवं प्रभाव:" : "Key Figures in this Era:"}
                      </span>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {epoch.thinkers.map((thinker) => (
                          <span key={thinker.name} className="inline-flex items-center">
                            {thinker.id ? (
                              <Link
                                href={`/course/${thinker.id}`}
                                className="text-xs font-mono text-neutral-300 hover:text-white underline underline-offset-4 decoration-neutral-700 hover:decoration-white transition-colors inline-flex items-center gap-1 group/link"
                                title={`Open ${thinker.name} Monograph Dossier`}
                              >
                                <span>{thinker.name}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/link:opacity-100" />
                              </Link>
                            ) : (
                              <span className="text-xs font-mono text-neutral-400">
                                {thinker.name}
                              </span>
                            )}
                            <span className="text-neutral-800 mx-1.5 last:hidden">•</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: In-depth Narrative & Axiom Pullquote */}
                  <div className="lg:col-span-8 space-y-6 lg:border-l lg:border-neutral-900 lg:pl-12">
                    <p className="font-garamond text-lg sm:text-xl text-neutral-200 leading-relaxed font-light">
                      {epoch.focus}
                    </p>

                    <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Quote className="w-4 h-4 text-neutral-400 shrink-0 mt-1" />
                        <blockquote className="font-serif-classic text-sm sm:text-base text-neutral-200 italic">
                          {epoch.axiom}
                        </blockquote>
                      </div>

                      <button
                        onClick={() => handleCopyMaxim(epoch.axiom, `epoch-${idx}`)}
                        className="text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                        title="Copy axiom"
                      >
                        {copiedMaxim === `epoch-${idx}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3 h-3" />
                            <span>Copy Axiom</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 03: TAXONOMY OF REASON (Five Cardinal Branches)
           ======================================================== */}
        <section id="branches" className="scroll-mt-20 py-20 border-b border-neutral-900">
          <div className="space-y-16">
            {/* Section Header */}
            <div className="space-y-3 pb-8 border-b border-neutral-900">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-neutral-400 tracking-widest font-bold">
                  § 03
                </span>
                <span className="text-neutral-700">•</span>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
                  {t.aboutPage?.branchesBadge || "TAXONOMY OF REASON"}
                </span>
              </div>
              <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.08em] text-white uppercase">
                {t.aboutPage?.branchesTitle || "THE FIVE CARDINAL BRANCHES"}
              </h2>
              <p className="font-garamond text-lg text-neutral-400 italic">
                {isHi
                  ? "ज्ञान, अस्तित्व और कर्म का वर्गीकरण: दार्शनिक चिंतन के पांच आधार स्तंभ"
                  : "The systemic architecture through which philosophical reason organizes the universe."}
              </p>
            </div>

            {/* Encyclopedic Definition Ledger (No generic square cards) */}
            <div className="divide-y divide-neutral-900">
              {pillars.map((pillar) => (
                <article
                  key={pillar.code}
                  className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start group hover:bg-neutral-950/40 transition-colors px-2 sm:px-4"
                >
                  {/* Badge & Title */}
                  <div className="lg:col-span-4 space-y-2">
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="border border-neutral-800 px-2 py-0.5 text-neutral-300 font-semibold tracking-widest">
                        [{pillar.code}]
                      </span>
                      <span className="text-neutral-400">BRANCH {pillar.num}</span>
                    </div>

                    <h3 className="font-serif-classic text-2xl font-bold text-white uppercase tracking-wide">
                      {pillar.title}
                    </h3>

                    <p className="font-mono text-xs text-neutral-400 tracking-wide">
                      {pillar.greekTerm}
                    </p>
                  </div>

                  {/* Core Dialectical Problem & Sub-Fields */}
                  <div className="lg:col-span-8 space-y-4">
                    <p className="font-garamond text-xl sm:text-2xl text-neutral-100 italic leading-snug">
                      &ldquo;{pillar.question}&rdquo;
                    </p>

                    <p className="font-garamond text-base sm:text-lg text-neutral-300 leading-relaxed font-light">
                      {pillar.desc}
                    </p>

                    {/* Sub-discipline / Key Problem Badges */}
                    <div className="pt-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-2 font-semibold">
                        {isHi ? "प्रमुख विवाद एवं प्रश्न:" : "Foundational Inquiries:"}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {pillar.keyProblems.map((prob) => (
                          <span
                            key={prob}
                            className="px-2.5 py-1 text-xs font-mono text-neutral-300 bg-neutral-950 border border-neutral-900"
                          >
                            {prob}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 04: DIALECTICAL INSTRUMENTS (Methods of Inquiry)
           ======================================================== */}
        <section id="instruments" className="scroll-mt-20 py-20 border-b border-neutral-900">
          <div className="space-y-16">
            {/* Section Header */}
            <div className="space-y-3 pb-8 border-b border-neutral-900">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-neutral-400 tracking-widest font-bold">
                  § 04
                </span>
                <span className="text-neutral-700">•</span>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
                  {t.aboutPage?.methodsBadge || "HOW PHILOSOPHY THINKS"}
                </span>
              </div>
              <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.08em] text-white uppercase">
                {t.aboutPage?.methodsTitle || "THE DIALECTICAL INSTRUMENTS"}
              </h2>
              <p className="font-garamond text-lg text-neutral-400 italic">
                {isHi
                  ? "विचार करने की कला: चार ऐतिहासिक पद्धतियां जिन्होंने अंधविश्वास को तर्क में बदला"
                  : "The procedural engines of Western skepticism, verification, and conceptual evolution."}
              </p>
            </div>

            {/* Editorial Method Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              {instruments.map((inst, idx) => (
                <div
                  key={inst.id}
                  className="space-y-6 pb-8 border-b border-neutral-900 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                      <span className="uppercase tracking-widest font-semibold">
                        INSTRUMENT 0{idx + 1}
                      </span>
                      <span>{inst.origin}</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-serif-classic text-2xl font-bold text-white uppercase tracking-wide">
                        {inst.name}
                      </h3>
                      <p className="font-mono text-xs text-neutral-400 italic">
                        {inst.originalName} • Associated with{" "}
                        {inst.philosopherId ? (
                          <Link
                            href={`/course/${inst.philosopherId}`}
                            className="text-neutral-300 underline underline-offset-4 hover:text-white"
                          >
                            {inst.philosopher}
                          </Link>
                        ) : (
                          inst.philosopher
                        )}
                      </p>
                    </div>

                    <p className="font-garamond text-base sm:text-lg text-neutral-300 leading-relaxed font-light">
                      {inst.definition}
                    </p>

                    {/* Step-by-Step Dialectical Movement */}
                    <div className="pt-2 space-y-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
                        {isHi ? "चिंतन की प्रक्रिया:" : "Dialectical Movement:"}
                      </span>
                      <ol className="space-y-1.5 text-xs font-mono text-neutral-300">
                        {inst.steps.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2.5">
                            <span className="text-neutral-400">0{sIdx + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-900 text-xs font-mono text-neutral-400 flex items-center justify-between">
                    <span>{inst.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 05: IMMORTAL MAXIMS & AXIOMS OF MIND
           ======================================================== */}
        <section id="maxims" className="scroll-mt-20 py-20 border-b border-neutral-900">
          <div className="space-y-16">
            {/* Section Header */}
            <div className="space-y-3 pb-8 border-b border-neutral-900">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-neutral-400 tracking-widest font-bold">
                  § 05
                </span>
                <span className="text-neutral-700">•</span>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
                  {t.aboutPage?.axiomsBadge || "TIMELESS PRINCIPLES"}
                </span>
              </div>
              <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.08em] text-white uppercase">
                {t.aboutPage?.axiomsTitle || "FOUNDATIONAL AXIOMS & MAXIMS"}
              </h2>
              <p className="font-garamond text-lg text-neutral-400 italic">
                {isHi
                  ? "शाश्वत दार्शनिक सूत्र: यूनानी एवं लैटिन भाषा के अमर सिद्धांत जिन्होंने सभ्यता को दिशा दी"
                  : "Canonical Greek & Latin maxims encoding humanity’s most profound breakthroughs."}
              </p>
            </div>

            {/* Archival Maxims Ledger */}
            <div className="divide-y divide-neutral-900">
              {maxims.map((maxim, idx) => (
                <div
                  key={idx}
                  className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-neutral-950/30 transition-colors px-2"
                >
                  <div className="lg:col-span-5 space-y-2">
                    <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
                      <span>AXIOM 0{idx + 1}</span>
                      <span>•</span>
                      <span>{maxim.language}</span>
                    </div>

                    <h3 className="font-serif-classic text-2xl sm:text-3xl font-bold text-white tracking-wide">
                      {maxim.original}
                    </h3>

                    <p className="font-mono text-xs text-neutral-400 italic">
                      [{maxim.transliteration}]
                    </p>

                    <p className="font-garamond text-lg text-neutral-200 font-medium italic pt-1">
                      &ldquo;{maxim.translation}&rdquo;
                    </p>
                  </div>

                  <div className="lg:col-span-7 space-y-4 lg:border-l lg:border-neutral-900 lg:pl-8 flex flex-col justify-between h-full">
                    <p className="font-garamond text-base sm:text-lg text-neutral-300 leading-relaxed font-light">
                      {maxim.context}
                    </p>

                    <div className="pt-3 border-t border-neutral-900 flex items-center justify-between text-xs font-mono">
                      <div className="text-neutral-400">
                        {maxim.authorId ? (
                          <Link
                            href={`/course/${maxim.authorId}`}
                            className="text-neutral-200 underline hover:text-white transition-colors"
                          >
                            {maxim.author}
                          </Link>
                        ) : (
                          <span>{maxim.author}</span>
                        )}
                        <span className="text-neutral-700 mx-2">•</span>
                        <span>{maxim.date}</span>
                      </div>

                      <button
                        onClick={() =>
                          handleCopyMaxim(
                            `${maxim.original} (${maxim.translation}) — ${maxim.author}`,
                            `maxim-${idx}`
                          )
                        }
                        className="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                        title="Copy Maxim"
                      >
                        {copiedMaxim === `maxim-${idx}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 06: THE 14 CANONICAL THINKERS INDEX (Encyclopedic Catalog)
           ======================================================== */}
        <section id="thinkers" className="scroll-mt-20 py-20 border-b border-neutral-900">
          <div className="space-y-12">
            <div className="space-y-3 pb-8 border-b border-neutral-900">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-neutral-400 tracking-widest font-bold">
                  § 06
                </span>
                <span className="text-neutral-700">•</span>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
                  {isHi ? "दार्शनिक महासंग्रह" : "CANONICAL TREATISES"}
                </span>
              </div>
              <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.08em] text-white uppercase">
                {isHi ? "14 महान विचारकों का संग्रह" : "THE FOURTEEN CANONICAL THINKERS"}
              </h2>
              <p className="font-garamond text-lg text-neutral-400 italic">
                {isHi
                  ? "प्रत्येक विचारक की विस्तृत जीवनी, मूल अवधारणाएं एवं अध्ययन पाठ्यक्रम पढ़ें"
                  : "Explore the comprehensive monographs, life odysseys, and curated modules in our archive."}
              </p>
            </div>

            {/* Encyclopedia Index Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-widest">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">{isHi ? "दार्शनिक" : "Thinker"}</th>
                    <th className="py-3 px-4">{isHi ? "कालखंड" : "Epoch & Dates"}</th>
                    <th className="py-3 px-4">{isHi ? "दर्शन धारा" : "Tradition & Legacy"}</th>
                    <th className="py-3 px-4 text-right">{isHi ? "पाठ्यक्रम" : "Dossier"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {thinkersCatalog.map((thinker, tIdx) => (
                    <tr
                      key={thinker.id}
                      className="hover:bg-neutral-950 transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-neutral-400">
                        {String(tIdx + 1).padStart(2, "0")}
                      </td>
                      <td className="py-3.5 px-4 font-serif-classic text-base text-white font-bold group-hover:text-neutral-200">
                        <Link
                          href={`/course/${thinker.id}`}
                          className="hover:underline flex items-center gap-1.5"
                        >
                          <span>{thinker.name}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-400">
                        <div>{thinker.dates}</div>
                        <div className="text-neutral-400 text-[11px]">{thinker.era}</div>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-300">
                        {thinker.school}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/course/${thinker.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 border border-neutral-800 hover:border-white text-neutral-300 hover:text-white uppercase tracking-wider text-[11px] transition-colors"
                        >
                          <span>Read Dossier</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 07: SCHOLARLY APPARATUS & GLOSSARY
           ======================================================== */}
        <section id="glossary" className="scroll-mt-20 py-20 border-b border-neutral-900">
          <div className="space-y-12">
            <div className="space-y-3 pb-8 border-b border-neutral-900">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-neutral-400 tracking-widest font-bold">
                  § 07
                </span>
                <span className="text-neutral-700">•</span>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
                  {isHi ? "शास्त्रीय शब्दावली" : "SCHOLARLY APPARATUS"}
                </span>
              </div>
              <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.08em] text-white uppercase">
                {isHi ? "दार्शनिक पारिभाषिक शब्दावली" : "GLOSSARY OF CLASSICAL TERMS"}
              </h2>
              <p className="font-garamond text-lg text-neutral-400 italic">
                {isHi
                  ? "पश्चिमी दर्शन के मूल यूनानी एवं लैटिन शब्दों की सटीक व्याख्या"
                  : "Critical nomenclature foundational to Western dialectics and metaphysics."}
              </p>
            </div>

            {/* Glossary definition list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-neutral-300">
              {glossaryTerms.map((item, gIdx) => (
                <div key={gIdx} className="space-y-2 border-l border-neutral-800 pl-4 py-1">
                  <h3 className="font-serif-classic text-lg font-bold text-white uppercase tracking-wider">
                    {item.term}
                  </h3>
                  <p className="font-mono text-xs text-neutral-400 italic">
                    {item.trans}
                  </p>
                  <p className="font-garamond text-sm text-neutral-300 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Citation & Methodology Note */}
            <div className="pt-8 border-t border-neutral-900 text-xs font-mono text-neutral-400 space-y-2">
              <span className="uppercase tracking-widest block font-semibold text-neutral-400">
                {isHi ? "अकादमिक संदर्भ एवं उद्धरण निर्देश:" : "Scholarly Citation & Archive Provenance:"}
              </span>
              <p className="font-garamond text-sm text-neutral-400 leading-relaxed">
                {isHi
                  ? "यह डिजिटल आर्काइव शास्त्रीय ग्रंथों, अकादमिक शोध एवं ऐतिहासिक मूल पाठों पर आधारित है। सुकरात के संवादों के लिए प्लेटो के आरंभिक संवाद, ज्ञानमीमांसा के लिए देकार्त के 'मेडिटेशन्स' एवं कांट की 'क्रिटिक ऑफ प्योर रीज़न', तथा अस्तित्ववाद के लिए नीत्शे एवं कामू के मूल ग्रंथों का उपयोग किया गया है।"
                  : "Curated in accordance with standard classical reference methodology. Primary sources referenced include the Platonic Dialogues, Aristotle's Organon and Nicomachean Ethics, Descartes' Meditationes de Prima Philosophia, Spinoza's Ethica Ordine Geometrico Demonstrata, Kant's Kritik der reinen Vernunft, and the Nietzschean Gesamtausgabe."}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 08: CALL TO INQUIRY (Elegant Monograph Coda)
           ======================================================== */}
        <section className="py-24 text-center space-y-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="text-xs uppercase font-mono tracking-[0.3em] text-neutral-400 font-semibold block">
              {isHi ? "दार्शनिक परंपरा में प्रवेश" : "THE CANON AWAITS YOUR INQUIRY"}
            </span>

            <h2 className="font-serif-classic text-3xl sm:text-5xl font-bold tracking-[0.12em] text-white uppercase leading-tight">
              {t.aboutPage?.ctaTitle || "BEGIN YOUR DIALECTICAL INQUIRY"}
            </h2>

            <p className="font-garamond text-lg sm:text-xl text-neutral-300 leading-relaxed font-light">
              {t.aboutPage?.ctaBody ||
                "Examine our curated monographs on 14 legendary thinkers spanning from Antiquity to Modernity."}
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/#courses"
                className="px-8 py-3.5 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-200 transition-colors shadow-lg"
              >
                {t.aboutPage?.ctaButton || "EXPLORE THE 14 THINKERS"}
              </Link>
              <Link
                href="/"
                className="px-8 py-3.5 border border-neutral-800 hover:border-white text-neutral-300 hover:text-white text-xs uppercase tracking-[0.25em] font-mono transition-colors"
              >
                {isHi ? "अकादमी मुख्य पृष्ठ" : "Return to Academy Home"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Global Minimalist Footer */}
      <Footer />

      {/* Interactive Modals */}
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
