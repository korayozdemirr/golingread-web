"use client";

import React, { useState } from "react";
import { VocabularyItem } from "@/types";

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  vocabulary: VocabularyItem[];
  onUpdateStatus: (id: string, status: "learning" | "mastered") => void;
  onRemoveWord: (id: string) => void;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({
  isOpen,
  onClose,
  vocabulary,
  onUpdateStatus,
  onRemoveWord,
}) => {
  const [activeTab, setActiveTab] = useState<"flashcards" | "list">("flashcards");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "learning" | "mastered">("all");

  if (!isOpen) return null;

  const playAudio = (word: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNextCard = (statusUpdate?: "learning" | "mastered") => {
    if (vocabulary.length > 0 && statusUpdate) {
      const currentItem = vocabulary[currentIndex];
      if (currentItem) {
        onUpdateStatus(currentItem.id, statusUpdate);
      }
    }

    setIsFlipped(false);
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const filteredVocabulary = vocabulary.filter((item) => {
    if (statusFilter === "all") return true;
    return item.status === statusFilter;
  });

  const currentCard = vocabulary[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl bg-[#FDFBF7] dark:bg-[#16171B] border border-[#E5E7EB] dark:border-[#2E2E2E] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#2E2E2E] flex items-center justify-between bg-white dark:bg-[#1E1E1E]">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h3 className="text-lg font-bold text-[#1F2937] dark:text-[#E5E7EB]">
              My Vocabulary & Flashcards
            </h3>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
              {vocabulary.length} Words
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex rounded-xl bg-[#F3F4F6] dark:bg-[#252528] p-1">
              <button
                type="button"
                onClick={() => setActiveTab("flashcards")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === "flashcards"
                    ? "bg-white dark:bg-[#1E1E1E] text-[#1F2937] dark:text-[#E5E7EB] shadow-2xs"
                    : "text-[#6B7280] dark:text-[#9CA3AF]"
                }`}
              >
                🃏 Flashcards
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("list")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === "list"
                    ? "bg-white dark:bg-[#1E1E1E] text-[#1F2937] dark:text-[#E5E7EB] shadow-2xs"
                    : "text-[#6B7280] dark:text-[#9CA3AF]"
                }`}
              >
                📋 Word List
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F3F4F6] dark:bg-[#252528] text-[#6B7280] hover:text-[#1F2937] dark:hover:text-[#E5E7EB] flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {vocabulary.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-4xl block mb-3">📖</span>
              <h4 className="text-base font-bold text-[#1F2937] dark:text-[#E5E7EB] mb-1">
                No saved vocabulary yet
              </h4>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] max-w-sm mx-auto">
                While reading stories, click any word you want to practice and tap <strong>&ldquo;Save to My Vocabulary&rdquo;</strong> to review it here.
              </p>
            </div>
          ) : activeTab === "flashcards" ? (
            /* Flashcard Practice Mode */
            <div className="flex flex-col items-center justify-center max-w-md mx-auto py-2">
              <div className="w-full flex items-center justify-between text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-3">
                <span>Card {currentIndex + 1} of {vocabulary.length}</span>
                <span className="font-semibold capitalize text-indigo-600 dark:text-indigo-400">
                  {currentCard?.status === "mastered" ? "✓ Mastered" : "⏳ Learning"}
                </span>
              </div>

              {/* 3D Flip Card Container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-64 rounded-2xl bg-white dark:bg-[#1E1E1E] border-2 border-[#E5E7EB] dark:border-[#2E2E2E] shadow-lg cursor-pointer p-6 flex flex-col justify-between transition-all duration-300 hover:border-indigo-500 select-none"
              >
                {!isFlipped ? (
                  /* Front Side (English) */
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider mb-2">
                      English Word
                    </span>
                    <h3 className="text-3xl font-extrabold text-[#1F2937] dark:text-[#E5E7EB] mb-2 font-serif">
                      {currentCard?.cleanWord}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                        {currentCard?.ipa}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(currentCard?.cleanWord || "");
                        }}
                        className="p-1 text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform"
                      >
                        🔊
                      </button>
                    </div>
                    <span className="text-[11px] text-[#6B7280]/60 dark:text-[#9CA3AF]/60 mt-6">
                      (Click card to reveal meaning)
                    </span>
                  </div>
                ) : (
                  /* Back Side (Turkish & Example) */
                  <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-150">
                    <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider mb-2">
                      Turkish Translation
                    </span>
                    <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">
                      {currentCard?.translationTr}
                    </h3>
                    {currentCard?.exampleSentence && (
                      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] italic max-w-xs">
                        &ldquo;{currentCard.exampleSentence}&rdquo;
                      </p>
                    )}
                    <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] mt-3">
                      Source: {currentCard?.storyTitle}
                    </span>
                  </div>
                )}
              </div>

              {/* Spaced Repetition Actions */}
              <div className="grid grid-cols-3 gap-3 w-full mt-6">
                <button
                  type="button"
                  onClick={() => handleNextCard("learning")}
                  className="py-2.5 px-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  🔄 Again
                </button>
                <button
                  type="button"
                  onClick={() => handleNextCard()}
                  className="py-2.5 px-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  👍 Good
                </button>
                <button
                  type="button"
                  onClick={() => handleNextCard("mastered")}
                  className="py-2.5 px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  ✓ Mastered
                </button>
              </div>
            </div>
          ) : (
            /* Table / List View */
            <div className="space-y-4">
              {/* Filter pills */}
              <div className="flex items-center gap-2 pb-2">
                {(["all", "learning", "mastered"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer capitalize ${
                      statusFilter === filter
                        ? "bg-[#1F2937] text-white dark:bg-[#E5E7EB] dark:text-[#121212]"
                        : "bg-white dark:bg-[#1E1E1E] text-[#6B7280] dark:text-[#9CA3AF] border border-[#E5E7EB] dark:border-[#2E2E2E]"
                    }`}
                  >
                    {filter === "all" ? "All" : filter === "learning" ? "Learning" : "Mastered"}
                  </button>
                ))}
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {filteredVocabulary.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#2E2E2E] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => playAudio(item.cleanWord)}
                        title="Listen"
                        className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-[#252528] text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm cursor-pointer"
                      >
                        🔊
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-[#1F2937] dark:text-[#E5E7EB]">
                            {item.cleanWord}
                          </span>
                          <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-mono">
                            {item.ipa}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          {item.translationTr}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateStatus(
                            item.id,
                            item.status === "mastered" ? "learning" : "mastered"
                          )
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          item.status === "mastered"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
                        }`}
                      >
                        {item.status === "mastered" ? "✓ Mastered" : "⏳ Learning"}
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemoveWord(item.id)}
                        title="Delete word"
                        className="text-xs text-[#6B7280] hover:text-rose-600 p-1 cursor-pointer"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
