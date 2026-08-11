"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { UserProfile, VocabularyItem, CEFRLevel, WordToken } from "@/types";

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
  userProfile: UserProfile;
  changeLevel: (newLevel: CEFRLevel) => void;
  incrementStoriesRead: () => void;
  vocabulary: VocabularyItem[];
  savedWordsMap: Map<string, boolean>;
  toggleSaveWord: (token: WordToken, storyTitle?: string) => void;
  updateVocabStatus: (id: string, status: "learning" | "mastered") => void;
  removeVocabWord: (id: string) => void;
  bookmarkedIds: Set<string>;
  toggleBookmark: (storyId: string) => void;
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
  const [userProfile, setUserProfile] = useState<UserProfile>(getInitialProfile);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(getInitialVocabulary);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(getInitialBookmarks);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme);
  const [isLevelTestModalOpen, setIsLevelTestModalOpen] = useState<boolean>(false);

  // Synchronize document dark class on theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Persist user profile changes
  const changeLevel = (newLevel: CEFRLevel) => {
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
  };

  const incrementStoriesRead = () => {
    setUserProfile((prev) => {
      const updated = {
        ...prev,
        storiesRead: prev.storiesRead + 1,
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
  };

  // Persist vocabulary updates
  const toggleSaveWord = (token: WordToken, storyTitle: string = "Reading") => {
    setVocabulary((prev) => {
      const existsIndex = prev.findIndex(
        (item) => item.cleanWord.toLowerCase() === token.clean.toLowerCase()
      );
      let updated: VocabularyItem[];
      if (existsIndex >= 0) {
        updated = prev.filter((_, idx) => idx !== existsIndex);
      } else {
        const newItem: VocabularyItem = {
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
        updated = [newItem, ...prev];
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
  };

  const updateVocabStatus = (id: string, status: "learning" | "mastered") => {
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
  };

  const removeVocabWord = (id: string) => {
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
  };

  // Persist bookmark updates
  const toggleBookmark = (storyId: string) => {
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
  };

  // Toggle Dark mode
  const toggleDarkMode = () => {
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
  };

  // Map of saved words for quick lookup in Reader
  const savedWordsMap = useMemo(() => {
    const map = new Map<string, boolean>();
    vocabulary.forEach((v) => map.set(v.cleanWord.toLowerCase(), true));
    return map;
  }, [vocabulary]);

  const value = useMemo(
    () => ({
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
      openLevelTestModal: () => setIsLevelTestModalOpen(true),
      closeLevelTestModal: () => setIsLevelTestModalOpen(false),
    }),
    [
      userProfile,
      vocabulary,
      savedWordsMap,
      bookmarkedIds,
      isDarkMode,
      isLevelTestModalOpen,
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
