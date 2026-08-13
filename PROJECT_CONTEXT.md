# 📚 GoLingread - Project Context & Architecture Memory

> **Version:** 0.5.0  
> **Last Updated:** August 2026  
> **Repository:** `golingread-web`

---

## 🎯 1. Project Overview & Core Philosophy

**GoLingread** is an editorial, distraction-free English reading web application built on **Stephen Krashen's 95% Comprehensible Input ($i+1$) hypothesis**. 

The core thesis is that natural language acquisition happens effortlessly when learners read content where they already comprehend at least 95% of the words. Under this condition, new vocabulary and grammar patterns are acquired organically from context without constant dictionary interruption.

---

## 🛠️ 2. Tech Stack & Route Architecture

- **Framework:** Next.js (App Router, Turbopack, `src/` directory structure)
- **Language:** TypeScript
- **Backend & Auth:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`) with Google OAuth, Email/Password authentication, and PostgreSQL RLS tables (`profiles`, `user_vocabulary`, `stories`).
- **AI Story Generation & Linguistics:** Next.js Route Handlers (`/api/admin/generate-story`, `/api/admin/publish-story`, `/api/translate`) with Gemini API multi-model fallbacks, comprehensive 2,000+ word English-Turkish lemmatized dictionary, and intelligent Krashen 95% fallback generator.
- **Styling:** Tailwind CSS v4 + Custom Theme Variables (`globals.css`)
- **Typography:** 
  - `Lora` (Google Fonts - Serif for story reading text, optimal line-height `1.8`, tracking `0.01em`)
  - `Inter` (Google Fonts - Sans-serif for all UI controls, navigation, badges, and modals)
- **Audio:** Web Speech API (`SpeechSynthesis`) for native, low-latency Text-to-Speech (TTS) audio with variable playback rates (0.8x, 1.0x, 1.2x)
- **State & Data:** Hybrid Local & Cloud State (`AppContext.tsx`, `src/lib/stories.ts`, `src/lib/story-enricher.ts`):
  - *Guest Mode:* Seamless `localStorage` persistence (no forced login, optimal for SEO and Google AdSense).
  - *Authenticated Mode:* Real-time cloud sync with Supabase tables (`profiles` for CEFR level/streak/stories read, `user_vocabulary` for saved deck with SRS status, `stories` for catalog).

### 🌐 App Router Route Structure (SEO & AdSense Ready)
- `/`: **Home & Story Catalog** — Krashen 95% Input Hero Section, CEFR level calibrator, search and filter bar, and dynamic story card grid.
- `/story/[slug]`: **Dynamic Story Reader Route** — Dedicated reading canvas with dynamic Next.js `generateMetadata` (title, CEFR keywords, OpenGraph, Twitter card), `generateStaticParams` pre-rendering, interactive word tokens with auto-repair, TTS audio player, and breadcrumbs.
- `/vocabulary`: **Standalone Vocabulary Hub** — Dedicated deck management page featuring interactive 3D flashcards (with *Again*, *Good*, *Mastered* ratings), progress statistics, word list search, audio pronunciations, and status filtering.
- `/admin/generate`: **AI Story Studio & Publisher** — Leveled story generator (A1-C1) with live preview, word token inspector, Turkish paragraph translations, comprehension quizzes, and 1-click Supabase auto-publishing.
- `/api/translate`: **Dynamic Translation Microservice** — Instant English-to-Turkish word translation with local dictionary priority and live translation API fallback.

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

1. **AI Story Studio ([page.tsx](file:///Users/korayozdemir/golingread-web/src/app/admin/generate/page.tsx), [generate-story/route.ts](file:///Users/korayozdemir/golingread-web/src/app/api/admin/generate-story/route.ts), [publish-story/route.ts](file:///Users/korayozdemir/golingread-web/src/app/api/admin/publish-story/route.ts)):**
   - Interactive prompt generator with CEFR level controls, preset inspiration chips, live reading preview, and 1-click publishing to Supabase `stories`.
2. **Built-in Lexicon & Morphological Lemmatizer ([dictionary.ts](file:///Users/korayozdemir/golingread-web/src/lib/dictionary.ts)):**
   - Curated 2,000+ English-Turkish high-frequency headwords, travel/airport vocabulary, past tense forms, plurals, continuous `-ing`, and phonetic IPA generation.
3. **Live Translation Microservice & Client ([route.ts](file:///Users/korayozdemir/golingread-web/src/app/api/translate/route.ts), [translator.ts](file:///Users/korayozdemir/golingread-web/src/lib/translator.ts)):**
   - Fast dictionary-first translation pipeline with live fallback for uncommon words and automatic dummy placeholder detection (`isPlaceholderTranslation`).
4. **Story Auto-Enricher & Repair Layer ([story-enricher.ts](file:///Users/korayozdemir/golingread-web/src/lib/story-enricher.ts)):**
   - Auto-repairs missing/placeholder tokens across loaded stories on the fly without database migration.
5. **Unified Story Data Layer ([stories.ts](file:///Users/korayozdemir/golingread-web/src/lib/stories.ts)):**
   - Fetches stories from Supabase with token enrichment and graceful fallback to `MOCK_STORIES`.
6. **Global App State Provider ([AppContext.tsx](file:///Users/korayozdemir/golingread-web/src/context/AppContext.tsx)):**
   - Centralizes user profile, CEFR level calibration, saved vocabulary deck, bookmark list, dark mode, auth session, and level test modal state with hybrid local/cloud persistence.
7. **Supabase Client ([supabase.ts](file:///Users/korayozdemir/golingread-web/src/lib/supabase.ts)):**
   - Client helper supporting `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
