"use client";

import React, { useState, useEffect } from "react";
import { ReadingTheme, LineHeight } from "@/types";

interface ReaderToolbarProps {
  storyTitle: string;
  onBack: () => void;
  fontSize: number;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  lineHeight: LineHeight;
  onChangeLineHeight: (height: LineHeight) => void;
  readingTheme: ReadingTheme;
  onChangeReadingTheme: (theme: ReadingTheme) => void;
  fullStoryText: string;
}

export const ReaderToolbar: React.FC<ReaderToolbarProps> = ({
  storyTitle,
  onBack,
  fontSize,
  onIncreaseFontSize,
  onDecreaseFontSize,
  lineHeight,
  onChangeLineHeight,
  readingTheme,
  onChangeReadingTheme,
  fullStoryText,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioRate, setAudioRate] = useState<number>(1.0);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);

  // Audio SpeechSynthesis TTS
  const handleToggleAudio = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Tarayıcınız ses sentezleme (TTS) özelliğini desteklemiyor.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(fullStoryText);
      utterance.lang = "en-US";
      utterance.rate = audioRate;

      utterance.onend = () => {
        setIsPlayingAudio(false);
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Stop audio when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const THEMES: { id: ReadingTheme; name: string; bg: string; text: string; border: string }[] = [
    { id: "cream", name: "Krem", bg: "#FDFBF7", text: "#2A2723", border: "#E8E2D6" },
    { id: "white", name: "Beyaz", bg: "#FFFFFF", text: "#111827", border: "#E5E7EB" },
    { id: "sepia", name: "Sepya", bg: "#F4ECD8", text: "#5B4636", border: "#D8C7AA" },
    { id: "dark", name: "Gece", bg: "#16171B", text: "#E6E4DF", border: "#2E303A" },
  ];

  return (
    <div className="sticky top-16 z-20 w-full border-b border-[#E8E2D6] dark:border-[#2A2B32] bg-[#FDFBF7]/95 dark:bg-[#121316]/95 backdrop-blur-md transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Left: Back Button & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E2D6] dark:border-[#2A2B32] bg-white dark:bg-[#1B1C20] text-xs font-semibold text-[#2A2723] dark:text-[#E6E4DF] hover:bg-[#F7F4EE] dark:hover:bg-[#25262C] transition-colors cursor-pointer shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Hikayeler</span>
          </button>

          <span className="text-xs sm:text-sm font-bold text-[#2A2723] dark:text-[#E6E4DF] truncate">
            {storyTitle}
          </span>
        </div>

        {/* Right: Audio Player & Reading Controls */}
        <div className="flex items-center gap-2">
          {/* TTS Audio Player Button */}
          <div className="flex items-center rounded-xl border border-[#E8E2D6] dark:border-[#2A2B32] bg-white dark:bg-[#1B1C20] p-0.5">
            <button
              type="button"
              onClick={handleToggleAudio}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                isPlayingAudio
                  ? "bg-[#2D6A4F] text-white animate-pulse"
                  : "text-[#2A2723] dark:text-[#E6E4DF] hover:bg-[#F7F4EE] dark:hover:bg-[#25262C]"
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  <span>Durdur</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Dinle</span>
                </>
              )}
            </button>

            {/* Audio Speed Rate */}
            <select
              value={audioRate}
              onChange={(e) => {
                const newRate = parseFloat(e.target.value);
                setAudioRate(newRate);
                if (isPlayingAudio) {
                  window.speechSynthesis.cancel();
                  setIsPlayingAudio(false);
                }
              }}
              className="bg-transparent text-[11px] font-semibold text-[#6E675F] dark:text-[#9A9790] px-1 py-1 focus:outline-hidden cursor-pointer"
            >
              <option value="0.8">0.8x</option>
              <option value="1.0">1.0x</option>
              <option value="1.2">1.2x</option>
            </select>
          </div>

          {/* Quick Font Size Adjusters */}
          <div className="hidden sm:flex items-center rounded-xl border border-[#E8E2D6] dark:border-[#2A2B32] bg-white dark:bg-[#1B1C20] p-0.5">
            <button
              type="button"
              onClick={onDecreaseFontSize}
              title="Yazıyı Küçült"
              className="px-2 py-1 text-xs font-bold text-[#6E675F] dark:text-[#9A9790] hover:text-[#2A2723] dark:hover:text-[#E6E4DF] cursor-pointer"
            >
              A-
            </button>
            <span className="text-[11px] font-mono text-[#6E675F] dark:text-[#9A9790] px-1">
              {fontSize}px
            </span>
            <button
              type="button"
              onClick={onIncreaseFontSize}
              title="Yazıyı Büyüt"
              className="px-2 py-1 text-xs font-bold text-[#6E675F] dark:text-[#9A9790] hover:text-[#2A2723] dark:hover:text-[#E6E4DF] cursor-pointer"
            >
              A+
            </button>
          </div>

          {/* Reading Display Settings Trigger Modal/Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              title="Okuma Ayarları"
              className="w-8 h-8 rounded-xl border border-[#E8E2D6] dark:border-[#2A2B32] bg-white dark:bg-[#1B1C20] text-[#6E675F] dark:text-[#9A9790] hover:text-[#2A2723] dark:hover:text-[#E6E4DF] flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showSettingsMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#1B1C20] border border-[#E8E2D6] dark:border-[#2A2B32] shadow-xl p-4 z-40 space-y-4">
                {/* Paper Theme */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6E675F] dark:text-[#9A9790] block mb-2">
                    Okuma Teması (Kağıt)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {THEMES.map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => onChangeReadingTheme(th.id)}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          readingTheme === th.id
                            ? "ring-2 ring-[#2D6A4F] dark:ring-[#52B788] scale-105"
                            : "opacity-80 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: th.bg, color: th.text, borderColor: th.border }}
                      >
                        {th.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Line Height */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6E675F] dark:text-[#9A9790] block mb-2">
                    Satır Aralığı
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["normal", "relaxed", "loose"] as LineHeight[]).map((lh) => (
                      <button
                        key={lh}
                        type="button"
                        onClick={() => onChangeLineHeight(lh)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium border cursor-pointer ${
                          lineHeight === lh
                            ? "bg-[#2D6A4F] text-white border-[#2D6A4F] dark:bg-[#52B788] dark:text-[#121316]"
                            : "bg-[#F7F4EE] dark:bg-[#25262C] text-[#6E675F] dark:text-[#9A9790] border-[#E8E2D6] dark:border-[#2A2B32]"
                        }`}
                      >
                        {lh === "normal" ? "Sıkı" : lh === "relaxed" ? "Rahat" : "Geniş"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Font Size controls */}
                <div className="sm:hidden">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6E675F] dark:text-[#9A9790] block mb-2">
                    Yazı Boyutu ({fontSize}px)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onDecreaseFontSize}
                      className="flex-1 py-1.5 rounded-lg bg-[#F7F4EE] dark:bg-[#25262C] font-bold text-xs"
                    >
                      A- (Küçült)
                    </button>
                    <button
                      type="button"
                      onClick={onIncreaseFontSize}
                      className="flex-1 py-1.5 rounded-lg bg-[#F7F4EE] dark:bg-[#25262C] font-bold text-xs"
                    >
                      A+ (Büyüt)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
