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
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-[90vw] rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#2E2E2E] shadow-2xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header with Word, Level & Close */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-2xl font-bold tracking-tight text-[#1F2937] dark:text-[#E5E7EB]">
              {token.clean}
            </h4>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
              {token.level}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-mono text-[#6B7280] dark:text-[#9CA3AF]">
              {token.ipa}
            </span>
            <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] italic">
              • {token.partOfSpeech}
            </span>

            {/* Speaker TTS Icon */}
            <button
              type="button"
              onClick={() => playWordAudio(token.clean)}
              title="Listen Pronunciation"
              className="w-6 h-6 rounded-full bg-[#F3F4F6] dark:bg-[#252528] hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-colors cursor-pointer"
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
          className="text-[#6B7280] hover:text-[#1F2937] dark:hover:text-[#E5E7EB] p-1 cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Turkish Meaning */}
      <div className="my-3 p-3 rounded-xl bg-[#F7F4EE] dark:bg-[#252528] border border-[#E5E7EB] dark:border-[#2E2E2E]">
        <span className="text-[11px] font-semibold text-[#6B7280] dark:text-[#9CA3AF] block mb-0.5">
          Contextual Turkish Translation:
        </span>
        <p className="text-base font-bold text-indigo-700 dark:text-indigo-300">
          {token.translationTr}
        </p>
      </div>

      {/* Example Sentence */}
      {token.exampleSentence && (
        <div className="mb-4 text-xs text-[#6B7280] dark:text-[#9CA3AF] italic">
          &ldquo;{token.exampleSentence}&rdquo;
        </div>
      )}

      {/* Save to Vocabulary Button */}
      <button
        type="button"
        onClick={() => onToggleSave(token)}
        className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
          isSaved
            ? "bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
            : "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-xs"
        }`}
      >
        {isSaved ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>Saved to My Vocabulary</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Save to My Vocabulary</span>
          </>
        )}
      </button>
    </div>
  );
};
