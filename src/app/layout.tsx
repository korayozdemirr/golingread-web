import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoLingread | 95% Comprehensible Input English Reading",
  description:
    "Learn English naturally by reading stories with targeted 95%+ comprehension, instant word translations, and smart vocabulary tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="min-h-screen flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-700 dark:selection:bg-indigo-400/20 dark:selection:text-indigo-300">
        {children}
      </body>
    </html>
  );
}
