"use client";

import React from "react";
import { CEFRLevel, StoryCategory } from "@/types";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLevel: CEFRLevel | "ALL";
  onSelectLevel: (level: CEFRLevel | "ALL") => void;
  selectedCategory: StoryCategory | "ALL";
  onSelectCategory: (category: StoryCategory | "ALL") => void;
  totalStoriesCount: number;
}

const CATEGORIES: (StoryCategory | "ALL")[] = [
  "ALL",
  "Mystery",
  "Sci-Fi",
  "Daily Life",
  "History",
  "Adventure",
  "Philosophy",
];

const CATEGORY_NAMES_EN: Record<string, string> = {
  ALL: "All Categories",
  Mystery: "Mystery",
  "Sci-Fi": "Sci-Fi",
  "Daily Life": "Daily Life",
  History: "History",
  Adventure: "Adventure",
  Philosophy: "Philosophy",
};

const LEVELS: (CEFRLevel | "ALL")[] = ["ALL", "A1", "A2", "B1", "B2", "C1"];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedLevel,
  onSelectLevel,
  selectedCategory,
  onSelectCategory,
  totalStoriesCount,
}) => {
  return (
    <div className="space-y-3.5 mb-6 sm:mb-8">
      {/* Top row: Search and count */}
      <div className="flex flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B7280] dark:text-[#9CA3AF]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search stories by keyword..."
            className="w-full pl-10 pr-8 py-2.5 rounded-2xl border border-[#E5E7EB] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-xs sm:text-sm text-[#1F2937] dark:text-[#E5E7EB] placeholder-[#6B7280]/60 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-[#6B7280] hover:text-[#1F2937] dark:hover:text-[#E5E7EB] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Stories Count Badge */}
        <div className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 px-2.5 py-1 rounded-full shrink-0">
          {totalStoriesCount} Stories
        </div>
      </div>

      {/* Filter Row: Level Pills & Category Pills */}
      <div className="space-y-2 pb-2 border-b border-[#E5E7EB] dark:border-[#2E2E2E]">
        {/* CEFR Level Filter (Horizontal scrollable carousel on mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF] mr-1 hidden sm:inline">
            Level:
          </span>
          {LEVELS.map((lvl) => {
            const isSelected = selectedLevel === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => onSelectLevel(lvl)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 active:scale-95 ${
                  isSelected
                    ? "bg-[#1F2937] text-white dark:bg-[#E5E7EB] dark:text-[#121212] shadow-xs"
                    : "bg-white dark:bg-[#1E1E1E] text-[#6B7280] dark:text-[#9CA3AF] border border-[#E5E7EB] dark:border-[#2E2E2E] hover:bg-[#F9FAFB] dark:hover:bg-[#252528]"
                }`}
              >
                {lvl === "ALL" ? "All Levels" : lvl}
              </button>
            );
          })}
        </div>

        {/* Category Pills (Horizontal scrollable carousel on mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer shrink-0 active:scale-95 ${
                  isSelected
                    ? "bg-indigo-600 text-white dark:bg-indigo-500 shadow-xs"
                    : "bg-white dark:bg-[#1E1E1E] text-[#6B7280] dark:text-[#9CA3AF] border border-[#E5E7EB] dark:border-[#2E2E2E] hover:bg-[#F9FAFB] dark:hover:bg-[#252528]"
                }`}
              >
                {CATEGORY_NAMES_EN[cat] || cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
