"use client";

import React from "react";

export const SponsorSidebar: React.FC = () => {
  return (
    <aside className="space-y-6">
      {/* Premium Feature Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/60 dark:from-indigo-950/40 dark:to-indigo-900/20 border border-indigo-200/80 dark:border-indigo-800/40">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-2">
          <span>✨ GoLingread Plus</span>
        </div>
        <h4 className="text-sm font-bold text-[#1F2937] dark:text-[#E5E7EB] mb-1">
          Personalized AI Story Generator
        </h4>
        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed mb-4">
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
      <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#2E2E2E] text-center">
        <span className="text-[10px] font-semibold text-[#6B7280]/70 dark:text-[#9CA3AF]/70 uppercase tracking-widest block mb-2">
          Sponsored Content
        </span>
        <div className="h-32 rounded-xl bg-[#F9FAFB] dark:bg-[#252528] flex flex-col items-center justify-center p-3 text-center border border-dashed border-[#E5E7EB] dark:border-[#2E2E2E]">
          <span className="text-2xl mb-1">🎧</span>
          <p className="text-xs font-bold text-[#1F2937] dark:text-[#E5E7EB]">
            Natural English Podcast Series
          </p>
          <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
            10-Minute Episodes for B1-B2 Learners
          </span>
        </div>
      </div>
    </aside>
  );
};
