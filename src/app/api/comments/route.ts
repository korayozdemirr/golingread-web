import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { StoryComment } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Story slug is required." }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ comments: [] });
    }

    const { data: dbComments, error } = await supabase
      .from("story_comments")
      .select("*")
      .eq("story_slug", slug)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase GET /api/comments error (Check if table exists):", error.message);
      return NextResponse.json({ comments: [], warning: error.message });
    }

    const mapped: StoryComment[] = (dbComments || []).map((c) => ({
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

    return NextResponse.json({ comments: mapped });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg, comments: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { storySlug, content, userName, userAvatar, userLevel, userId } = body;

    if (!storySlug || !content || !content.trim()) {
      return NextResponse.json({ error: "Story slug and content are required." }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
    }

    // Insert to Supabase without forcing custom ID format
    const insertPayload: Record<string, unknown> = {
      story_slug: storySlug,
      user_name: userName || "Learner",
      user_avatar: userAvatar || null,
      user_level: userLevel || "A2",
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    if (userId) {
      insertPayload.user_id = userId;
    }

    const { data, error } = await supabase
      .from("story_comments")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error("Supabase POST /api/comments error:", error);
      return NextResponse.json(
        {
          error: error.message,
          hint: "Ensure 'story_comments' table is created in Supabase SQL editor using supabase_schema.sql",
        },
        { status: 500 }
      );
    }

    const createdComment: StoryComment = {
      id: String(data.id),
      storySlug: data.story_slug || storySlug,
      userId: data.user_id,
      userName: data.user_name || userName || "Learner",
      userAvatar: data.user_avatar,
      userLevel: data.user_level || userLevel || "A2",
      content: data.content,
      createdAt: data.created_at || new Date().toISOString(),
      likesCount: data.likes_count || 0,
    };

    return NextResponse.json({ comment: createdComment });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
