"use client";

import React from "react";
import { CEFRLevel, UserProfile } from "@/types";

interface HeroSectionProps {
  userProfile: UserProfile;
  onChangeLevel: (level: CEFRLevel) => void;
  onOpenLevelTest: () => void;
}

const CEFR_LEVELS: { level: CEFRLevel; label: string; desc: string }[] = [
  { level: "A1", label: "A1", desc: "Başlangıç (Beginner)" },
  { level: "A2", label: "A2", desc: "Temel (Elementary)" },
  { level: "B1", label: "B1", desc: "Orta (Intermediate)" },
  { level: "B2", label: "B2", desc: "İleri Orta (Upper Int.)" },
  { level: "C1", label: "C1", desc: "İleri (Advanced)" },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  userProfile,
  onChangeLevel,
  onOpenLevelTest,
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#FAF7F0] to-[#F3EDE2] dark:from-[#18191E] dark:to-[#121316] border border-[#E8E2D6] dark:border-[#2A2B32] p-6 sm:p-10 mb-10 shadow-sm transition-colors">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#2D6A4F]/5 dark:bg-[#52B788]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl relative z-10">
        {/* Krashen Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] dark:bg-[#143820] border border-[#C8E6C9] dark:border-[#1E4D2B] text-[#1B5E20] dark:text-[#81C784] text-xs font-semibold mb-4">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D32] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2E7D32] dark:bg-[#81C784]" />
          </span>
          <span>Stephen Krashen: %95 Comprehensible Input Hipotezi</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2A2723] dark:text-[#E6E4DF] leading-tight mb-4 font-sans">
          Anladığınız oranda okuyun, <br className="hidden sm:inline" />
          <span className="text-[#2D6A4F] dark:text-[#52B788] underline decoration-wavy decoration-[#52B788]/40">
            doğal olarak edinin.
          </span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-[#6E675F] dark:text-[#9A9790] leading-relaxed mb-8">
          Kelimelerinin <strong>en az %95&apos;ini bildiğiniz</strong> hikayeler okuduğunuzda beyniniz yeni kelimeleri sözlük baskısı olmadan bağlamdan doğal olarak çözer.
        </p>

        {/* Level Calibrator Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF]/90 dark:bg-[#1B1C20]/90 border border-[#E8E2D6] dark:border-[#2A2B32] shadow-xs backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6E675F] dark:text-[#9A9790]">
                Mevcut Seviyeniz
              </span>
              <p className="text-sm font-semibold text-[#2A2723] dark:text-[#E6E4DF]">
                Seçtiğiniz seviyeye göre tüm hikayelerin % Eşleşme oranları hesaplanır:
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenLevelTest}
              className="text-xs font-bold text-[#2D6A4F] dark:text-[#52B788] hover:underline cursor-pointer flex items-center gap-1 self-start sm:self-auto"
            >
              <span>⚡ Seviyemi Test Et (1 Dk)</span>
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
                      ? "bg-[#2D6A4F] text-white shadow-md font-bold scale-[1.02] dark:bg-[#52B788] dark:text-[#121316]"
                      : "bg-[#F7F4EE] dark:bg-[#25262C] text-[#6E675F] dark:text-[#9A9790] hover:bg-[#EAE4D7] dark:hover:bg-[#30323B] font-medium"
                  }`}
                >
                  <div className="text-sm sm:text-base font-bold leading-none mb-1">
                    {item.label}
                  </div>
                  <div className="text-[10px] sm:text-[11px] opacity-80 truncate hidden sm:block">
                    {item.desc.split(" ")[0]}
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
