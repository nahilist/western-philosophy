export interface PhilosopherCourse {
  id: string;
  name: string;
  nativeName?: string;
  title: string;
  image: string;
  era: string;
  school: string;
  quote: string;
  quoteSource: string;
  overview: string;
  modules: {
    title: string;
    description: string;
  }[];
  keyWorks: string[];
  duration: string;
  level: string;
}

export const PHILOSOPHER_COURSES: PhilosopherCourse[] = [
  {
    id: "descartes",
    name: "RENÉ DESCARTES",
    title: "Cartesian Doubt & Foundations of Modern Rationalism",
    image: "/images/descartes.jpg",
    era: "1596 – 1650 (Early Modern)",
    school: "Rationalism & Dualism",
    quote: "Cogito, ergo sum. (I think, therefore I am.)",
    quoteSource: "Discourse on the Method (1637) & Meditations on First Philosophy (1641)",
    overview:
      "Embark on the foundational journey of modern epistemology. René Descartes demolished unexamined dogma by systematically doubting everything until he arrived at the indubitable truth: the existence of the thinking mind.",
    modules: [
      {
        title: "I. Method of Radical Doubt",
        description: "Deconstructing sensory deception, dreams, and the hypothetical Evil Demon.",
      },
      {
        title: "II. The Archimedian Point: Cogito",
        description: "Why consciousness is the bedrock of all epistemological certainty.",
      },
      {
        title: "III. Mind-Body Dualism",
        description: "The ontological split between Res Cogitans (mind) and Res Extensa (matter).",
      },
      {
        title: "IV. The Cartesian Legacy in AI & Modern Science",
        description: "How Descartes shaped cognitive science, mathematics, and rational inquiry.",
      },
    ],
    keyWorks: [
      "Meditations on First Philosophy (1641)",
      "Discourse on the Method (1637)",
      "Principles of Philosophy (1644)",
    ],
    duration: "6 Weeks • 18 Lectures",
    level: "Foundational to Intermediate",
  },
  {
    id: "nietzsche",
    name: "FRIEDRICH NIETZSCHE",
    title: "The Will to Power, Nihilism & The Overman (Übermensch)",
    image: "/images/nietzsche.jpg",
    era: "1844 – 1900 (Late Modern)",
    school: "Existentialism, Perspectivism & Vitalism",
    quote: "Become who you are.",
    quoteSource: "Thus Spoke Zarathustra (1883) & The Gay Science (1882)",
    overview:
      "Confront the crisis of nihilism with the philosopher of the hammer. Nietzsche calls us to transcend inherited moral systems, embrace Amor Fati (love of fate), and craft self-overcoming individuals capable of affirming life in its tragic totality.",
    modules: [
      {
        title: "I. The Death of God & The Twilight of Idols",
        description: "Diagnosing the collapse of universal metaphysics and the dawn of European nihilism.",
      },
      {
        title: "II. Master vs. Slave Morality",
        description: "The genealogy of morals, ressentiment, and the revaluation of all values.",
      },
      {
        title: "III. The Will to Power & Eternal Recurrence",
        description: "Life as self-affirmation, psychological drive, and the supreme existential test.",
      },
      {
        title: "IV. The Übermensch & Dionysian Affirmation",
        description: "Creating meaning in an indifferent universe through artistic and spiritual mastery.",
      },
    ],
    keyWorks: [
      "Thus Spoke Zarathustra (1883)",
      "Beyond Good and Evil (1886)",
      "On the Genealogy of Morality (1887)",
    ],
    duration: "8 Weeks • 24 Lectures",
    level: "Intermediate to Advanced",
  },
  {
    id: "socrates",
    name: "SÓCRATES",
    title: "The Socratic Elenchus: Virtue, Dialectic & Self-Knowledge",
    image: "/images/socrates_bust.jpg",
    era: "c. 470 – 399 BCE (Classical Antiquity)",
    school: "Classical Greek Philosophy & Virtue Ethics",
    quote: "I know that I am intelligent, because I know that I know nothing.",
    quoteSource: "Plato's Apology & The Socratic Dialogues",
    overview:
      "Return to the bustling marketplace of ancient Athens. Socrates practiced philosophy not as abstract theory, but as an urgent living discipline of relentless questioning to uncover the nature of justice, courage, piety, and the good life.",
    modules: [
      {
        title: "I. The Oracle of Delphi & Aporia",
        description: "Why recognizing ignorance is the starting point of genuine philosophical inquiry.",
      },
      {
        title: "II. The Socratic Method (Elenchus)",
        description: "Cross-examination, defining virtues, and exposing unconscious contradictions.",
      },
      {
        title: "III. The Care of the Soul (Epimeleia Heautou)",
        description: "Why living unjustly harms the wrongdoer far more than the victim.",
      },
      {
        title: "IV. The Trial & Hemlock: Martyrdom of Reason",
        description: "Examining Socrates' defense, civic duty, and facing death with unyielding virtue.",
      },
    ],
    keyWorks: [
      "Plato's Apology",
      "Plato's Crito & Phaedo",
      "Xenophon's Memorabilia",
    ],
    duration: "6 Weeks • 16 Lectures",
    level: "Foundational",
  },
  {
    id: "machiavelli",
    name: "NICOLAU MAQUIAVEL",
    title: "Realpolitik: Power Dynamics, Fortuna & Civic Republicanism",
    image: "/images/machiavelli.jpg",
    era: "1469 – 1527 (Renaissance)",
    school: "Political Realism & Classical Republicanism",
    quote: "Everyone sees what you appear to be, few experience what you really are.",
    quoteSource: "The Prince (Il Principe, 1513)",
    overview:
      "Step into the volatile intrigue of Renaissance Italy. Niccolò Machiavelli decoupled political science from theological idealism, analyzing human nature, political survival, and statecraft with unsparing realism.",
    modules: [
      {
        title: "I. The Verità Effettuale (The Effective Truth)",
        description: "Analyzing the world as it truly is rather than as it ought to be.",
      },
      {
        title: "II. Virtù vs. Fortuna",
        description: "How visionary agency and bold strategy master the raging torrent of fate.",
      },
      {
        title: "III. Fear, Love, and The Art of Deception",
        description: "The psychology of power, appearances, and maintaining authority.",
      },
      {
        title: "IV. Discourses on Livy: Republican Liberty",
        description: "Why free republics with checks on tyranny outlast authoritarian regimes.",
      },
    ],
    keyWorks: [
      "The Prince (1513)",
      "Discourses on Livy (1517)",
      "The Art of War (1521)",
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

