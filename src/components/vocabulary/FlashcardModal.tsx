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
      <div className="w-full max-w-2xl rounded-3xl bg-[#FDFBF7] dark:bg-[#16171B] border border-[#E8E2D6] dark:border-[#2A2B32] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D6] dark:border-[#2A2B32] flex items-center justify-between bg-white dark:bg-[#1B1C20]">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h3 className="text-lg font-bold text-[#2A2723] dark:text-[#E6E4DF]">
              Kelime Defterim & Flashcard
            </h3>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#E8F5E9] text-[#1B5E20] dark:bg-[#143820] dark:text-[#81C784]">
              {vocabulary.length} Kelime
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex rounded-xl bg-[#F7F4EE] dark:bg-[#25262C] p-1">
              <button
                type="button"
                onClick={() => setActiveTab("flashcards")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === "flashcards"
                    ? "bg-white dark:bg-[#1B1C20] text-[#2A2723] dark:text-[#E6E4DF] shadow-xs"
                    : "text-[#6E675F] dark:text-[#9A9790]"
                }`}
              >
                🃏 Kartlar
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("list")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === "list"
                    ? "bg-white dark:bg-[#1B1C20] text-[#2A2723] dark:text-[#E6E4DF] shadow-xs"
                    : "text-[#6E675F] dark:text-[#9A9790]"
                }`}
              >
                📋 Liste
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F7F4EE] dark:bg-[#25262C] text-[#6E675F] hover:text-[#2A2723] dark:hover:text-[#E6E4DF] flex items-center justify-center cursor-pointer"
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
              <h4 className="text-base font-bold text-[#2A2723] dark:text-[#E6E4DF] mb-1">
                Henüz kelime kaydetmediniz
              </h4>
              <p className="text-xs text-[#6E675F] dark:text-[#9A9790] max-w-sm mx-auto">
                Hikayeleri okurken bilmediğiniz kelimelerin üzerine tıklayıp <strong>&ldquo;+ Kelime Defterime Ekle&rdquo;</strong> butonunu kullanarak buraya ekleyebilirsiniz.
              </p>
            </div>
          ) : activeTab === "flashcards" ? (
            /* Flashcard Practice Mode */
            <div className="flex flex-col items-center justify-center max-w-md mx-auto py-2">
              <div className="w-full flex items-center justify-between text-xs text-[#6E675F] dark:text-[#9A9790] mb-3">
                <span>Kart {currentIndex + 1} / {vocabulary.length}</span>
                <span className="font-semibold capitalize text-[#2D6A4F] dark:text-[#52B788]">
                  {currentCard?.status === "mastered" ? "✓ Öğrenildi" : "⏳ Öğreniliyor"}
                </span>
              </div>

              {/* 3D Flip Card Container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-64 rounded-2xl bg-white dark:bg-[#1B1C20] border-2 border-[#E8E2D6] dark:border-[#2A2B32] shadow-lg cursor-pointer p-6 flex flex-col justify-between transition-all duration-300 hover:border-[#2D6A4F] dark:hover:border-[#52B788] select-none"
              >
                {!isFlipped ? (
                  /* Front Side (English) */
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <span className="text-xs text-[#6E675F] dark:text-[#9A9790] uppercase tracking-wider mb-2">
                      İngilizce Kelime
                    </span>
                    <h3 className="text-3xl font-extrabold text-[#2A2723] dark:text-[#E6E4DF] mb-2 font-serif">
                      {currentCard?.cleanWord}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#6E675F] dark:text-[#9A9790]">
                        {currentCard?.ipa}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(currentCard?.cleanWord || "");
                        }}
                        className="p-1 text-[#2D6A4F] dark:text-[#52B788] hover:scale-110 transition-transform"
                      >
                        🔊
                      </button>
                    </div>
                    <span className="text-[11px] text-[#6E675F]/60 dark:text-[#9A9790]/60 mt-6">
                      (Anlamını görmek için karta tıkla)
                    </span>
                  </div>
                ) : (
                  /* Back Side (Turkish & Example) */
                  <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-150">
                    <span className="text-xs text-[#6E675F] dark:text-[#9A9790] uppercase tracking-wider mb-2">
                      Türkçe Karşılığı
                    </span>
                    <h3 className="text-2xl font-bold text-[#2D6A4F] dark:text-[#52B788] mb-3">
                      {currentCard?.translationTr}
                    </h3>
                    {currentCard?.exampleSentence && (
                      <p className="text-xs text-[#6E675F] dark:text-[#9A9790] italic max-w-xs">
                        &ldquo;{currentCard.exampleSentence}&rdquo;
                      </p>
                    )}
                    <span className="text-[10px] text-[#6E675F] dark:text-[#9A9790] mt-3">
                      Kaynak: {currentCard?.storyTitle}
                    </span>
                  </div>
                )}
              </div>

              {/* Spaced Repetition Actions */}
              <div className="grid grid-cols-3 gap-3 w-full mt-6">
                <button
                  type="button"
                  onClick={() => handleNextCard("learning")}
                  className="py-2.5 px-2 rounded-xl bg-[#FFEBEE] dark:bg-[#3B161B] text-[#C62828] dark:text-[#E57373] text-xs font-bold hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  🔄 Tekrar
                </button>
                <button
                  type="button"
                  onClick={() => handleNextCard()}
                  className="py-2.5 px-2 rounded-xl bg-[#FFF8E1] dark:bg-[#3E3211] text-[#F57F17] dark:text-[#FFD54F] text-xs font-bold hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  👍 İyi
                </button>
                <button
                  type="button"
                  onClick={() => handleNextCard("mastered")}
                  className="py-2.5 px-2 rounded-xl bg-[#E8F5E9] dark:bg-[#143820] text-[#1B5E20] dark:text-[#81C784] text-xs font-bold hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  ✓ Öğrenildi
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
                        ? "bg-[#2A2723] text-white dark:bg-[#E6E4DF] dark:text-[#121316]"
                        : "bg-white dark:bg-[#1B1C20] text-[#6E675F] dark:text-[#9A9790] border border-[#E8E2D6] dark:border-[#2A2B32]"
                    }`}
                  >
                    {filter === "all" ? "Tümü" : filter === "learning" ? "Öğreniliyor" : "Öğrenildi"}
                  </button>
                ))}
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {filteredVocabulary.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-[#1B1C20] border border-[#E8E2D6] dark:border-[#2A2B32] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => playAudio(item.cleanWord)}
                        title="Dinle"
                        className="w-8 h-8 rounded-lg bg-[#F7F4EE] dark:bg-[#25262C] text-[#2D6A4F] dark:text-[#52B788] flex items-center justify-center text-sm cursor-pointer"
                      >
                        🔊
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-[#2A2723] dark:text-[#E6E4DF]">
                            {item.cleanWord}
                          </span>
                          <span className="text-xs text-[#6E675F] dark:text-[#9A9790] font-mono">
                            {item.ipa}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#2D6A4F] dark:text-[#52B788]">
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
                            ? "bg-[#E8F5E9] text-[#1B5E20] dark:bg-[#143820] dark:text-[#81C784]"
                            : "bg-[#FFF8E1] text-[#F57F17] dark:bg-[#3E3211] dark:text-[#FFD54F]"
                        }`}
                      >
                        {item.status === "mastered" ? "✓ Öğrenildi" : "⏳ Öğreniliyor"}
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemoveWord(item.id)}
                        title="Sil"
                        className="text-xs text-[#6E675F] hover:text-[#C62828] p-1 cursor-pointer"
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
