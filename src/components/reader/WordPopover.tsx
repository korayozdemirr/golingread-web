"use client";

import React, { useState, useEffect } from "react";
import { WordToken } from "@/types";
import { isPlaceholderTranslation, translateWordOnline } from "@/lib/translator";

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
  const [activeToken, setActiveToken] = useState<WordToken>(token);
  const [isLoadingTranslation, setIsLoadingTranslation] = useState<boolean>(false);

  // When token prop changes, sync activeToken and auto-repair placeholder translations
  useEffect(() => {
    setActiveToken(token);

    const needsTranslation = isPlaceholderTranslation(token.translationTr, token.clean);
    if (needsTranslation) {
      setIsLoadingTranslation(true);
      translateWordOnline(token.clean, token.exampleSentence, token.level)
        .then((enriched) => {
          setActiveToken((prev) => ({
            ...prev,
            translationTr: enriched.translationTr || prev.translationTr,
            ipa: enriched.ipa || prev.ipa,
            partOfSpeech: enriched.partOfSpeech || prev.partOfSpeech,
            exampleSentence: enriched.exampleSentence || prev.exampleSentence,
          }));
        })
        .finally(() => {
          setIsLoadingTranslation(false);
        });
    }
  }, [token]);

  const handleRefreshTranslation = async () => {
    setIsLoadingTranslation(true);
    try {
      const enriched = await translateWordOnline(
        activeToken.clean,
        activeToken.exampleSentence,
        activeToken.level
      );
      setActiveToken((prev) => ({
        ...prev,
        translationTr: enriched.translationTr || prev.translationTr,
        ipa: enriched.ipa || prev.ipa,
        partOfSpeech: enriched.partOfSpeech || prev.partOfSpeech,
      }));
    } finally {
      setIsLoadingTranslation(false);
    }
  };

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
    <>
      {/* Mobile Backdrop Scrim (tap outside to close) */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 sm:hidden animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Popover / Mobile Bottom Sheet Container */}
      <div className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 w-full sm:max-w-sm sm:w-[90vw] rounded-t-3xl sm:rounded-2xl bg-white dark:bg-[#1E1E22] border-t sm:border border-[#E5E7EB] dark:border-[#2E2E2E] shadow-2xl p-5 sm:p-5 animate-in slide-in-from-bottom duration-300 pb-safe">
        {/* Mobile Drag Indicator Handle */}
        <div className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-3.5 sm:hidden" />

        {/* Header with Word, Level Badge & Actions */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-2xl sm:text-2xl font-bold tracking-tight text-[#1F2937] dark:text-[#E5E7EB]">
                {activeToken.clean}
              </h4>
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {activeToken.level}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                {activeToken.ipa}
              </span>
              <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] italic">
                • {activeToken.partOfSpeech}
              </span>

              {/* Speaker TTS Pronunciation Button */}
              <button
                type="button"
                onClick={() => playWordAudio(activeToken.clean)}
                title="Listen to American English Pronunciation"
                className="w-7 h-7 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-[#2A2B32] dark:hover:bg-[#343640] text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-colors cursor-pointer active:scale-90"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Top-Right Action Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleRefreshTranslation}
              disabled={isLoadingTranslation}
              title="Re-translate word"
              className="text-[#6B7280] hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer text-xs"
            >
              {isLoadingTranslation ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <span className="text-base leading-none">↻</span>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#6B7280] hover:text-[#1F2937] dark:hover:text-[#E5E7EB] flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Contextual Turkish Translation Card */}
        <div className="my-3 p-3.5 rounded-2xl bg-[#F7F4EE] dark:bg-[#252528] border border-[#E5E7EB] dark:border-[#2E2E2E]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">
              Turkish Contextual Meaning:
            </span>
            {isLoadingTranslation && (
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 animate-pulse font-bold">
                Translating...
              </span>
            )}
          </div>
          <p className="text-lg font-extrabold text-indigo-700 dark:text-indigo-300">
            {isLoadingTranslation ? (
              <span className="inline-flex items-center gap-1.5 opacity-70 text-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                <span>Fetching Turkish meaning...</span>
              </span>
            ) : (
              activeToken.translationTr || activeToken.clean
            )}
          </p>
        </div>

        {/* Example Sentence */}
        {activeToken.exampleSentence && (
          <div className="mb-4 p-2.5 rounded-xl bg-gray-50 dark:bg-[#18181B] text-xs text-[#6B7280] dark:text-[#9CA3AF] italic leading-relaxed border border-gray-100 dark:border-gray-800">
            &ldquo;{activeToken.exampleSentence}&rdquo;
          </div>
        )}

        {/* Save to Vocabulary Deck Action Button */}
        <button
          type="button"
          onClick={() => onToggleSave(activeToken)}
          className={`w-full py-3.5 px-4 rounded-2xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] shadow-xs ${
            isSaved
              ? "bg-emerald-50 text-emerald-800 border-2 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700"
              : "bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md"
          }`}
        >
          {isSaved ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Saved to My Vocabulary Deck</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>+ Save to My Vocabulary Deck</span>
            </>
          )}
        </button>
      </div>
    </>
  );
};
