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

const CATEGORY_NAMES_TR: Record<string, string> = {
  ALL: "Tüm Türler",
  Mystery: "Gizem / Macera",
  "Sci-Fi": "Bilim Kurgu",
  "Daily Life": "Günlük Yaşam",
  History: "Tarih",
  Adventure: "Keşif",
  Philosophy: "Felsefe",
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
    <div className="space-y-4 mb-8">
      {/* Top row: Search and count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6E675F] dark:text-[#9A9790]">
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
            placeholder="Hikaye başlığı veya tema ara..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E2D6] dark:border-[#2A2B32] bg-[#FFFFFF] dark:bg-[#1B1C20] text-sm text-[#2A2723] dark:text-[#E6E4DF] placeholder-[#6E675F]/60 focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#52B788] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-[#6E675F] hover:text-[#2A2723] dark:hover:text-[#E6E4DF] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Stories Count */}
        <div className="text-xs font-semibold text-[#6E675F] dark:text-[#9A9790]">
          {totalStoriesCount} Hikaye Listeleniyor
        </div>
      </div>

      {/* Filter Row: Level Pills & Category Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E8E2D6]/80 dark:border-[#2A2B32]">
        {/* CEFR Level Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-bold text-[#6E675F] dark:text-[#9A9790] mr-1 hidden sm:inline">
            Seviye:
          </span>
          {LEVELS.map((lvl) => {
            const isSelected = selectedLevel === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => onSelectLevel(lvl)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-[#2A2723] text-white dark:bg-[#E6E4DF] dark:text-[#121316]"
                    : "bg-[#FFFFFF] dark:bg-[#1B1C20] text-[#6E675F] dark:text-[#9A9790] border border-[#E8E2D6] dark:border-[#2A2B32] hover:bg-[#F7F4EE] dark:hover:bg-[#25262C]"
                }`}
              >
                {lvl === "ALL" ? "Tümü" : lvl}
              </button>
            );
          })}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-[#2D6A4F] text-white dark:bg-[#52B788] dark:text-[#121316]"
                    : "bg-[#FFFFFF] dark:bg-[#1B1C20] text-[#6E675F] dark:text-[#9A9790] border border-[#E8E2D6] dark:border-[#2A2B32] hover:bg-[#F7F4EE] dark:hover:bg-[#25262C]"
                }`}
              >
                {CATEGORY_NAMES_TR[cat] || cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
