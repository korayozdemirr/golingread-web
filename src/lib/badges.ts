import { UserBadge, UserProfile, VocabularyItem } from "@/types";

export const BADGE_CATALOG: UserBadge[] = [
  {
    id: "first_story",
    name: "First Step",
    description: "Complete your first graded reading story",
    icon: "🌱",
    category: "reading",
  },
  {
    id: "story_explorer",
    name: "Story Explorer",
    description: "Read and complete 5 or more stories",
    icon: "📚",
    category: "reading",
  },
  {
    id: "vocab_starter",
    name: "Vocab Hunter",
    description: "Save at least 5 words to your vocabulary deck",
    icon: "✨",
    category: "vocabulary",
  },
  {
    id: "vocab_master",
    name: "Lexicon Master",
    description: "Save 20 or more words to your vocabulary deck",
    icon: "👑",
    category: "vocabulary",
  },
  {
    id: "streak_flame",
    name: "Flame On",
    description: "Keep a daily reading streak for 3 consecutive days",
    icon: "🔥",
    category: "streak",
  },
  {
    id: "streak_master",
    name: "Streak Champion",
    description: "Achieve a 7-day daily reading streak",
    icon: "⚡",
    category: "streak",
  },
  {
    id: "first_comment",
    name: "Active Voice",
    description: "Share your thoughts in the story discussion",
    icon: "💬",
    category: "social",
  },
  {
    id: "story_lover",
    name: "Story Enthusiast",
    description: "Like 3 or more stories in the library",
    icon: "❤️",
    category: "social",
  },
  {
    id: "xp_pioneer",
    name: "XP Pioneer",
    description: "Earn 500 total Experience Points",
    icon: "🏆",
    category: "reading",
  },
];

/**
 * Checks which badges the user qualifies for and returns newly unlocked badge IDs
 */
export function checkNewUnlockedBadges(
  profile: UserProfile,
  vocabulary: VocabularyItem[],
  likedCount: number = 0,
  commentCount: number = 0
): string[] {
  const currentUnlocked = new Set(profile.unlockedBadges || []);
  const newlyUnlocked: string[] = [];

  const check = (badgeId: string, condition: boolean) => {
    if (condition && !currentUnlocked.has(badgeId)) {
      newlyUnlocked.push(badgeId);
    }
  };

  // Reading Badges
  check("first_story", (profile.storiesRead || 0) >= 1);
  check("story_explorer", (profile.storiesRead || 0) >= 5);

  // Vocabulary Badges
  check("vocab_starter", (vocabulary.length || 0) >= 5);
  check("vocab_master", (vocabulary.length || 0) >= 20);

  // Streak Badges
  check("streak_flame", (profile.dailyStreak || 0) >= 3);
  check("streak_master", (profile.dailyStreak || 0) >= 7);

  // Social Badges
  check("first_comment", commentCount >= 1);
  check("story_lover", likedCount >= 3);

  // XP Badges
  check("xp_pioneer", (profile.xp || 0) >= 500);

  return newlyUnlocked;
}
