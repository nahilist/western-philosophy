export interface PhilosophicalConcept {
  name: string;
  latinOrGreek?: string;
  explanation: string;
}

export interface SeminalWork {
  title: string;
  year: string;
  summary: string;
}

export interface PhilosopherCourse {
  id: string;
  name: string;
  title: string;
  image: string;
  era: string;
  school: string;
  quote: string;
  quoteSource: string;
  overview: string;
  biography: string;
  keyConcepts: PhilosophicalConcept[];
  seminalWorks: SeminalWork[];
  famousQuotes: string[];
  modules: {
    title: string;
    description: string;
    lessons: string[];
  }[];
  duration: string;
  level: string;
}

export const PHILOSOPHER_COURSES: PhilosopherCourse[] = [
  {
    id: "descartes",
    name: "RENÉ DESCARTES",
    title: "Cartesian Doubt & Foundations of Modern Rationalism",
    image: "/images/descartes.jpg",
    era: "1596 – 1650 (Early Modern • France)",
    school: "Rationalism, Epistemology & Dualism",
    quote: "Cogito, ergo sum. (I think, therefore I am.)",
    quoteSource: "Discourse on the Method (1637) & Meditations on First Philosophy (1641)",
    overview:
      "Regarded as the Father of Modern Western Philosophy, René Descartes fundamentally disrupted Scholastic traditions by refusing to accept any belief that could possibly be doubted. Through radical doubt, he reconstructed knowledge on the bedrock of self-conscious thought.",
    biography:
      "Born in La Haye en Touraine, France, in 1596, Descartes was educated by the Jesuits at Collège Henri IV, studying mathematics, physics, and classical philosophy. Dissatisfied with dogmatic tradition, he enlisted in the military to travel and study the 'book of the world'. In a heated stove-room in Germany in 1619, he experienced a series of dreams that revealed to him a universal mathematical science of nature. Later settling in the Dutch Republic, he composed his epochal works on optics, geometry, epistemology, and the passions of the soul, before passing away in Stockholm, Sweden in 1650.",
    keyConcepts: [
      {
        name: "Method of Hyperbolic Doubt",
        latinOrGreek: "Dubito, ergo cogito",
        explanation:
          "Systematically stripping away all sensory beliefs, mathematical assumptions, and worldly observations to test if anything indubitable survives.",
      },
      {
        name: "The Cogito",
        latinOrGreek: "Cogito, ergo sum",
        explanation:
          "Even if an all-powerful Evil Genius deceives me about mathematics and physics, my very act of doubting or being deceived proves with certainty that I exist as a thinking thing.",
      },
      {
        name: "Substance Dualism",
        latinOrGreek: "Res Cogitans vs. Res Extensa",
        explanation:
          "The strict metaphysical distinction between the unextended, conscious mind (Res Cogitans) and the extended, spatial, mechanical matter (Res Extensa).",
      },
      {
        name: "Innate Ideas & Clear and Distinct Perception",
        latinOrGreek: "Clare et distincte",
        explanation:
          "Certain foundational truths (such as mathematical axioms, the concept of God, and identity) are stamped into the intellect prior to sensory experience.",
      },
    ],
    seminalWorks: [
      {
        title: "Discourse on the Method",
        year: "1637",
        summary:
          "Descartes' intellectual autobiography proposing four rules for directing the mind and introducing Cartesian geometry.",
      },
      {
        title: "Meditations on First Philosophy",
        year: "1641",
        summary:
          "Six intellectual meditations demonstrating the existence of God and the distinction between the human soul and body.",
      },
      {
        title: "Passions of the Soul",
        year: "1649",
        summary:
          "A comprehensive treatise on emotions, moral psychology, and the physiological pineal interaction between mind and body.",
      },
    ],
    famousQuotes: [
      "I think, therefore I am.",
      "It is not enough to have a good mind; the main thing is to use it well.",
      "If you would be a real seeker after truth, it is necessary that at least once in your life you doubt, as far as possible, all things.",
      "Divide each difficulty into as many parts as is feasible and necessary to resolve it.",
    ],
    modules: [
      {
        title: "I. The Method of Radical Doubt",
        description: "Deconstructing sensory deception, dreams, and the Evil Demon hypothesis.",
        lessons: [
          "1.1 Breakdown of Aristotelian Scholasticism",
          "1.2 The Dream Argument & Hallucinatory Experience",
          "1.3 The Malicious Deceiver (Genius Malignus)",
        ],
      },
      {
        title: "II. The Archimedian Point: Cogito",
        description: "Why consciousness is the bedrock of epistemological certainty.",
        lessons: [
          "2.1 The Nature of Thinking (Res Cogitans)",
          "2.2 The Wax Argument: Sensation vs. Intellection",
          "2.3 Solipsism and the Bridge to Objective Reality",
        ],
      },
      {
        title: "III. Mind-Body Dualism & Physiology",
        description: "The ontological split between conscious soul and mechanical body.",
        lessons: [
          "3.1 Res Extensa and Cartesian Physics",
          "3.2 The Pineal Gland Interaction Problem",
          "3.3 Princess Elisabeth of Bohemia's Critiques",
        ],
      },
      {
        title: "IV. The Cartesian Legacy in Modern Thought",
        description: "How Descartes shaped cognitive science, Artificial Intelligence, and analytical philosophy.",
        lessons: [
          "4.1 Rationalism vs. British Empiricism",
          "4.2 Computational Theories of Mind and the Ghost in the Machine",
          "4.3 The Contemporary Epistemological Renaissance",
        ],
      },
    ],
    duration: "6 Weeks • 18 Lectures",
    level: "Foundational to Intermediate",
  },
  {
    id: "nietzsche",
    name: "FRIEDRICH NIETZSCHE",
    title: "The Will to Power, Nihilism & The Overman (Übermensch)",
    image: "/images/nietzsche.jpg",
    era: "1844 – 1900 (Late Modern • Germany)",
    school: "Existentialism, Perspectivism, Vitalism & Cultural Critique",
    quote: "Become who you are.",
    quoteSource: "Thus Spoke Zarathustra (1883) & The Gay Science (1882)",
    overview:
      "Confronting the supreme existential crisis of Western civilization—the collapse of traditional religious metaphysics—Nietzsche waged intellectual war on dogmatic morality, championing life affirmation, creative overcoming, and the revaluation of all values.",
    biography:
      "Born in Röcken, Saxony, in 1844, Friedrich Wilhelm Nietzsche became a prodigy in classical philology, appointed full professor at the University of Basel at just 24 years old. Resigning ten years later due to chronic health struggles and migraine afflictions, he lived as an itinerant wanderer between the Swiss Alps of Sils Maria, Turin, Genoa, and Nice, penning monumental philosophical aphorisms with lyrical fury before suffering an irreversible mental collapse in Turin in 1889.",
    keyConcepts: [
      {
        name: "The Death of God & Nihilism",
        latinOrGreek: "Gott ist tot",
        explanation:
          "The historical recognition that European culture no longer truly believes in transcendent metaphysical foundations, creating a perilous void between despair and absolute liberation.",
      },
      {
        name: "The Overman (Übermensch)",
        latinOrGreek: "Übermensch",
        explanation:
          "The autonomous creator of meaning who rises above herd complacency and reactive moral codes to embody peak creative and spiritual vitality.",
      },
      {
        name: "Will to Power",
        latinOrGreek: "Wille zur Macht",
        explanation:
          "The fundamental instinct of all living organisms not merely to survive, but to expand, master, discharge energy, and transcend existing limitations.",
      },
      {
        name: "Amor Fati & Eternal Recurrence",
        latinOrGreek: "Amor fati",
        explanation:
          "The ultimate affirmative spiritual test: to love one's fate so unreservedly that one would willingly repeat every joyous and tragic moment of existence infinitely.",
      },
    ],
    seminalWorks: [
      {
        title: "Thus Spoke Zarathustra",
        year: "1883",
        summary:
          "A poetic philosophical masterpiece chronicling the prophet Zarathustra descending from his mountain solitude to teach the Übermensch and Eternal Return.",
      },
      {
        title: "Beyond Good and Evil",
        year: "1886",
        summary:
          "A fierce critique of dogmatic philosophers, slave morality, and the psychological roots of truth seeking.",
      },
      {
        title: "On the Genealogy of Morality",
        year: "1887",
        summary:
          "A historical and linguistic deconstruction of good/bad versus good/evil and the origins of guilt and ascetic ideals.",
      },
    ],
    famousQuotes: [
      "He who has a why to live can bear almost any how.",
      "What does not kill me makes me stronger.",
      "And those who were seen dancing were thought to be insane by those who could not hear the music.",
      "You must have chaos within you to give birth to a dancing star.",
    ],
    modules: [
      {
        title: "I. The Crisis of European Nihilism",
        description: "Diagnosing the cultural collapse of universal moral teleology.",
        lessons: [
          "1.1 The Parable of the Madman",
          "1.2 Passive vs. Active Nihilism",
          "1.3 The Dangers of The Last Man (Der letzte Mensch)",
        ],
      },
      {
        title: "II. Master vs. Slave Morality",
        description: "The psychological roots of guilt, bad conscience, and ressentiment.",
        lessons: [
          "2.1 Noble Self-Affirmation vs. Reactive Resentment",
          "2.2 The Inversion of Values in Judaeo-Christian Ethics",
          "2.3 The Ascetic Ideal and the Will to Nothingness",
        ],
      },
      {
        title: "III. Perspectivism & The Will to Power",
        description: "Deconstructing objective absolute truth in favor of interpretive depth.",
        lessons: [
          "3.1 There are no facts, only interpretations",
          "3.2 Psychology as the Queen of the Sciences",
          "3.3 Life as Artistic Self-Creation and Affirmation",
        ],
      },
      {
        title: "IV. The Supreme Affirmation: Amor Fati",
        description: "Living dangerously and mastering the thought of Eternal Return.",
        lessons: [
          "4.1 The Greatest Weight (Das größte Schwergewicht)",
          "4.2 Dionysian Vitality vs. Apollonian Restraint",
          "4.3 Becoming Who You Truly Are in Practice",
        ],
      },
    ],
    duration: "8 Weeks • 24 Lectures",
    level: "Intermediate to Advanced",
  },
  {
    id: "socrates",
    name: "SÓCRATES",
    title: "The Socratic Elenchus: Virtue, Dialectic & Self-Knowledge",
    image: "/images/socrates_bust.jpg",
    era: "c. 470 – 399 BCE (Classical Antiquity • Athens)",
    school: "Classical Greek Philosophy & Virtue Ethics",
    quote: "I know that I am intelligent, because I know that I know nothing.",
    quoteSource: "Plato's Apology & The Socratic Dialogues",
    overview:
      "Socrates revolutionized human thought by bringing philosophy down from the stars into the Agora of Athens. Rather than studying cosmology, he interrogated human ethics: What is justice? What is courage? Can virtue be taught? What makes life truly worthwhile?",
    biography:
      "Born in the Deme of Alopece near Athens around 470 BCE, Socrates was the son of Sophroniscus, a stonemason, and Phaenarete, a midwife. He served with heroic valor as a hoplite soldier in the Peloponnesian War (Potidaea, Delium, Amphipolis). Choosing poverty over paid rhetoric, he spent his life walking barefoot through the streets of Athens, questioning politicians, poets, and craftsmen. In 399 BCE, accused of corrupting the youth and impiety towards the civic gods, he defended himself with defiant integrity before an Athenian jury of 501 citizens, drinking hemlock poison in serene philosophical dignity.",
    keyConcepts: [
      {
        name: "Socratic Ignorance (Aporia)",
        latinOrGreek: "Aporia / Socratic docta ignorantia",
        explanation:
          "The admission of one's own ignorance is the prerequisite for all wisdom; true philosophy begins only when false pretenses of knowledge are destroyed.",
      },
      {
        name: "The Socratic Method (Elenchus)",
        latinOrGreek: "Elenchus",
        explanation:
          "A form of cooperative argumentative dialogue between individuals, based on asking and answering questions to stimulate critical thinking and uncover contradictions.",
      },
      {
        name: "Virtue is Knowledge",
        latinOrGreek: "Arete / Episteme",
        explanation:
          "No one does evil willingly; wrongdoing is the result of ignorance about what is truly good and beneficial for the human soul.",
      },
      {
        name: "Care of the Soul",
        latinOrGreek: "Epimeleia heautou",
        explanation:
          "The supreme duty of human life is not the accumulation of wealth, status, or power, but the moral and intellectual perfection of one's inner being.",
      },
    ],
    seminalWorks: [
      {
        title: "Plato's Apology",
        year: "c. 399 BCE",
        summary:
          "The definitive speech delivered by Socrates at his trial, setting forth his divine mission from Apollo and declaring that the unexamined life is not worth living.",
      },
      {
        title: "Plato's Crito & Phaedo",
        year: "c. 385 BCE",
        summary:
          "The drama of Socrates in his prison cell, his refusal to escape unjust laws, and his final dialogues on the immortality of the soul before drinking hemlock.",
      },
      {
        title: "Plato's Republic (Book I)",
        year: "c. 375 BCE",
        summary:
          "Socrates demolishing Thrasymachus' cynical claim that 'justice is nothing other than the advantage of the stronger'.",
      },
    ],
    famousQuotes: [
      "The unexamined life is not worth living.",
      "I know that I am intelligent, because I know that I know nothing.",
      "True wisdom comes to each of us when we realize how little we understand about life, ourselves, and the world around us.",
      "Be kind, for everyone you meet is fighting a hard battle.",
    ],
    modules: [
      {
        title: "I. The Oracle of Delphi & The Quest for Wisdom",
        description: "Why recognizing our blindness is the foundational awakening of philosophy.",
        lessons: [
          "1.1 Chaerephon's Pilgrimage to Delphi",
          "1.2 Cross-Examining the Athenian Elites (Politicians, Poets, Artisans)",
          "1.3 The Paradox of Knowing Nothing",
        ],
      },
      {
        title: "II. The Art of the Socratic Dialogue (Elenchus)",
        description: "Mastering the dialectical method of moral inquiry in the Agora.",
        lessons: [
          "2.1 Socratic Irony and Intellectual Midwifery (Maieutics)",
          "2.2 Searching for Universal Definitions of Courage, Piety, and Temperance",
          "2.3 Reaching Productive Perplexity (Aporia)",
        ],
      },
      {
        title: "III. Moral Psychology: The Care of the Soul",
        description: "Why committing injustice harms the wrongdoer more than the victim.",
        lessons: [
          "3.1 The Inviolability of the Good Soul",
          "3.2 The Socratic Paradox: All Sin is Ignorance",
          "3.3 The Daimonion: Socrates' Inner Warning Voice",
        ],
      },
      {
        title: "IV. The Trial, Death & Martyrdom of Reason",
        description: "The Athenian political crisis and Socrates' heroic stand for intellectual freedom.",
        lessons: [
          "4.1 The Charges: Meletus, Anytus, and the Thirty Tyrants",
          "4.2 The Gadfly of Athens and the Defense of Free Inquiry",
          "4.3 The Serenity of Phaedo and the Legacy of Socratic Martyrdom",
        ],
      },
    ],
    duration: "6 Weeks • 16 Lectures",
    level: "Foundational",
  },
  {
    id: "machiavelli",
    name: "NICOLAU MAQUIAVEL",
    title: "Realpolitik: Power Dynamics, Fortuna & Civic Republicanism",
    image: "/images/machiavelli.jpg",
    era: "1469 – 1527 (Italian Renaissance • Florence)",
    school: "Political Realism, Classical Republicanism & Statecraft",
    quote: "Everyone sees what you appear to be, few experience what you really are.",
    quoteSource: "The Prince (Il Principe, 1513)",
    overview:
      "Niccolò Machiavelli decoupled politics from theological moralism, pioneering modern political science through the cold-eyed observation of how leaders actually govern rather than how they ought to govern. His philosophy balances audacious human agency (Virtù) against the unpredictable floods of fate (Fortuna).",
    biography:
      "Born in Florence in 1469 during the golden age of Lorenzo de' Medici, Machiavelli became senior secretary and chancellor of the Second Chancery of the Florentine Republic in 1498. For fourteen years, he undertook high-stakes diplomatic missions to Cesare Borgia, King Louis XII of France, Emperor Maximilian I, and Pope Julius II. When the Medici family returned to power backed by Spanish troops in 1512, Machiavelli was stripped of office, imprisoned, tortured on the strappado, and exiled to his small country estate in Sant'Andrea in Percussina, where he channeled his genius into writing The Prince and Discourses on Livy.",
    keyConcepts: [
      {
        name: "The Effective Truth of Things",
        latinOrGreek: "La verità effettuale della cosa",
        explanation:
          "Analyzing the reality of human behavior as it genuinely exists in politics, rather than indulging in utopian or pious fantasies of how men ought to live.",
      },
      {
        name: "Virtù vs. Fortuna",
        latinOrGreek: "Virtù / Fortuna",
        explanation:
          "Fortuna is an erratic raging river; Virtù is the foresight, boldness, and calculated courage to build dams and dikes in calm times to master the torrent.",
      },
      {
        name: "The Lion and The Fox",
        latinOrGreek: "Il leone e la volpe",
        explanation:
          "A ruler must know how to deploy both the beast and the man: the lion to frighten wolves, and the fox to recognize and navigate traps.",
      },
      {
        name: "Feared Rather Than Loved",
        latinOrGreek: "Meglio essere temuto che amato",
        explanation:
          "Love is held by a chain of obligation which men break whenever it suits them; fear is maintained by a dread of punishment which never fails.",
      },
    ],
    seminalWorks: [
      {
        title: "The Prince (Il Principe)",
        year: "1513",
        summary:
          "A revolutionary handbook on acquiring, consolidating, and defending political power in volatile and corrupt principalities.",
      },
      {
        title: "Discourses on Livy",
        year: "1517",
        summary:
          "Machiavelli's profound treatise on republican liberty, civic virtue, mixed constitutions, and checks on tyranny drawn from ancient Rome.",
      },
      {
        title: "The Art of War (Dell'arte della guerra)",
        year: "1521",
        summary:
          "A dialogue advocating for citizen-soldier militias over treacherous mercenary armies to guarantee republican sovereignty.",
      },
    ],
    famousQuotes: [
      "Everyone sees what you appear to be, few experience what you really are.",
      "It is much safer to be feared than loved because...love is preserved by the link of obligation which...is broken at every opportunity.",
      "The lion cannot protect himself from traps, and the fox cannot defend himself from wolves. One must therefore be a fox to recognize traps, and a lion to frighten wolves.",
      "There is nothing more difficult to take in hand, more perilous to conduct, or more uncertain in its success, than to take the lead in the introduction of a new order of things.",
    ],
    modules: [
      {
        title: "I. The Italian Renaissance & The Diplomatic Cauldron",
        description: "The Medici, Cesare Borgia, and the fall of the Florentine Republic.",
        lessons: [
          "1.1 Machiavelli's Chancery Years in Italy and France",
          "1.2 The Cesare Borgia Paradigm: Ruthless Efficiency vs. Ill Fortune",
          "1.3 The Catastrophe of 1512: Torture and Rural Exile",
        ],
      },
      {
        title: "II. The Effective Truth: Deconstructing Christian Idealism",
        description: "Why rulers guided purely by private morality invite collective ruin.",
        lessons: [
          "2.1 Principalities: Hereditary, Mixed, and Newly Acquired",
          "2.2 Cruelty Well Used vs. Cruelty Abused",
          "2.3 Cultivating the Reputation of Piety and Mercy",
        ],
      },
      {
        title: "III. Virtù, Fortuna and Political Agency",
        description: "Mastering the unpredictability of human affairs through audacious statecraft.",
        lessons: [
          "3.1 Fortuna as a Torrential River",
          "3.2 The Necessity of Decisive Boldness (Audacia)",
          "3.3 The Art of Military Self-Reliance: Why Mercenaries Destroy States",
        ],
      },
      {
        title: "IV. Discourses on Livy: The Republican Vision",
        description: "Why democratic institutions and civic virtue outlast absolute dictatorships.",
        lessons: [
          "4.1 Checks, Balances, and Popular Participation in Rome",
          "4.2 Friction as the Engine of Liberty (The Patricians and Plebeians)",
          "4.3 Machiavelli's Enduring Influence on the US Constitution and Modern Political Thought",
        ],
      },
    ],
    duration: "6 Weeks • 18 Lectures",
    level: "Intermediate",
  },
];

export const DAILY_QUOTES = [
  {
    quote: "He who has a why to live can bear almost any how.",
    author: "Friedrich Nietzsche",
    era: "1889",
  },
  {
    quote: "The unexamined life is not worth living.",
    author: "Socrates",
    era: "399 BCE",
  },
  {
    quote: "It is not enough to have a good mind; the main thing is to use it well.",
    author: "René Descartes",
    era: "1637",
  },
  {
    quote: "He who wishes to be obeyed must know how to command.",
    author: "Niccolò Machiavelli",
    era: "1513",
  },
  {
    quote: "Two things awe me most, the starry sky above and the moral law within.",
    author: "Immanuel Kant",
    era: "1788",
  },
  {
    quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    era: "180 CE",
  },
  {
    quote: "Man is condemned to be free; because once thrown into the world, he is responsible for everything he does.",
    author: "Jean-Paul Sartre",
    era: "1946",
  },
  {
    quote: "Happiness resides not in possessions, and not in gold, happiness dwells in the soul.",
    author: "Democritus",
    era: "c. 400 BCE",
  },
];
