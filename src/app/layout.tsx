import type { Metadata, Viewport } from "next";
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

import { AppProvider } from "@/context/AppContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { MobileTabBar } from "@/components/layout/MobileTabBar";

export const metadata: Metadata = {
  title: "GoLingread | 95% Comprehensible Input English Reading",
  description:
    "Learn English naturally by reading stories with targeted 95%+ comprehension, instant word translations, and smart vocabulary tracking.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GoLingread",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFBF7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} overflow-x-hidden overscroll-none`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-dvh flex flex-col font-sans overflow-x-hidden overscroll-none selection:bg-indigo-500/20 selection:text-indigo-700 dark:selection:bg-indigo-400/20 dark:selection:text-indigo-300">
        <AppProvider>
          {children}
          <MobileTabBar />
          <AuthModal />
        </AppProvider>
      </body>
    </html>
  );
}
