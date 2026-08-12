"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { UserProfile, VocabularyItem, CEFRLevel, WordToken } from "@/types";
import { supabase } from "@/lib/supabase";
import { isAdminEmail } from "@/lib/auth-admin";

const LEVEL_MAP: Record<CEFRLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

const DEFAULT_USER_PROFILE: UserProfile = {
  name: "Learner",
  level: "A2",
  levelNumber: 2,
  dailyStreak: 5,
  wordsLearned: 24,
  storiesRead: 3,
};

const INITIAL_VOCABULARY: VocabularyItem[] = [
  {
    id: "v-1",
    cleanWord: "cinnamon",
    text: "cinnamon",
    translationTr: "tarçın",
    ipa: "/ˈsɪn.ə.mən/",
    partOfSpeech: "noun",
    exampleSentence: "A sprinkle of cinnamon makes the coffee smell sweet.",
    storyTitle: "The Whispering Library",
    savedAt: "2026-08-10T10:00:00.000Z",
    status: "learning",
    reviewCount: 1,
    easeFactor: 2.5,
  },
  {
    id: "v-2",
    cleanWord: "intricate",
    text: "intricate",
    translationTr: "karmaşık / ince işlenmiş",
    ipa: "/ˈɪn.trə.kət/",
    partOfSpeech: "adj",
    exampleSentence: "The clock mechanism had an intricate arrangement of gears.",
    storyTitle: "The Clockwork Forest",
    savedAt: "2026-08-10T11:00:00.000Z",
    status: "learning",
    reviewCount: 2,
    easeFactor: 2.5,
  },
  {
    id: "v-3",
    cleanWord: "fleeting",
    text: "fleeting",
    translationTr: "kısa süren / gelip geçici",
    ipa: "/ˈfliː.t̬ɪŋ/",
    partOfSpeech: "adj",
    exampleSentence: "The morning fog offered a fleeting glimpse of the ancient pagoda.",
    storyTitle: "A Morning in Kyoto",
    savedAt: "2026-08-11T08:30:00.000Z",
    status: "mastered",
    reviewCount: 4,
    easeFactor: 2.7,
  },
];

interface AppContextType {
  // Auth State
  user: User | null;
  session: Session | null;
  isLoadingAuth: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<{ error: AuthError | null; user: User | null }>;
  signOut: () => Promise<void>;

  // User Profile
  userProfile: UserProfile;
  changeLevel: (newLevel: CEFRLevel) => void;
  incrementStoriesRead: () => void;

  // Vocabulary
  vocabulary: VocabularyItem[];
  savedWordsMap: Map<string, boolean>;
  toggleSaveWord: (token: WordToken, storyTitle?: string) => void;
  updateVocabStatus: (id: string, status: "learning" | "mastered") => void;
  removeVocabWord: (id: string) => void;

  // Bookmarks
  bookmarkedIds: Set<string>;
  toggleBookmark: (storyId: string) => void;

  // Theme & Level Test Modals
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLevelTestModalOpen: boolean;
  openLevelTestModal: () => void;
  closeLevelTestModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  PROFILE: "golingread_user_profile",
  VOCABULARY: "golingread_vocabulary",
  BOOKMARKS: "golingread_bookmarks",
  THEME: "golingread_dark_mode",
};

const getInitialProfile = (): UserProfile => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.PROFILE);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  return DEFAULT_USER_PROFILE;
};

const getInitialVocabulary = (): VocabularyItem[] => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.VOCABULARY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  return INITIAL_VOCABULARY;
};

const getInitialBookmarks = (): Set<string> => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKMARKS);
      if (stored) return new Set(JSON.parse(stored));
    } catch {
      // ignore
    }
  }
  return new Set(["story-1"]);
};

