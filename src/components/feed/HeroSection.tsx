"use client";

import React from "react";
import { CEFRLevel, UserProfile } from "@/types";

interface HeroSectionProps {
  userProfile: UserProfile;
  onChangeLevel: (level: CEFRLevel) => void;
  onOpenLevelTest: () => void;
}

const CEFR_LEVELS: { level: CEFRLevel; label: string; desc: string }[] = [
  { level: "A1", label: "A1", desc: "Beginner" },
  { level: "A2", label: "A2", desc: "Elementary" },
  { level: "B1", label: "B1", desc: "Intermediate" },
  { level: "B2", label: "B2", desc: "Upper Int." },
  { level: "C1", label: "C1", desc: "Advanced" },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  userProfile,
  onChangeLevel,
  onOpenLevelTest,
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#FAF7F0] to-[#F5EFE6] dark:from-[#1A1A1E] dark:to-[#121214] border border-[#E5E7EB] dark:border-[#2E2E2E] p-6 sm:p-10 mb-10 shadow-xs transition-colors">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl relative z-10">
        {/* Krashen Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-4">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-400" />
          </span>
          <span>Stephen Krashen: 95% Comprehensible Input Hypothesis</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1F2937] dark:text-[#E5E7EB] leading-tight mb-4 font-sans">
          Read at your level, <br className="hidden sm:inline" />
          <span className="text-indigo-600 dark:text-indigo-400 underline decoration-wavy decoration-indigo-400/40">
            acquire English naturally.
          </span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed mb-8">
          When you read stories where you already know <strong>95%+ of the vocabulary</strong>, your brain unlocks new words effortlessly from context without dictionary fatigue.
        </p>

        {/* Level Calibrator Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-[#1E1E1E]/90 border border-[#E5E7EB] dark:border-[#2E2E2E] shadow-xs backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">
                Your Current Level
              </span>
              <p className="text-sm font-semibold text-[#1F2937] dark:text-[#E5E7EB]">
                Story Match scores recalculate dynamically for your level:
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenLevelTest}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1 self-start sm:self-auto"
            >
              <span>⚡ Test My Level (1 Min)</span>
            </button>
          </div>

          {/* Level Chips */}
          <div className="grid grid-cols-5 gap-2">
            {CEFR_LEVELS.map((item) => {
              const isActive = userProfile.level === item.level;
              return (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => onChangeLevel(item.level)}
                  className={`py-2 px-2 rounded-xl text-center transition-all cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md font-bold scale-[1.02] dark:bg-indigo-500"
                      : "bg-[#F7F4EE] dark:bg-[#252528] text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#EAE4D7] dark:hover:bg-[#303035] font-medium"
                  }`}
                >
                  <div className="text-sm sm:text-base font-bold leading-none mb-1">
                    {item.label}
                  </div>
                  <div className="text-[10px] sm:text-[11px] opacity-80 truncate hidden sm:block">
                    {item.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