8. **Authentication Modal ([AuthModal.tsx](file:///Users/korayozdemir/golingread-web/src/components/auth/AuthModal.tsx)):**
   - Google OAuth and Email/Password Sign-In/Sign-Up modal with validation, error messages, and account creation feedback.
9. **Header & Navigation ([Navbar.tsx](file:///Users/korayozdemir/golingread-web/src/components/layout/Navbar.tsx)):**
   - Brand logo with reading icon, Next.js `<Link>` navigation ("Stories", "My Vocabulary", "Level Test"), daily streak pill (🔥 5 Days), active CEFR level pill, user profile avatar with dropdown (including AI Story Studio link), and theme mode toggle.
10. **Story Feed & Dynamic Match Engine ([HeroSection.tsx](file:///Users/korayozdemir/golingread-web/src/components/feed/HeroSection.tsx), [FilterBar.tsx](file:///Users/korayozdemir/golingread-web/src/components/feed/FilterBar.tsx), [StoryCard.tsx](file:///Users/korayozdemir/golingread-web/src/components/feed/StoryCard.tsx)):**
    - Real-time CEFR level selector: Changing the learner's level instantly recalculates comprehension match percentages for all stories across the catalog.
11. **Dynamic Story Reader ([page.tsx](file:///Users/korayozdemir/golingread-web/src/app/story/%5Bslug%5D/page.tsx), [StoryReaderView.tsx](file:///Users/korayozdemir/golingread-web/src/components/reader/StoryReaderView.tsx)):**
    - Server-side metadata generator for crawlability and social sharing with dynamic token enrichment.
12. **Core Reader Canvas ([ReaderCanvas.tsx](file:///Users/korayozdemir/golingread-web/src/components/reader/ReaderCanvas.tsx)):**
    - Centered `max-w-[68ch]` reading container with Lora serif typography.
    - Zero-layout-shift tokenized clickable words.
    - Expandable Turkish paragraph translations toggle on demand.
13. **Reader Toolbar ([ReaderToolbar.tsx](file:///Users/korayozdemir/golingread-web/src/components/reader/ReaderToolbar.tsx)):**
    - Full story TTS speech player with speed control (0.8x, 1.0x, 1.2x).
    - Font size adjuster (`15px` to `26px`), line-height adjuster (`tight`, `relaxed`, `loose`), and 4 paper themes switcher.
14. **Zero-Layout-Shift Word Popover ([WordPopover.tsx](file:///Users/korayozdemir/golingread-web/src/components/reader/WordPopover.tsx)):**
    - Contextual Turkish translation, phonetic IPA pronunciation, part-of-speech badge, single-word audio pronunciation, live translation fallback recovery, and "+ Save to My Vocabulary" toggle.
15. **Standalone Vocabulary Hub ([page.tsx](file:///Users/korayozdemir/golingread-web/src/app/vocabulary/page.tsx)):**
    - 3D flip card review session with spaced-repetition ratings (*Again*, *Good*, *Mastered*), statistics banner, search filter, and vocabulary management table.
16. **Diagnostic Level Test ([LevelTestModal.tsx](file:///Users/korayozdemir/golingread-web/src/components/level-test/LevelTestModal.tsx)):**
    - 5-question CEFR level assessment that calibrates the user profile and updates match scores across all views.
17. **Comprehension Quiz & Sponsorship ([StoryQuiz.tsx](file:///Users/korayozdemir/golingread-web/src/components/reader/StoryQuiz.tsx), [SponsorSidebar.tsx](file:///Users/korayozdemir/golingread-web/src/components/reader/SponsorSidebar.tsx)):**
    - End-of-story comprehension checks and non-intrusive editorial premium sponsorship blocks.

---

## 🐛 5. Resolved Bugs & Fix History

1. **Word Hover Contrast Issue in Reader Canvas:**
   - *Problem:* In Cream and Sepia themes, hover background colors were too dark, causing dark text to become unreadable.
   - *Solution:* Implemented `themeWordStyles` with dedicated, high-contrast highlighter effects per paper theme.
2. **Theme Contrast Mismatch on Headers & Toolbar:**
   - *Problem:* Hardcoded `dark:text-white` classes conflicted when users chose light paper themes (Cream/Sepia) while system dark mode was enabled.
   - *Solution:* Refactored story headers, reader toolbar, quiz cards, and sidebars to dynamically inherit colors from the active `readingTheme`.
3. **UI Language Uniformity:**
   - *Problem:* Mixed Turkish and English UI labels across filters, navigation, and badges.
   - *Solution:* Standardized all UI elements to English, strictly limiting Turkish to contextual word popovers and paragraph translation reveals.
4. **Dynamic URL Routing & Page Separation for SEO/AdSense:**
   - *Problem:* Story reader and vocabulary deck were embedded in modals/state toggles on a single URL (`/`), preventing deep-linking, SEO indexing, and AdSense placement.
   - *Solution:* Separated into dedicated Next.js App Router routes (`/story/[slug]`, `/vocabulary`, `/admin/generate`, `/`) with `generateMetadata`, `generateStaticParams`, and global `AppContext` state persistence.
5. **Supabase Auth & Hybrid Database Cloud Sync:**
   - *Problem:* Required cloud synchronization for authenticated learners across devices while allowing frictionless guest reading for SEO & Google AdSense.
   - *Solution:* Connected Supabase browser client with Google OAuth & Email auth, syncing `profiles` and `user_vocabulary` tables for authenticated users while maintaining `localStorage` fallback for guests.
6. **AI Story Generator & Supabase Publishing:**
   - *Problem:* Manual creation of tokenized stories, translations, and quizzes was tedious and slow.
   - *Solution:* Built AI Story Studio (`/admin/generate`) with automated paragraph translation, word tokenization, IPA generation, and 1-click publishing directly to Supabase.
7. **Admin Role-Based Authorization Guard (Security):**
   - *Problem:* Unrestricted access to `/admin/generate` and `/api/admin/*` could allow unauthorized visitors to consume AI tokens and publish arbitrary content to the database.
   - *Solution:* Implemented a 3-tier security architecture using `NEXT_PUBLIC_ADMIN_EMAILS`, an `isAdminEmail` helper ([auth-admin.ts](file:///Users/korayozdemir/golingread-web/src/lib/auth-admin.ts)), a 403 access control screen on `/admin/generate`, conditional Navbar link rendering, and server-side request header verification on API endpoints.
8. **AI-Generated Story Word Translation & Real-Time Linguistic Engine:**
   - *Problem:* When generating stories offline or when external AI models failed, tokens were assigned dummy placeholder text (`"${clean} anlamı"`), causing word clicks in stories (e.g. "airport") to display unhelpful or missing translations in the reader popover.
   - *Solution:* Developed a comprehensive 2,000+ word offline English-Turkish lexicon with morphological lemmatizer ([dictionary.ts](file:///Users/korayozdemir/golingread-web/src/lib/dictionary.ts)), dynamic translation microservice ([/api/translate](file:///Users/korayozdemir/golingread-web/src/app/api/translate/route.ts), [translator.ts](file:///Users/korayozdemir/golingread-web/src/lib/translator.ts)), automatic token enricher and repair layer ([story-enricher.ts](file:///Users/korayozdemir/golingread-web/src/lib/story-enricher.ts)), and resilient live translation recovery in [WordPopover.tsx](file:///Users/korayozdemir/golingread-web/src/components/reader/WordPopover.tsx).
9. **Gemini AI Story Generation Truncation & API Key Testing:**
   - *Problem:* Previous AI prompts forced Gemini to generate thousands of tokens of dense word-token JSON, hitting completion limits, causing JSON parsing failures that silently fell back to offline static templates without explaining API status to the administrator.
   - *Solution:* Streamlined prompt to request narrative paragraphs and quizzes, offloading tokenization to server-side dictionary engine for 20x faster generation. Added `/api/admin/verify-gemini-key`, `localStorage` key persistence, interactive "⚡ Test Key" connection tester, and transparent generation source badges in the studio.
10. **Contextual Word Token Mapping & Adaptive Thematic Story Synthesis:**
    - *Problem:* AI stories previously lacked word-level contextual translations (only full paragraphs were translated), causing words outside the hardcoded dictionary to lack Turkish meanings. Additionally, fallback templates produced grammatically awkward sentences for non-travel prompts.
    - *Solution:* Engineered a compact `"words": { "word": "Turkish translation" }` JSON protocol where Gemini returns contextual Turkish meanings for every word in 1.5 seconds. Rebuilt fallback engine into an intelligent thematic narrative generator covering Cooking, Mystery, Travel, and Daily Life, and expanded `EN_TR_LEXICON` with hundreds of core nouns, verbs, and adjectives.
11. **Story Length & Paragraph Scaling Enforcement (100w to 500w):**
    - *Problem:* When requesting 400-word stories, Gemini defaulted to producing brief 3-paragraph summaries (80-85 words total) due to fixed paragraph instructions and low output token limits (2500 tokens).
    - *Solution:* Implemented dynamic paragraph scaling (`targetParagraphs = wordCount / 65`), explicit sentence/paragraph length constraints in the Gemini prompt, increased `maxOutputTokens` to 8192, expanded the UI slider up to 500 words, and updated the fallback generator to produce 5-6 rich narrative paragraphs for long stories.




