import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#E8E2D6] dark:border-[#2A2B32] bg-[#FDFBF7] dark:bg-[#121316] py-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <div className="flex items-center gap-2 font-bold text-lg text-[#2A2723] dark:text-[#E6E4DF]">
            <span>📚 GoLingread</span>
          </div>
          <p className="text-xs text-[#6E675F] dark:text-[#9A9790] max-w-sm">
            Stephen Krashen&apos;ın %95 Anlaşılabilir Girdi (Comprehensible Input) kuramıyla tasarlanmış modern İngilizce okuma platformu.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-[#6E675F] dark:text-[#9A9790]">
          <span className="hover:text-[#2D6A4F] dark:hover:text-[#52B788] cursor-pointer">
            Metodoloji & %95 Kuralı
          </span>
          <span className="hover:text-[#2D6A4F] dark:hover:text-[#52B788] cursor-pointer">
            CEFR Seviyeleri
          </span>
          <span className="hover:text-[#2D6A4F] dark:hover:text-[#52B788] cursor-pointer">
            Gizlilik Politikası
          </span>
        </div>

        <div className="text-xs text-[#6E675F]/80 dark:text-[#9A9790]/80 text-center">
          © {new Date().getFullYear()} GoLingread. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
};
