import { NextRequest, NextResponse } from "next/server";
import { publishStoryToSupabase } from "@/lib/stories";
import { Story } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { story } = body as { story: Story };

    if (!story || !story.title || !story.slug || !story.paragraphs) {
      return NextResponse.json(
        { error: "Invalid story object provided." },
        { status: 400 }
      );
    }

    const result = await publishStoryToSupabase(story);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to publish story to Supabase." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, slug: story.slug });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error during publishing";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
