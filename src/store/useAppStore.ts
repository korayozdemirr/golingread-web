import { create } from "zustand";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { UserProfile, VocabularyItem, CEFRLevel, WordToken } from "@/types";
import { supabase } from "@/lib/supabase";

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

export interface AppState {
  // Auth State
  user: User | null;
  session: Session | null;
  isLoadingAuth: boolean;
  isAuthModalOpen: boolean;

  // App Data State
  userProfile: UserProfile;
  vocabulary: VocabularyItem[];
  savedWordsMap: Map<string, boolean>;
  bookmarkedIds: Set<string>;
  isDarkMode: boolean;
  isLevelTestModalOpen: boolean;

  // Actions
  setUserAndSession: (user: User | null, session: Session | null) => void;
  setIsLoadingAuth: (loading: boolean) => void;
  setUserDataFromSupabase: (profile: UserProfile, vocabulary: VocabularyItem[]) => void;
  resetToGuestDefaults: () => void;

  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<{ error: AuthError | null; user: User | null }>;
  signOut: () => Promise<void>;

  changeLevel: (newLevel: CEFRLevel) => void;
  incrementStoriesRead: () => void;

  toggleSaveWord: (token: WordToken, storyTitle?: string) => void;
  updateVocabStatus: (id: string, status: "learning" | "mastered") => void;
  removeVocabWord: (id: string) => void;

  toggleBookmark: (storyId: string) => void;

  toggleDarkMode: () => void;
  openLevelTestModal: () => void;
  closeLevelTestModal: () => void;
}

export const useAppStore = create<AppState>((set, get) => {
  // Compute derived state initially
  const initialVocabulary = getInitialVocabulary();
  const initialMap = new Map<string, boolean>();
  initialVocabulary.forEach((v) => initialMap.set(v.cleanWord.toLowerCase(), true));

  return {
    user: null,
    session: null,
    isLoadingAuth: true,
    isAuthModalOpen: false,

    userProfile: getInitialProfile(),
    vocabulary: initialVocabulary,
    savedWordsMap: initialMap,
    bookmarkedIds: getInitialBookmarks(),
    isDarkMode: getInitialTheme(),
    isLevelTestModalOpen: false,

    setUserAndSession: (user, session) => set({ user, session }),
    setIsLoadingAuth: (isLoadingAuth) => set({ isLoadingAuth }),

    setUserDataFromSupabase: (profile, vocabulary) => {
      const savedWordsMap = new Map<string, boolean>();
      vocabulary.forEach((v) => savedWordsMap.set(v.cleanWord.toLowerCase(), true));
      set({ userProfile: profile, vocabulary, savedWordsMap });
    },

    resetToGuestDefaults: () => {
      const initialMap = new Map<string, boolean>();
      INITIAL_VOCABULARY.forEach((v) => initialMap.set(v.cleanWord.toLowerCase(), true));
      set({
        userProfile: DEFAULT_USER_PROFILE,
        vocabulary: INITIAL_VOCABULARY,
        savedWordsMap: initialMap,
      });
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.PROFILE);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.VOCABULARY);
      } catch {
        // ignore
      }
    },

    openAuthModal: () => set({ isAuthModalOpen: true }),
    closeAuthModal: () => set({ isAuthModalOpen: false }),

    signInWithGoogle: async () => {
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
    },

    signInWithEmail: async (email, password) => {
      try {
        const cleanEmail = email.trim().toLowerCase();
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (!error) {
          set({ isAuthModalOpen: false });
        }
        return { error };
      } catch (err: unknown) {
        return { error: err as AuthError };
      }
    },

    signUpWithEmail: async (email, password, name) => {
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
          set({ isAuthModalOpen: false });
        }
        return { error, user: data.user };
      } catch (err: unknown) {
        return { error: err as AuthError, user: null };
      }
    },

    signOut: async () => {
      try {
        await supabase.auth.signOut();
        set({ user: null, session: null });
        get().resetToGuestDefaults();
      } catch {
        // ignore
      }
    },

    changeLevel: (newLevel) => {
      const { userProfile, user } = get();
      const updated: UserProfile = {
        ...userProfile,
        level: newLevel,
        levelNumber: LEVEL_MAP[newLevel] || 2,
      };
      set({ userProfile: updated });

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILE, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }

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
    },

    incrementStoriesRead: () => {
      const { userProfile, user } = get();
      const nextCount = userProfile.storiesRead + 1;
      const updated = {
        ...userProfile,
        storiesRead: nextCount,
      };
      set({ userProfile: updated });

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILE, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }

      if (user?.id) {
        supabase
          .from("profiles")
          .update({
            stories_read: nextCount,
          })
          .eq("id", user.id)
          .then();
      }
    },

    toggleSaveWord: (token, storyTitle = "Reading") => {
      const { vocabulary, savedWordsMap, user } = get();
      let isRemoving = false;
      let addedItem: VocabularyItem | null = null;

      const existsIndex = vocabulary.findIndex(
        (item) => item.cleanWord.toLowerCase() === token.clean.toLowerCase()
      );

      let updated: VocabularyItem[];
      const newMap = new Map(savedWordsMap);

      if (existsIndex >= 0) {
        isRemoving = true;
        updated = vocabulary.filter((_, idx) => idx !== existsIndex);
        newMap.delete(token.clean.toLowerCase());
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
        updated = [addedItem, ...vocabulary];
        newMap.set(token.clean.toLowerCase(), true);
      }

      set({ vocabulary: updated, savedWordsMap: newMap });

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.VOCABULARY, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }

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
    },

    updateVocabStatus: (id, status) => {
      const { vocabulary, user } = get();
      const updated = vocabulary.map((item) => (item.id === id ? { ...item, status } : item));
      set({ vocabulary: updated });

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.VOCABULARY, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }

      if (user?.id) {
        supabase
          .from("user_vocabulary")
          .update({ status })
          .eq("id", id)
          .eq("user_id", user.id)
          .then();
      }
    },

    removeVocabWord: (id) => {
      const { vocabulary, savedWordsMap, user } = get();

      const wordToRemove = vocabulary.find(item => item.id === id);
      const updated = vocabulary.filter((item) => item.id !== id);

      const newMap = new Map(savedWordsMap);
      if (wordToRemove) {
        newMap.delete(wordToRemove.cleanWord.toLowerCase());
      }

      set({ vocabulary: updated, savedWordsMap: newMap });

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.VOCABULARY, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }

      if (user?.id) {
        supabase
          .from("user_vocabulary")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id)
          .then();
      }
    },

    toggleBookmark: (storyId) => {
      const { bookmarkedIds } = get();
      const updated = new Set(bookmarkedIds);
      if (updated.has(storyId)) {
        updated.delete(storyId);
      } else {
        updated.add(storyId);
      }

      set({ bookmarkedIds: updated });

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKMARKS, JSON.stringify(Array.from(updated)));
        } catch {
          // ignore
        }
      }
    },

    toggleDarkMode: () => {
      const { isDarkMode } = get();
      const next = !isDarkMode;

      set({ isDarkMode: next });

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, String(next));
        } catch {
          // ignore
        }
      }
    },

    openLevelTestModal: () => set({ isLevelTestModalOpen: true }),
    closeLevelTestModal: () => set({ isLevelTestModalOpen: false }),
  };
});
