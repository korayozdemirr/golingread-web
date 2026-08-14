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
      alert("Your browser does not support Speech Synthesis (TTS).");
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
    { id: "cream", name: "Cream", bg: "#FDFBF7", text: "#1F2937", border: "#E5E7EB" },
    { id: "white", name: "White", bg: "#FFFFFF", text: "#111827", border: "#E5E7EB" },
    { id: "sepia", name: "Sepia", bg: "#F4ECD8", text: "#5B4636", border: "#D8C7AA" },
    { id: "dark", name: "Dark", bg: "#16171B", text: "#E5E7EB", border: "#2E303A" },
  ];

  const toolbarThemeStyles: Record<
    ReadingTheme,
    {
      barBg: string;
      border: string;
      btnBg: string;
      titleColor: string;
      textColor: string;
      btnBorder: string;
    }
  > = {
    cream: {
      barBg: "bg-[#FDFBF7]/95",
      border: "border-[#E5E7EB]",
      btnBg: "bg-white hover:bg-[#F3F4F6]",
      titleColor: "text-[#111827]",
      textColor: "text-[#374151]",
      btnBorder: "border-[#E5E7EB]",
    },
    white: {
      barBg: "bg-[#FFFFFF]/95",
      border: "border-[#E5E7EB]",
      btnBg: "bg-[#F9FAFB] hover:bg-[#F3F4F6]",
      titleColor: "text-[#111827]",
      textColor: "text-[#374151]",
      btnBorder: "border-[#E5E7EB]",
    },
    sepia: {
      barBg: "bg-[#F4ECD8]/95",
      border: "border-[#DECDB2]",
      btnBg: "bg-[#EFE5CD] hover:bg-[#E8DCC4]",
      titleColor: "text-[#2B2118]",
      textColor: "text-[#4A3B2C]",
      btnBorder: "border-[#DECDB2]",
    },
    dark: {
      barBg: "bg-[#121212]/95",
      border: "border-[#2E2E2E]",
      btnBg: "bg-[#1E1E1E] hover:bg-[#252528]",
      titleColor: "text-[#F9FAFB]",
      textColor: "text-[#D1D5DB]",
      btnBorder: "border-[#2E2E2E]",
    },
  };

  const currentBarTheme = toolbarThemeStyles[readingTheme];

  return (
    <div className={`sticky top-16 z-20 w-full border-b ${currentBarTheme.border} ${currentBarTheme.barBg} backdrop-blur-md transition-colors`}>
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-13 sm:h-14 flex items-center justify-between gap-2.5">
        {/* Left: Back Button & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={onBack}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border ${currentBarTheme.btnBorder} ${currentBarTheme.btnBg} text-xs font-bold ${currentBarTheme.textColor} transition-colors cursor-pointer shrink-0 active:scale-95`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Stories</span>
          </button>

          <span className={`text-xs sm:text-sm font-bold ${currentBarTheme.titleColor} truncate`}>
            {storyTitle}
          </span>
        </div>

        {/* Right: Audio Player & Reading Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* TTS Audio Player Button */}
          <div className={`flex items-center rounded-xl border ${currentBarTheme.btnBorder} ${currentBarTheme.btnBg} p-0.5`}>
            <button
              type="button"
              onClick={handleToggleAudio}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer active:scale-95 ${
                isPlayingAudio
                  ? "bg-indigo-600 text-white animate-pulse"
                  : `${currentBarTheme.textColor}`
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span className="hidden sm:inline">Listen</span>
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
              className={`bg-transparent text-[11px] font-bold ${currentBarTheme.textColor} px-1 py-1 focus:outline-hidden cursor-pointer`}
            >
              <option value="0.8">0.8x</option>
              <option value="1.0">1.0x</option>
              <option value="1.2">1.2x</option>
            </select>
          </div>

          {/* Desktop Quick Font Size Adjusters */}
          <div className={`hidden sm:flex items-center rounded-xl border ${currentBarTheme.btnBorder} ${currentBarTheme.btnBg} p-0.5`}>
            <button
              type="button"
              onClick={onDecreaseFontSize}
              title="Decrease Font Size"
              className={`px-2 py-1 text-xs font-bold ${currentBarTheme.textColor} hover:opacity-75 cursor-pointer`}
            >
              A-
            </button>
            <span className={`text-[11px] font-mono ${currentBarTheme.textColor} px-1 font-bold`}>
              {fontSize}px
            </span>
            <button
              type="button"
              onClick={onIncreaseFontSize}
              title="Increase Font Size"
              className={`px-2 py-1 text-xs font-bold ${currentBarTheme.textColor} hover:opacity-75 cursor-pointer`}
            >
              A+
            </button>
          </div>

          {/* Reading Display Settings Trigger Modal/Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              title="Reading Settings (Theme, Font, Spacing)"
              className={`w-8 h-8 rounded-xl border ${currentBarTheme.btnBorder} ${currentBarTheme.btnBg} ${currentBarTheme.textColor} flex items-center justify-center transition-colors cursor-pointer active:scale-95`}
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

            {/* Reading Settings Sheet (Mobile bottom sheet & Desktop dropdown) */}
            {showSettingsMenu && (
              <>
                {/* Backdrop on mobile */}
                <div
                  className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 sm:hidden animate-in fade-in"
                  onClick={() => setShowSettingsMenu(false)}
                />

                <div className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-auto sm:absolute sm:right-0 sm:mt-2 w-full sm:w-80 rounded-t-3xl sm:rounded-2xl bg-white dark:bg-[#1E1E22] border-t sm:border border-[#E5E7EB] dark:border-[#2E2E2E] shadow-2xl p-5 z-50 space-y-4 animate-in slide-in-from-bottom sm:slide-in-from-top duration-200 pb-safe">
                  {/* Mobile Drag Handle */}
                  <div className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-2 sm:hidden" />

                  <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] dark:border-[#2E2E2E]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-[#E5E7EB]">
                      Reading Appearance
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSettingsMenu(false)}
                      className="text-xs text-[#6B7280] hover:text-[#1F2937] dark:hover:text-[#E5E7EB] p-1 font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Paper Theme */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF] block mb-2">
                      Paper Palette
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {THEMES.map((th) => (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => onChangeReadingTheme(th.id)}
                          className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                            readingTheme === th.id
                              ? "ring-2 ring-indigo-600 dark:ring-indigo-400 scale-105 shadow-xs"
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
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF] block mb-2">
                      Line Spacing
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["normal", "relaxed", "loose"] as LineHeight[]).map((lh) => (
                        <button
                          key={lh}
                          type="button"
                          onClick={() => onChangeLineHeight(lh)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                            lineHeight === lh
                              ? "bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 shadow-xs"
                              : "bg-[#F7F4EE] dark:bg-[#252528] text-[#6B7280] dark:text-[#9CA3AF] border-[#E5E7EB] dark:border-[#2E2E2E]"
                          }`}
                        >
                          {lh === "normal" ? "Compact" : lh === "relaxed" ? "Relaxed" : "Spacious"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size controls (Mobile) */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF] block mb-2">
                      Font Scale ({fontSize}px)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={onDecreaseFontSize}
                        className="flex-1 py-2.5 rounded-xl bg-[#F7F4EE] dark:bg-[#252528] font-bold text-xs text-[#1F2937] dark:text-[#E5E7EB] border border-[#E5E7EB] dark:border-[#2E2E2E] active:scale-95"
                      >
                        A- (Smaller)
                      </button>
                      <button
                        type="button"
                        onClick={onIncreaseFontSize}
                        className="flex-1 py-2.5 rounded-xl bg-[#F7F4EE] dark:bg-[#252528] font-bold text-xs text-[#1F2937] dark:text-[#E5E7EB] border border-[#E5E7EB] dark:border-[#2E2E2E] active:scale-95"
                      >
                        A+ (Larger)
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
