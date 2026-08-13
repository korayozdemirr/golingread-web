export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type StoryCategory = "Mystery" | "Sci-Fi" | "Daily Life" | "History" | "Adventure" | "Philosophy";

export type ReadingTheme = "cream" | "white" | "sepia" | "dark";

export type LineHeight = "normal" | "relaxed" | "loose";

export interface WordToken {
  text: string;
  clean: string;
  translationTr: string;
  ipa: string;
  partOfSpeech: "noun" | "verb" | "adj" | "adv" | "prep" | "pron" | "conj" | "det" | "phrase";
  level: CEFRLevel;
  exampleSentence?: string;
}

export interface Paragraph {
  id: string;
  tokens: WordToken[];
  turkishTranslation: string;
  audioStartTime?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Story {
  id: string;
  title: string;
  titleTr: string;
  slug: string;
  level: CEFRLevel;
  category: StoryCategory;
  readTimeMinutes: number;
  wordCount: number;
  coverImage: string;
  summary: string;
  summaryTr: string;
  requiredVocabularyLevel: number; // 1 (A1) to 5 (C1)
  paragraphs: Paragraph[];
  quiz: QuizQuestion[];
  featured?: boolean;
}

export interface VocabularyItem {
  id: string;
  cleanWord: string;
  text: string;
  translationTr: string;
  ipa: string;
  partOfSpeech: string;
  exampleSentence?: string;
  storyTitle: string;
  savedAt: string;
  status: "learning" | "mastered";
  reviewCount: number;
  easeFactor: number;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "reading" | "vocabulary" | "streak" | "social";
  unlockedAt?: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  level: CEFRLevel;
  levelNumber: number; // 1 to 5
  dailyStreak: number;
  lastActiveDate?: string;
  wordsLearned: number;
  storiesRead: number;
  xp: number;
  unlockedBadges: string[];
}

export interface StoryLike {
  id?: string;
  storySlug: string;
  userId?: string;
  createdAt: string;
}

export interface StoryComment {
  id: string;
  storySlug: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  userLevel?: CEFRLevel;
  content: string;
  createdAt: string;
  likesCount?: number;
}

