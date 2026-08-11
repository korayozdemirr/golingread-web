"use client";

import React from "react";
import { WordToken } from "@/types";

interface WordPopoverProps {
  token: WordToken;
  isSaved: boolean;
  onToggleSave: (token: WordToken) => void;
  onClose: () => void;
}

export const WordPopover: React.FC<WordPopoverProps> = ({
  token,
  isSaved,
  onToggleSave,
  onClose,
}) => {
  const playWordAudio = (word: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-[90vw] rounded-2xl bg-white dark:bg-[#1B1C20] border-2 border-[#2D6A4F]/30 dark:border-[#52B788]/40 shadow-2xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header with Word, Level & Close */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-2xl font-bold tracking-tight text-[#2A2723] dark:text-[#E6E4DF]">
              {token.clean}
            </h4>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-[#E8F5E9] dark:bg-[#143820] text-[#1B5E20] dark:text-[#81C784]">
              {token.level}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-mono text-[#6E675F] dark:text-[#9A9790]">
              {token.ipa}
            </span>
            <span className="text-xs text-[#6E675F] dark:text-[#9A9790] italic">
              • {token.partOfSpeech}
            </span>

            {/* Speaker TTS Icon */}
            <button
              type="button"
              onClick={() => playWordAudio(token.clean)}
              title="Telaffuzu Dinle"
              className="w-6 h-6 rounded-full bg-[#F7F4EE] dark:bg-[#25262C] hover:bg-[#E8F5E9] dark:hover:bg-[#143820] text-[#2D6A4F] dark:text-[#52B788] flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="text-[#6E675F] hover:text-[#2A2723] dark:hover:text-[#E6E4DF] p-1 cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Turkish Meaning */}
      <div className="my-3 p-3 rounded-xl bg-[#F7F4EE] dark:bg-[#25262C] border border-[#E8E2D6] dark:border-[#2A2B32]">
        <span className="text-[11px] font-semibold text-[#6E675F] dark:text-[#9A9790] block mb-0.5">
          Bağlamsal Türkçe Karşılığı:
        </span>
        <p className="text-base font-bold text-[#2D6A4F] dark:text-[#52B788]">
          {token.translationTr}
        </p>
      </div>

      {/* Example Sentence */}
      {token.exampleSentence && (
        <div className="mb-4 text-xs text-[#6E675F] dark:text-[#9A9790] italic">
          &ldquo;{token.exampleSentence}&rdquo;
        </div>
      )}

      {/* Save to Vocabulary Button */}
      <button
        type="button"
        onClick={() => onToggleSave(token)}
        className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
          isSaved
            ? "bg-[#E8F5E9] text-[#1B5E20] border border-[#A5D6A7] dark:bg-[#143820] dark:text-[#81C784] dark:border-[#2E7D32]"
            : "bg-[#2D6A4F] text-white hover:bg-[#245640] dark:bg-[#52B788] dark:text-[#121316] shadow-sm"
        }`}
      >
        {isSaved ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>Kelime Defterine Kaydedildi</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Kelime Defterime Ekle</span>
          </>
        )}
      </button>
    </div>
  );
};
