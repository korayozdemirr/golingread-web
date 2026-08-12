"use client";

import { useEffect, useRef, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { useAppStore } from "@/store/useAppStore";
import { supabase } from "@/lib/supabase";
import { UserProfile, VocabularyItem, CEFRLevel } from "@/types";

const LEVEL_MAP: Record<CEFRLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

export const AppInitializer = () => {
  const { isDarkMode, setUserAndSession, setIsLoadingAuth, setUserDataFromSupabase } = useAppStore();
  const lastLoadedUserIdRef = useRef<string | null>(null);

  // Synchronize document dark class on theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Cloud Database Sync: Load user profile & vocabulary from Supabase
  const loadUserDataFromSupabase = useCallback(async (activeUser: User) => {
    try {
      let profile: UserProfile | null = null;
      let loadedVocab: VocabularyItem[] = [];

      // 1. Fetch or create Profile in Supabase
      const { data: profileRow, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", activeUser.id)
        .maybeSingle();

      if (!profileErr && profileRow) {
        const level = (profileRow.level || profileRow.cefr_level || "A2") as CEFRLevel;
        profile = {
          id: activeUser.id,
          name:
            profileRow.name ||
            profileRow.full_name ||
            activeUser.user_metadata?.full_name ||
            activeUser.email?.split("@")[0] ||
            "Learner",
          email: activeUser.email,
          avatarUrl:
            profileRow.avatar_url ||
            activeUser.user_metadata?.avatar_url ||
            activeUser.user_metadata?.picture,
          level,
          levelNumber: LEVEL_MAP[level] || 2,
          dailyStreak: profileRow.daily_streak ?? 5,
          wordsLearned: profileRow.words_learned ?? 0,
          storiesRead: profileRow.stories_read ?? 0,
        };
        try {
          localStorage.setItem("golingread_user_profile", JSON.stringify(profile));
        } catch {}
      } else if (!profileErr) {
        // Auto-create initial profile row for new user
        profile = {
          id: activeUser.id,
          name:
            activeUser.user_metadata?.full_name ||
            activeUser.email?.split("@")[0] ||
            "Learner",
          email: activeUser.email,
          avatarUrl:
            activeUser.user_metadata?.avatar_url ||
            activeUser.user_metadata?.picture,
          level: "A2",
          levelNumber: 2,
          dailyStreak: 5,
          wordsLearned: 24,
          storiesRead: 3,
        };
        await supabase.from("profiles").insert({
          id: activeUser.id,
          name: profile.name,
          level: profile.level,
          level_number: profile.levelNumber,
          daily_streak: profile.dailyStreak,
          words_learned: profile.wordsLearned,
          stories_read: profile.storiesRead,
          avatar_url: profile.avatarUrl || null,
        });
      }

      // 2. Fetch User Vocabulary from Supabase
      const { data: vocabRows, error: vocabErr } = await supabase
        .from("user_vocabulary")
        .select("*")
        .eq("user_id", activeUser.id)
        .order("saved_at", { ascending: false });

      if (!vocabErr && vocabRows && vocabRows.length > 0) {
        loadedVocab = vocabRows.map((row) => ({
          id: String(row.id),
          cleanWord: row.clean_word || row.cleanWord || "",
          text: row.text || row.clean_word || "",
          translationTr: row.translation_tr || row.translationTr || "",
          ipa: row.ipa || "",
          partOfSpeech: row.part_of_speech || row.partOfSpeech || "noun",
          exampleSentence: row.example_sentence || row.exampleSentence,
          storyTitle: row.story_title || row.storyTitle || "Reading",
          savedAt: row.saved_at || row.savedAt || new Date().toISOString(),
          status: (row.status === "mastered" ? "mastered" : "learning"),
          reviewCount: row.review_count || row.reviewCount || 0,
          easeFactor: row.ease_factor || row.easeFactor || 2.5,
        }));

        try {
          localStorage.setItem("golingread_vocabulary", JSON.stringify(loadedVocab));
        } catch {}
      }

      if (profile) {
        setUserDataFromSupabase(profile, loadedVocab);
      }
    } catch {
      // Supabase access failsafe
    }
  }, [setUserDataFromSupabase]);

  // Initialize Supabase Auth Session listener with deduplication
  useEffect(() => {
    let isMounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return;

      const currentUser = newSession?.user ?? null;
      setUserAndSession(currentUser, newSession);
      setIsLoadingAuth(false);

      if (currentUser) {
        if (lastLoadedUserIdRef.current !== currentUser.id) {
          lastLoadedUserIdRef.current = currentUser.id;
          await loadUserDataFromSupabase(currentUser);
        }
      } else {
        lastLoadedUserIdRef.current = null;
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadUserDataFromSupabase, setUserAndSession, setIsLoadingAuth]);

  return null; // AppInitializer renders nothing
};
