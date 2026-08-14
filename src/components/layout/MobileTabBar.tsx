"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

export const MobileTabBar: React.FC = () => {
  const pathname = usePathname();
  const {
    user,
    userProfile,
    vocabulary,
    openLevelTestModal,
    openAuthModal,
    signOut,
  } = useAppContext();

  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState<boolean>(false);

  const isHome = pathname === "/";
  const isVocabulary = pathname === "/vocabulary";
  const isStoryReader = pathname.startsWith("/story/");

  // Don't show bottom tab bar on story reading canvas to provide maximum distraction-free reading space
  if (isStoryReader) {
    return null;
  }

  return (
    <>
      {/* Profile Bottom Sheet Modal for Mobile */}
      {isProfileSheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end animate-in fade-in duration-200">
          {/* Backdrop Scrim */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
            onClick={() => setIsProfileSheetOpen(false)}
          />

          {/* Sheet Content */}
          <div className="relative z-10 bg-white dark:bg-[#1A1A1E] rounded-t-3xl border-t border-[#E5E7EB] dark:border-[#2E2E2E] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 pb-safe">
            {/* Drag Handle */}
            <div className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4" />

            {/* Profile Info Header */}
            <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-[#E5E7EB] dark:border-[#2E2E2E]">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white font-bold text-lg flex items-center justify-center shadow-sm">
                {(userProfile.name || userProfile.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#1F2937] dark:text-[#E5E7EB] truncate">
                    {userProfile.name || "Reader"}
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Level {userProfile.level}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] truncate">
                  {user ? user.email : "Guest Reader (Local Storage)"}
                </p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              <div className="p-3 rounded-2xl bg-[#F7F4EE] dark:bg-[#252528] text-center border border-[#E5E7EB] dark:border-[#2E2E2E]">
                <div className="text-base font-extrabold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                  <span>🔥</span>
                  <span>{userProfile.dailyStreak}d</span>
                </div>
                <span className="text-[10px] font-semibold text-[#6B7280] dark:text-[#9CA3AF] block mt-0.5">
                  Daily Streak
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F7F4EE] dark:bg-[#252528] text-center border border-[#E5E7EB] dark:border-[#2E2E2E]">
                <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1">
                  <span>⚡</span>
                  <span>{userProfile.xp || 0}</span>
                </div>
                <span className="text-[10px] font-semibold text-[#6B7280] dark:text-[#9CA3AF] block mt-0.5">
                  Total XP
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F7F4EE] dark:bg-[#252528] text-center border border-[#E5E7EB] dark:border-[#2E2E2E]">
                <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                  <span>✨</span>
                  <span>{vocabulary.length}</span>
                </div>
                <span className="text-[10px] font-semibold text-[#6B7280] dark:text-[#9CA3AF] block mt-0.5">
                  Saved Words
                </span>
              </div>
            </div>

            {/* Quick Actions List */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsProfileSheetOpen(false);
                  openLevelTestModal();
                }}
                className="w-full p-3.5 rounded-2xl bg-[#F7F4EE] dark:bg-[#252528] hover:bg-[#EFE9DC] text-left font-bold text-xs text-[#1F2937] dark:text-[#E5E7EB] flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🎯</span>
                  <span>CEFR Level Diagnostic Test</span>
                </div>
                <span className="text-indigo-600 dark:text-indigo-400 text-xs">Test Now →</span>
              </button>

              {user ? (
                <button
                  type="button"
                  onClick={async () => {
                    setIsProfileSheetOpen(false);
                    await signOut();
                  }}
                  className="w-full p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileSheetOpen(false);
                    openAuthModal();
                  }}
                  className="w-full p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98]"
                >
                  <span>Sign In / Create Free Account</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Mobile Bottom Tab Bar */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-xl border-t border-[#E5E7EB] dark:border-[#2E2E2E] shadow-lg px-3 py-1.5 flex items-center justify-around pb-safe"
      >
        {/* 1. Stories Tab */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            isHome
              ? "text-indigo-600 dark:text-indigo-400 font-bold scale-105"
              : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937]"
          }`}
        >
          <div className="relative">
            <svg className="w-5 h-5" fill={isHome ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isHome ? 2.2 : 1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {isHome && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">Stories</span>
        </Link>

        {/* 2. Vocabulary Deck Tab */}
        <Link
          href="/vocabulary"
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer relative ${
            isVocabulary
              ? "text-indigo-600 dark:text-indigo-400 font-bold scale-105"
              : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937]"
          }`}
        >
          <div className="relative">
            <svg className="w-5 h-5" fill={isVocabulary ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isVocabulary ? 2.2 : 1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {vocabulary.length > 0 && (
              <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-indigo-600 text-white text-[8px] font-extrabold shadow-2xs">
                {vocabulary.length > 99 ? "99+" : vocabulary.length}
              </span>
            )}
            {isVocabulary && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">Vocab</span>
        </Link>

        {/* 3. Level Test Quick Action */}
        <button
          type="button"
          onClick={openLevelTestModal}
          className="flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] transition-all cursor-pointer"
        >
          <div className="relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" strokeWidth={1.8} />
              <circle cx="12" cy="12" r="5" strokeWidth={1.8} />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
            <span className="absolute -top-1 -right-2.5 px-1 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[8px] font-bold">
              {userProfile.level}
            </span>
          </div>
          <span className="text-[10px] tracking-tight">Level Test</span>
        </button>

        {/* 4. Profile & Badges Tab */}
        <button
          type="button"
          onClick={() => setIsProfileSheetOpen(true)}
          className="flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] transition-all cursor-pointer"
        >
          <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
            <span>🔥</span>
          </div>
          <span className="text-[10px] tracking-tight">{userProfile.dailyStreak}d Streak</span>
        </button>
      </nav>
    </>
  );
};
