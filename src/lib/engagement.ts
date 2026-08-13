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
      id: "comm-seed-1",
      storySlug: "the-whispering-library",
      userName: "Elena Rostova",
      userLevel: "B1",
      content: "The atmospheric description of the dust motes and ancient tea was wonderful. Krashen 95% input at its best!",
      createdAt: "2026-08-11T14:20:00.000Z",
      likesCount: 5,
    },
    {
      id: "comm-seed-2",
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
      id: "comm-seed-3",
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
      id: "comm-seed-4",
      storySlug: "a-morning-in-kyoto",
      userName: "Kenji Sato",
      userLevel: "B2",
      content: "Captures the early morning silence of Kyoto beautifully. Loved the phrase 'fleeting glimpse'.",
      createdAt: "2026-08-10T18:30:00.000Z",
      likesCount: 7,
    },
  ],
};

// ---------------------------
// Likes Operations
// ---------------------------

export async function fetchStoryLikes(
  slug: string,
  userId?: string
): Promise<{ count: number; isLiked: boolean }> {
  let count = 0;
  let isLiked = false;

  // 1. Try Direct Supabase Query
  if (supabase) {
    try {
      const { count: dbCount, error: countErr } = await supabase
        .from("story_likes")
        .select("*", { count: "exact", head: true })
        .eq("story_slug", slug);

      if (!countErr && typeof dbCount === "number") {
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
    } catch (err) {
      console.warn("Direct Supabase likes query failed:", err);
    }
  }

  // 2. Read local storage for guest state
  if (typeof window !== "undefined") {
    try {
      const storedLikes = localStorage.getItem(LOCAL_STORAGE_LIKES_KEY);
      if (storedLikes) {
        const parsed = JSON.parse(storedLikes) as Record<string, boolean>;
        if (parsed[slug] !== undefined) {
          isLiked = parsed[slug];
          if (count === 0 && isLiked) {
            count = 1;
          }
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
  let count = 0;

  // 1. Local storage state update
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

  // 2. Cloud Supabase sync
  if (supabase && userId) {
    try {
      if (isLiked) {
        await supabase.from("story_likes").insert({
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
    } catch (err) {
      console.warn("Supabase toggleStoryLike error:", err);
    }
  } else {
    count = isLiked ? 1 : 0;
  }

  return { count, isLiked };
}

// ---------------------------
// Comments Operations
// ---------------------------

export async function fetchStoryComments(slug: string): Promise<StoryComment[]> {
  const initialSeeds = DEFAULT_COMMENTS_MAP[slug] || [];

  // 1. Try Supabase directly
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
        return mapped;
      }
    } catch (err) {
      console.warn("Supabase fetchStoryComments failed:", err);
    }
  }

  // 2. Try API Route fallback
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.comments && data.comments.length > 0) {
          return data.comments;
        }
      }
    } catch {
      // ignore
    }
  }

  // 3. Fallback to local storage + initial seeds
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY);
      if (stored) {
        const allComments = JSON.parse(stored) as StoryComment[];
        const localStoryComments = allComments.filter((c) => c.storySlug === slug);
        if (localStoryComments.length > 0) {
          return [...localStoryComments, ...initialSeeds.filter((s) => !localStoryComments.some((l) => l.id === s.id))];
        }
      }
    } catch {
      // ignore
    }
  }

  return initialSeeds;
}

