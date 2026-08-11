"use client";

import React from "react";
import Link from "next/link";
import { Story, UserProfile } from "@/types";
import { calculateStoryMatch } from "@/data/mockStories";

interface StoryCardProps {
  story: Story;
  userProfile: UserProfile;
  isBookmarked: boolean;
  onToggleBookmark: (storyId: string) => void;
  onSelectStory?: (story: Story) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  userProfile,
  isBookmarked,
  onToggleBookmark,
}) => {
  const match = calculateStoryMatch(story, userProfile.levelNumber);

  return (
    <article className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#2E2E2E] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Top Media & Tags */}
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-[#F3F4F6] dark:bg-[#252528]">
          <Link href={`/story/${story.slug}`} className="block w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={story.coverImage}
              alt={story.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </Link>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Level & Category badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#121212]/80 backdrop-blur-md text-white border border-white/20">
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
              e.preventDefault();
              e.stopPropagation();
              onToggleBookmark(story.id);
            }}
            title={isBookmarked ? "Remove from bookmarks" : "Bookmark this story"}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#121212]/80 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer z-10"
          >
            {isBookmarked ? (
              <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
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
          <div className="absolute bottom-3 left-3 pointer-events-none">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${match.badgeColorClass}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  match.badgeType === "optimal"
                    ? "bg-emerald-500"
                    : match.badgeType === "challenging"
                    ? "bg-amber-500"
                    : "bg-slate-400"
                }`}
              />
              {match.badgeLabel}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-2 font-medium">
            <span>⏱️ {story.readTimeMinutes} min read</span>
            <span>•</span>
            <span>📝 {story.wordCount} words</span>
          </div>

          <Link href={`/story/${story.slug}`}>
            <h2 className="text-xl font-bold tracking-tight text-[#1F2937] dark:text-[#E5E7EB] mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
              {story.title}
            </h2>
          </Link>

          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed line-clamp-2">
            {story.summary}
          </p>
        </div>
      </div>

      {/* Card Footer / Action */}
      <div className="p-5 pt-0">
        <Link
          href={`/story/${story.slug}`}
          className="w-full py-2.5 px-4 rounded-xl bg-[#F7F4EE] dark:bg-[#252528] group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500 text-xs sm:text-sm font-semibold text-[#1F2937] dark:text-[#E5E7EB] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <span>Start Reading</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
};
