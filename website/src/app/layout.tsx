import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "saroku — Behavioral Reliability Testing for LLMs",
  description:
    "saroku measures whether your LLM holds its positions under pressure, answers consistently across phrasings, and stays honest when users push back. Detect behavioral drift before it reaches production.",
  keywords: [
    "LLM testing",
    "behavioral regression",
    "sycophancy detection",
    "model reliability",
    "model evaluation",
    "ML engineering",
    "AI alignment",
  ],
  openGraph: {
    title: "saroku — Behavioral Reliability Testing for LLMs",
    description:
      "Test what your model values, not just what it knows. Detect sycophancy, honesty drift, and consistency failures before they reach production.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('saroku-theme');
                  if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
