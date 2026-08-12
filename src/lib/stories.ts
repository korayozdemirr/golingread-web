import { Story } from "@/types";
import { MOCK_STORIES } from "@/data/mockStories";
import { supabase } from "@/lib/supabase";

/**
 * Fetch all stories from Supabase `stories` table, merging with MOCK_STORIES.
 */
export async function getAllStories(): Promise<Story[]> {
  try {
    const { data: dbStories, error } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !dbStories || dbStories.length === 0) {
      return MOCK_STORIES;
    }

    // Map database records to Story interface
    const mappedDbStories: Story[] = dbStories.map((row) => ({
      id: String(row.id),
      title: row.title,
      titleTr: row.title_tr || row.titleTr || row.title,
      slug: row.slug,
      level: row.level,
      category: row.category,
      readTimeMinutes: row.read_time_minutes ?? row.readTimeMinutes ?? 3,
      wordCount: row.word_count ?? row.wordCount ?? 150,
      coverImage: row.cover_image || row.coverImage || "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
      summary: row.summary,
      summaryTr: row.summary_tr || row.summaryTr || row.summary,
      requiredVocabularyLevel: row.required_vocabulary_level ?? row.requiredVocabularyLevel ?? 2,
      featured: Boolean(row.featured),
      paragraphs: typeof row.paragraphs === "string" ? JSON.parse(row.paragraphs) : row.paragraphs,
      quiz: typeof row.quiz === "string" ? JSON.parse(row.quiz) : row.quiz,
    }));

    // Merge: DB stories take precedence if matching slug, then append remaining mock stories
    const seenSlugs = new Set<string>();
    const combined: Story[] = [];

    for (const s of mappedDbStories) {
      if (!seenSlugs.has(s.slug)) {
        seenSlugs.add(s.slug);
        combined.push(s);
      }
    }

    for (const m of MOCK_STORIES) {
      if (!seenSlugs.has(m.slug)) {
        seenSlugs.add(m.slug);
        combined.push(m);
      }
    }

    return combined;
  } catch {
    return MOCK_STORIES;
  }
}

/**
 * Fetch a single story by slug from Supabase or mock data fallback.
 */
export async function getStoryBySlug(slug: string): Promise<Story | null> {
  try {
    const { data: row, error } = await supabase
      .from("stories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && row) {
      return {
        id: String(row.id),
        title: row.title,
        titleTr: row.title_tr || row.titleTr || row.title,
        slug: row.slug,
        level: row.level,
        category: row.category,
        readTimeMinutes: row.read_time_minutes ?? row.readTimeMinutes ?? 3,
        wordCount: row.word_count ?? row.wordCount ?? 150,
        coverImage: row.cover_image || row.coverImage || "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
        summary: row.summary,
        summaryTr: row.summary_tr || row.summaryTr || row.summary,
        requiredVocabularyLevel: row.required_vocabulary_level ?? row.requiredVocabularyLevel ?? 2,
        featured: Boolean(row.featured),
        paragraphs: typeof row.paragraphs === "string" ? JSON.parse(row.paragraphs) : row.paragraphs,
        quiz: typeof row.quiz === "string" ? JSON.parse(row.quiz) : row.quiz,
      };
    }
  } catch {
    // ignore
  }

  // Fallback to MOCK_STORIES
  const mockStory = MOCK_STORIES.find((s) => s.slug === slug || s.id === slug);
  return mockStory || null;
}

/**
 * Publish a new or updated story to Supabase `stories` table.
 */
export async function publishStoryToSupabase(story: Story): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      title: story.title,
      title_tr: story.titleTr,
      slug: story.slug,
      level: story.level,
      category: story.category,
      read_time_minutes: story.readTimeMinutes,
      word_count: story.wordCount,
      cover_image: story.coverImage,
      summary: story.summary,
      summary_tr: story.summaryTr,
      required_vocabulary_level: story.requiredVocabularyLevel,
      featured: story.featured ?? false,
      paragraphs: story.paragraphs,
      quiz: story.quiz,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("stories")
      .upsert(payload, { onConflict: "slug" });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to publish story to database.";
    return { success: false, error: message };
  }
}
