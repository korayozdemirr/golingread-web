"use client";

import React from "react";
import { Story, UserProfile } from "@/types";
import { calculateStoryMatch } from "@/data/mockStories";

interface StoryCardProps {
  story: Story;
  userProfile: UserProfile;
  isBookmarked: boolean;
  onToggleBookmark: (storyId: string) => void;
  onSelectStory: (story: Story) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  userProfile,
  isBookmarked,
  onToggleBookmark,
  onSelectStory,
}) => {
  const match = calculateStoryMatch(story, userProfile.levelNumber);

  return (
    <article className="group flex flex-col justify-between rounded-2xl bg-[#FFFFFF] dark:bg-[#1B1C20] border border-[#E8E2D6] dark:border-[#2A2B32] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Top Media & Tags */}
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-[#E8E2D6] dark:bg-[#25262C]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Level & Category badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#121316]/80 backdrop-blur-md text-white border border-white/20">
              {story.level}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/40 backdrop-blur-md text-white/90">
              {story.category}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(story.id);
            }}
            title={isBookmarked ? "Kaydedilenlerden Çıkar" : "Kaydet"}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#121316]/80 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
          >
            {isBookmarked ? (
              <svg className="w-4 h-4 text-[#F59E0B] fill-current" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            )}
          </button>

          {/* Krashen % Match Pill */}
          <div className="absolute bottom-3 left-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${match.badgeColorClass}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  match.badgeType === "optimal"
                    ? "bg-[#2E7D32] dark:bg-[#81C784]"
                    : match.badgeType === "challenging"
                    ? "bg-[#F57F17] dark:bg-[#FFD54F]"
                    : "bg-[#C62828] dark:text-[#E57373]"
                }`}
              />
              {match.badgeLabel}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-[#6E675F] dark:text-[#9A9790] mb-2 font-medium">
            <span>⏱️ {story.readTimeMinutes} dk okuma</span>
            <span>•</span>
            <span>📝 {story.wordCount} kelime</span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-[#2A2723] dark:text-[#E6E4DF] mb-1 group-hover:text-[#2D6A4F] dark:group-hover:text-[#52B788] transition-colors line-clamp-1">
            {story.title}
          </h2>
          <h3 className="text-xs font-medium text-[#6E675F] dark:text-[#9A9790] mb-3 line-clamp-1 italic">
            {story.titleTr}
          </h3>

          <p className="text-xs sm:text-sm text-[#6E675F] dark:text-[#9A9790] leading-relaxed line-clamp-2">
            {story.summary}
          </p>
        </div>
      </div>

      {/* Card Footer / Action */}
      <div className="p-5 pt-0">
        <button
          type="button"
          onClick={() => onSelectStory(story)}
          className="w-full py-2.5 px-4 rounded-xl bg-[#F7F4EE] dark:bg-[#25262C] group-hover:bg-[#2D6A4F] group-hover:text-white dark:group-hover:bg-[#52B788] dark:group-hover:text-[#121316] text-xs sm:text-sm font-semibold text-[#2A2723] dark:text-[#E6E4DF] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Hikayeyi Oku</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </article>
  );
};
