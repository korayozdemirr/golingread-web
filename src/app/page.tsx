"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Story, CEFRLevel, StoryCategory } from "@/types";
import { MOCK_STORIES } from "@/data/mockStories";
import { getAllStories } from "@/lib/stories";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/feed/HeroSection";
import { FilterBar } from "@/components/feed/FilterBar";
import { StoryCard } from "@/components/feed/StoryCard";
import { LevelTestModal } from "@/components/level-test/LevelTestModal";
import { useAppContext } from "@/context/AppContext";

export default function Home() {
  const {
    userProfile,
    changeLevel,
    bookmarkedIds,
    toggleBookmark,
    isLevelTestModalOpen,
    openLevelTestModal,
    closeLevelTestModal,
  } = useAppContext();

  // Stories State (Hybrid DB + Mock)
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);

  // Load all stories from Supabase on mount
  useEffect(() => {
    getAllStories().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setStories(loaded);
      }
    });
  }, []);

  // Feed Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<CEFRLevel | "ALL">("ALL");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<StoryCategory | "ALL">("ALL");

  // Filtered stories for the feed
  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      const matchesSearch =
        searchQuery === "" ||
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.summary.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLevel =
        selectedLevelFilter === "ALL" || story.level === selectedLevelFilter;

      const matchesCategory =
        selectedCategoryFilter === "ALL" || story.category === selectedCategoryFilter;

      return matchesSearch && matchesLevel && matchesCategory;
    });
  }, [stories, searchQuery, selectedLevelFilter, selectedCategoryFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-[#121212] text-[#1F2937] dark:text-[#E5E7EB] transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8 pb-24 sm:pb-8 flex-1 w-full">
        {/* Krashen 95% Hero & Level Calibrator */}
        <HeroSection
          userProfile={userProfile}
          onChangeLevel={changeLevel}
          onOpenLevelTest={openLevelTestModal}
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
          <div className="text-center py-20 bg-white dark:bg-[#1E1E1E] rounded-3xl border border-[#E5E7EB] dark:border-[#2E2E2E]">
            <span className="text-4xl block mb-2">🔍</span>
            <h3 className="text-lg font-bold text-[#1F2937] dark:text-[#E5E7EB]">
              No stories found
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
              Please adjust your search keywords or filter criteria to see available stories.
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
                onToggleBookmark={toggleBookmark}
              />
            ))}
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