export async function addStoryComment(
  slug: string,
  content: string,
  userProfile: UserProfile,
  userId?: string
): Promise<StoryComment> {
  const fallbackComment: StoryComment = {
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

  let savedComment: StoryComment = fallbackComment;

  // 1. Try Supabase Insert
  if (supabase) {
    try {
      const insertData: Record<string, unknown> = {
        story_slug: slug,
        user_name: userProfile.name || "Reader",
        user_avatar: userProfile.avatarUrl || null,
        user_level: userProfile.level || "A2",
        content: content.trim(),
        created_at: new Date().toISOString(),
      };

      if (userId) {
        insertData.user_id = userId;
      }

      const { data, error } = await supabase
        .from("story_comments")
        .insert(insertData)
        .select()
        .single();

      if (!error && data) {
        savedComment = {
          id: String(data.id),
          storySlug: data.story_slug || slug,
          userId: data.user_id,
          userName: data.user_name || userProfile.name,
          userAvatar: data.user_avatar,
          userLevel: data.user_level || userProfile.level,
          content: data.content,
          createdAt: data.created_at || new Date().toISOString(),
          likesCount: data.likes_count || 0,
        };
      } else if (error) {
        console.error("Supabase insert error in addStoryComment:", error);
      }
    } catch (err) {
      console.warn("Direct Supabase insert exception:", err);
    }
  }

  // 2. Also try API Route if Supabase direct didn't return a record with DB id
  if (savedComment.id === fallbackComment.id && typeof window !== "undefined") {
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storySlug: slug,
          content: content.trim(),
          userName: userProfile.name,
          userAvatar: userProfile.avatarUrl,
          userLevel: userProfile.level,
          userId,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.comment) {
          savedComment = json.comment;
        }
      }
    } catch (err) {
      console.warn("API /api/comments error:", err);
    }
  }

  // 3. Local storage cache
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY);
      const allComments: StoryComment[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem(LOCAL_STORAGE_COMMENTS_KEY, JSON.stringify([savedComment, ...allComments]));
    } catch {
      // ignore
    }
  }

  return savedComment;
}

export async function updateStoryComment(
  commentId: string,
  newContent: string,
  userId?: string
): Promise<boolean> {
  let success = false;

  // 1. Supabase update
  if (supabase) {
    try {
      let query = supabase
        .from("story_comments")
        .update({ content: newContent.trim() })
        .eq("id", commentId);

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { error } = await query;
      if (!error) {
        success = true;
      }
    } catch (err) {
      console.warn("Supabase updateStoryComment error:", err);
    }
  }

  // 2. API Route fallback
  if (!success && typeof window !== "undefined") {
    try {
      const res = await fetch("/api/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId,
          content: newContent.trim(),
          userId,
        }),
      });
      if (res.ok) {
        success = true;
      }
    } catch {
      // ignore
    }
  }

  // 3. Update localStorage cache
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY);
      if (stored) {
        const allComments: StoryComment[] = JSON.parse(stored);
        const updated = allComments.map((c) =>
          c.id === commentId ? { ...c, content: newContent.trim() } : c
        );
        localStorage.setItem(LOCAL_STORAGE_COMMENTS_KEY, JSON.stringify(updated));
      }
    } catch {
      // ignore
    }
  }

  return success;
}

export async function deleteStoryComment(
  commentId: string,
  userId?: string
): Promise<boolean> {
  let success = false;

  // 1. Supabase delete
  if (supabase) {
    try {
      let query = supabase.from("story_comments").delete().eq("id", commentId);
      if (userId) {
        query = query.eq("user_id", userId);
      }
      const { error } = await query;
      if (!error) {
        success = true;
      }
    } catch (err) {
      console.warn("Supabase deleteStoryComment error:", err);
    }
  }

  // 2. API Route fallback
  if (!success && typeof window !== "undefined") {
    try {
      const url = userId
        ? `/api/comments?id=${encodeURIComponent(commentId)}&userId=${encodeURIComponent(userId)}`
        : `/api/comments?id=${encodeURIComponent(commentId)}`;
      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) {
        success = true;
      }
    } catch {
      // ignore
    }
  }

  // 3. Update localStorage cache
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY);
      if (stored) {
        const allComments: StoryComment[] = JSON.parse(stored);
        const filtered = allComments.filter((c) => c.id !== commentId);
        localStorage.setItem(LOCAL_STORAGE_COMMENTS_KEY, JSON.stringify(filtered));
      }
    } catch {
      // ignore
    }
  }

  return success;
}
