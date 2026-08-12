"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LevelTestModal } from "@/components/level-test/LevelTestModal";
import { useAppStore } from "@/store/useAppStore";

export default function VocabularyPage() {
  const {
    vocabulary,
    updateVocabStatus,
    removeVocabWord,
    isLevelTestModalOpen,
    closeLevelTestModal,
    changeLevel,
  } = useAppStore();

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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs mb-6 font-medium text-[#6B7280] dark:text-[#9CA3AF]" aria-label="Breadcrumb">
          <Link
            href="/"
            className="hover:underline flex items-center gap-1.5 font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Stories</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#1F2937] dark:text-[#E5E7EB]">
            My Vocabulary Deck
          </span>
        </nav>

        {/* Page Hero & Statistics Banner */}
        <div className="relative rounded-3xl bg-white dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#2E2E2E] p-6 sm:p-8 mb-8 overflow-hidden shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-2xl">✨</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1F2937] dark:text-[#E5E7EB]">
                  My Vocabulary & Flashcards
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#9CA3AF] max-w-xl leading-relaxed">
                Review words collected from your reading sessions using spaced-repetition flashcards. Regular active recall turns receptive words into active vocabulary!
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-3 rounded-2xl bg-[#F7F4EE] dark:bg-[#252528] border border-[#E5E7EB] dark:border-[#2E2E2E] text-center min-w-[90px]">
                <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] block font-medium">Total</span>
                <span className="text-xl font-extrabold text-[#1F2937] dark:text-[#E5E7EB]">
                  {vocabulary.length}
                </span>
              </div>

              <div className="px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-center min-w-[90px]">
                <span className="text-xs text-amber-800 dark:text-amber-300 block font-medium">Learning</span>
                <span className="text-xl font-extrabold text-amber-700 dark:text-amber-300">
                  {learningCount}
                </span>
              </div>

              <div className="px-4 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-center min-w-[90px]">
                <span className="text-xs text-emerald-800 dark:text-emerald-300 block font-medium">Mastered</span>
                <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300">
                  {masteredCount}
                </span>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-6 border-t border-[#E5E7EB] dark:border-[#2E2E2E]">
            <button
              type="button"
              onClick={() => setActiveTab("flashcards")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "flashcards"
                  ? "bg-indigo-600 text-white dark:bg-indigo-500 shadow-xs"
                  : "bg-[#F3F4F6] dark:bg-[#252528] text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#E5E7EB]"
              }`}
            >
              <span>🃏</span>
              <span>Flashcard Practice</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("list")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "list"
                  ? "bg-indigo-600 text-white dark:bg-indigo-500 shadow-xs"
                  : "bg-[#F3F4F6] dark:bg-[#252528] text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#E5E7EB]"
              }`}
            >
              <span>📋</span>
              <span>Vocabulary Word List</span>
              <span className="px-1.5 py-0.5 text-[11px] rounded-full bg-black/10 dark:bg-white/10 font-bold">
                {vocabulary.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {vocabulary.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white dark:bg-[#1E1E1E] rounded-3xl border border-[#E5E7EB] dark:border-[#2E2E2E] shadow-xs px-4">
            <span className="text-5xl block mb-3">📖</span>
            <h3 className="text-xl font-bold text-[#1F2937] dark:text-[#E5E7EB] mb-2">
              Your vocabulary deck is empty
            </h3>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#9CA3AF] max-w-md mx-auto mb-6 leading-relaxed">
              While reading English stories, click on any word and tap <strong>&ldquo;Save to My Vocabulary&rdquo;</strong> to start practicing with spaced-repetition flashcards.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white dark:bg-indigo-500 text-sm font-bold shadow-md hover:bg-indigo-700 transition-colors"
            >
              <span>Explore Stories</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : activeTab === "flashcards" ? (
          /* Flashcard Practice Mode */
          <div className="max-w-xl mx-auto py-4">
            <div className="flex items-center justify-between text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-3 px-1">
              <span className="font-semibold">
                Card {currentIndex + 1} of {vocabulary.length}
              </span>
              <span className="font-bold capitalize px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300">
                {currentCard?.status === "mastered" ? "✓ Mastered" : "⏳ Learning"}
              </span>
            </div>

            {/* 3D Flip Card Container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full h-80 rounded-3xl bg-white dark:bg-[#1E1E1E] border-2 border-[#E5E7EB] dark:border-[#2E2E2E] shadow-lg cursor-pointer p-8 flex flex-col justify-between transition-all duration-300 hover:border-indigo-500 select-none"
            >
              {!isFlipped ? (
                /* Front Side (English) */
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider mb-2 font-bold">
                    English Word
                  </span>
                  <h3 className="text-4xl font-extrabold text-[#1F2937] dark:text-[#E5E7EB] mb-3 font-serif">
                    {currentCard?.cleanWord}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                      {currentCard?.ipa}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(currentCard?.cleanWord || "");
                      }}
                      className="p-1.5 rounded-lg bg-[#F3F4F6] dark:bg-[#252528] text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      🔊
                    </button>
                  </div>
                  <span className="text-xs text-[#6B7280]/70 dark:text-[#9CA3AF]/70 mt-8">
                    (Click card to reveal Turkish meaning)
                  </span>
                </div>
              ) : (
                /* Back Side (Turkish & Example) */
                <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-150">
                  <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider mb-2 font-bold">
                    Turkish Translation
                  </span>
                  <h3 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                    {currentCard?.translationTr}
                  </h3>
                  {currentCard?.exampleSentence && (
                    <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#9CA3AF] italic max-w-sm leading-relaxed bg-[#F9FAFB] dark:bg-[#252528] p-3 rounded-xl border border-[#E5E7EB] dark:border-[#2E2E2E]">
                      &ldquo;{currentCard.exampleSentence}&rdquo;
                    </p>
                  )}
                  <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] mt-3">
                    From story: <strong>{currentCard?.storyTitle}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Spaced Repetition Actions */}
            <div className="grid grid-cols-3 gap-3 w-full mt-6">
              <button
                type="button"
                onClick={() => handleNextCard("learning")}
                className="py-3 px-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-bold hover:scale-[1.02] transition-transform cursor-pointer border border-rose-200 dark:border-rose-900/50"
              >
                🔄 Again
              </button>
              <button
                type="button"
                onClick={() => handleNextCard()}
                className="py-3 px-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-bold hover:scale-[1.02] transition-transform cursor-pointer border border-amber-200 dark:border-amber-900/50"
              >
                👍 Good
              </button>
              <button
                type="button"
                onClick={() => handleNextCard("mastered")}
                className="py-3 px-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold hover:scale-[1.02] transition-transform cursor-pointer border border-emerald-200 dark:border-emerald-900/50"
              >
                ✓ Mastered
              </button>
            </div>
          </div>
        ) : (
          /* Table / Word List View */
          <div className="space-y-4">
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-[#E5E7EB] dark:border-[#2E2E2E]">
              {/* Filter Pills */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {(["all", "learning", "mastered"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer capitalize ${
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
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-[#F7F4EE] dark:bg-[#252528] border border-[#E5E7EB] dark:border-[#2E2E2E] text-[#1F2937] dark:text-[#E5E7EB] focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <svg
                  className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6B7280] dark:text-[#9CA3AF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Word List Table */}
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
                    className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#2E2E2E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => playAudio(item.cleanWord)}
                        title="Listen pronunciation"
                        className="w-9 h-9 rounded-xl bg-[#F3F4F6] dark:bg-[#252528] text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm hover:scale-105 transition-transform cursor-pointer shrink-0"
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
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-[#F3F4F6] dark:bg-[#252528] text-[#6B7280] dark:text-[#9CA3AF] uppercase">
                            {item.partOfSpeech}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {item.translationTr}
                        </p>
                        {item.exampleSentence && (
                          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] italic mt-1">
                            &ldquo;{item.exampleSentence}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5E7EB] dark:border-[#2E2E2E]">
                      <button
                        type="button"
                        onClick={() =>
                          updateVocabStatus(
                            item.id,
                            item.status === "mastered" ? "learning" : "mastered"
                          )
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
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
                        className="w-8 h-8 rounded-xl bg-[#F3F4F6] dark:bg-[#252528] text-[#6B7280] hover:text-rose-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
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