const getInitialTheme = (): boolean => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
      if (stored !== null) return stored === "true";
    } catch {
      // ignore
    }
  }
  return false;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // App Data State (Hybrid Local / Cloud)
  const [userProfile, setUserProfile] = useState<UserProfile>(getInitialProfile);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(getInitialVocabulary);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(getInitialBookmarks);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme);
  const [isLevelTestModalOpen, setIsLevelTestModalOpen] = useState<boolean>(false);

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
      // 1. Fetch or create Profile in Supabase
      const { data: profileRow, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", activeUser.id)
        .maybeSingle();

      if (!profileErr && profileRow) {
        const level = (profileRow.level || profileRow.cefr_level || "A2") as CEFRLevel;
        const profile: UserProfile = {
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
        setUserProfile(profile);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILE, JSON.stringify(profile));
        } catch {
          // ignore
        }
      } else if (!profileErr) {
        // Auto-create initial profile row for new user
        const initialProfile: UserProfile = {
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
          name: initialProfile.name,
          level: initialProfile.level,
          level_number: initialProfile.levelNumber,
          daily_streak: initialProfile.dailyStreak,
          words_learned: initialProfile.wordsLearned,
          stories_read: initialProfile.storiesRead,
          avatar_url: initialProfile.avatarUrl || null,
        });
        setUserProfile(initialProfile);
      }

      // 2. Fetch User Vocabulary from Supabase
      const { data: vocabRows, error: vocabErr } = await supabase
        .from("user_vocabulary")
        .select("*")
        .eq("user_id", activeUser.id)
        .order("saved_at", { ascending: false });

      if (!vocabErr && vocabRows && vocabRows.length > 0) {
        const loadedVocab: VocabularyItem[] = vocabRows.map((row) => ({
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

        setVocabulary(loadedVocab);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.VOCABULARY, JSON.stringify(loadedVocab));
        } catch {
          // ignore
        }
      }
    } catch {
      // Supabase access failsafe
    }
  }, []);

  // Initialize Supabase Auth Session listener with deduplication
  useEffect(() => {
    let isMounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return;

      setSession(newSession);
      const currentUser = newSession?.user ?? null;
      setUser(currentUser);
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
  }, [loadUserDataFromSupabase]);

  // Auth Operations
  const signInWithGoogle = useCallback(async (): Promise<{ error: AuthError | null }> => {
    try {
      const redirectTo = typeof window !== "undefined" ? window.location.origin : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });
      return { error };
    } catch (err: unknown) {
      return { error: err as AuthError };
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (!error) {
        setIsAuthModalOpen(false);
      }
      return { error };
    } catch (err: unknown) {
      return { error: err as AuthError };
    }
  }, []);

  const signUpWithEmail = useCallback(async (
    email: string,
    password: string,
    name?: string
  ): Promise<{ error: AuthError | null; user: User | null }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name?.trim() || "Learner";
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
          },
        },
      });
      if (!error && data.user) {
        setIsAuthModalOpen(false);
      }
      return { error, user: data.user };
    } catch (err: unknown) {
      return { error: err as AuthError, user: null };
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      lastLoadedUserIdRef.current = null;
      // Reset to guest defaults
      setUserProfile(DEFAULT_USER_PROFILE);
      setVocabulary(INITIAL_VOCABULARY);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.PROFILE);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.VOCABULARY);
      } catch {
        // ignore
      }
    } catch {
      // ignore
    }
  }, []);

  // Change Level (Hybrid Local + Supabase)
  const changeLevel = useCallback((newLevel: CEFRLevel) => {
    setUserProfile((prev) => {
      const updated: UserProfile = {
        ...prev,
        level: newLevel,
        levelNumber: LEVEL_MAP[newLevel] || 2,
      };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILE, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
      return updated;
    });

    // Cloud sync if user logged in
    if (user?.id) {
      supabase
        .from("profiles")
        .update({
          level: newLevel,
          level_number: LEVEL_MAP[newLevel] || 2,
        })
        .eq("id", user.id)
        .then();
    }
  }, [user]);

  // Increment Stories Read (Hybrid Local + Supabase)
  const incrementStoriesRead = useCallback(() => {
    let nextCount = 1;
    setUserProfile((prev) => {
      nextCount = prev.storiesRead + 1;
      const updated = {
        ...prev,
        storiesRead: nextCount,
      };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILE, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
      return updated;
    });

    // Cloud sync if user logged in
    if (user?.id) {
      supabase
        .from("profiles")
        .update({
          stories_read: nextCount,
        })
        .eq("id", user.id)
        .then();
    }
  }, [user]);

  // Toggle Save Word (Hybrid Local + Supabase)
  const toggleSaveWord = useCallback((token: WordToken, storyTitle: string = "Reading") => {
    let isRemoving = false;
    let addedItem: VocabularyItem | null = null;

    setVocabulary((prev) => {
      const existsIndex = prev.findIndex(
        (item) => item.cleanWord.toLowerCase() === token.clean.toLowerCase()
      );
      let updated: VocabularyItem[];
      if (existsIndex >= 0) {
        isRemoving = true;
        updated = prev.filter((_, idx) => idx !== existsIndex);
      } else {
        addedItem = {
          id: `vocab-${Date.now()}`,
          cleanWord: token.clean,
          text: token.text,
          translationTr: token.translationTr,
          ipa: token.ipa,
          partOfSpeech: token.partOfSpeech,
          exampleSentence: token.exampleSentence,
          storyTitle,
          savedAt: new Date().toISOString(),
          status: "learning",
          reviewCount: 0,
          easeFactor: 2.5,
        };
        updated = [addedItem, ...prev];
      }

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.VOCABULARY, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
      return updated;
    });

    // Cloud sync if user logged in
    if (user?.id) {
      if (isRemoving) {
        supabase
          .from("user_vocabulary")
          .delete()
          .eq("user_id", user.id)
          .ilike("clean_word", token.clean)
          .then();
      } else if (addedItem) {
        supabase
          .from("user_vocabulary")
          .upsert({
            id: (addedItem as VocabularyItem).id,
            user_id: user.id,
            clean_word: token.clean,
            text: token.text,
            translation_tr: token.translationTr,
            ipa: token.ipa,
            part_of_speech: token.partOfSpeech,
            example_sentence: token.exampleSentence || null,
            story_title: storyTitle,
            status: "learning",
            review_count: 0,
            ease_factor: 2.5,
            saved_at: new Date().toISOString(),
          })
          .then();
      }
    }
  }, [user]);

  // Update Vocab Status (Hybrid Local + Supabase)
  const updateVocabStatus = useCallback((id: string, status: "learning" | "mastered") => {
    setVocabulary((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, status } : item));
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.VOCABULARY, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
      return updated;
    });

    // Cloud sync if user logged in
    if (user?.id) {
      supabase
        .from("user_vocabulary")
        .update({ status })
        .eq("id", id)
        .eq("user_id", user.id)
        .then();
    }
  }, [user]);

  // Remove Word (Hybrid Local + Supabase)
  const removeVocabWord = useCallback((id: string) => {
    setVocabulary((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.VOCABULARY, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
      return updated;
    });

    // Cloud sync if user logged in
    if (user?.id) {
      supabase
        .from("user_vocabulary")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
        .then();
    }
  }, [user]);

  // Toggle Bookmark
  const toggleBookmark = useCallback((storyId: string) => {
    setBookmarkedIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(storyId)) {
        updated.delete(storyId);
      } else {
        updated.add(storyId);
      }
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKMARKS, JSON.stringify(Array.from(updated)));
        } catch {
          // ignore
        }
      }
      return updated;
    });
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, String(next));
        } catch {
          // ignore
        }
      }
      return next;
    });
  }, []);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);
  const openLevelTestModal = useCallback(() => setIsLevelTestModalOpen(true), []);
  const closeLevelTestModal = useCallback(() => setIsLevelTestModalOpen(false), []);

  // Compute Admin Status based on verified email whitelist
  const isAdmin = useMemo(() => {
    return isAdminEmail(user?.email || userProfile.email);
  }, [user?.email, userProfile.email]);

  // Map of saved words for quick lookup in Reader
  const savedWordsMap = useMemo(() => {
    const map = new Map<string, boolean>();
    vocabulary.forEach((v) => map.set(v.cleanWord.toLowerCase(), true));
    return map;
  }, [vocabulary]);

  const value = useMemo(
    () => ({
      user,
      session,
      isLoadingAuth,
      isAdmin,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      userProfile,
      changeLevel,
      incrementStoriesRead,
      vocabulary,
      savedWordsMap,
      toggleSaveWord,
      updateVocabStatus,
      removeVocabWord,
      bookmarkedIds,
      toggleBookmark,
      isDarkMode,
      toggleDarkMode,
      isLevelTestModalOpen,
      openLevelTestModal,
      closeLevelTestModal,
    }),
    [
      user,
      session,
      isLoadingAuth,
      isAdmin,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      userProfile,
      changeLevel,
      incrementStoriesRead,
      vocabulary,
      savedWordsMap,
      toggleSaveWord,
      updateVocabStatus,
      removeVocabWord,
      bookmarkedIds,
      toggleBookmark,
      isDarkMode,
      toggleDarkMode,
      isLevelTestModalOpen,
      openLevelTestModal,
      closeLevelTestModal,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
