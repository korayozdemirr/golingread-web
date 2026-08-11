# 📚 GoLingread - Project Context & Architecture Memory

> **Version:** 0.1.0  
> **Last Updated:** August 2026  
> **Repository:** `golingread-web`

---

## 🎯 1. Project Overview & Core Philosophy

**GoLingread** is an editorial, distraction-free English reading web application built on **Stephen Krashen's 95% Comprehensible Input ($i+1$) hypothesis**. 

The core thesis is that natural language acquisition happens effortlessly when learners read content where they already comprehend at least 95% of the words. Under this condition, new vocabulary and grammar patterns are acquired organically from context without constant dictionary interruption.

---

## 🛠️ 2. Tech Stack & Architecture

- **Framework:** Next.js (App Router, Turbopack, `src/` directory structure)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + Custom Theme Variables (`globals.css`)
- **Typography:** 
  - `Lora` (Google Fonts - Serif for story reading text, optimal line-height `1.8`, tracking `0.01em`)
  - `Inter` (Google Fonts - Sans-serif for all UI controls, navigation, badges, and modals)
- **Audio:** Web Speech API (`SpeechSynthesis`) for native, low-latency Text-to-Speech (TTS) audio with variable playback rates (0.8x, 1.0x, 1.2x)
- **State & Data:** Client-side React state with tokenized mock stories (`src/data/mockStories.ts`), spaced-repetition vocabulary tracking, and CEFR level calibration.

---

## 🎨 3. Design Tokens & Color Standards

### Paper Themes (Reader Canvas)
- **Warm Cream (Default):** Background `#FDFBF7`, Body text `#1F2937`, Heading `#111827`, Muted `#4B5563`, Border `#E5E7EB`
- **Dark Charcoal:** Background `#121212`, Body text `#E5E7EB`, Heading `#F9FAFB`, Muted `#9CA3AF`, Border `#2E2E2E`
- **Sepia:** Background `#F4ECD8`, Body text `#4A3B2C`, Heading `#2B2118`, Muted `#6E543D`, Border `#DECDB2`
- **Crisp White:** Background `#FFFFFF`, Body text `#1F2937`, Heading `#111827`, Muted `#4B5563`, Border `#E5E7EB`

### Accent & Primary Buttons
- **Primary / Brand Accent:** Indigo (`#4F46E5` / `indigo-600`), Dark Mode (`#6366F1` / `indigo-500`)

### Krashen 95% Match Badges
- **Optimal (≥95% Match):** `bg-emerald-100 text-emerald-800 border-emerald-200` (`dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800`)
- **Challenging (85–94% Match):** `bg-amber-100 text-amber-800 border-amber-200` (`dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800`)
- **Advanced (<85% Match):** `bg-slate-100 text-slate-700 border-slate-200` (`dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700`)

---

## 📱 4. Key Components & Implementation

1. **Header & Navigation ([Navbar.tsx](file:///Users/korayozdemir/golingread-web/src/components/layout/Navbar.tsx)):**
   - Brand logo with reading icon, navigation links ("Stories", "My Vocabulary", "Level Test"), daily streak pill (🔥 5 Days), active CEFR level pill, and theme mode toggle.
2. **Story Feed & Dynamic Match Engine ([HeroSection.tsx](file:///Users/korayozdemir/golingread-web/src/components/feed/HeroSection.tsx), [FilterBar.tsx](file:///Users/korayozdemir/golingread-web/src/components/feed/FilterBar.tsx), [StoryCard.tsx](file:///Users/korayozdemir/golingread-web/src/components/feed/StoryCard.tsx)):**
   - Real-time CEFR level selector: Changing the learner's level instantly recalculates comprehension match percentages for all stories across the catalog.
   - Search bar and filters for CEFR levels (All, A1..C1) and genres (Mystery, Sci-Fi, Daily Life, History, Adventure, Philosophy).
3. **Core Reader Canvas ([ReaderCanvas.tsx](file:///Users/korayozdemir/golingread-web/src/components/reader/ReaderCanvas.tsx)):**
   - Centered `max-w-[68ch]` reading container with Lora serif typography.
   - Zero-layout-shift tokenized clickable words.
   - Expandable Turkish paragraph translations toggle on demand.
4. **Reader Toolbar ([ReaderToolbar.tsx](file:///Users/korayozdemir/golingread-web/src/components/reader/ReaderToolbar.tsx)):**
   - Full story TTS speech player with speed control (0.8x, 1.0x, 1.2x).
   - Font size adjuster (`15px` to `26px`), line-height adjuster (`tight`, `relaxed`, `loose`), and 4 paper themes switcher.
5. **Zero-Layout-Shift Word Popover ([WordPopover.tsx](file:///Users/korayozdemir/golingread-web/src/components/reader/WordPopover.tsx)):**
   - Contextual Turkish translation, phonetic IPA pronunciation, part-of-speech badge, single-word audio pronunciation, and "+ Save to My Vocabulary" toggle.
6. **3D Flip Flashcards ([FlashcardModal.tsx](file:///Users/korayozdemir/golingread-web/src/components/vocabulary/FlashcardModal.tsx)):**
   - 3D flip card review session with spaced-repetition ratings (*Again*, *Good*, *Mastered*) and vocabulary management table.
7. **Diagnostic Level Test ([LevelTestModal.tsx](file:///Users/korayozdemir/golingread-web/src/components/level-test/LevelTestModal.tsx)):**
   - 5-question CEFR level assessment that calibrates the user profile and updates match scores.
8. **Comprehension Quiz & Sponsorship ([StoryQuiz.tsx](file:///Users/korayozdemir/golingread-web/src/components/reader/StoryQuiz.tsx), [SponsorSidebar.tsx](file:///Users/korayozdemir/golingread-web/src/components/reader/SponsorSidebar.tsx)):**
   - End-of-story comprehension checks and non-intrusive editorial premium sponsorship blocks.

---

## 🐛 5. Resolved Bugs & Fix History

1. **Word Hover Contrast Issue in Reader Canvas:**
   - *Problem:* In Cream and Sepia themes, hover background colors were too dark, causing dark text to become unreadable.
   - *Solution:* Implemented `themeWordStyles` with dedicated, high-contrast highlighter effects per paper theme (`bg-amber-100 text-amber-950` for Cream, `bg-[#E8DCC4] text-[#2B2118]` for Sepia, `bg-indigo-50 text-indigo-950` for White, and `bg-white/15 text-white` for Dark).
2. **Theme Contrast Mismatch on Headers & Toolbar:**
   - *Problem:* Hardcoded `dark:text-white` classes conflicted when users chose light paper themes (Cream/Sepia) while system dark mode was enabled.
   - *Solution:* Refactored story headers, reader toolbar, quiz cards, and sidebars to dynamically inherit colors from the active `readingTheme`.
3. **UI Language Uniformity:**
   - *Problem:* Mixed Turkish and English UI labels across filters, navigation, and badges.
   - *Solution:* Standardized all UI elements to English, strictly limiting Turkish to contextual word popovers and paragraph translation reveals.
