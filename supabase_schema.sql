-- ============================================================================
-- GoLingread - Supabase Schema for Social Interaction & Gamification
-- Run this in your Supabase SQL Editor: https://app.supabase.com/project/_/sql
-- ============================================================================

-- 1. Profiles Table Enhancement (Gamification columns)
ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 120,
ADD COLUMN IF NOT EXISTS daily_streak INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS last_active_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS unlocked_badges TEXT[] DEFAULT ARRAY['first_story', 'streak_flame'];

-- 2. Story Comments Table
CREATE TABLE IF NOT EXISTS public.story_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_slug TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL DEFAULT 'Reader',
    user_avatar TEXT,
    user_level TEXT DEFAULT 'A2',
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookup by story_slug
CREATE INDEX IF NOT EXISTS idx_story_comments_slug ON public.story_comments(story_slug);
CREATE INDEX IF NOT EXISTS idx_story_comments_created ON public.story_comments(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.story_comments ENABLE ROW LEVEL SECURITY;

-- Allow everyone (public & authenticated) to read comments
DROP POLICY IF EXISTS "Public can view all comments" ON public.story_comments;
CREATE POLICY "Public can view all comments" 
ON public.story_comments FOR SELECT 
USING (true);

-- Allow authenticated users to post comments
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.story_comments;
CREATE POLICY "Authenticated users can insert comments" 
ON public.story_comments FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow anonymous visitors with profile to post comments
DROP POLICY IF EXISTS "Anon users can insert comments" ON public.story_comments;
CREATE POLICY "Anon users can insert comments" 
ON public.story_comments FOR INSERT 
TO anon 
WITH CHECK (true);

-- 3. Story Likes Table
CREATE TABLE IF NOT EXISTS public.story_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_slug TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(story_slug, user_id)
);

CREATE INDEX IF NOT EXISTS idx_story_likes_slug ON public.story_likes(story_slug);

-- Enable Row Level Security (RLS)
ALTER TABLE public.story_likes ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view likes
DROP POLICY IF EXISTS "Public can view likes" ON public.story_likes;
CREATE POLICY "Public can view likes" 
ON public.story_likes FOR SELECT 
USING (true);

-- Allow authenticated users to insert/delete their own likes
DROP POLICY IF EXISTS "Users can insert own likes" ON public.story_likes;
CREATE POLICY "Users can insert own likes" 
ON public.story_likes FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own likes" ON public.story_likes;
CREATE POLICY "Users can delete own likes" 
ON public.story_likes FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- 4. Enable Supabase Realtime for instant live comment and like updates
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.story_comments;
  EXCEPTION WHEN duplicate_object THEN
    -- already added
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.story_likes;
  EXCEPTION WHEN duplicate_object THEN
    -- already added
  END;
END $$;
