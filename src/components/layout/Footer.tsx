import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#E5E7EB] dark:border-[#2E2E2E] bg-[#FDFBF7] dark:bg-[#121212] py-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <div className="flex items-center gap-2 font-bold text-lg text-[#1F2937] dark:text-[#E5E7EB]">
            <span>📚 GoLingread</span>
          </div>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] max-w-sm">
            Modern English reading platform built on Stephen Krashen&apos;s 95% Comprehensible Input hypothesis.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF]">
          <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
            95% Input Methodology
          </span>
          <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
            CEFR Framework
          </span>
          <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
            Privacy & Terms
          </span>
        </div>

        <div className="text-xs text-[#6B7280]/80 dark:text-[#9CA3AF]/80 text-center">
          © {new Date().getFullYear()} GoLingread. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
