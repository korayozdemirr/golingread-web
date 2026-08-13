import { StoryComment, UserProfile } from "@/types";
import { supabase } from "./supabase";

const LOCAL_STORAGE_LIKES_KEY = "golingread_story_likes";
const LOCAL_STORAGE_COMMENTS_KEY = "golingread_story_comments";

/**
 * Initial curated community discussion comments for default stories
 */
const DEFAULT_COMMENTS_MAP: Record<string, StoryComment[]> = {
  "the-whispering-library": [
    {
      id: "comm-1",
      storySlug: "the-whispering-library",
      userName: "Elena Rostova",
      userLevel: "B1",
      content: "The atmospheric description of the dust motes and ancient tea was wonderful. Krashen 95% input at its best!",
      createdAt: "2026-08-11T14:20:00.000Z",
      likesCount: 5,
    },
    {
      id: "comm-2",
      storySlug: "the-whispering-library",
      userName: "Caner Yılmaz",
      userLevel: "A2",
      content: "Hikayedeki 'intricate' ve 'parchment' kelimelerini doğrudan kelime defterime ekledim, çok akıcı bir okumaydı.",
      createdAt: "2026-08-12T09:15:00.000Z",
      likesCount: 3,
    },
  ],
  "airport-7579": [
    {
      id: "comm-3",
      storySlug: "airport-7579",
      userName: "Sarah Jenkins",
      userLevel: "A1",
      content: "Perfect vocabulary practice for my upcoming holiday flight. Clear and easy to follow without stopping for dictionary every sentence.",
      createdAt: "2026-08-12T16:45:00.000Z",
      likesCount: 4,
    },
  ],
  "a-morning-in-kyoto": [
    {
      id: "comm-4",
      storySlug: "a-morning-in-kyoto",
      userName: "Kenji Sato",
      userLevel: "B2",
      content: "Captures the early morning silence of Kyoto beautifully. Loved the phrase 'fleeting glimpse'.",
      createdAt: "2026-08-10T18:30:00.000Z",
      likesCount: 7,
    },
  ],
};

const DEFAULT_LIKES_MAP: Record<string, number> = {
  "the-whispering-library": 28,
  "airport-7579": 19,
  "a-morning-in-kyoto": 34,
  "the-clockwork-forest": 15,
};

// ---------------------------
// Likes Operations
// ---------------------------

export async function fetchStoryLikes(
  slug: string,
  userId?: string
): Promise<{ count: number; isLiked: boolean }> {
  let count = DEFAULT_LIKES_MAP[slug] || 8;
  let isLiked = false;

  // 1. Try fetching from Supabase
  if (supabase) {
    try {
      const { count: dbCount, error: countErr } = await supabase
        .from("story_likes")
        .select("*", { count: "exact", head: true })
        .eq("story_slug", slug);

      if (!countErr && typeof dbCount === "number" && dbCount > 0) {
        count = dbCount;
      }

      if (userId) {
        const { data: userLike } = await supabase
          .from("story_likes")
          .select("id")
          .eq("story_slug", slug)
          .eq("user_id", userId)
          .maybeSingle();

        if (userLike) {
          isLiked = true;
        }
      }
    } catch {
      // Fall through to local storage
    }
  }

  // 2. Read local storage for guest/offline state
  if (typeof window !== "undefined") {
    try {
      const storedLikes = localStorage.getItem(LOCAL_STORAGE_LIKES_KEY);
      if (storedLikes) {
        const parsed = JSON.parse(storedLikes) as Record<string, boolean>;
        if (parsed[slug]) {
          isLiked = true;
        }
      }
    } catch {
      // ignore
    }
  }

  return { count, isLiked };
}

export async function toggleStoryLike(
  slug: string,
  userId?: string
): Promise<{ count: number; isLiked: boolean }> {
  let isLiked = false;
  let count = DEFAULT_LIKES_MAP[slug] || 8;

  // Local storage state update
  if (typeof window !== "undefined") {
    try {
      const storedLikes = localStorage.getItem(LOCAL_STORAGE_LIKES_KEY);
      const parsed: Record<string, boolean> = storedLikes ? JSON.parse(storedLikes) : {};
      isLiked = !parsed[slug];
      parsed[slug] = isLiked;
      localStorage.setItem(LOCAL_STORAGE_LIKES_KEY, JSON.stringify(parsed));
    } catch {
      // ignore
    }
  }

  // Cloud Supabase sync
  if (supabase && userId) {
    try {
      if (isLiked) {
        await supabase.from("story_likes").upsert({
          story_slug: slug,
          user_id: userId,
          created_at: new Date().toISOString(),
        });
      } else {
        await supabase
          .from("story_likes")
          .delete()
          .eq("story_slug", slug)
          .eq("user_id", userId);
      }

      const { count: freshCount } = await supabase
        .from("story_likes")
        .select("*", { count: "exact", head: true })
        .eq("story_slug", slug);

      if (typeof freshCount === "number") {
        count = freshCount;
      }
    } catch {
      // ignore
    }
  }

  return { count, isLiked };
}

// ---------------------------
// Comments Operations
// ---------------------------

export async function fetchStoryComments(slug: string): Promise<StoryComment[]> {
  const initial = DEFAULT_COMMENTS_MAP[slug] || [];
  let localAdded: StoryComment[] = [];

  // Read local storage
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY);
      if (stored) {
        const allComments = JSON.parse(stored) as StoryComment[];
        localAdded = allComments.filter((c) => c.storySlug === slug);
      }
    } catch {
      // ignore
    }
  }

  // Try Supabase
  if (supabase) {
    try {
      const { data: dbComments, error } = await supabase
        .from("story_comments")
        .select("*")
        .eq("story_slug", slug)
        .order("created_at", { ascending: false });

      if (!error && dbComments && dbComments.length > 0) {
        const mapped: StoryComment[] = dbComments.map((c) => ({
          id: String(c.id),
          storySlug: c.story_slug || slug,
          userId: c.user_id,
          userName: c.user_name || "Learner",
          userAvatar: c.user_avatar,
          userLevel: c.user_level || "A2",
          content: c.content,
          createdAt: c.created_at || new Date().toISOString(),
          likesCount: c.likes_count || 0,
        }));
        return [...mapped, ...localAdded.filter((l) => !mapped.some((m) => m.id === l.id))];
      }
    } catch {
      // ignore
    }
  }

  return [...localAdded, ...initial];
}

export async function addStoryComment(
  slug: string,
  content: string,
  userProfile: UserProfile,
  userId?: string
): Promise<StoryComment> {
  const newComment: StoryComment = {
    id: `comm-${Date.now()}`,
    storySlug: slug,
    userId,
    userName: userProfile.name || "Reader",
    userAvatar: userProfile.avatarUrl,
    userLevel: userProfile.level,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    likesCount: 0,
  };

  // Save to local storage
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY);
      const allComments: StoryComment[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem(LOCAL_STORAGE_COMMENTS_KEY, JSON.stringify([newComment, ...allComments]));
    } catch {
      // ignore
    }
  }

  // Save to Supabase
  if (supabase && userId) {
    try {
      await supabase.from("story_comments").insert({
        id: newComment.id,
        story_slug: slug,
        user_id: userId,
        user_name: newComment.userName,
        user_avatar: newComment.userAvatar || null,
        user_level: newComment.userLevel || "A2",
        content: newComment.content,
        created_at: newComment.createdAt,
      });
    } catch {
      // ignore
    }
  }

  return newComment;
}
