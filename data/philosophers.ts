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
  // 1. DESCARTES
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
          "Even if an all-powerful Evil Genius deceives me about mathematics and physics, my very act of doubting proves with certainty that I exist as a thinking thing.",
      },
      {
        name: "Substance Dualism",
        latinOrGreek: "Res Cogitans vs. Res Extensa",
        explanation:
          "The strict metaphysical distinction between the unextended, conscious mind (Res Cogitans) and the extended, spatial, mechanical matter (Res Extensa).",
      },
      {
        name: "Innate Ideas",
        latinOrGreek: "Clare et distincte",
        explanation:
          "Certain foundational truths (mathematical axioms, the concept of God, and identity) are stamped into the intellect prior to sensory experience.",
      },
    ],
    seminalWorks: [
      {
        title: "Discourse on the Method",
        year: "1637",
        summary: "Descartes' intellectual autobiography introducing four rules of reasoning and Cartesian geometry.",
      },
      {
        title: "Meditations on First Philosophy",
        year: "1641",
        summary: "Six intellectual meditations establishing the foundations of epistemology and mind-body dualism.",
      },
      {
        title: "Passions of the Soul",
        year: "1649",
        summary: "A comprehensive treatise on human emotions, moral psychology, and mind-body interaction.",
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
        lessons: ["1.1 Scholastic Breakdown", "1.2 The Dream Argument", "1.3 The Genius Malignus"],
      },
      {
        title: "II. The Archimedian Point: Cogito",
        description: "Why consciousness is the bedrock of epistemological certainty.",
        lessons: ["2.1 The Nature of Thinking", "2.2 The Wax Argument", "2.3 Solipsism and Objective Reality"],
      },
      {
        title: "III. Mind-Body Dualism",
        description: "The ontological split between conscious soul and mechanical body.",
        lessons: ["3.1 Res Extensa and Cartesian Physics", "3.2 The Pineal Interaction Problem", "3.3 Princess Elisabeth's Critiques"],
      },
      {
        title: "IV. The Cartesian Legacy in Modern AI",
        description: "How Descartes shaped cognitive science, Artificial Intelligence, and analytical philosophy.",
        lessons: ["4.1 Rationalism vs. Empiricism", "4.2 The Ghost in the Machine", "4.3 Contemporary Epistemology"],
      },
    ],
    duration: "6 Weeks • 18 Lectures",
    level: "Foundational to Intermediate",
  },

  // 2. NIETZSCHE
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
      "Born in Röcken, Saxony, in 1844, Friedrich Wilhelm Nietzsche was appointed full professor at Basel at just 24 years old. Resigning ten years later due to health afflictions, he lived as an itinerant wanderer between the Swiss Alps of Sils Maria, Turin, Genoa, and Nice, penning monumental philosophical aphorisms with lyrical fury before his collapse in Turin in 1889.",
    keyConcepts: [
      {
        name: "The Death of God & Nihilism",
        latinOrGreek: "Gott ist tot",
        explanation:
          "The historical recognition that European culture no longer truly believes in transcendent metaphysical foundations, creating a void between despair and absolute liberation.",
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
          "The ultimate affirmative spiritual test: to love one's fate so unreservedly that one would willingly repeat every moment of existence infinitely.",
      },
    ],
    seminalWorks: [
      {
        title: "Thus Spoke Zarathustra",
        year: "1883",
        summary: "A poetic philosophical masterpiece teaching the Übermensch and the Eternal Return of the same.",
      },
      {
        title: "Beyond Good and Evil",
        year: "1886",
        summary: "A fierce critique of dogmatic philosophers, slave morality, and the psychology of truth.",
      },
      {
        title: "On the Genealogy of Morality",
        year: "1887",
        summary: "A linguistic and psychological deconstruction of moral values, guilt, and the ascetic ideal.",
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
        lessons: ["1.1 The Madman's Parable", "1.2 Passive vs. Active Nihilism", "1.3 The Last Man"],
      },
      {
        title: "II. Master vs. Slave Morality",
        description: "The psychological roots of guilt, bad conscience, and ressentiment.",
        lessons: ["2.1 Noble Self-Affirmation", "2.2 The Inversion of Values", "2.3 The Ascetic Ideal"],
      },
      {
        title: "III. Perspectivism & The Will to Power",
        description: "Deconstructing objective absolute truth in favor of interpretive depth.",
        lessons: ["3.1 No Facts, Only Interpretations", "3.2 Psychology as Queen Science", "3.3 Artistic Self-Creation"],
      },
      {
        title: "IV. The Supreme Affirmation: Amor Fati",
        description: "Living dangerously and mastering the thought of Eternal Return.",
        lessons: ["4.1 The Greatest Weight", "4.2 Dionysian Vitality", "4.3 Becoming Who You Are"],
      },
    ],
    duration: "8 Weeks • 24 Lectures",
    level: "Intermediate to Advanced",
  },

  // 3. SOCRATES
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
      "Socrates revolutionized human thought by bringing philosophy down from the stars into the Agora of Athens. Rather than studying cosmology, he interrogated human ethics: What is justice? What is courage? What makes life truly worthwhile?",
    biography:
      "Born in Alopece near Athens around 470 BCE, Socrates was the son of a stonemason and a midwife. He served with heroic valor as a hoplite soldier in the Peloponnesian War. Choosing poverty over paid rhetoric, he spent his life questioning politicians, poets, and craftsmen in Athens. In 399 BCE, accused of corrupting the youth and impiety, he defended himself with defiant integrity before an Athenian jury of 501 citizens, drinking hemlock poison in serene philosophical dignity.",
    keyConcepts: [
      {
        name: "Socratic Ignorance",
        latinOrGreek: "Aporia / Docta Ignorantia",
        explanation:
          "The admission of one's own ignorance is the prerequisite for all wisdom; true philosophy begins only when false pretenses of knowledge are destroyed.",
      },
      {
        name: "The Socratic Method",
        latinOrGreek: "Elenchus",
        explanation:
          "A dialectical method of cooperative inquiry and cross-examination to stimulate critical thinking and expose internal contradictions.",
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
          "The supreme duty of human life is not the accumulation of wealth or power, but the moral and intellectual perfection of one's inner being.",
      },
    ],
    seminalWorks: [
      {
        title: "Plato's Apology",
        year: "c. 399 BCE",
        summary: "Socrates' defense at his trial, declaring that the unexamined life is not worth living.",
      },
      {
        title: "Plato's Crito & Phaedo",
        year: "c. 385 BCE",
        summary: "Socrates' final dialogues in prison on civic duty, justice, and the immortality of the soul.",
      },
      {
        title: "Plato's Republic (Book I)",
        year: "c. 375 BCE",
        summary: "Socrates demolishing the cynical claim that justice is merely the advantage of the stronger.",
      },
    ],
    famousQuotes: [
      "The unexamined life is not worth living.",
      "I know that I am intelligent, because I know that I know nothing.",
      "True wisdom comes to each of us when we realize how little we understand about life.",
      "Be kind, for everyone you meet is fighting a hard battle.",
    ],
    modules: [
      {
        title: "I. The Oracle of Delphi & The Quest for Wisdom",
        description: "Why recognizing our blindness is the foundational awakening of philosophy.",
        lessons: ["1.1 The Delphic Oracle", "1.2 Questioning the Athenian Elites", "1.3 The Paradox of Knowing Nothing"],
      },
      {
        title: "II. The Art of the Socratic Dialogue",
        description: "Mastering the dialectical method of moral inquiry in the Agora.",
        lessons: ["2.1 Socratic Irony & Intellectual Midwifery", "2.2 Searching for Universal Definitions", "2.3 Reaching Productive Aporia"],
      },
      {
        title: "III. Moral Psychology: The Care of the Soul",
        description: "Why committing injustice harms the wrongdoer more than the victim.",
        lessons: ["3.1 The Inviolability of the Good Soul", "3.2 All Sin is Ignorance", "3.3 The Daimonion's Voice"],
      },
      {
        title: "IV. The Trial, Death & Martyrdom of Reason",
        description: "The Athenian political crisis and Socrates' heroic stand for intellectual freedom.",
        lessons: ["4.1 The Charges & Thirty Tyrants", "4.2 The Gadfly of Athens", "4.3 The Serenity of Phaedo"],
      },
    ],
    duration: "6 Weeks • 16 Lectures",
    level: "Foundational",
  },

  // 4. MACHIAVELLI
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
      "Born in Florence in 1469, Machiavelli served as senior secretary to the Second Chancery of the Florentine Republic for fourteen years, undertaking diplomatic missions to Cesare Borgia, France, and Rome. When the Medici returned in 1512, he was imprisoned, tortured, and exiled to his country estate, where he channeled his genius into writing The Prince and Discourses on Livy.",
    keyConcepts: [
      {
        name: "The Effective Truth of Things",
        latinOrGreek: "La verità effettuale della cosa",
        explanation:
          "Analyzing the reality of human behavior as it genuinely exists in politics, rather than indulging in utopian fantasies of how men ought to live.",
      },
      {
        name: "Virtù vs. Fortuna",
        latinOrGreek: "Virtù / Fortuna",
        explanation:
          "Fortuna is an erratic raging river; Virtù is the foresight, boldness, and calculated courage to build dams in calm times to master the torrent.",
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
        title: "The Prince",
        year: "1513",
        summary: "A revolutionary handbook on acquiring, consolidating, and defending political power.",
      },
      {
        title: "Discourses on Livy",
        year: "1517",
        summary: "Machiavelli's profound treatise on republican liberty, civic virtue, and checks on tyranny.",
      },
      {
        title: "The Art of War",
        year: "1521",
        summary: "A dialogue advocating citizen-soldier militias over treacherous mercenary armies.",
      },
    ],
    famousQuotes: [
      "Everyone sees what you appear to be, few experience what you really are.",
      "It is much safer to be feared than loved when you have to choose between the two.",
      "The lion cannot protect himself from traps, and the fox cannot defend himself from wolves.",
      "There is nothing more difficult to take in hand than the introduction of a new order of things.",
    ],
    modules: [
      {
        title: "I. The Renaissance & The Diplomatic Cauldron",
        description: "The Medici, Cesare Borgia, and the fall of the Florentine Republic.",
        lessons: ["1.1 Chancery Diplomacy", "1.2 Cesare Borgia Paradigm", "1.3 Torture & Country Exile"],
      },
      {
        title: "II. The Effective Truth: Deconstructing Idealism",
        description: "Why rulers guided purely by private morality invite collective ruin.",
        lessons: ["2.1 Types of Principalities", "2.2 Cruelty Well Used vs. Abused", "2.3 The Reputation of Mercy"],
      },
      {
        title: "III. Virtù, Fortuna and Political Agency",
        description: "Mastering the unpredictability of human affairs through audacious statecraft.",
        lessons: ["3.1 Fortuna as a Torrent", "3.2 Necessity of Audacity", "3.3 Military Self-Reliance"],
      },
      {
        title: "IV. The Republican Vision of Rome",
        description: "Why democratic institutions and civic virtue outlast dictatorships.",
        lessons: ["4.1 Checks and Balances in Rome", "4.2 Friction as the Engine of Liberty", "4.3 Modern Constitutional Legacy"],
      },
    ],
    duration: "6 Weeks • 18 Lectures",
    level: "Intermediate",
  },

  // 5. PLATO
  {
    id: "plato",
    name: "PLATO",
    title: "The Theory of Forms, The Allegory of the Cave & The Ideal State",
    image: "/images/plato.jpg",
    era: "c. 428 – 348 BCE (Classical Antiquity • Athens)",
    school: "Classical Greek Philosophy, Idealism & Political Theory",
    quote: "Reality is created by the mind; we can change our reality by changing our mind.",
    quoteSource: "The Republic & The Socratic Dialogues",
    overview:
      "Student of Socrates and teacher of Aristotle, Plato founded the Academy in Athens, the Western world's first institution of higher learning. His dialogues laid the metaphysical, epistemological, and political foundations of Western civilization, postulating an eternal realm of transcendent Forms beyond sensory illusions.",
    biography:
      "Born to an aristocratic Athenian family during the Peloponnesian War, Plato's youth was transformed by encountering Socrates. Following Socrates' execution in 399 BCE, Plato traveled through Egypt, Italy, and Sicily before returning to Athens around 387 BCE to establish the Academy. His immortal dialogues span ethics, metaphysics, love, mathematics, and the nature of the just republic.",
    keyConcepts: [
      {
        name: "The Theory of Forms",
        latinOrGreek: "Eidos / Idea",
        explanation:
          "The physical material world is only a shadow or copy of the true, transcendent, unchanging realm of immaterial Forms (Justice, Beauty, Truth, and the Good).",
      },
      {
        name: "The Allegory of the Cave",
        latinOrGreek: "Republic Book VII",
        explanation:
          "Mankind is chained inside a subterranean cave mistaking projected shadows for reality, until the philosopher breaks free into the blinding sunlight of true knowledge.",
      },
      {
        name: "The Tripartite Soul",
        latinOrGreek: "Logistikon, Thymoeides, Epithymetikon",
        explanation:
          "Human consciousness is composed of Reason (Logos), Spirit/Courage (Thymos), and Appetite (Epithymia), requiring Reason to govern like a charioteer.",
      },
      {
        name: "The Philosopher King",
        latinOrGreek: "Kallipolis",
        explanation:
          "Societies will never escape corruption and suffering until either philosophers become kings or the kings of this world genuinely philosophize.",
      },
    ],
    seminalWorks: [
      {
        title: "The Republic (Politeia)",
        year: "c. 375 BCE",
        summary: "Plato's masterwork on the nature of justice, the ideal state, the philosopher king, and the immortality of the soul.",
      },
      {
        title: "The Symposium",
        year: "c. 385 BCE",
        summary: "A magnificent dramatic dialogue investigating the metaphysical nature, origins, and philosophical ascent of Eros (Love).",
      },
      {
        title: "Phaedo",
        year: "c. 380 BCE",
        summary: "Socrates' final conversation on the day of his death discussing the transmigration and immortality of the rational soul.",
      },
    ],
    famousQuotes: [
      "The greatest wealth is to live content with little.",
      "Wise men speak because they have something to say; fools because they have to say something.",
      "We can easily forgive a child who is afraid of the dark; the real tragedy of life is when men are afraid of the light.",
      "Knowledge becomes evil if the aim be not virtuous.",
    ],
    modules: [
      {
        title: "I. The Metaphysics of Forms",
        description: "The ontological division between the realm of becoming and the realm of being.",
        lessons: ["1.1 Socratic Definitions to Platonic Forms", "1.2 The Divided Line", "1.3 The Form of the Good as the Intellectual Sun"],
      },
      {
        title: "II. The Allegory of the Cave & Epistemology",
        description: "The journey of philosophical liberation from shadows to radiant truth.",
        lessons: ["2.1 Prisoners in Chains", "2.2 The Pain of Ascending to Sunlight", "2.3 The Return and Peril of the Enlightened"],
      },
      {
        title: "III. The Architecture of the Just State",
        description: "The tripartite city: Guardians, Auxiliaries, and Producers.",
        lessons: ["3.1 The Myth of the Metals", "3.2 Censorship, Education, and Gymnastics", "3.3 Justice as Internal Harmony"],
      },
      {
        title: "IV. Eros & The Ascent to Beauty",
        description: "Platonic love as the ladder of metaphysical contemplation.",
        lessons: ["4.1 Aristophanes' Myth of the Split Beings", "4.2 Diotima's Ladder of Love", "4.3 Intellectual Immortality"],
      },
    ],
    duration: "8 Weeks • 24 Lectures",
    level: "Foundational to Advanced",
  },

  // 6. ARISTOTLE
  {
    id: "aristotle",
    name: "ARISTOTLE",
    title: "Teleology, Nicomachean Ethics & The Golden Mean",
    image: "/images/aristotle.jpg",
    era: "384 – 322 BCE (Classical Antiquity • Greece)",
    school: "Classical Greek Philosophy, Empirical Inquiry & Virtue Ethics",
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    quoteSource: "Nicomachean Ethics (Book II)",
    overview:
      "Known throughout the Middle Ages simply as 'The Philosopher', Aristotle was the master of those who know. Tutored by Plato for twenty years and later tutor to Alexander the Great, Aristotle founded the Lyceum, pioneering formal logic, biology, physics, metaphysics, poetics, and virtue ethics.",
    biography:
      "Born in Stagira in northern Greece, Aristotle entered Plato's Academy at age seventeen. Following Plato's death, he traveled across Asia Minor and Macedonia, tutoring young Alexander the Great. In 335 BCE, he returned to Athens to establish the Lyceum, lecturing while walking along the colonnades (the Peripatetic school). Following Alexander's death, facing Athenian anti-Macedonian hostility, he retreated to Chalcis, famously stating he would not allow Athens to sin twice against philosophy.",
    keyConcepts: [
      {
        name: "Teleology & The Final Cause",
        latinOrGreek: "Telos",
        explanation:
          "Everything in nature has an intrinsic purpose, goal, or function (Telos), and a thing is good when it successfully realizes its natural end.",
      },
      {
        name: "The Golden Mean",
        latinOrGreek: "Mesotes",
        explanation:
          "Virtue is the harmonious middle point between two extremes of excess and deficiency (e.g., Courage is the mean between Cowardice and Recklessness).",
      },
      {
        name: "Eudaimonia",
        latinOrGreek: "Eudaimonia",
        explanation:
          "True human flourishing, wholeness, and supreme happiness achieved not through fleeting pleasure, but through a lifetime of rational virtuous action.",
      },
      {
        name: "Hylomorphism",
        latinOrGreek: "Hyle & Morphe",
        explanation:
          "Rejection of Plato's detached Forms: substance is a composite of primary matter (Hyle) and structural form (Morphe) unified within things.",
      },
    ],
    seminalWorks: [
      {
        title: "Nicomachean Ethics",
        year: "c. 340 BCE",
        summary: "The definitive ancient treatise on human happiness, moral character, virtue, and friendship.",
      },
      {
        title: "Politics (Politika)",
        year: "c. 335 BCE",
        summary: "Analyzing human nature as a 'political animal' (zoon politikon) and comparing constitution types.",
      },
      {
        title: "Metaphysics (Metaphysica)",
        year: "c. 330 BCE",
        summary: "The study of being qua being, substance, potentiality vs. actuality, and the Unmoved Mover.",
      },
    ],
    famousQuotes: [
      "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
      "Knowing yourself is the beginning of all wisdom.",
      "It is the mark of an educated mind to be able to entertain a thought without accepting it.",
      "Man is by nature a political animal.",
    ],
    modules: [
      {
        title: "I. Teleological Metaphysics & Nature",
        description: "The four causes and the dynamics of potentiality becoming actuality.",
        lessons: ["1.1 Material, Formal, Efficient, and Final Causes", "1.2 Actuality (Entelecheia) vs. Potentiality (Dynamis)", "1.3 The Prime Unmoved Mover"],
      },
      {
        title: "II. Virtue Ethics & The Golden Mean",
        description: "Cultivating moral character and finding the harmonious balance of action.",
        lessons: ["2.1 What is Eudaimonia?", "2.2 Moral Virtues as Acquired Habits", "2.3 Navigating Excess and Deficiency"],
      },
      {
        title: "III. The Philosophy of Friendship (Philia)",
        description: "The highest fulfillment of human virtue in shared intellectual life.",
        lessons: ["3.1 Friendships of Utility vs. Pleasure", "3.2 The Friendship of the Good", "3.3 The Friend as Another Self"],
      },
      {
        title: "IV. Politics, Justice & The Lyceum Legacy",
        description: "The ideal polity and the birth of scientific classification.",
        lessons: ["4.1 The Zoon Politikon", "4.2 Distributive and Corrective Justice", "4.3 The Peripatetic Scientific Legacy"],
      },
    ],
    duration: "8 Weeks • 20 Lectures",
    level: "Foundational to Intermediate",
  },

  // 7. BARUCH SPINOZA
  {
    id: "spinoza",
    name: "BARUCH SPINOZA",
    title: "Substance Monism, Deus Sive Natura & Intellectual Freedom",
    image: "/images/spinoza.jpg",
    era: "1632 – 1677 (Early Modern • Dutch Republic)",
    school: "Rationalism, Substance Monism & Pantheism",
    quote: "All things excellent are as difficult as they are rare.",
    quoteSource: "Ethics (Ethica, 1677)",
    overview:
      "Baruch Spinoza was one of the boldest minds in human history. Excommunicated from the Jewish community of Amsterdam for his radical heresies, Spinoza lived a quiet life grinding optical lenses while composing his geometric masterpiece, 'Ethics'—demonstrating that God and Nature are one single infinite substance.",
    biography:
      "Born in Amsterdam in 1632 to Sephardic Portuguese refugees, Spinoza received rigorous rabbinic education before absorbing Cartesian philosophy and Latin scholarship. In 1656, the synagogue issued against him the harshest cherem (excommunication) in its history. Refusing prestigious university chairs to safeguard his complete intellectual freedom, he died in The Hague in 1677 from lung illness exacerbated by glass dust.",
    keyConcepts: [
      {
        name: "God or Nature",
        latinOrGreek: "Deus sive Natura",
        explanation:
          "There is only one infinite substance in the universe: God and the physical universe are identical, operating through eternal natural laws.",
      },
      {
        name: "The Conatus",
        latinOrGreek: "Conatus sese conservandi",
        explanation:
          "The fundamental striving inherent to every entity to persevere in its own being and increase its vitality, power, and active understanding.",
      },
      {
        name: "Intellectual Love of God",
        latinOrGreek: "Amor Dei intellectualis",
        explanation:
          "The highest state of human serenity and blessedness, attained through rational comprehension of the universe's geometric necessity.",
      },
      {
        name: "Sub Specie Aeternitatis",
        latinOrGreek: "Under the aspect of eternity",
        explanation:
          "Perceiving events not through fleeting personal emotions or mortal fears, but as necessary links in the infinite causal chain of reality.",
      },
    ],
    seminalWorks: [
      {
        title: "Ethics (Ethica)",
        year: "1677",
        summary: "Demonstrated in geometric order (axioms, propositions, proofs), deconstructing Cartesian dualism and founding pantheistic rationalism.",
      },
      {
        title: "Theological-Political Treatise",
        year: "1670",
        summary: "A groundbreaking defense of free speech, secular democracy, and the historical-critical reading of religious texts.",
      },
      {
        title: "On the Improvement of the Understanding",
        year: "1662",
        summary: "An unfinished epistemological treatise detailing the four levels of perception and the purification of the mind.",
      },
    ],
    famousQuotes: [
      "All things excellent are as difficult as they are rare.",
      "I have made a ceaseless effort not to ridicule, not to bewail, not to scorn human actions, but to understand them.",
      "Peace is not an absence of war; it is a virtue, a state of mind, a disposition for benevolence, confidence, justice.",
      "The highest activity a human being can attain is learning for understanding, because to understand is to be free.",
    ],
    modules: [
      {
        title: "I. Substance Monism: God is Nature",
        description: "Deconstructing the anthropomorphic deity in favor of infinite nature.",
        lessons: ["1.1 The Excommunication of 1656", "1.2 Definition of Substance and Attributes", "1.3 Natura Naturans vs. Natura Naturata"],
      },
      {
        title: "II. Mind, Body and Parallelism",
        description: "Solving Descartes' dualism: Mind and Body as two attributes of the same substance.",
        lessons: ["2.1 Psychophysical Parallelism", "2.2 The Fallacy of Free Will as Uncaused Agency", "2.3 The Conatus as Vital Striving"],
      },
      {
        title: "III. The Affects & Freedom from Servitude",
        description: "How passive passions become active virtues through rational comprehension.",
        lessons: ["3.1 Bondage to the Passions", "3.2 The Transformation of Negative Affects", "3.3 Seeing Under the Aspect of Eternity"],
      },
      {
        title: "IV. The Free Republic & Spinoza's Legacy",
        description: "Spinoza's revolutionary defense of democratic free speech and modern secularism.",
        lessons: ["4.1 The Theological-Political Breakthrough", "4.2 Freedom of Thought as Non-Negotiable", "4.3 The Pantheism Controversy"],
      },
    ],
    duration: "6 Weeks • 18 Lectures",
    level: "Intermediate to Advanced",
  },

  // 8. DAVID HUME
  {
    id: "hume",
    name: "DAVID HUME",
    title: "Radical Empiricism, The Problem of Induction & The Passions",
    image: "/images/hume.jpg",
    era: "1711 – 1776 (The Enlightenment • Scotland)",
    school: "British Empiricism, Skepticism & Naturalism",
    quote: "Reason is, and ought only to be the slave of the passions.",
    quoteSource: "A Treatise of Human Nature (1739)",
    overview:
      "David Hume was the great champion of British Empiricism and the Scottish Enlightenment. By subjecting human reason, causation, miracles, and the concept of the self to relentless empirical scrutiny, Hume famously awoke Immanuel Kant from his 'dogmatic slumber'.",
    biography:
      "Born in Edinburgh in 1711, Hume composed his masterwork 'A Treatise of Human Nature' while in France in his twenties, though it initially 'fell dead-born from the press'. Later gaining widespread fame as a brilliant essayist and historian of England, he lived as a cheerful skeptic and beloved companion of Adam Smith, dying peacefully in Edinburgh in 1776 while calmly maintaining his philosophical skepticism to his final breath.",
    keyConcepts: [
      {
        name: "The Problem of Induction",
        latinOrGreek: "Skepticism of Causality",
        explanation:
          "Just because the sun has risen every morning does not logically guarantee it will rise tomorrow; inductive reasoning rests on habit and custom, not deductive necessity.",
      },
      {
        name: "Bundle Theory of Self",
        latinOrGreek: "The Illusion of the Ego",
        explanation:
          "Introspecting into consciousness reveals no permanent soul or unified 'self'—only a perpetually changing bundle of fleeting perceptions, sensations, and thoughts.",
      },
      {
        name: "The Is-Ought Problem",
        latinOrGreek: "Hume's Guillotine",
        explanation:
          "One cannot logically deduce moral obligations ('ought') purely from descriptive factual claims ('is'); morality is grounded in human sentiments, not dry logic.",
      },
      {
        name: "Relations of Ideas vs. Matters of Fact",
        latinOrGreek: "Hume's Fork",
        explanation:
          "All meaningful knowledge is either logically tautological (mathematics) or empirically verified by sensory experience; everything else should be committed to the flames.",
      },
    ],
    seminalWorks: [
      {
        title: "A Treatise of Human Nature",
        year: "1739",
        summary: "Hume's monumental attempt to introduce the experimental method of reasoning into moral subjects.",
      },
      {
        title: "An Enquiry Concerning Human Understanding",
        year: "1748",
        summary: "A streamlined, powerful reformulation of his epistemology, critique of miracles, and skepticism of causality.",
      },
      {
        title: "Dialogues Concerning Natural Religion",
        year: "1779",
        summary: "A masterpiece of philosophical dialogue devastating the classical argument from design for the existence of God.",
      },
    ],
    famousQuotes: [
      "Reason is, and ought only to be the slave of the passions, and can never pretend to any other office than to serve and obey them.",
      "Custom, then, is the great guide of human life.",
      "A wise man proportions his belief to the evidence.",
      "Be a philosopher; but, amidst all your philosophy, be still a man.",
    ],
    modules: [
      {
        title: "I. Impressions and Ideas",
        description: "The foundations of empirical psychology and cognitive perception.",
        lessons: ["1.1 The Priority of Sense Impressions", "1.2 Association of Ideas: Resemblance, Contiguity, Cause", "1.3 Hume's Fork"],
      },
      {
        title: "II. The Skeptical Destruction of Causality",
        description: "Why necessity exists only in our minds, not in the physical collisions of objects.",
        lessons: ["2.1 The Billiard Ball Experiment", "2.2 Custom as the Cement of the Universe", "2.3 The Scandal of Induction"],
      },
      {
        title: "III. The Disappearing Self & Morality as Sentiment",
        description: "Deconstructing the Cartesian soul and grounding ethics in human empathy.",
        lessons: ["3.1 The Theater of the Mind with No Stage", "3.2 The Fallacy of Pure Rational Morality", "3.3 Sympathy and Moral Sentiment"],
      },
      {
        title: "IV. Miracles, Religion & The Enlightenment",
        description: "The empirical critique of supernatural claims and the design argument.",
        lessons: ["4.1 The Essay on Miracles", "4.2 The Philo vs. Cleanthes Debate", "4.3 Awakening Kant from Dogmatic Slumber"],
      },
    ],
    duration: "6 Weeks • 18 Lectures",
    level: "Intermediate",
  },

  // 9. IMMANUEL KANT
  {
    id: "kant",
    name: "IMMANUEL KANT",
    title: "Transcendental Idealism, The Categorical Imperative & Pure Reason",
    image: "/images/kant.jpg",
    era: "1724 – 1804 (German Idealism • Prussia)",
    school: "Critical Philosophy, Deontology & Transcendental Idealism",
    quote: "To be is to do.",
    quoteSource: "Critique of Pure Reason (1781) & Critique of Practical Reason (1788)",
    overview:
      "Immanuel Kant orchestrated a Copernican Revolution in Western philosophy. Synthesizing rationalism and empiricism, Kant demonstrated that while our knowledge begins with experience, the mind actively structures that experience through a priori categories of space, time, and causality.",
    biography:
      "Born in Königsberg, Prussia (now Kaliningrad), Kant led a life of legendary clockwork discipline, never traveling more than a few miles from his home city. After years as a respected university lecturer, he entered a decade of silence to write his revolutionary 'Critique of Pure Reason' at age 57, permanently redefining epistemology, ethics, aesthetics, and political philosophy.",
    keyConcepts: [
      {
        name: "The Copernican Revolution",
        latinOrGreek: "Transcendental Turn",
        explanation:
          "Instead of our mind conforming to external objects, objects of experience conform to the mind's innate cognitive structures of space, time, and categories.",
      },
      {
        name: "Phenomena vs. Noumena",
        latinOrGreek: "Ding an sich (Thing-in-itself)",
        explanation:
          "We can only know the world as it appears to our sensory apparatus (Phenomena); the underlying reality in itself (Noumena) is forever inaccessible to human knowledge.",
      },
      {
        name: "The Categorical Imperative",
        latinOrGreek: "Categorical Imperative",
        explanation:
          "Act only according to that maxim whereby you can at the same time will that it should become a universal law; never treat humanity merely as a means, but always as an end.",
      },
      {
        name: "Sapere Aude! (Dare to Know)",
        latinOrGreek: "Was ist Aufklärung?",
        explanation:
          "Enlightenment is humanity's emergence from its self-incurred immaturity: the courage to use your own reason without the guidance of another.",
      },
    ],
    seminalWorks: [
      {
        title: "Critique of Pure Reason",
        year: "1781",
        summary: "The architectural cornerstone of modern philosophy investigating the limits, conditions, and boundaries of human reason.",
      },
      {
        title: "Groundwork of the Metaphysics of Morals",
        year: "1785",
        summary: "The classic formulation of deontological ethics, duty, moral autonomy, and the Categorical Imperative.",
      },
      {
        title: "Critique of Judgment",
        year: "1790",
        summary: "Investigating the nature of aesthetic beauty, the sublime, and teleological judgment in nature.",
      },
    ],
    famousQuotes: [
      "Two things awe me most: the starry sky above and the moral law within.",
      "Dare to know! Have the courage to use your own reason.",
      "Thoughts without content are empty, intuitions without concepts are blind.",
      "Live your life as though your every act were to become a universal law.",
    ],
    modules: [
      {
        title: "I. The Copernican Revolution in Epistemology",
        description: "How the mind synthesizes the raw data of sensation through space and time.",
        lessons: ["1.1 The Synthetic A Priori Question", "1.2 The Transcendental Aesthetic (Space and Time)", "1.3 The 12 Categories of Understanding"],
      },
      {
        title: "II. The Boundaries of Pure Reason",
        description: "Why traditional metaphysics generates insoluble antinomies when overreaching.",
        lessons: ["2.1 Phenomena and the Ding an sich", "2.2 The Paralogisms and Antinomies", "2.3 The Destruction of Ontological Proofs for God"],
      },
      {
        title: "III. Duty, Autonomy and the Categorical Imperative",
        description: "The purity of deontological ethics and the kingdom of ends.",
        lessons: ["3.1 The Good Will as the Only Absolute Good", "3.2 Formula of Universal Law", "3.3 Humanity as an End in Itself"],
      },
      {
        title: "IV. The Sublime, Perpetual Peace & Legacy",
        description: "Kant's vision of universal human rights, republican federations, and the sublime.",
        lessons: ["4.1 The Mathematical and Dynamical Sublime", "4.2 Perpetual Peace (Zum ewigen Frieden)", "4.3 The Rise of German Idealism"],
      },
    ],
    duration: "8 Weeks • 24 Lectures",
    level: "Advanced",
  },

  // 10. HEGEL
  {
    id: "hegel",
    name: "GEORG W. F. HEGEL",
    title: "Dialectical Idealism, The Master-Slave Dialectic & Absolute Spirit",
    image: "/images/hegel.jpg",
    era: "1770 – 1831 (German Idealism • Germany)",
    school: "German Idealism, Dialectical Metaphysics & Historicism",
    quote: "The history of the world is none other than the progress of the consciousness of freedom.",
    quoteSource: "Phenomenology of Spirit (1807) & Philosophy of History (1837)",
    overview:
      "Georg Wilhelm Friedrich Hegel constructed the most comprehensive and ambitious system in Western idealism. For Hegel, reality is not static substance, but dynamic historical process: the unfolding of Spirit (Geist) through dialectical struggle and self-recognition toward absolute freedom.",
    biography:
      "Born in Stuttgart in 1770, Hegel studied theology at the Tübingen Stift alongside poet Friedrich Hölderlin and philosopher Friedrich Schelling. Witnessing Napoleon ride through Jena in 1806—whom he described as the 'world-soul on horseback'—he rushed to finish his masterpiece 'Phenomenology of Spirit'. Appointed rector of the University of Berlin in 1830, he became the intellectual titan of 19th-century European thought.",
    keyConcepts: [
      {
        name: "The Dialectical Method",
        latinOrGreek: "Aufhebung (Sublation)",
        explanation:
          "Thought and history develop through contradictions: a thesis encounters its antithesis, resolving into a higher synthesis (Aufhebung) that preserves, cancels, and elevates both.",
      },
      {
        name: "The Master-Slave Dialectic",
        latinOrGreek: "Herrschaft und Knechtschaft",
        explanation:
          "Self-consciousness emerges only through recognition by another; the slave through labor and transformative mastery ultimately surpasses the dependent master.",
      },
      {
        name: "The World Spirit (Geist)",
        latinOrGreek: "Geist",
        explanation:
          "The collective consciousness of humanity realizing its own freedom and self-awareness across successive historical civilizations.",
      },
      {
        name: "The Owl of Minerva",
        latinOrGreek: "Philosophy as Retrospection",
        explanation:
          "Philosophy always arrives too late to teach the world what it should be; the owl of Minerva spreads its wings only with the falling of the dusk.",
      },
    ],
    seminalWorks: [
      {
        title: "Phenomenology of Spirit",
        year: "1807",
        summary: "The epic odyssey of consciousness journeying from sense-certainty to absolute knowing.",
      },
      {
        title: "Elements of the Philosophy of Right",
        year: "1820",
        summary: "Hegel's political philosophy analyzing ethical life (Sittlichkeit), the family, civil society, and the constitutional state.",
      },
      {
        title: "Science of Logic",
        year: "1812",
        summary: "The reconstruction of pure thought categories from pure Being, Nothing, to Becoming.",
      },
    ],
    famousQuotes: [
      "The history of the world is none other than the progress of the consciousness of freedom.",
      "The owl of Minerva spreads its wings only with the falling of the dusk.",
      "Nothing great in the world has ever been accomplished without passion.",
      "What is rational is actual; and what is actual is rational.",
    ],
    modules: [
      {
        title: "I. The Odyssey of Consciousness",
        description: "The journey from raw sense-certainty to self-reflective spirit.",
        lessons: ["1.1 The Jena Battlefield & Napoleon", "1.2 The Illusion of Immediate Sense-Certainty", "1.3 The Birth of Self-Consciousness"],
      },
      {
        title: "II. The Struggle for Recognition",
        description: "The Master-Slave dialectic and the existential origins of labor.",
        lessons: ["2.1 The Death-Struggle for Recognition", "2.2 The Master's Stagnation", "2.3 The Slave's Transformative Labor"],
      },
      {
        title: "III. Ethical Life (Sittlichkeit) & The State",
        description: "The reconciliation of individual liberty within institutional life.",
        lessons: ["3.1 Abstract Right vs. Moral Conscience", "3.2 Civil Society as the Battlefield of Interests", "3.3 The Constitutional State as Actualized Freedom"],
      },
      {
        title: "IV. Absolute Spirit & The Hegelian Fracture",
        description: "Art, religion, and philosophy, and the split between Left and Right Hegelians.",
        lessons: ["4.1 The End of Art", "4.2 Philosophy as Comprehended History", "4.3 The Emergence of Marx and Kierkegaard"],
      },
    ],
    duration: "8 Weeks • 24 Lectures",
    level: "Advanced",
  },

  // 11. SCHOPENHAUER
  {
    id: "schopenhauer",
    name: "ARTHUR SCHOPENHAUER",
    title: "The World as Will and Representation & The Metaphysics of Art",
    image: "/images/schopenhauer.jpg",
    era: "1788 – 1860 (19th Century • Germany)",
    school: "Philosophical Pessimism, Transcendental Idealism & Aesthetics",
    quote: "Life swings like a pendulum backward and forward between pain and boredom.",
    quoteSource: "The World as Will and Representation (1818)",
    overview:
      "Arthur Schopenhauer was the great contrarian of 19th-century philosophy. Bridging Kantian idealism with Eastern Buddhist and Hindu philosophy, Schopenhauer revealed reality to be a blind, insatiable, irrational metaphysical force—the Will—and championed artistic contemplation and compassion as the only escapes from cosmic suffering.",
    biography:
      "Born in Danzig in 1788, Schopenhauer inherited financial independence from his merchant father, allowing him to write free of academic dogma. He scheduled his lectures at Berlin at the exact same hour as Hegel to challenge the giant, lecturing to nearly empty halls while Hegel drew crowds. Retiring to Frankfurt, he lived with his beloved poodles, enjoying late-in-life international acclaim as the master of existential pessimism and dark philosophical elegance.",
    keyConcepts: [
      {
        name: "The World as Will",
        latinOrGreek: "Der Wille zum Leben",
        explanation:
          "The underlying thing-in-itself (Noumenon) is not a benevolent God or rational Spirit, but a blind, irrational, ceaseless striving called the Will to Live.",
      },
      {
        name: "The Metaphysics of Suffering",
        latinOrGreek: "Pessimism",
        explanation:
          "All willing springs from lack, from deficiency, and therefore from suffering; the satisfaction of a desire brings only momentary respite before boredom or new desires strike.",
      },
      {
        name: "Aesthetic Liberation & Music",
        latinOrGreek: "Pure Contemplation",
        explanation:
          "In aesthetic experience—especially music—the individual ceases to be a striving ego and becomes the pure, will-less subject of knowledge, briefly escaping pain.",
      },
      {
        name: "Ethics of Compassion (Mitleid)",
        latinOrGreek: "Tat Tvam Asi (Thou Art That)",
        explanation:
          "Recognizing that the same suffering Will breathes within all sentient creatures leads to genuine compassion, empathy, and ascetic self-overcoming.",
      },
    ],
    seminalWorks: [
      {
        title: "The World as Will and Representation",
        year: "1818",
        summary: "Schopenhauer's masterwork unveiling the blind metaphysical Will and the pathways of aesthetic and ascetic salvation.",
      },
      {
        title: "Parerga and Paralipomena",
        year: "1851",
        summary: "A brilliant collection of philosophical essays on fame, suffering, suicide, and the wisdom of life.",
      },
      {
        title: "On the Basis of Morality",
        year: "1840",
        summary: "A devastating critique of Kantian deontological duty, arguing that compassion alone is the true ground of ethical value.",
      },
    ],
    famousQuotes: [
      "Life swings like a pendulum backward and forward between pain and boredom.",
      "A man can do what he wills, but he cannot will what he wills.",
      "Talent hits a target no one else can hit; Genius hits a target no one else can see.",
      "Compassion for animals is intimately associated with goodness of character.",
    ],
    modules: [
      {
        title: "I. The World as Representation",
        description: "The subjective lens of perception and the principle of sufficient reason.",
        lessons: ["1.1 The World is My Representation", "1.2 The Kantian Roots", "1.3 Space, Time, and Causality as Intellectual Forms"],
      },
      {
        title: "II. The Discovery of the Blind Will",
        description: "Recognizing the body as the direct physical manifestation of metaphysical striving.",
        lessons: ["2.1 The Body as Will", "2.2 The Blind Drive in Nature", "2.3 The Inevitability of Suffering"],
      },
      {
        title: "III. Art, Genius & The Platonic Ideas",
        description: "How aesthetic transcendence frees consciousness from the wheel of desire.",
        lessons: ["3.1 The Genius as Will-less Eye", "3.2 The Hierarchy of the Arts", "3.3 Music as the Direct Copy of the Will"],
      },
      {
        title: "IV. Compassion, Asceticism & Eastern Echoes",
        description: "The moral breakthrough of Tat Tvam Asi and the denial of the Will to Live.",
        lessons: ["4.1 Mitleid as the Universal Moral Root", "4.2 Buddhist and Upanishadic Confluences", "4.3 The Quietist Saint and Eternal Peace"],
      },
    ],
    duration: "6 Weeks • 18 Lectures",
    level: "Intermediate",
  },

  // 12. KARL MARX
  {
    id: "marx",
    name: "KARL MARX",
    title: "Historical Materialism, Alienation & The Critique of Capital",
    image: "/images/marx.jpg",
    era: "1818 – 1883 (19th Century • Germany / UK)",
    school: "Historical Materialism, Political Economy & Critical Theory",
    quote: "The philosophers have only interpreted the world in various ways; the point is to change it.",
    quoteSource: "Theses on Feuerbach (1845) & Das Kapital (1867)",
    overview:
      "Karl Marx turned Hegelian idealism on its head, arguing that history is driven not by disembodied Spirit, but by the material conditions of economic production and class struggle. His critique of capitalism, wage labor, and alienation remains one of the most consequential forces in modern global history.",
    biography:
      "Born in Trier, Prussia, in 1818, Marx studied law and philosophy in Bonn and Berlin, joining the radical Young Hegelians. Exiled from Germany, France, and Belgium for his revolutionary writings, he settled in London in 1849. Supported by his lifelong friend Friedrich Engels, he spent decades in the Reading Room of the British Museum researching the mechanics of capitalism before dying in London in 1883.",
    keyConcepts: [
      {
        name: "Historical Materialism",
        latinOrGreek: "Base and Superstructure",
        explanation:
          "The economic substructure (forces and relations of production) conditions the legal, political, religious, and ideological superstructure of society.",
      },
      {
        name: "Alienation of Labor",
        latinOrGreek: "Entfremdung",
        explanation:
          "Under capitalism, workers become alienated from the product of their labor, the act of production, their human essence (Gattungswesen), and fellow workers.",
      },
      {
        name: "Surplus Value & Exploitation",
        latinOrGreek: "Mehrwert",
        explanation:
          "Capitalist profit originates from the unpaid surplus labor extracted from wage workers above the cost of their subsistence.",
      },
      {
        name: "Commodity Fetishism",
        latinOrGreek: "Warenfetischismus",
        explanation:
          "Social relationships between human beings are masked as objective economic relationships between inanimate commodities and prices in the marketplace.",
      },
    ],
    seminalWorks: [
      {
        title: "Das Kapital (Volume I)",
        year: "1867",
        summary: "Marx's magnum opus dissecting the commodity, surplus value, labor exploitation, and systemic crises of capital.",
      },
      {
        title: "The Communist Manifesto",
        year: "1848",
        summary: "A fiery polemical declaration outlining world history as the history of class struggles.",
      },
      {
        title: "Economic and Philosophic Manuscripts of 1844",
        year: "1844",
        summary: "The Paris manuscripts articulating his humanist theory of alienated labor under industrial capitalism.",
      },
    ],
    famousQuotes: [
      "The philosophers have only interpreted the world in various ways; the point is to change it.",
      "The history of all hitherto existing society is the history of class struggles.",
      "From each according to his ability, to each according to his needs.",
      "Religion is the sigh of the oppressed creature, the heart of a heartless world, and the soul of soulless conditions.",
    ],
    modules: [
      {
        title: "I. Turning Hegel on His Head",
        description: "From German idealism to dialectical and historical materialism.",
        lessons: ["1.1 The Young Hegelians and Feuerbach", "1.2 The Primacy of Material Conditions", "1.3 Base and Superstructure"],
      },
      {
        title: "II. The Theory of Alienation",
        description: "How industrial production strips workers of their creative species-being.",
        lessons: ["2.1 Alienation from the Product", "2.2 Alienation from Nature and Species-Essence", "2.3 The Competitive Estrangement of Humanity"],
      },
      {
        title: "III. Capital & Surplus Value",
        description: "The mechanics of exploitation, primitive accumulation, and value theory.",
        lessons: ["3.1 The Mystery of the Commodity", "3.2 The Transformation of Money into Capital", "3.3 Surplus Labor and the Working Day"],
      },
      {
        title: "IV. Crises, Revolution & Modern Critical Theory",
        description: "Systemic contractions of capitalism and 20th-century critical theory.",
        lessons: ["4.1 The Tendency of the Rate of Profit to Fall", "4.2 Proletarian Consciousness", "4.3 The Frankfurt School and Contemporary Neo-Marxism"],
      },
    ],
    duration: "8 Weeks • 22 Lectures",
    level: "Intermediate",
  },

  // 13. BERTRAND RUSSELL
  {
    id: "russell",
    name: "BERTRAND RUSSELL",
    title: "Analytic Philosophy, Mathematical Logic & The Limits of Dogma",
    image: "/images/russell.jpg",
    era: "1872 – 1970 (20th Century • United Kingdom)",
    school: "Analytic Philosophy, Logicism & Scientific Empiricism",
    quote: "The whole problem with the world is that fools are certain and the wise full of doubts.",
    quoteSource: "The Triumph of Stupidity (1933) & The Problems of Philosophy (1912)",
    overview:
      "Nobel Laureate, mathematician, and public intellectual, Bertrand Russell co-founded modern Analytic Philosophy. By striving to ground mathematics in formal symbolic logic in 'Principia Mathematica', Russell revolutionized epistemology, language analysis, and secular humanism.",
    biography:
      "Born into an aristocratic British family (his grandfather was Prime Minister Lord John Russell), Bertrand Russell studied mathematics and philosophy at Trinity College, Cambridge. Over a ninety-seven-year life, he co-authored 'Principia Mathematica' with Alfred North Whitehead, mentored Ludwig Wittgenstein, was imprisoned for pacifism during WWI, won the Nobel Prize in Literature in 1950, and led global campaigns against nuclear weapons.",
    keyConcepts: [
      {
        name: "Russell's Paradox",
        latinOrGreek: "Set Theory Crisis",
        explanation:
          "Does the set of all sets that do not contain themselves contain itself? If it does, it doesn't; if it doesn't, it does—shaking the foundations of mathematics.",
      },
      {
        name: "Theory of Definite Descriptions",
        latinOrGreek: "Logic of Language",
        explanation:
          "Solving linguistic illusions by demonstrating that grammatical surface forms mask the true underlying logical structure of propositions.",
      },
      {
        name: "Russell's Teapot",
        latinOrGreek: "Burden of Proof",
        explanation:
          "If one claims a tiny china teapot orbits the Sun between Earth and Mars, the burden of proof rests on the claimant, not on skeptics to disprove it.",
      },
      {
        name: "Knowledge by Acquaintance",
        latinOrGreek: "Acquaintance vs. Description",
        explanation:
          "Direct cognitive awareness of immediate sense data versus inferential descriptive knowledge of physical objects and external truths.",
      },
    ],
    seminalWorks: [
      {
        title: "Principia Mathematica",
        year: "1910",
        summary: "The colossal three-volume treatise with A.N. Whitehead attempting to deduce all mathematical truths from pure logic.",
      },
      {
        title: "The Problems of Philosophy",
        year: "1912",
        summary: "A sparkling, accessible masterclass in epistemological skepticism, appearance versus reality, and the value of philosophy.",
      },
      {
        title: "A History of Western Philosophy",
        year: "1945",
        summary: "A sweeping, witty, and critically acclaimed chronicle of Western thought from Thales to the logical positivists.",
      },
    ],
    famousQuotes: [
      "The whole problem with the world is that fools and fanatics are always so certain of themselves, and wiser people so full of doubts.",
      "Three passions have governed my life: the longing for love, the search for knowledge, and unbearable pity for the suffering of mankind.",
      "Do not fear to be eccentric in opinion, for every opinion now accepted was once eccentric.",
      "The good life is one inspired by love and guided by knowledge.",
    ],
    modules: [
      {
        title: "I. The Revolt Against Idealism",
        description: "Breaking with British Hegelianism to invent analytic philosophy.",
        lessons: ["1.1 The Cambridge Rebellion with G.E. Moore", "1.2 The Logic of Symbolic Relations", "1.3 Russell's Paradox and Type Theory"],
      },
      {
        title: "II. Language, Logic & Definite Descriptions",
        description: "Exposing metaphysical illusions through linguistic analysis.",
        lessons: ["2.1 On Denoting (1905)", "2.2 The Present King of France is Bald", "2.3 Logical Atomism"],
      },
      {
        title: "III. Appearance, Reality & Sense Data",
        description: "Epistemological inquiry into what we can truly know of the physical world.",
        lessons: ["3.1 The Table Argument", "3.2 Knowledge by Acquaintance", "3.3 Inductive Probability and Scientific Inference"],
      },
      {
        title: "IV. Pacifism, Morals & Russell's Teapot",
        description: "The public intellectual, secular humanism, and the ethics of doubt.",
        lessons: ["4.1 Why I Am Not a Christian", "4.2 The Russell-Einstein Manifesto", "4.3 The Value of Philosophical Uncertainty"],
      },
    ],
    duration: "6 Weeks • 18 Lectures",
    level: "Foundational to Intermediate",
  },

  // 14. ALBERT CAMUS
  {
    id: "camus",
    name: "ALBERT CAMUS",
    title: "Absurdism, The Myth of Sisyphus & The Ethics of Rebellion",
    image: "/images/camus.jpg",
    era: "1913 – 1960 (20th Century • France / Algeria)",
    school: "Absurdism, Existential Philosophy & Moral Humanism",
    quote: "In the depth of winter, I finally learned that within me there lay an invincible summer.",
    quoteSource: "The Myth of Sisyphus (1942) & Return to Tipasa (1952)",
    overview:
      "Awarded the Nobel Prize in Literature at age 44, Albert Camus was the luminous voice of French Absurdism. Confronting an indifferent universe stripped of cosmic meaning, Camus rejected both physical and philosophical suicide, demanding that humanity live with passionate defiance, lucid freedom, and profound solidarity.",
    biography:
      "Born in Mondovi, French Algeria, to a working-class family, Camus lost his father in WWI and was raised in poverty by his illiterate mother. A star athlete whose football career was cut short by tuberculosis, he became an investigative journalist, joined the French Resistance editing the clandestine newspaper Combat during WWII, and wrote iconic novels and essays before tragically dying in an automobile crash in 1960.",
    keyConcepts: [
      {
        name: "The Absurd",
        latinOrGreek: "Le Sentiment de l'Absurde",
        explanation:
          "The irreconcilable clash between the human soul's desperate desire for meaning, purpose, and clarity, and the cold, unreasonable silence of the universe.",
      },
      {
        name: "The Myth of Sisyphus",
        latinOrGreek: "One must imagine Sisyphus happy",
        explanation:
          "Condemned eternally to roll a boulder up a mountain only to watch it roll down, Sisyphus masters his destiny through defiant consciousness and joy in the struggle.",
      },
      {
        name: "Rejection of Suicide",
        latinOrGreek: "Lucidity over Escape",
        explanation:
          "Neither physical suicide nor 'philosophical suicide' (leaping into dogmatic religious or political faith) resolves the Absurd; only living in continuous rebellion honors human dignity.",
      },
      {
        name: "The Rebel & Solidarity",
        latinOrGreek: "Je me révolte, donc nous sommes",
        explanation:
          "'I rebel, therefore we exist': Rebellion is not nihilistic destruction, but the affirmation of a shared human limit that opposes totalitarian tyranny.",
      },
    ],
    seminalWorks: [
      {
        title: "The Myth of Sisyphus",
        year: "1942",
        summary: "Camus' defining philosophical treatise opening with the declaration that there is only one really serious philosophical problem: suicide.",
      },
      {
        title: "The Stranger (L'Étranger)",
        year: "1942",
        summary: "The legendary novel following Meursault, a detached clerk who refuses to lie about his feelings in a hypocritical society.",
      },
      {
        title: "The Rebel (L'Homme révolté)",
        year: "1951",
        summary: "A profound critique of historical revolutions that devolved into murderous totalitarian state tyrannies.",
      },
    ],
    famousQuotes: [
      "In the depth of winter, I finally learned that within me there lay an invincible summer.",
      "There is only one really serious philosophical problem, and that is suicide.",
      "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.",
      "You will never be happy if you continue to search for what happiness consists of. You will never live if you are looking for the meaning of life.",
    ],
    modules: [
      {
        title: "I. The Discovery of the Absurd",
        description: "The collapse of daily illusions and the awakening of existential absurdity.",
        lessons: ["1.1 The Stage Sets Collapse", "1.2 The Feeling vs. The Concept of the Absurd", "1.3 The Only Serious Philosophical Problem"],
      },
      {
        title: "II. The Three Consequences: Revolt, Freedom, Passion",
        description: "Living without appeal: lucid defiance in an indifferent cosmos.",
        lessons: ["2.1 Rejecting the Leap of Faith", "2.2 The Don Juan and Actor Archetypes", "2.3 The Conquest of Present Freedom"],
      },
      {
        title: "III. Sisyphus at the Foot of the Mountain",
        description: "Transforming punishment into triumph: the tragic hero's smile.",
        lessons: ["3.1 The Absurd Hero", "3.2 The Pause at the Summit", "3.3 One Must Imagine Sisyphus Happy"],
      },
      {
        title: "IV. From Solitary Absurd to Communal Revolt",
        description: "The ethics of moderation, human solidarity, and the critique of tyranny.",
        lessons: ["4.1 The Plague (La Peste) as Collective Trial", "4.2 The Camus-Sartre Rift on Totalitarianism", "4.3 The Invincible Summer"],
      },
    ],
    duration: "6 Weeks • 18 Lectures",
    level: "Foundational to Intermediate",
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
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    era: "c. 340 BCE",
  },
  {
    quote: "Reality is created by the mind; we can change our reality by changing our mind.",
    author: "Plato",
    era: "c. 375 BCE",
  },
  {
    quote: "All things excellent are as difficult as they are rare.",
    author: "Baruch Spinoza",
    era: "1677",
  },
  {
    quote: "Reason is, and ought only to be the slave of the passions.",
    author: "David Hume",
    era: "1739",
  },
  {
    quote: "The history of the world is none other than the progress of the consciousness of freedom.",
    author: "Georg W. F. Hegel",
    era: "1837",
  },
  {
    quote: "Life swings like a pendulum backward and forward between pain and boredom.",
    author: "Arthur Schopenhauer",
    era: "1818",
  },
  {
    quote: "The philosophers have only interpreted the world in various ways; the point is to change it.",
    author: "Karl Marx",
    era: "1845",
  },
  {
    quote: "The whole problem with the world is that fools and fanatics are always so certain of themselves, and wiser people so full of doubts.",
    author: "Bertrand Russell",
    era: "1933",
  },
  {
    quote: "In the depth of winter, I finally learned that within me there lay an invincible summer.",
    author: "Albert Camus",
    era: "1952",
  },
];
