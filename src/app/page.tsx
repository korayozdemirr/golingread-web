"use client";

import React, { useState } from "react";
import { Story, WordToken, VocabularyItem, UserProfile, CEFRLevel, StoryCategory } from "@/types";
import { MOCK_STORIES } from "@/data/mockStories";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/feed/HeroSection";
import { FilterBar } from "@/components/feed/FilterBar";
import { StoryCard } from "@/components/feed/StoryCard";
import { ReaderCanvas } from "@/components/reader/ReaderCanvas";
import { FlashcardModal } from "@/components/vocabulary/FlashcardModal";
import { LevelTestModal } from "@/components/level-test/LevelTestModal";

const LEVEL_MAP: Record<CEFRLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

const INITIAL_VOCABULARY: VocabularyItem[] = [
  {
    id: "v-1",
    cleanWord: "cinnamon",
    text: "cinnamon",
    translationTr: "tarçın",
    ipa: "/ˈsɪn.ə.mən/",
    partOfSpeech: "noun",
    exampleSentence: "A sprinkle of cinnamon makes the coffee smell sweet.",
    storyTitle: "The Whispering Library",
    savedAt: new Date().toISOString(),
    status: "learning",
    reviewCount: 1,
    easeFactor: 2.5,
  },
  {
    id: "v-2",
    cleanWord: "intricate",
    text: "intricate",
    translationTr: "karmaşık / ince işlenmiş",
    ipa: "/ˈɪn.trə.kət/",
    partOfSpeech: "adj",
    exampleSentence: "The clock mechanism had an intricate arrangement of gears.",
    storyTitle: "The Clockwork Forest",
    savedAt: new Date().toISOString(),
    status: "learning",
    reviewCount: 2,
    easeFactor: 2.5,
  },
];

