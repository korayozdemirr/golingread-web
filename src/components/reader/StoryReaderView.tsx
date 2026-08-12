"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Story, WordToken } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ReaderCanvas } from "@/components/reader/ReaderCanvas";
import { LevelTestModal } from "@/components/level-test/LevelTestModal";
import { useAppContext } from "@/context/AppContext";
import { enrichStoryTokens } from "@/lib/story-enricher";

interface StoryReaderViewProps {
  story: Story;
}

export const StoryReaderView: React.FC<StoryReaderViewProps> = ({ story: rawStory }) => {
  const router = useRouter();
  const story = useMemo(() => enrichStoryTokens(rawStory), [rawStory]);
  const {
    savedWordsMap,
    toggleSaveWord,
    incrementStoriesRead,
    isLevelTestModalOpen,
    closeLevelTestModal,
    changeLevel,
  } = useAppContext();

  const handleBackToFeed = () => {
    router.push("/");
  };

  const handleToggleSaveWord = (token: WordToken) => {
    toggleSaveWord(token, story.title);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar />

      {/* Reader Canvas */}
      <div className="flex-1">
        <ReaderCanvas
          story={story}
          onBackToFeed={handleBackToFeed}
          savedWordsMap={savedWordsMap}
          onToggleSaveWord={handleToggleSaveWord}
          onCompleteStory={incrementStoriesRead}
        />
      </div>

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
};
