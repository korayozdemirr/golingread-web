"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  const themeStyles: Record<
    ReadingTheme,
    {
      containerBg: string;
      textColor: string;
      headingColor: string;
      mutedColor: string;
      cardBg: string;
      borderColor: string;
      borderClass: string;
    }
  > = {
    cream: {
      containerBg: "bg-[#FDFBF7]",
      textColor: "text-[#1F2937]",
      headingColor: "text-[#111827]",
      mutedColor: "text-[#4B5563]",
      cardBg: "bg-[#FFFFFF]",
      borderColor: "#E5E7EB",
      borderClass: "border-[#E5E7EB]",
    },
    white: {
      containerBg: "bg-[#FFFFFF]",
      textColor: "text-[#1F2937]",
      headingColor: "text-[#111827]",
      mutedColor: "text-[#4B5563]",
      cardBg: "bg-[#FAFAFA]",
      borderColor: "#E5E7EB",
      borderClass: "border-[#E5E7EB]",
    },
    sepia: {
      containerBg: "bg-[#F4ECD8]",
      textColor: "text-[#4A3B2C]",
      headingColor: "text-[#2B2118]",
      mutedColor: "text-[#6E543D]",
      cardBg: "bg-[#EFE5CD]",
      borderColor: "#DECDB2",
      borderClass: "border-[#DECDB2]",
    },
    dark: {
      containerBg: "bg-[#121212]",
      textColor: "text-[#E5E7EB]",
      headingColor: "text-[#F9FAFB]",
      mutedColor: "text-[#9CA3AF]",
      cardBg: "bg-[#1E1E1E]",
      borderColor: "#2E2E2E",
      borderClass: "border-[#2E2E2E]",
    },
  };

  // Theme-specific word token highlighting styles
  const themeWordStyles: Record<
    ReadingTheme,
    {
      baseText: string;
      hover: string;
      selected: string;
      saved: string;
    }
  > = {
    cream: {
      baseText: "text-[#1F2937]",
      hover: "hover:bg-amber-100 hover:text-amber-950",
      selected: "bg-amber-200 text-amber-950 font-medium ring-1 ring-amber-400/60",
      saved: "bg-emerald-100/70 text-emerald-950 border-b border-emerald-400",
    },
    white: {
      baseText: "text-[#111827]",
      hover: "hover:bg-indigo-50 hover:text-indigo-950",
      selected: "bg-indigo-100 text-indigo-950 font-medium ring-1 ring-indigo-300",
      saved: "bg-emerald-50 text-emerald-950 border-b border-emerald-400",
    },
    sepia: {
      baseText: "text-[#4A3B2C]",
      hover: "hover:bg-[#E8DCC4] hover:text-[#2B2118]",
      selected: "bg-[#DECDB2] text-[#2B2118] font-medium ring-1 ring-[#BAA88C]",
      saved: "bg-[#E2D6BC] text-[#2B2118] border-b border-[#A69476]",
    },
    dark: {
      baseText: "text-[#E5E7EB]",
      hover: "hover:bg-white/15 hover:text-white",
      selected: "bg-white/25 text-white font-medium ring-1 ring-white/40",
      saved: "bg-emerald-950/60 text-emerald-300 border-b border-emerald-500/60",
    },
  };

  const currentTheme = themeStyles[readingTheme];
  const currentWordTheme = themeWordStyles[readingTheme];

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
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs mb-5 font-medium" aria-label="Breadcrumb">
              <Link
                href="/"
                className={`hover:underline flex items-center gap-1.5 font-bold ${currentTheme.mutedColor} hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Stories</span>
              </Link>
              <span className={currentTheme.mutedColor}>/</span>
              <span className={currentTheme.mutedColor}>{story.category}</span>
              <span className={currentTheme.mutedColor}>/</span>
              <span className={`font-semibold truncate max-w-[200px] ${currentTheme.textColor}`}>
                {story.title}
              </span>
            </nav>

            {/* Story Header */}
            <header className={`mb-8 pb-6 border-b ${currentTheme.borderClass}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                  Level: {story.level}
                </span>
                <span className={`text-xs ${currentTheme.mutedColor}`}>
                  • {story.category} • {story.readTimeMinutes} min read
                </span>
              </div>

              <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight ${currentTheme.headingColor} mb-2 font-serif`}>
                {story.title}
              </h1>
              <h2 className={`text-sm sm:text-base font-medium ${currentTheme.mutedColor} italic`}>
                {story.summary}
              </h2>
            </header>

            {/* Reading Body with Interactive Tokens */}
            <div
              className={`font-story tracking-[0.01em] ${lineHeightClass} transition-all duration-150 space-y-8`}
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
                        const isSaved = savedWordsMap.has(token.clean.toLowerCase());

                        let tokenClass = `rounded-sm px-0.5 transition-colors duration-150 text-left cursor-pointer inline-block ${currentWordTheme.baseText}`;

                        if (isSelected) {
                          tokenClass += ` ${currentWordTheme.selected}`;
                        } else if (isSaved) {
                          tokenClass += ` ${currentWordTheme.saved} ${currentWordTheme.hover}`;
                        } else {
                          tokenClass += ` ${currentWordTheme.hover}`;
                        }

                        return (
                          <button
                            key={`${paragraph.id}-${tIndex}-${token.clean}`}
                            type="button"
                            onClick={() => setSelectedToken(token)}
                            className={tokenClass}
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
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] hover:text-indigo-600 dark:hover:text-indigo-400 py-1 px-2.5 rounded-lg bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#2E2E2E] transition-colors cursor-pointer shadow-2xs"
                      >
                        <span>🇹🇷</span>
                        <span>{isTranslationOpen ? "Hide Turkish Translation" : "Show Turkish Translation"}</span>
                      </button>
                    </div>

                    {/* Revealed Turkish Paragraph Translation */}
                    {isTranslationOpen && (
                      <div className="mt-3 p-4 rounded-xl bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#2E2E2E] text-sm text-[#4B5563] dark:text-[#9CA3AF] font-sans leading-relaxed shadow-2xs animate-in fade-in duration-200">
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                          Turkish Translation:
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
              readingTheme={readingTheme}
            />
          </div>

          {/* Right Sidebar (Col 4) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-36">
              <SponsorSidebar readingTheme={readingTheme} />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Word Popover / Inspector */}
      {selectedToken && (
        <WordPopover
          token={selectedToken}
          isSaved={savedWordsMap.has(selectedToken.clean.toLowerCase())}
          onToggleSave={onToggleSaveWord}
          onClose={() => setSelectedToken(null)}
        />
      )}
    </div>
  );
};
