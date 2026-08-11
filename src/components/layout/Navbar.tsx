"use client";

import React from "react";
import { UserProfile } from "@/types";

interface NavbarProps {
  currentView: "feed" | "reader";
  onNavigateHome: () => void;
  onOpenVocabulary: () => void;
  onOpenLevelTest: () => void;
  savedWordsCount: number;
  userProfile: UserProfile;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateHome,
  onOpenVocabulary,
  onOpenLevelTest,
  savedWordsCount,
  userProfile,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#E8E2D6] dark:border-[#2A2B32] bg-[#FDFBF7]/90 dark:bg-[#121316]/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-hidden"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] dark:from-[#52B788] dark:to-[#2D6A4F] flex items-center justify-center text-white dark:text-[#121316] shadow-xs group-hover:scale-105 transition-transform">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-[#2A2723] dark:text-[#E6E4DF] leading-none">
              GoLing<span className="text-[#2D6A4F] dark:text-[#52B788]">read</span>
            </div>
            <span className="text-[10px] font-medium tracking-wide text-[#6E675F] dark:text-[#9A9790]">
              %95 COMPREHENSIBLE INPUT
            </span>
          </div>
        </button>

        {/* Center: Main Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          <button
            type="button"
            onClick={onNavigateHome}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              currentView === "feed"
                ? "bg-[#E8F5E9] text-[#1B5E20] dark:bg-[#143820] dark:text-[#81C784]"
                : "text-[#6E675F] dark:text-[#9A9790] hover:text-[#2A2723] dark:hover:text-[#E6E4DF] hover:bg-[#F4EFE6] dark:hover:bg-[#1B1C20]"
            }`}
          >
            📖 Hikayeler
          </button>

          <button
            type="button"
            onClick={onOpenVocabulary}
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-[#6E675F] dark:text-[#9A9790] hover:text-[#2A2723] dark:hover:text-[#E6E4DF] hover:bg-[#F4EFE6] dark:hover:bg-[#1B1C20] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>✨ Kelime Defterim</span>
            <span className="px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-[#E8E2D6] dark:bg-[#2A2B32] text-[#2A2723] dark:text-[#E6E4DF]">
              {savedWordsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenLevelTest}
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-[#6E675F] dark:text-[#9A9790] hover:text-[#2A2723] dark:hover:text-[#E6E4DF] hover:bg-[#F4EFE6] dark:hover:bg-[#1B1C20] transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>🎯 Seviye Testi</span>
          </button>
        </nav>

        {/* Right: Stats, User Level & Theme Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Daily Streak */}
          <div
            title="Günlük Seri: 5 Gün"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF3E0] dark:bg-[#332211] border border-[#FFE0B2] dark:border-[#553818] text-[#E65100] dark:text-[#FFB74D] text-xs font-bold"
          >
            <span>🔥</span>
            <span>{userProfile.dailyStreak} Gün</span>
          </div>

          {/* User CEFR Level Pill */}
          <button
            type="button"
            onClick={onOpenLevelTest}
            title="Seviyeni değiştirmek veya test etmek için tıkla"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] dark:bg-[#143820] border border-[#A5D6A7] dark:border-[#2E7D32] text-[#1B5E20] dark:text-[#81C784] text-xs font-semibold hover:scale-105 transition-transform cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#2E7D32] dark:bg-[#81C784]" />
            <span>Seviye: {userProfile.level}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label="Koyu / Açık Tema Değiştir"
            className="w-9 h-9 rounded-xl border border-[#E8E2D6] dark:border-[#2A2B32] bg-[#FFFFFF] dark:bg-[#1B1C20] text-[#6E675F] dark:text-[#9A9790] hover:text-[#2A2723] dark:hover:text-[#E6E4DF] flex items-center justify-center transition-colors cursor-pointer"
          >
            {isDarkMode ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Submenu Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#E8E2D6]/80 dark:border-[#2A2B32] px-2 py-2 bg-[#FAF7F2] dark:bg-[#16171B]">
        <button
          type="button"
          onClick={onNavigateHome}
          className={`px-3 py-1 text-xs font-medium rounded-lg ${
            currentView === "feed"
              ? "bg-[#E8F5E9] text-[#1B5E20] dark:bg-[#143820] dark:text-[#81C784]"
              : "text-[#6E675F] dark:text-[#9A9790]"
          }`}
        >
          📖 Hikayeler
        </button>
        <button
          type="button"
          onClick={onOpenVocabulary}
          className="px-3 py-1 text-xs font-medium text-[#6E675F] dark:text-[#9A9790] flex items-center gap-1"
        >
          <span>✨ Kelimelerim</span>
          <span className="px-1 py-0.2 bg-[#E8E2D6] dark:bg-[#2A2B32] rounded-full text-[10px]">
            {savedWordsCount}
          </span>
        </button>
        <button
          type="button"
          onClick={onOpenLevelTest}
          className="px-3 py-1 text-xs font-medium text-[#6E675F] dark:text-[#9A9790]"
        >
          🎯 Seviye Testi
        </button>
      </div>
    </header>
  );
};
