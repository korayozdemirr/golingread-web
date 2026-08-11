"use client";

import React from "react";

export const SponsorSidebar: React.FC = () => {
  return (
    <aside className="space-y-6">
      {/* Premium Feature Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2D6A4F]/10 to-[#52B788]/10 dark:from-[#52B788]/10 dark:to-[#2D6A4F]/10 border border-[#2D6A4F]/20 dark:border-[#52B788]/20">
        <div className="flex items-center gap-2 text-xs font-bold text-[#2D6A4F] dark:text-[#52B788] uppercase tracking-wider mb-2">
          <span>✨ GoLingread Plus</span>
        </div>
        <h4 className="text-sm font-bold text-[#2A2723] dark:text-[#E6E4DF] mb-1">
          Kişiselleştirilmiş AI Hikaye Üretimi
        </h4>
        <p className="text-xs text-[#6E675F] dark:text-[#9A9790] leading-relaxed mb-4">
          Kelime defterinizdeki eksik kelimeleri içeren özel seviyenize uygun sınırsız hikaye oluşturun.
        </p>
        <button
          type="button"
          className="w-full py-2 px-3 rounded-xl bg-[#2D6A4F] text-white dark:bg-[#52B788] dark:text-[#121316] text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
        >
          7 Gün Ücretsiz Dene
        </button>
      </div>

      {/* Non-intrusive Sponsor Banner */}
      <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#1B1C20] border border-[#E8E2D6] dark:border-[#2A2B32] text-center">
        <span className="text-[10px] font-semibold text-[#6E675F]/60 dark:text-[#9A9790]/60 uppercase tracking-widest block mb-2">
          Sponsorlu İçerik
        </span>
        <div className="h-32 rounded-xl bg-[#F7F4EE] dark:bg-[#25262C] flex flex-col items-center justify-center p-3 text-center border border-dashed border-[#E8E2D6] dark:border-[#2A2B32]">
          <span className="text-2xl mb-1">🎧</span>
          <p className="text-xs font-bold text-[#2A2723] dark:text-[#E6E4DF]">
            Doğal İngilizce Podcast Serisi
          </p>
          <span className="text-[11px] text-[#6E675F] dark:text-[#9A9790]">
            B1-B2 Seviyesine Özel 10 Dk Bölümler
          </span>
        </div>
      </div>
    </aside>
  );
};