export default function Home() {
  const [currentView, setCurrentView] = useState<"feed" | "reader">("feed");
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  // User Profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Öğrenici",
    level: "A2",
    levelNumber: 2,
    dailyStreak: 5,
    wordsLearned: 24,
    storiesRead: 3,
  });

  // Saved Vocabulary list
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(INITIAL_VOCABULARY);

  // Bookmarked Stories
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(["story-1"]));

  // Feed Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<CEFRLevel | "ALL">("ALL");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<StoryCategory | "ALL">("ALL");

  // Modals
  const [isVocabularyModalOpen, setIsVocabularyModalOpen] = useState<boolean>(false);
  const [isLevelTestModalOpen, setIsLevelTestModalOpen] = useState<boolean>(false);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  // Change User Level
  const handleChangeLevel = (newLevel: CEFRLevel) => {
    setUserProfile((prev) => ({
      ...prev,
      level: newLevel,
      levelNumber: LEVEL_MAP[newLevel] || 2,
    }));
  };

  // Bookmark Toggle
  const handleToggleBookmark = (storyId: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(storyId)) {
        next.delete(storyId);
      } else {
        next.add(storyId);
      }
      return next;
    });
  };

  // Select Story to Read
  const handleSelectStory = (story: Story) => {
    setActiveStory(story);
    setCurrentView("reader");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Word Save / Toggle from Reader
  const handleToggleSaveWord = (token: WordToken) => {
    setVocabulary((prev) => {
      const existsIndex = prev.findIndex((item) => item.cleanWord.toLowerCase() === token.clean.toLowerCase());
      if (existsIndex >= 0) {
        // Remove
        return prev.filter((_, idx) => idx !== existsIndex);
      } else {
        // Add
        const newItem: VocabularyItem = {
          id: `vocab-${Date.now()}`,
          cleanWord: token.clean,
          text: token.text,
          translationTr: token.translationTr,
          ipa: token.ipa,
          partOfSpeech: token.partOfSpeech,
          exampleSentence: token.exampleSentence,
          storyTitle: activeStory?.title || "Okuma",
          savedAt: new Date().toISOString(),
          status: "learning",
          reviewCount: 0,
          easeFactor: 2.5,
        };
        return [newItem, ...prev];
      }
    });
  };

  // Complete Story Handler
  const handleCompleteStory = () => {
    setUserProfile((prev) => ({
      ...prev,
      storiesRead: prev.storiesRead + 1,
    }));
  };

  // Vocabulary Status Update
  const handleUpdateVocabStatus = (id: string, status: "learning" | "mastered") => {
    setVocabulary((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  // Remove Word from Vocabulary
  const handleRemoveVocabWord = (id: string) => {
    setVocabulary((prev) => prev.filter((item) => item.id !== id));
  };

  // Map of saved words for quick lookup in Reader
  const savedWordsMap = new Map<string, boolean>();
  vocabulary.forEach((v) => savedWordsMap.set(v.cleanWord.toLowerCase(), true));

  // Filtered stories for the feed
  const filteredStories = MOCK_STORIES.filter((story) => {
    const matchesSearch =
      searchQuery === "" ||
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.titleTr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = selectedLevelFilter === "ALL" || story.level === selectedLevelFilter;

    const matchesCategory = selectedCategoryFilter === "ALL" || story.category === selectedCategoryFilter;

    return matchesSearch && matchesLevel && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-[#121316] text-[#2A2723] dark:text-[#E6E4DF] transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigateHome={() => setCurrentView("feed")}
        onOpenVocabulary={() => setIsVocabularyModalOpen(true)}
        onOpenLevelTest={() => setIsLevelTestModalOpen(true)}
        savedWordsCount={vocabulary.length}
        userProfile={userProfile}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Content Area */}
      {currentView === "feed" ? (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
          {/* Krashen 95% Hero & Level Calibrator */}
          <HeroSection
            userProfile={userProfile}
            onChangeLevel={handleChangeLevel}
            onOpenLevelTest={() => setIsLevelTestModalOpen(true)}
          />

          {/* Filter Bar (Search, Level, Category) */}
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedLevel={selectedLevelFilter}
            onSelectLevel={setSelectedLevelFilter}
            selectedCategory={selectedCategoryFilter}
            onSelectCategory={setSelectedCategoryFilter}
            totalStoriesCount={filteredStories.length}
          />

          {/* Story Cards Grid */}
          {filteredStories.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#1B1C20] rounded-3xl border border-[#E8E2D6] dark:border-[#2A2B32]">
              <span className="text-4xl block mb-2">🔍</span>
              <h3 className="text-lg font-bold text-[#2A2723] dark:text-[#E6E4DF]">
                Uygun hikaye bulunamadı
              </h3>
              <p className="text-xs text-[#6E675F] dark:text-[#9A9790] mt-1">
                Lütfen arama teriminizi veya filtre tercihlerinizi değiştirin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  userProfile={userProfile}
                  isBookmarked={bookmarkedIds.has(story.id)}
                  onToggleBookmark={handleToggleBookmark}
                  onSelectStory={handleSelectStory}
                />
              ))}
            </div>
          )}
        </main>
      ) : (
        activeStory && (
          <ReaderCanvas
            story={activeStory}
            onBackToFeed={() => setCurrentView("feed")}
            savedWordsMap={savedWordsMap}
            onToggleSaveWord={handleToggleSaveWord}
            onCompleteStory={handleCompleteStory}
          />
        )
      )}

      {/* Footer */}
      <Footer />

      {/* Vocabulary Review & Flashcard Modal */}
      <FlashcardModal
        isOpen={isVocabularyModalOpen}
        onClose={() => setIsVocabularyModalOpen(false)}
        vocabulary={vocabulary}
        onUpdateStatus={handleUpdateVocabStatus}
        onRemoveWord={handleRemoveVocabWord}
      />

      {/* Level Diagnostic Test Modal */}
      <LevelTestModal
        isOpen={isLevelTestModalOpen}
        onClose={() => setIsLevelTestModalOpen(false)}
        onApplyLevel={handleChangeLevel}
      />
    </div>
  );
}
