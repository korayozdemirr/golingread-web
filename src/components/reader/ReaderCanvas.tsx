"use client";

import React, { useState } from "react";
import { Story, WordToken, ReadingTheme, LineHeight } from "@/types";
import { ReaderToolbar } from "./ReaderToolbar";
import { WordPopover } from "./WordPopover";
import { StoryQuiz } from "./StoryQuiz";
import { SponsorSidebar } from "./SponsorSidebar";

interface ReaderCanvasProps {
  story: Story;
  onBackToFeed: () => void;
  savedWordsMap: Map<string, boolean>;
  onToggleSaveWord: (token: WordToken) => void;
  onCompleteStory: () => void;
}

export const ReaderCanvas: React.FC<ReaderCanvasProps> = ({
  story,
  onBackToFeed,
  savedWordsMap,
  onToggleSaveWord,
  onCompleteStory,
}) => {
  const [fontSize, setFontSize] = useState<number>(19);
  const [lineHeight, setLineHeight] = useState<LineHeight>("relaxed");
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>("cream");
  const [selectedToken, setSelectedToken] = useState<WordToken | null>(null);
  const [expandedTranslations, setExpandedTranslations] = useState<Record<string, boolean>>({});

  // Assemble full plain text for TTS audio
  const fullStoryText = story.paragraphs
    .map((p) => p.tokens.map((t) => t.text).join(" "))
    .join(" \n\n ");

  const toggleParagraphTranslation = (paragraphId: string) => {
    setExpandedTranslations((prev) => ({
      ...prev,
      [paragraphId]: !prev[paragraphId],
    }));
  };

  // Line height CSS classes
  const lineHeightClass =
    lineHeight === "normal"
      ? "leading-[1.6]"
      : lineHeight === "relaxed"
      ? "leading-[1.85]"
      : "leading-[2.15]";

  // Theme style mapping
  const themeStyles: Record<ReadingTheme, { containerBg: string; textColor: string; cardBg: string; borderColor: string }> = {
    cream: {
      containerBg: "bg-[#FDFBF7]",
      textColor: "text-[#2A2723]",
      cardBg: "bg-[#FFFFFF]",
      borderColor: "border-[#E8E2D6]",
    },
    white: {
      containerBg: "bg-[#FFFFFF]",
      textColor: "text-[#111827]",
      cardBg: "bg-[#FAFAFA]",
      borderColor: "border-[#E5E7EB]",
    },
    sepia: {
      containerBg: "bg-[#F4ECD8]",
      textColor: "text-[#4A3B2C]",
      cardBg: "bg-[#EFE5CD]",
      borderColor: "border-[#DECDB2]",
    },
    dark: {
      containerBg: "bg-[#121316]",
      textColor: "text-[#E6E4DF]",
      cardBg: "bg-[#1B1C20]",
      borderColor: "border-[#2A2B32]",
    },
  };

  const currentTheme = themeStyles[readingTheme];

  return (
    <div className={`min-h-screen ${currentTheme.containerBg} transition-colors duration-200`}>
      {/* Top Toolbar */}
      <ReaderToolbar
        storyTitle={story.title}
        onBack={onBackToFeed}
        fontSize={fontSize}
        onIncreaseFontSize={() => setFontSize((prev) => Math.min(26, prev + 1))}
        onDecreaseFontSize={() => setFontSize((prev) => Math.max(15, prev - 1))}
        lineHeight={lineHeight}
        onChangeLineHeight={setLineHeight}
        readingTheme={readingTheme}
        onChangeReadingTheme={setReadingTheme}
        fullStoryText={fullStoryText}
      />

      {/* Main Reading Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Reading Canvas (Col 8) */}
          <div className="lg:col-span-8 max-w-[68ch] mx-auto w-full">
            {/* Story Header */}
            <header className="mb-8 pb-6 border-b border-[#E8E2D6]/80 dark:border-[#2A2B32]">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F5E9] dark:bg-[#143820] text-[#1B5E20] dark:text-[#81C784]">
                  {story.level} Seviyesi
                </span>
                <span className="text-xs text-[#6E675F] dark:text-[#9A9790]">
                  • {story.category} • {story.readTimeMinutes} dk okuma
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2A2723] dark:text-[#E6E4DF] mb-2 font-serif">
                {story.title}
              </h1>
              <h2 className="text-sm sm:text-base font-medium text-[#6E675F] dark:text-[#9A9790] italic">
                {story.titleTr}
              </h2>
            </header>

            {/* Reading Body with Interactive Tokens */}
            <div
              className={`font-story ${lineHeightClass} transition-all duration-150 space-y-8`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {story.paragraphs.map((paragraph) => {
                const isTranslationOpen = expandedTranslations[paragraph.id];

                return (
                  <div key={paragraph.id} className="relative group/paragraph">
                    {/* Tokenized Paragraph */}
                    <p className={`${currentTheme.textColor} flex flex-wrap gap-x-1.5 gap-y-1 items-baseline`}>
                      {paragraph.tokens.map((token, tIndex) => {
                        const isSelected = selectedToken?.clean === token.clean;
                        const isSaved = savedWordsMap.has(token.clean);

                        return (
                          <button
                            key={`${paragraph.id}-${tIndex}-${token.clean}`}
                            type="button"
                            onClick={() => setSelectedToken(token)}
                            className={`rounded px-1 py-0.5 transition-all text-left cursor-pointer inline-block ${
                              isSelected
                                ? "bg-[#2D6A4F] text-white ring-2 ring-[#2D6A4F] dark:bg-[#52B788] dark:text-[#121316]"
                                : isSaved
                                ? "bg-[#E8F5E9] text-[#1B5E20] dark:bg-[#143820] dark:text-[#81C784] font-medium"
                                : "hover:bg-[#EAE4D7] dark:hover:bg-[#2A2B32]"
                            }`}
                          >
                            {token.text}
                          </button>
                        );
                      })}
                    </p>

                    {/* Paragraph Translation Toggle Button */}
                    <div className="mt-2 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => toggleParagraphTranslation(paragraph.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#6E675F] dark:text-[#9A9790] hover:text-[#2D6A4F] dark:hover:text-[#52B788] py-1 px-2 rounded-lg bg-[#F7F4EE] dark:bg-[#1B1C20] border border-[#E8E2D6] dark:border-[#2A2B32] transition-colors cursor-pointer"
                      >
                        <span>🇹🇷</span>
                        <span>{isTranslationOpen ? "Çeviriyi Gizle" : "Paragraf Çevirisi"}</span>
                      </button>
                    </div>

                    {/* Revealed Turkish Paragraph Translation */}
                    {isTranslationOpen && (
                      <div className="mt-3 p-4 rounded-xl bg-[#F7F4EE] dark:bg-[#1B1C20] border border-[#E8E2D6] dark:border-[#2A2B32] text-sm text-[#6E675F] dark:text-[#9A9790] font-sans leading-relaxed animate-in fade-in duration-200">
                        <span className="text-[11px] font-bold text-[#2D6A4F] dark:text-[#52B788] uppercase tracking-wider block mb-1">
                          Türkçe Karşılık:
                        </span>
                        {paragraph.turkishTranslation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Comprehension Quiz at the end */}
            <StoryQuiz
              quizQuestions={story.quiz}
              onCompleteStory={onCompleteStory}
            />
          </div>

          {/* Right Sidebar (Col 4) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-36">
              <SponsorSidebar />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Word Popover / Inspector */}
      {selectedToken && (
        <WordPopover
          token={selectedToken}
          isSaved={savedWordsMap.has(selectedToken.clean)}
          onToggleSave={onToggleSaveWord}
          onClose={() => setSelectedToken(null)}
        />
      )}
    </div>
  );
};
