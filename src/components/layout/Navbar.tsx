"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    user,
    userProfile,
    vocabulary,
    isAdmin,
    isDarkMode,
    toggleDarkMode,
    openLevelTestModal,
    openAuthModal,
    signOut,
  } = useAppContext();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  const isHome = pathname === "/";
  const isVocabulary = pathname === "/vocabulary";

  const userInitial = (userProfile.name || userProfile.email || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#E5E7EB] dark:border-[#2E2E2E] bg-[#FDFBF7]/90 dark:bg-[#121212]/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-hidden"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-500 dark:to-indigo-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
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
            <div className="text-xl font-bold tracking-tight text-[#1F2937] dark:text-[#E5E7EB] leading-none">
              GoLing<span className="text-indigo-600 dark:text-indigo-400">read</span>
            </div>
            <span className="text-[10px] font-medium tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">
              95% COMPREHENSIBLE INPUT
            </span>
          </div>
        </Link>

        {/* Center: Main Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link
            href="/"
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              isHome
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#E5E7EB] hover:bg-[#F3F4F6] dark:hover:bg-[#1E1E1E]"
            }`}
          >
            📖 Stories
          </Link>

          <Link
            href="/vocabulary"
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              isVocabulary
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#E5E7EB] hover:bg-[#F3F4F6] dark:hover:bg-[#1E1E1E]"
            }`}
          >
            <span>✨ My Vocabulary</span>
            <span className="px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-[#E5E7EB] dark:bg-[#2E2E2E] text-[#1F2937] dark:text-[#E5E7EB]">
              {vocabulary.length}
            </span>
          </Link>

          <button
            type="button"
            onClick={openLevelTestModal}
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#E5E7EB] hover:bg-[#F3F4F6] dark:hover:bg-[#1E1E1E] transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>🎯 Level Test</span>
          </button>
        </nav>

        {/* Right: User Status, Streak & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Daily Streak */}
          <div
            title={`Daily Streak: ${userProfile.dailyStreak} Days`}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-bold"
          >
            <span>🔥</span>
            <span>{userProfile.dailyStreak} Days</span>
          </div>

          {/* User CEFR Level Pill */}
          <button
            type="button"
            onClick={openLevelTestModal}
            title="Click to test or recalibrate your level"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold hover:scale-105 transition-transform cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Level: {userProfile.level}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle Light / Dark Mode"
            className="w-9 h-9 rounded-xl border border-[#E5E7EB] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#E5E7EB] flex items-center justify-center transition-colors cursor-pointer"
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

          {/* Auth Action: Sign In Button or User Dropdown */}
          {!user ? (
            <button
              type="button"
              onClick={openAuthModal}
              className="py-1.5 px-3 sm:px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span>Sign In</span>
            </button>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform overflow-hidden"
              >
                {userProfile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{userInitial}</span>
                )}
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#2E2E2E] shadow-xl p-3 z-40 animate-in fade-in duration-150">
                  <div className="px-3 py-2 border-b border-[#E5E7EB] dark:border-[#2E2E2E] mb-2">
                    <p className="text-xs font-bold text-[#1F2937] dark:text-[#E5E7EB] truncate">
                      {userProfile.name}
                    </p>
                    <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] truncate">
                      {userProfile.email || user.email}
                    </p>
                  </div>

                  <Link
                    href="/vocabulary"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full px-3 py-2 text-xs font-medium text-[#1F2937] dark:text-[#E5E7EB] hover:bg-[#F3F4F6] dark:hover:bg-[#252528] rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <span>✨</span>
                    <span>My Vocabulary ({vocabulary.length})</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin/generate"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full px-3 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl flex items-center gap-2 transition-colors"
                    >
                      <span>⚡</span>
                      <span>AI Story Studio</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      openLevelTestModal();
                    }}
                    className="w-full px-3 py-2 text-xs font-medium text-[#1F2937] dark:text-[#E5E7EB] hover:bg-[#F3F4F6] dark:hover:bg-[#252528] rounded-xl flex items-center gap-2 transition-colors cursor-pointer text-left"
                  >
                    <span>🎯</span>
                    <span>Level Calibration ({userProfile.level})</span>
                  </button>

                  <div className="pt-2 mt-2 border-t border-[#E5E7EB] dark:border-[#2E2E2E]">
                    <button
                      type="button"
                      onClick={async () => {
                        setIsUserMenuOpen(false);
                        await signOut();
                      }}
                      className="w-full px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl flex items-center gap-2 transition-colors cursor-pointer text-left"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Submenu Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#E5E7EB] dark:border-[#2E2E2E] px-2 py-2 bg-[#FDFBF7] dark:bg-[#181818]">
        <Link
          href="/"
          className={`px-3 py-1 text-xs font-medium rounded-lg ${
            isHome
              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
              : "text-[#6B7280] dark:text-[#9CA3AF]"
          }`}
        >
          📖 Stories
        </Link>
        <Link
          href="/vocabulary"
          className={`px-3 py-1 text-xs font-medium flex items-center gap-1 ${
            isVocabulary
              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
              : "text-[#6B7280] dark:text-[#9CA3AF]"
          }`}
        >
          <span>✨ Vocabulary</span>
          <span className="px-1 py-0.2 bg-[#E5E7EB] dark:bg-[#2E2E2E] rounded-full text-[10px]">
            {vocabulary.length}
          </span>
        </Link>
        <button
          type="button"
          onClick={openLevelTestModal}
          className="px-3 py-1 text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF]"
        >
          🎯 Level Test
        </button>
      </div>
    </header>
  );
};
