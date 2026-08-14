"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LevelTestModal } from "@/components/level-test/LevelTestModal";
import { useAppContext } from "@/context/AppContext";

export default function VocabularyPage() {
  const {
    vocabulary,
    updateVocabStatus,
    removeVocabWord,
    isLevelTestModalOpen,
    closeLevelTestModal,
    changeLevel,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<"flashcards" | "list">("flashcards");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "learning" | "mastered">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const learningCount = vocabulary.filter((v) => v.status === "learning").length;
  const masteredCount = vocabulary.filter((v) => v.status === "mastered").length;

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
        updateVocabStatus(currentItem.id, statusUpdate);
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
    const matchesFilter = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      item.cleanWord.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translationTr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.storyTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const currentCard = vocabulary[currentIndex];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-[#121212] text-[#1F2937] dark:text-[#E5E7EB] transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Vocabulary Hub Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8 pb-24 sm:pb-8 flex-1 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs mb-4 sm:mb-6 font-medium text-[#6B7280] dark:text-[#9CA3AF]" aria-label="Breadcrumb">
          <Link
            href="/"
            className="hover:underline flex items-center gap-1.5 font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Stories</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#1F2937] dark:text-[#E5E7EB]">
            My Vocabulary Deck
          </span>
        </nav>

        {/* Page Hero & Statistics Banner */}
        <div className="relative rounded-2xl sm:rounded-3xl bg-white dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#2E2E2E] p-5 sm:p-8 mb-6 sm:mb-8 overflow-hidden shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <span className="text-xl sm:text-2xl">✨</span>
                <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#1F2937] dark:text-[#E5E7EB]">
                  Vocabulary & Flashcards
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#9CA3AF] max-w-xl leading-relaxed">
                Review words collected from your reading sessions. Active recall flashcards turn receptive words into active vocabulary!
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-[#F7F4EE] dark:bg-[#252528] border border-[#E5E7EB] dark:border-[#2E2E2E] text-center">
                <span className="text-[10px] sm:text-xs text-[#6B7280] dark:text-[#9CA3AF] block font-medium">Total</span>
                <span className="text-lg sm:text-xl font-extrabold text-[#1F2937] dark:text-[#E5E7EB]">
                  {vocabulary.length}
                </span>
              </div>

              <div className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-center">
                <span className="text-[10px] sm:text-xs text-amber-800 dark:text-amber-300 block font-medium">Learning</span>
                <span className="text-lg sm:text-xl font-extrabold text-amber-700 dark:text-amber-300">
                  {learningCount}
                </span>
              </div>

              <div className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-center">
                <span className="text-[10px] sm:text-xs text-emerald-800 dark:text-emerald-300 block font-medium">Mastered</span>
                <span className="text-lg sm:text-xl font-extrabold text-emerald-700 dark:text-emerald-300">
                  {masteredCount}
                </span>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#E5E7EB] dark:border-[#2E2E2E]">
            <button
              type="button"
              onClick={() => setActiveTab("flashcards")}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 ${
                activeTab === "flashcards"
                  ? "bg-indigo-600 text-white dark:bg-indigo-500 shadow-xs"
                  : "bg-[#F3F4F6] dark:bg-[#252528] text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#E5E7EB]"
              }`}
            >
              <span>🃏</span>
              <span>Flashcards</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("list")}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 ${
                activeTab === "list"
                  ? "bg-indigo-600 text-white dark:bg-indigo-500 shadow-xs"
                  : "bg-[#F3F4F6] dark:bg-[#252528] text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#E5E7EB]"
              }`}
            >
              <span>📋</span>
              <span>Word List</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-black/10 dark:bg-white/10 font-extrabold">
                {vocabulary.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {vocabulary.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 sm:py-20 bg-white dark:bg-[#1E1E1E] rounded-3xl border border-[#E5E7EB] dark:border-[#2E2E2E] shadow-xs px-4">
            <span className="text-4xl sm:text-5xl block mb-3">📖</span>
            <h3 className="text-lg sm:text-xl font-bold text-[#1F2937] dark:text-[#E5E7EB] mb-2">
              Your vocabulary deck is empty
            </h3>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#9CA3AF] max-w-md mx-auto mb-6 leading-relaxed">
              While reading English stories, click on any word and tap <strong>&ldquo;Save to My Vocabulary&rdquo;</strong> to start practicing with spaced-repetition flashcards.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white dark:bg-indigo-500 text-xs sm:text-sm font-bold shadow-md hover:bg-indigo-700 transition-all active:scale-95"
            >
              <span>Explore Stories</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : activeTab === "flashcards" ? (
          /* Flashcard Practice Mode */
          <div className="max-w-xl mx-auto py-2 sm:py-4">
            <div className="flex items-center justify-between text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-3 px-1">
              <span className="font-bold">
                Card {currentIndex + 1} of {vocabulary.length}
              </span>
              <span className="font-extrabold capitalize px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {currentCard?.status === "mastered" ? "✓ Mastered" : "⏳ Learning"}
              </span>
            </div>

            {/* 3D Flip Card Container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full h-72 sm:h-80 rounded-3xl bg-white dark:bg-[#1E1E1E] border-2 border-[#E5E7EB] dark:border-[#2E2E2E] shadow-md cursor-pointer p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-indigo-500 select-none active:scale-[0.99]"
            >
              {!isFlipped ? (
                /* Front Side (English) */
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider mb-2 font-bold">
                    English Word
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] dark:text-[#E5E7EB] mb-2 sm:mb-3 font-serif">
                    {currentCard?.cleanWord}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                      {currentCard?.ipa}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(currentCard?.cleanWord || "");
                      }}
                      title="Pronounce Word"
                      className="w-7 h-7 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-xs transition-colors cursor-pointer"
                    >
                      🔊
                    </button>
                  </div>
                  <span className="mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                    {currentCard?.partOfSpeech}
                  </span>
                  <p className="mt-4 text-xs text-[#6B7280] dark:text-[#9CA3AF] animate-pulse">
                    👆 Tap to reveal translation
                  </p>
                </div>
              ) : (
                /* Back Side (Turkish & Example) */
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider mb-2 font-bold">
                    Turkish Contextual Meaning
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">
                    {currentCard?.translationTr}
                  </h3>
                  {currentCard?.exampleSentence && (
                    <div className="mt-2 p-3 rounded-xl bg-[#F7F4EE] dark:bg-[#252528] text-xs sm:text-sm text-[#4B5563] dark:text-[#D1D5DB] italic leading-relaxed max-w-md">
                      &ldquo;{currentCard.exampleSentence}&rdquo;
                    </div>
                  )}
                  <p className="mt-4 text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                    Source: {currentCard?.storyTitle}
                  </p>
                </div>
              )}
            </div>

            {/* Flashcard Action Buttons (Mobile Optimized) */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                type="button"
                onClick={() => handleNextCard("learning")}
                className="py-3 sm:py-3.5 px-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                <span>⏳</span>
                <span>Still Learning</span>
              </button>

              <button
                type="button"
                onClick={() => handleNextCard("mastered")}
                className="py-3 sm:py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                <span>✓</span>
                <span>Mastered!</span>
              </button>
            </div>
          </div>
        ) : (
          /* Word List Mode */
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#1E1E1E] p-3 sm:p-4 rounded-2xl border border-[#E5E7EB] dark:border-[#2E2E2E]">
              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
                {(["all", "learning", "mastered"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer capitalize shrink-0 active:scale-95 ${
                      statusFilter === filter
                        ? "bg-indigo-600 text-white dark:bg-indigo-500 shadow-2xs"
                        : "bg-[#F3F4F6] dark:bg-[#252528] text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#E5E7EB]"
                    }`}
                  >
                    {filter === "all" ? `All (${vocabulary.length})` : filter === "learning" ? `Learning (${learningCount})` : `Mastered (${masteredCount})`}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search saved words..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[#F7F4EE] dark:bg-[#252528] border border-[#E5E7EB] dark:border-[#2E2E2E] text-[#1F2937] dark:text-[#E5E7EB] focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <svg
                  className="w-3.5 h-3.5 absolute left-3 top-3 text-[#6B7280] dark:text-[#9CA3AF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Word List Items */}
            {filteredVocabulary.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E5E7EB] dark:border-[#2E2E2E]">
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                  No words match your search query or filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {filteredVocabulary.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#2E2E2E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <button
                        type="button"
                        onClick={() => playAudio(item.cleanWord)}
                        title="Listen pronunciation"
                        className="w-9 h-9 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-sm transition-transform active:scale-90 cursor-pointer shrink-0 mt-0.5 sm:mt-0"
                      >
                        🔊
                      </button>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-bold text-[#1F2937] dark:text-[#E5E7EB]">
                            {item.cleanWord}
                          </span>
                          <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-mono">
                            {item.ipa}
                          </span>
                          <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-md bg-[#F3F4F6] dark:bg-[#252528] text-[#6B7280] dark:text-[#9CA3AF] uppercase">
                            {item.partOfSpeech}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {item.translationTr}
                        </p>
                        {item.exampleSentence && (
                          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] italic mt-1 line-clamp-2">
                            &ldquo;{item.exampleSentence}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5E7EB] dark:border-[#2E2E2E]">
                      <button
                        type="button"
                        onClick={() =>
                          updateVocabStatus(
                            item.id,
                            item.status === "mastered" ? "learning" : "mastered"
                          )
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer active:scale-95 ${
                          item.status === "mastered"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
                        }`}
                      >
                        {item.status === "mastered" ? "✓ Mastered" : "⏳ Learning"}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeVocabWord(item.id)}
                        title="Delete word from deck"
                        className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#252528] text-[#6B7280] hover:text-rose-600 flex items-center justify-center text-xs transition-colors cursor-pointer active:scale-95"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Level Diagnostic Test Modal */}
      <LevelTestModal
        isOpen={isLevelTestModalOpen}
        onClose={closeLevelTestModal}
        onApplyLevel={changeLevel}
      />
    </div>
  );
}
