import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const userId = searchParams.get("userId");

    if (!slug) {
      return NextResponse.json({ error: "Story slug is required." }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ count: 0, isLiked: false });
    }

    const { count, error } = await supabase
      .from("story_likes")
      .select("*", { count: "exact", head: true })
      .eq("story_slug", slug);

    let isLiked = false;
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

    if (error) {
      console.warn("Supabase GET /api/likes error:", error.message);
      return NextResponse.json({ count: 0, isLiked });
    }

    return NextResponse.json({ count: count || 0, isLiked });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg, count: 0, isLiked: false }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { storySlug, userId, guestAction } = body;

    if (!storySlug) {
      return NextResponse.json({ error: "Story slug is required." }, { status: 400 });
    }

    let isLiked = false;

    if (supabase && userId) {
      const { data: existing } = await supabase
        .from("story_likes")
        .select("id")
        .eq("story_slug", storySlug)
        .eq("user_id", userId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("story_likes")
          .delete()
          .eq("story_slug", storySlug)
          .eq("user_id", userId);
        isLiked = false;
      } else {
        await supabase.from("story_likes").insert({
          story_slug: storySlug,
          user_id: userId,
          created_at: new Date().toISOString(),
        });
        isLiked = true;
      }

      const { count } = await supabase
        .from("story_likes")
        .select("*", { count: "exact", head: true })
        .eq("story_slug", storySlug);

      return NextResponse.json({ count: count || (isLiked ? 1 : 0), isLiked });
    }

    // Guest toggle
    isLiked = typeof guestAction === "boolean" ? guestAction : true;
    let count = 0;
    if (supabase) {
      const { count: dbCount } = await supabase
        .from("story_likes")
        .select("*", { count: "exact", head: true })
        .eq("story_slug", storySlug);
      count = Math.max(0, (dbCount || 0) + (isLiked ? 1 : 0));
    } else {
      count = isLiked ? 1 : 0;
    }

    return NextResponse.json({ count, isLiked });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
