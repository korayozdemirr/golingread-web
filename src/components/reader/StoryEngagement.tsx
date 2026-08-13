"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ReadingTheme, StoryComment } from "@/types";
import { useAppContext } from "@/context/AppContext";
import {
  fetchStoryLikes,
  toggleStoryLike,
  fetchStoryComments,
  addStoryComment,
  updateStoryComment,
  deleteStoryComment,
} from "@/lib/engagement";
import { supabase } from "@/lib/supabase";

interface StoryEngagementProps {
  storySlug: string;
  storyTitle: string;
  readingTheme: ReadingTheme;
}

const THEME_ENGAGEMENT_STYLES: Record<
  ReadingTheme,
  {
    surfaceClass: string;
    borderClass: string;
    textClass: string;
    mutedClass: string;
    inputBgClass: string;
    commentCardClass: string;
    actionBtnClass: string;
  }
> = {
  cream: {
    surfaceClass: "bg-[#FDFBF7]",
    borderClass: "border-[#E8E2D6]",
    textClass: "text-[#2A2723]",
    mutedClass: "text-[#6E675F]",
    inputBgClass: "bg-white border-[#E8E2D6] focus:border-amber-600",
    commentCardClass: "bg-white border-[#E8E2D6]",
    actionBtnClass: "hover:bg-amber-100 text-[#6E675F] hover:text-[#2A2723]",
  },
  white: {
    surfaceClass: "bg-white",
    borderClass: "border-[#E5E7EB]",
    textClass: "text-[#1F2937]",
    mutedClass: "text-[#6B7280]",
    inputBgClass: "bg-[#F9FAFB] border-[#E5E7EB] focus:border-indigo-600",
    commentCardClass: "bg-[#F9FAFB] border-[#E5E7EB]",
    actionBtnClass: "hover:bg-gray-100 text-[#6B7280] hover:text-[#1F2937]",
  },
  sepia: {
    surfaceClass: "bg-[#F4ECD8]",
    borderClass: "border-[#DECDB2]",
    textClass: "text-[#4A3B2C]",
    mutedClass: "text-[#6E543D]",
    inputBgClass: "bg-[#EDE2CB] border-[#DECDB2] focus:border-amber-800",
    commentCardClass: "bg-[#EDE2CB] border-[#DECDB2]",
    actionBtnClass: "hover:bg-[#E8DCC4] text-[#6E543D] hover:text-[#4A3B2C]",
  },
  dark: {
    surfaceClass: "bg-[#121212]",
    borderClass: "border-[#2E2E2E]",
    textClass: "text-[#E6E4DF]",
    mutedClass: "text-[#9A9790]",
    inputBgClass: "bg-[#1B1C20] border-[#2A2B32] focus:border-indigo-400",
    commentCardClass: "bg-[#1B1C20] border-[#2A2B32]",
    actionBtnClass: "hover:bg-[#2E2E2E] text-[#9A9790] hover:text-white",
  },
};

