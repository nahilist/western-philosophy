"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Send,
  ShieldCheck,
  CheckCircle,
  Clock,
  MapPin,
  HelpCircle,
  Compass,
  ScrollText,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DailyWisdomModal from "@/components/DailyWisdomModal";
import AuthModal from "@/components/AuthModal";
import { AuthProvider } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { submitContactInquiry } from "@/lib/supabase/queries";

function ContactPageContent() {
  const { t, language } = useLanguage();
  const isHi = language === "hi";
  const [dailyWisdomOpen, setDailyWisdomOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [discipline, setDiscipline] = useState("Epistemology");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [requestCritique, setRequestCritique] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const res = await submitContactInquiry({
      name,
      email,
      discipline,
      subject,
      message,
      honeypot,
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsSubmitted(true);
    } else {
      setErrorMessage(
        res.error || (isHi ? "संदेश भेजने में त्रुटि हुई।" : "Failed to transmit epistle.")
      );
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubject("");
    setMessage("");
  };

  const faqs = [
    {
      q: isHi ? "अकादमी किन विषयों पर संवाद स्वीकार करती है?" : "What inquiries does the Academy review?",
      a: isHi
        ? "हम शास्त्रीय पाश्चात्य दर्शन, ज्ञानमीमांसा, तत्वमीमांसा, नीतिशास्त्र, अनुवाद सुधार, और अकादमिक अध्ययन समूहों से संबंधित सभी तार्किक विमर्शों का स्वागत करते हैं।"
        : "We welcome critical correspondence pertaining to classical epistemology, metaphysics, normative ethics, translation critique, and reading group proposals.",
    },
    {
      q: isHi ? "क्या स्वतंत्र शोधकर्ता नए दार्शनिकों का सुझाव दे सकते हैं?" : "Can scholars propose additions to the Canon?",
      a: isHi
        ? "हाँ। यदि आप किसी प्रमुख दार्शनिक (उदा. स्पिनोज़ा, कीर्केगार्ड, या लॉक) पर विस्तृत समीक्षा प्रस्तुत करना चाहते हैं, तो कृपया 'General Philosophical Discourse' चुनकर प्रेषित करें।"
        : "Yes. Inquiries advocating for additional seminal thinkers or expanding canonical monographs are systematically evaluated by our archival board.",
    },
    {
      q: isHi ? "पत्राचार की गोपनीयता कैसे सुनिश्चित की जाती है?" : "How is correspondence privacy safeguarded?",
      a: isHi
        ? "सभी प्रेषण कड़े सुरक्षा नियमों (Row-Level Security) और इनपुट सैनिटाइजेशन द्वारा सुरक्षित हैं। हम कभी भी किसी तीसरे पक्ष को डेटा नहीं सौंपते।"
        : "All dispatches are transmitted via parameterized prepared statements guarded by strict PostgreSQL Row-Level Security with zero third-party telemetry.",
    },
    {
      q: isHi ? "उत्तर प्राप्त होने की समय-सीमा क्या है?" : "What is the expected response horizon?",
      a: isHi
        ? "प्रत्येक संदेश की विद्वानों द्वारा समीक्षा की जाती है। अधिकांश वैध दार्शनिक जिज्ञासाओं का उत्तर 2 से 3 दिनों के भीतर प्रेषित कर दिया जाता है।"
        : "Due to the dialectical rigor applied to each missive, responses are typically dispatched within two to three business days.",
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
          <span>{isHi ? "दार्शनिक पत्राचार" : "Epistolae"}</span>
          <span className="text-neutral-600">•</span>
          <span>DISPATCH</span>
        </div>
      </div>

      {/* ========================================================
          1. HERO BANNER: THE EPISTOLARY TRADITION (Full-Width)
         ======================================================== */}
      <section className="w-full py-16 sm:py-24 lg:py-28 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-black">
        <div className="w-full max-w-6xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-neutral-800 bg-neutral-950 text-xs uppercase tracking-[0.2em] text-neutral-200 font-mono font-medium">
            <ScrollText className="w-3.5 h-3.5 text-neutral-300" />
            <span>{t.contactPage?.tag || "THE EPISTOLARY TRADITION"}</span>
          </div>

          <h1 className="font-serif-classic text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[0.12em] text-white uppercase leading-none">
            {t.contactPage?.title || "TRANSMIT YOUR DISCOURSE"}
          </h1>

          <div className="w-20 h-px bg-neutral-800" />

          <p className="font-garamond text-lg sm:text-2xl text-neutral-200 leading-relaxed font-light max-w-4xl">
            {t.contactPage?.subtitle ||
              "Philosophical thought has always progressed through the rigorous exchange of written correspondence. Whether seeking clarification on classical treatises, proposing dialectical seminars, or submitting critical corrections—inscribe your dispatch below."}
          </p>

          <blockquote className="pt-2 text-sm sm:text-base font-garamond italic text-neutral-300 border-l border-neutral-800 pl-4 max-w-3xl">
            {t.contactPage?.leadQuote ||
              "“Letters speak with absent friends as if they were present before us.”"}
            <span className="not-italic text-xs font-mono text-neutral-400 block mt-1.5 font-medium">
              {t.contactPage?.leadQuoteAuthor || "— Seneca the Younger, Epistulae Morales"}
            </span>
          </blockquote>
        </div>
      </section>

      {/* ========================================================
          2. TWO-COLUMN SPLIT: SECRETARIAT & DISPATCH FORM
         ======================================================== */}
      <section className="w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 border-b border-neutral-900 bg-black">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 items-start">
          {/* ----------------------------------------------------
              LEFT COLUMN: ACADEMY SECRETARIAT & COORDINATES (5 Cols)
             ---------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-32">
            <div className="space-y-3">
              <span className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-medium block">
                COORDINATES
              </span>
              <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
                {t.contactPage?.secretariatTitle || "ACADEMY SECRETARIAT"}
              </h2>
              <p className="font-garamond text-base text-neutral-300 leading-relaxed">
                {t.contactPage?.secretariatDesc ||
                  "Direct epistolary channels guarded by cryptographic privacy and academic fidelity."}
              </p>
            </div>

            {/* Direct Digital Epistles */}
            <div className="space-y-4 pt-2">
              <div className="p-5 border border-neutral-800 bg-neutral-950/80 space-y-2 hover:border-neutral-700 transition-colors">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="uppercase tracking-wider text-neutral-300 font-medium">
                    GENERAL INQUIRIES
                  </span>
                  <Mail className="w-3.5 h-3.5 text-neutral-300" />
                </div>
                <a
                  href="mailto:inquiries@philosophy.org"
                  className="font-mono text-sm text-neutral-100 hover:text-white transition-colors block"
                >
                  inquiries@philosophy.org
                </a>
                <p className="text-xs text-neutral-300 font-garamond leading-relaxed">
                  {isHi
                    ? "सामान्य दार्शनिक जिज्ञासा एवं अकादमिक सहयोग।"
                    : "For discourse, curricula, and institutional partnership."}
                </p>
              </div>

              <div className="p-5 border border-neutral-800 bg-neutral-950/80 space-y-2 hover:border-neutral-700 transition-colors">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="uppercase tracking-wider text-neutral-300 font-medium">
                    MANUSCRIPT &amp; TRANSLATION CODEX
                  </span>
                  <ScrollText className="w-3.5 h-3.5 text-neutral-300" />
                </div>
                <a
                  href="mailto:translations@philosophy.org"
                  className="font-mono text-sm text-neutral-100 hover:text-white transition-colors block"
                >
                  translations@philosophy.org
                </a>
                <p className="text-xs text-neutral-300 font-garamond leading-relaxed">
                  {isHi
                    ? "ग्रंथों, मूल पाठ व अनुवाद संबंधी सुधार एवं समालोचना।"
                    : "For philological feedback, Greek/Latin corrections, and Hindi treatises."}
                </p>
              </div>

              <div className="p-5 border border-neutral-800 bg-neutral-950/80 space-y-2 hover:border-neutral-700 transition-colors">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="uppercase tracking-wider text-neutral-300 font-medium">
                    SEMINARS &amp; READING CHAPTERS
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
                </div>
                <a
                  href="mailto:seminars@philosophy.org"
                  className="font-mono text-sm text-neutral-100 hover:text-white transition-colors block"
                >
                  seminars@philosophy.org
                </a>
                <p className="text-xs text-neutral-300 font-garamond leading-relaxed">
                  {isHi
                    ? "साप्ताहिक ऑनलाइन अध्ययन सत्र एवं विद्वत परिसंवाद।"
                    : "For dialetical seminar registration and colloquium schedules."}
                </p>
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="p-5 border border-neutral-800 bg-black space-y-2 text-xs font-mono text-neutral-300">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span className="uppercase tracking-wider font-semibold">
                  100% Parameterized &amp; Encrypted
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-mono">
                {isHi
                  ? "सभी प्रेषण SQL इंजेक्शन व स्पैम सुरक्षा मानकों से सुरक्षित हैं। कोई बाहरी ट्रैकर सक्रिय नहीं है।"
                  : "Protected against query exploits, injection, and denial-of-service. Transmissions are archived with strict schema constraints."}
              </p>
            </div>
          </div>

          {/* ----------------------------------------------------
              RIGHT COLUMN: LUXURY DISPATCH FORM (7 Cols)
             ---------------------------------------------------- */}
          <div className="lg:col-span-7 bg-neutral-950 border border-neutral-800 p-8 sm:p-12 shadow-[0_20px_70px_rgba(0,0,0,0.95)]">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 pb-4 border-b border-neutral-900">
                  <span className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-medium">
                    DISPATCH TRANSMISSION
                  </span>
                  <h3 className="font-serif-classic text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
                    {t.contactPage?.formTitle || "INSCRIBE AN EPISTLE"}
                  </h3>
                  <p className="font-garamond text-sm text-neutral-300">
                    {t.contactPage?.formDesc ||
                      "All correspondence is reviewed with dialectical rigor. Dispatches receive response within two to three celestial rotations."}
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Honeypot Anti-Spam Trap */}
                <input
                  type="text"
                  name="bot_field_trap"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="opacity-0 absolute -z-50 pointer-events-none w-0 h-0"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Sender's Name */}
                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 font-medium">
                      {t.contactPage?.nameLabel || "Sender's Full Name"} *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      placeholder="e.g. Baruch Spinoza"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black border border-neutral-800 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  {/* Electronic Mail Address */}
                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 font-medium">
                      {t.contactPage?.emailLabel || "Electronic Mail Address"} *
                    </label>
                    <input
                      type="email"
                      required
                      maxLength={255}
                      placeholder="scholar@academy.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black border border-neutral-800 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors font-mono"
                    />
                  </div>
                </div>

                {/* Discipline of Inquiry */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 font-medium">
                    {t.contactPage?.disciplineLabel || "Discipline of Inquiry"}
                  </label>
                  <select
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    className="w-full bg-black border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                  >
                    <option value="Epistemology">Epistemology &amp; Theory of Knowledge (ज्ञानमीमांसा)</option>
                    <option value="Metaphysics">Metaphysics &amp; Ontology (तत्वमीमांसा)</option>
                    <option value="Ethics">Moral Duty &amp; Virtue Ethics (नीतिशास्त्र)</option>
                    <option value="Translation Critique">Manuscript &amp; Translation Critique (अनुवाद एवं मूल पाठ)</option>
                    <option value="Seminars">Academy Seminars &amp; Reading Chapters (अध्ययन संगोष्ठी)</option>
                    <option value="General Inquiry">General Philosophical Discourse (सामान्य दार्शनिक विमर्श)</option>
                  </select>
                </div>

                {/* Subject of Treatise */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 font-medium">
                    {t.contactPage?.subjectLabel || "Subject of Treatise"}
                  </label>
                  <input
                    type="text"
                    maxLength={200}
                    placeholder="e.g. On the Synthesis of A Priori Judgments in Kant"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-black border border-neutral-800 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                {/* Message / Treatise Body */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 font-medium">
                      {t.contactPage?.messageLabel || "The Dispatch / Inquiry Text"} *
                    </label>
                    <span className="text-xs font-mono text-neutral-400">
                      {message.length} / 3000 chars
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    required
                    maxLength={3000}
                    placeholder={
                      isHi
                        ? "अपना दार्शनिक तर्क, प्रश्न या विचार यहाँ विस्तार से लिखें..."
                        : "Formulate your dialectical inquiry, premises, or textual observations here..."
                    }
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-black border border-neutral-800 p-4 text-base text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors resize-none font-garamond leading-relaxed"
                  />
                </div>

                {/* Checkbox: Critique option */}
                <label className="flex items-center gap-3 text-xs sm:text-sm text-neutral-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={requestCritique}
                    onChange={(e) => setRequestCritique(e.target.checked)}
                    className="accent-white cursor-pointer"
                  />
                  <span>
                    {isHi
                      ? "अकादमी के विद्वानों से औपचारिक तार्किक प्रतिवाद (Rebuttal) का अनुरोध करें"
                      : "Request a formal scholarly critique / counter-argument from the Academy"}
                  </span>
                </label>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t.contactPage?.submittingText || "Inscribing into Archives..."}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t.contactPage?.submitButton || "INSCRIBE & DISPATCH EPISTLE"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Success Confirmation Card */
              <div className="text-center py-12 space-y-6 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full border border-white mx-auto flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-medium block">
                    ARCHIVAL CONFIRMATION
                  </span>
                  <h3 className="font-serif-classic text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
                    {t.contactPage?.successTitle || "Epistle Successfully Transmitted"}
                  </h3>
                  <p className="font-garamond text-neutral-200 text-base max-w-md mx-auto leading-relaxed">
                    {t.contactPage?.successDesc ||
                      "Your dispatch has been preserved in the Academy’s intellectual register. A scholar shall review your inquiry."}
                  </p>
                </div>

                <div className="p-4 bg-neutral-900/60 border border-neutral-800 text-xs font-mono text-neutral-300 max-w-sm mx-auto">
                  <span>DISPATCH RECEIPT: #{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleReset}
                    className="px-8 py-3 border border-neutral-700 hover:border-white text-xs uppercase tracking-[0.2em] text-neutral-300 hover:text-white transition-colors"
                  >
                    {t.contactPage?.resetButton || "Transmit Another Inquiry"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SECTION 03: DIALECTICAL PROTOCOL & FAQ (Full-Bleed)
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
                  PROTOCOL &amp; INQUIRY STANDARDS
                </span>
              </div>
              <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.12em] text-white uppercase">
                {isHi ? "संवाद नियमावली एवं सामान्य प्रश्न" : "Frequently Contemplated Inquiries"}
              </h2>
            </div>
            <p className="text-xs text-neutral-400 tracking-widest uppercase font-mono">
              SCHOLARLY CONDUCT
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-8 border border-neutral-900 bg-black/60 space-y-3 hover:border-neutral-800 transition-colors"
              >
                <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 font-medium">
                  <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                  <span>INQUIRY 0{idx + 1}</span>
                </div>
                <h3 className="font-serif-classic text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                  {faq.q}
                </h3>
                <div className="w-8 h-px bg-neutral-800" />
                <p className="font-garamond text-base text-neutral-300 leading-relaxed font-light">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <DailyWisdomModal
        isOpen={dailyWisdomOpen}
        onClose={() => setDailyWisdomOpen(false)}
      />
      <AuthModal />
    </div>
  );
}

export default function ContactPage() {
  return (
    <AuthProvider>
      <ContactPageContent />
    </AuthProvider>
  );
}
