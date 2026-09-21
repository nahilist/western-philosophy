import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
import { LanguageProvider } from "@/context/LanguageContext";
import { FloatingLanguageButton } from "@/components/LanguageTranslator";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PHILOSOPHY Φ — The Great Thinkers & Classical Inquiry",
  description:
    "An exploration of Western Philosophy: René Descartes, Friedrich Nietzsche, Sócrates, and Nicolau Maquiavel. Comprehensive courses, aphorisms, and timeless inquiries into truth, reality, and morality.",
  keywords: [
    "Western Philosophy",
    "René Descartes",
    "Friedrich Nietzsche",
    "Socrates",
    "Machiavelli",
    "Epistemology",
    "Existentialism",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${cinzel.variable} ${cormorant.variable} ${inter.variable} bg-black text-white antialiased min-h-screen selection:bg-white selection:text-black overflow-x-hidden`}
      >
        {/* Hidden Google Translate Element Anchor (offscreen so script initializes combo) */}
        <div
          id="google_translate_element"
          className="fixed -top-[9999px] -left-[9999px] opacity-0 pointer-events-none w-0 h-0 overflow-hidden"
        />

        {/* Google Translate Init Script */}
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            window.googleTranslateElementInit = function() {
              try {
                if (window.google && window.google.translate) {
                  new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'en,hi',
                    autoDisplay: false
                  }, 'google_translate_element');
                }
              } catch (e) {
                console.warn('Google translate init error:', e);
              }
            };
          `}
        </Script>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />

        <LanguageProvider>
          {children}
          {/* Global Floating Hindi Translator Pill */}
          <FloatingLanguageButton />
        </LanguageProvider>
      </body>
    </html>
  );
}