export const StoryEngagement: React.FC<StoryEngagementProps> = ({
  storySlug,
  readingTheme,
}) => {
  const { user, userProfile, isAdmin, openAuthModal, recordSocialAction } = useAppContext();
  const theme = THEME_ENGAGEMENT_STYLES[readingTheme];

  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  const [comments, setComments] = useState<StoryComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(true);
  const [commentText, setCommentText] = useState<string>("");
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);
  const [authIncentiveNotice, setAuthIncentiveNotice] = useState<string | null>(null);

  // Edit & Delete state
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  // Load Likes and Comments on story mount
  const loadData = useCallback(async () => {
    try {
      const likesData = await fetchStoryLikes(storySlug, user?.id);
      const commentsData = await fetchStoryComments(storySlug);

      setLikesCount(likesData.count);
      setIsLiked(likesData.isLiked);
      setComments(commentsData);
      setIsLoadingComments(false);
    } catch {
      setIsLoadingComments(false);
    }
  }, [storySlug, user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time listener for incoming/updated/deleted comments and likes from other users
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel(`realtime:story_engagement:${storySlug}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "story_comments",
          filter: `story_slug=eq.${storySlug}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newRow = payload.new as Record<string, unknown>;
            if (newRow && newRow.content) {
              const incoming: StoryComment = {
                id: String(newRow.id),
                storySlug: String(newRow.story_slug || storySlug),
                userId: newRow.user_id as string | undefined,
                userName: (newRow.user_name as string) || "Reader",
                userAvatar: newRow.user_avatar as string | undefined,
                userLevel: (newRow.user_level as StoryComment["userLevel"]) || "A2",
                content: String(newRow.content),
                createdAt: (newRow.created_at as string) || new Date().toISOString(),
                likesCount: (newRow.likes_count as number) || 0,
              };

              setComments((prev) => {
                if (prev.some((c) => c.id === incoming.id)) {
                  return prev.map((c) => (c.id === incoming.id ? incoming : c));
                }
                return [incoming, ...prev];
              });
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedRow = payload.new as Record<string, unknown>;
            if (updatedRow && updatedRow.id) {
              setComments((prev) =>
                prev.map((c) =>
                  c.id === String(updatedRow.id)
                    ? { ...c, content: String(updatedRow.content) }
                    : c
                )
              );
            }
          } else if (payload.eventType === "DELETE") {
            const deletedRow = payload.old as Record<string, unknown>;
            if (deletedRow && deletedRow.id) {
              setComments((prev) => prev.filter((c) => c.id !== String(deletedRow.id)));
            }
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "story_likes",
          filter: `story_slug=eq.${storySlug}`,
        },
        async () => {
          const freshLikes = await fetchStoryLikes(storySlug, user?.id);
          setLikesCount(freshLikes.count);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [storySlug, user?.id]);

  // Handle Like Button click
  const handleToggleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      const result = await toggleStoryLike(storySlug, user?.id);
      setLikesCount(result.count);
      setIsLiked(result.isLiked);

      if (result.isLiked) {
        recordSocialAction("like"); // +5 XP reward
      }

      if (!user) {
        setAuthIncentiveNotice("Sign in to save your likes across devices and earn +5 XP!");
      }
    } catch {
      // ignore
    } finally {
      setIsLiking(false);
    }
  };

  // Handle Comment Submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!user) {
      openAuthModal();
      return;
    }

    setIsSubmittingComment(true);
    try {
      const created = await addStoryComment(storySlug, commentText.trim(), userProfile, user.id);
      setComments((prev) => {
        if (prev.some((c) => c.id === created.id)) return prev;
        return [created, ...prev];
      });
      setCommentText("");
      recordSocialAction("comment"); // +20 XP reward
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Check if current active user can edit/delete this comment
  const canManageComment = useCallback(
    (comment: StoryComment) => {
      if (isAdmin) return true;
      if (user?.id && comment.userId === user.id) return true;
      if (!comment.userId && comment.userName === userProfile.name) return true;
      return false;
    },
    [isAdmin, user?.id, userProfile.name]
  );

  // Start Inline Edit
  const handleStartEdit = (comment: StoryComment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  // Cancel Inline Edit
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  // Save Inline Edit
  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim()) return;
    setIsSavingEdit(true);

    try {
      const success = await updateStoryComment(commentId, editContent.trim(), user?.id);
      if (success) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, content: editContent.trim() } : c))
        );
        setEditingCommentId(null);
        setEditContent("");
      }
    } catch (err) {
      console.error("Error updating comment:", err);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    setDeletingCommentId(commentId);

    try {
      const success = await deleteStoryComment(commentId, user?.id);
      if (success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const formatDate = useCallback((isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recent";
    }
  }, []);

  return (
    <section aria-label="Story Community Engagement" className="mt-12 pt-8 border-t border-dashed border-[#E5E7EB] dark:border-[#2E2E2E]">
      {/* Interaction Header: Like Button & Discussion Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          {/* Like Button */}
          <button
            type="button"
            onClick={handleToggleLike}
            disabled={isLiking}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-95 ${
              isLiked
                ? "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400"
                : `${theme.commentCardClass} ${theme.textClass} hover:border-rose-300 hover:text-rose-600`
            }`}
          >
            <span className={`text-base transition-transform ${isLiked ? "scale-110" : ""}`}>
              {isLiked ? "❤️" : "🤍"}
            </span>
            <span>{likesCount} Likes</span>
          </button>

          <div className={`text-xs ${theme.mutedClass}`}>
            💬 <strong>{comments.length}</strong> Reader Comments
          </div>
        </div>

        {/* Gamification Incentive Badge */}
        <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit">
          <span>⚡</span>
          <span>Earn +20 XP by sharing your thoughts</span>
        </div>
      </div>

      {/* Guest Sign-In Encouragement Alert */}
      {authIncentiveNotice && !user && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <span>💡 {authIncentiveNotice}</span>
          <button
            type="button"
            onClick={openAuthModal}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shrink-0 cursor-pointer"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Comment Input Box */}
      <form onSubmit={handleSubmitComment} className="mb-10">
        <div className={`p-4 rounded-3xl border shadow-sm ${theme.surfaceClass} ${theme.borderClass}`}>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme.mutedClass}`}>
            Join the Reader Discussion
          </label>
          <textarea
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onClick={() => {
              if (!user) openAuthModal();
            }}
            placeholder={
              user
                ? "Share a thought, a favorite phrase, or ask a question about this story..."
                : "Sign in to share a comment and earn +20 XP..."
            }
            className={`w-full p-3.5 rounded-2xl text-xs sm:text-sm font-story ${theme.inputBgClass} ${theme.textClass} resize-none focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 leading-relaxed`}
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className={`text-[11px] ${theme.mutedClass}`}>
              {user ? `Posting as ${userProfile.name} (${userProfile.level})` : "Guest Reader"}
            </span>

            <button
              type="submit"
              disabled={isSubmittingComment || !commentText.trim()}
              className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmittingComment ? (
                <span>Posting...</span>
              ) : (
                <>
                  <span>💬</span>
                  <span>{user ? "Post Comment" : "Sign In to Post"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Comments List Header with live refresh */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-base font-bold font-serif ${theme.textClass}`}>
          Discussion ({comments.length})
        </h2>
        <button
          type="button"
          onClick={loadData}
          title="Refresh comments"
          className={`text-xs ${theme.mutedClass} hover:text-indigo-600 flex items-center gap-1 cursor-pointer transition-colors`}
        >
          <span>🔄</span>
          <span>Refresh</span>
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoadingComments ? (
          <div className={`text-xs py-6 text-center ${theme.mutedClass}`}>
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className={`text-xs py-8 text-center rounded-2xl border border-dashed ${theme.borderClass} ${theme.mutedClass}`}>
            No comments yet. Be the first reader to share your thoughts on this story!
          </div>
        ) : (
          comments.map((comment) => {
            const isEditing = editingCommentId === comment.id;
            const isDeleting = deletingCommentId === comment.id;
            const canManage = canManageComment(comment);

            return (
              <div
                key={comment.id}
                className={`p-4 sm:p-5 rounded-2xl border shadow-2xs transition-colors ${theme.commentCardClass} ${theme.borderClass}`}
              >
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
                      {comment.userAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{comment.userName.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <span className={`text-xs font-bold block ${theme.textClass}`}>
                        {comment.userName}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded-full border border-emerald-200 dark:border-emerald-800">
                        Level: {comment.userLevel || "A2"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <time className={`text-[11px] ${theme.mutedClass}`}>
                      {formatDate(comment.createdAt)}
                    </time>

                    {/* Edit & Delete Action Buttons (Only for author or admin) */}
                    {canManage && !isEditing && (
                      <div className="flex items-center gap-1 ml-1">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(comment)}
                          title="Edit your comment"
                          className={`p-1 rounded-md text-[11px] transition-colors cursor-pointer ${theme.actionBtnClass}`}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={isDeleting}
                          title="Delete your comment"
                          className="p-1 rounded-md text-[11px] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isDeleting ? "..." : "🗑️"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Comment Content or Inline Edit Form */}
                {isEditing ? (
                  <div className="pl-9.5 mt-2 space-y-2">
                    <textarea
                      rows={2}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className={`w-full p-2.5 rounded-xl text-xs sm:text-sm font-story ${theme.inputBgClass} ${theme.textClass} resize-none focus:outline-hidden focus:ring-1 focus:ring-indigo-500`}
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isSavingEdit}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${theme.actionBtnClass} cursor-pointer`}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(comment.id)}
                        disabled={isSavingEdit || !editContent.trim()}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isSavingEdit ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={`text-xs sm:text-sm font-story leading-relaxed ${theme.textClass} pl-9.5`}>
                    {comment.content}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
