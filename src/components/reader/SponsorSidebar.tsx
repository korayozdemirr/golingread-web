"use client";

import React from "react";
import { ReadingTheme } from "@/types";

interface SponsorSidebarProps {
  readingTheme?: ReadingTheme;
}

export const SponsorSidebar: React.FC<SponsorSidebarProps> = ({
  readingTheme = "cream",
}) => {
  const sidebarStyles: Record<
    ReadingTheme,
    {
      cardBg: string;
      border: string;
      titleColor: string;
      textColor: string;
      bannerBg: string;
    }
  > = {
    cream: {
      cardBg: "bg-white",
      border: "border-[#E5E7EB]",
      titleColor: "text-[#111827]",
      textColor: "text-[#4B5563]",
      bannerBg: "bg-[#F9FAFB]",
    },
    white: {
      cardBg: "bg-[#FAFAFA]",
      border: "border-[#E5E7EB]",
      titleColor: "text-[#111827]",
      textColor: "text-[#4B5563]",
      bannerBg: "bg-white",
    },
    sepia: {
      cardBg: "bg-[#EFE5CD]",
      border: "border-[#DECDB2]",
      titleColor: "text-[#2B2118]",
      textColor: "text-[#6E543D]",
      bannerBg: "bg-[#F4ECD8]",
    },
    dark: {
      cardBg: "bg-[#1E1E1E]",
      border: "border-[#2E2E2E]",
      titleColor: "text-[#F9FAFB]",
      textColor: "text-[#9CA3AF]",
      bannerBg: "bg-[#252528]",
    },
  };

  const theme = sidebarStyles[readingTheme];

  return (
    <aside className="space-y-6">
      {/* Premium Feature Card */}
      <div className={`p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/60 dark:from-indigo-950/40 dark:to-indigo-900/20 border border-indigo-200/80 dark:border-indigo-800/40 shadow-xs`}>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-2">
          <span>✨ GoLingread Plus</span>
        </div>
        <h4 className={`text-sm font-bold ${theme.titleColor} mb-1`}>
          Personalized AI Story Generator
        </h4>
        <p className={`text-xs ${theme.textColor} leading-relaxed mb-4`}>
          Generate custom reading stories tailored to your exact vocabulary and target CEFR level.
        </p>
        <button
          type="button"
          className="w-full py-2 px-3 rounded-xl bg-indigo-600 text-white dark:bg-indigo-500 text-xs font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors cursor-pointer shadow-2xs"
        >
          Start 7-Day Free Trial
        </button>
      </div>

      {/* Non-intrusive Sponsor Banner */}
      <div className={`p-5 rounded-2xl ${theme.cardBg} border ${theme.border} text-center shadow-2xs`}>
        <span className={`text-[10px] font-semibold ${theme.textColor} opacity-75 uppercase tracking-widest block mb-2`}>
          Sponsored Content
        </span>
        <div className={`h-32 rounded-xl ${theme.bannerBg} flex flex-col items-center justify-center p-3 text-center border border-dashed ${theme.border}`}>
          <span className="text-2xl mb-1">🎧</span>
          <p className={`text-xs font-bold ${theme.titleColor}`}>
            Natural English Podcast Series
          </p>
          <span className={`text-[11px] ${theme.textColor}`}>
            10-Minute Episodes for B1-B2 Learners
          </span>
        </div>
      </div>
    </aside>
  );
};
