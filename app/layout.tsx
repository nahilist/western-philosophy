import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Inter } from "next/font/google";
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
        {children}
      </body>
    </html>
  );
}
