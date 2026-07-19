import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Manrope } from "next/font/google";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

import "./globals.css";

const display = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600"] });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jancarlossosa.com"),
  title: { default: "Jancarlos Sosa — AI Engineer", template: "%s — Jancarlos Sosa" },
  description: "AI engineer building agentic systems, applied AI workflows, and production software with deliberate human controls.",
  openGraph: {
    title: "Jancarlos Sosa — AI Engineer",
    description: "Agentic systems and production software, built with deliberate human controls.",
    url: "https://www.jancarlossosa.com",
    siteName: "Jancarlos Sosa",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div className="ambient-field" aria-hidden="true"><span></span><span></span></div>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
