"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Story, CEFRLevel, StoryCategory, WordToken } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WordPopover } from "@/components/reader/WordPopover";
import { useAppContext } from "@/context/AppContext";

const PRESET_TOPICS = [
  {
    title: "Antique Clock in Prague",
    prompt: "An apprentice clockmaker in old Prague discovers a golden pocket watch that ticks backward during thunderstorms.",
    level: "A2" as CEFRLevel,
    category: "Mystery" as StoryCategory,
  },
  {
    title: "Rainy Kyoto Teahouse",
    prompt: "A traveler waits out a sudden summer rainstorm in an ancient bamboo tea garden in Kyoto and meets a mysterious calligrapher.",
    level: "A1" as CEFRLevel,
    category: "Daily Life" as StoryCategory,
  },
  {
    title: "Astronomer's Silent Comet",
    prompt: "An astronomer working at a mountain observatory detects an ancient comet reflecting radio signals from deep space.",
    level: "B1" as CEFRLevel,
    category: "Sci-Fi" as StoryCategory,
  },
  {
    title: "Philosophy of Lost Keys",
    prompt: "An old locksmith reflects on how the keys people lose reveal the secret doors and decisions of their lives.",
    level: "C1" as CEFRLevel,
    category: "Philosophy" as StoryCategory,
  },
  {
    title: "The Roman Mosaic",
    prompt: "A farmer in Cappadocia uncovers a pristine Byzantine mosaic hidden beneath an ancient olive tree.",
    level: "B2" as CEFRLevel,
    category: "History" as StoryCategory,
  },
];

const CEFR_LEVELS: { id: CEFRLevel; name: string; desc: string; color: string }[] = [
  { id: "A1", name: "A1 Beginner", desc: "500 headwords, simple present & past", color: "border-emerald-400 text-emerald-700 dark:text-emerald-300" },
  { id: "A2", name: "A2 Elementary", desc: "1,000 headwords, everyday routines", color: "border-teal-400 text-teal-700 dark:text-teal-300" },
  { id: "B1", name: "B1 Intermediate", desc: "2,000 headwords, descriptive narratives", color: "border-blue-400 text-blue-700 dark:text-blue-300" },
  { id: "B2", name: "B2 Upper-Int.", desc: "4,000 headwords, abstract concepts", color: "border-indigo-400 text-indigo-700 dark:text-indigo-300" },
  { id: "C1", name: "C1 Advanced", desc: "8,000 headwords, literary & nuanced", color: "border-purple-400 text-purple-700 dark:text-purple-300" },
];

const CATEGORIES: StoryCategory[] = [
  "Mystery",
  "Sci-Fi",
  "Daily Life",
  "History",
  "Adventure",
  "Philosophy",
];

export default function AdminGeneratePage() {
  const { savedWordsMap, toggleSaveWord } = useAppContext();

  // Form State
  const [topic, setTopic] = useState<string>("");
  const [level, setLevel] = useState<CEFRLevel>("A2");
  const [category, setCategory] = useState<StoryCategory>("Mystery");
  const [wordCount, setWordCount] = useState<number>(180);
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);

  // Generation & Publishing State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishSuccessSlug, setPublishSuccessSlug] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Preview Interactive State
  const [selectedToken, setSelectedToken] = useState<WordToken | null>(null);
  const [expandedTranslations, setExpandedTranslations] = useState<Record<string, boolean>>({});
  const [isJsonCopied, setIsJsonCopied] = useState<boolean>(false);

  const handleApplyPreset = (preset: typeof PRESET_TOPICS[0]) => {
    setTopic(preset.prompt);
    setLevel(preset.level);
    setCategory(preset.category);
    setErrorMessage(null);
    setPublishSuccessSlug(null);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMessage("Please enter a story topic or choose an inspiration preset.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setPublishSuccessSlug(null);
    setGenerationStep("Analyzing target CEFR level vocabulary...");

    try {
      setTimeout(() => setGenerationStep("Drafting narrative with 95% comprehensible tokens..."), 800);
      setTimeout(() => setGenerationStep("Generating natural Turkish paragraph translations..."), 1600);
      setTimeout(() => setGenerationStep("Creating comprehension quiz and phonetic IPA..."), 2400);

      const res = await fetch("/api/admin/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          level,
          category,
          wordCount,
          apiKey: apiKey.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate story.");
      }

      setGeneratedStory(data.story);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error generating story.";
      setErrorMessage(msg);
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  const handlePublish = async () => {
    if (!generatedStory) return;
    setIsPublishing(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/publish-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story: generatedStory }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to publish story to database.");
      }

      setPublishSuccessSlug(generatedStory.slug);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error publishing story.";
      setErrorMessage(msg);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyJson = () => {
    if (!generatedStory) return;
    navigator.clipboard.writeText(JSON.stringify(generatedStory, null, 2));
    setIsJsonCopied(true);
    setTimeout(() => setIsJsonCopied(false), 2000);
  };

  const toggleTranslation = (pId: string) => {
    setExpandedTranslations((prev) => ({ ...prev, [pId]: !prev[pId] }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-[#121212] text-[#1F2937] dark:text-[#E5E7EB] transition-colors duration-200">
      {/* Navbar */}
      <Navbar />

      {/* Main Studio Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* Breadcrumb & Admin Tag */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <nav className="flex items-center gap-2 text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF]">
            <Link href="/" className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400">
              Home
            </Link>
            <span>/</span>
            <span className="font-bold text-[#1F2937] dark:text-[#E5E7EB]">
              AI Story Studio
            </span>
          </nav>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <span>⚡</span>
            <span>Admin Story Engine</span>
          </span>
        </div>

        {/* Studio Hero Banner */}
        <div className="rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#2E2E2E] p-6 sm:p-8 mb-8 shadow-xs">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1F2937] dark:text-[#E5E7EB] mb-2 font-serif">
              AI Story Generator & Publisher
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
              Generate Krashen 95% comprehensible graded English stories with tokenized words, phonetic IPA, paragraph translations, and auto-publish them directly to Supabase.
            </p>
          </div>

          {/* Preset Inspiration Tags */}
          <div className="mt-6 pt-5 border-t border-[#E5E7EB] dark:border-[#2E2E2E]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF] block mb-2.5">
              💡 Quick Inspiration Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_TOPICS.map((preset) => (
                <button
                  key={preset.title}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F7F4EE] dark:bg-[#252528] border border-[#E5E7EB] dark:border-[#2E2E2E] text-[#1F2937] dark:text-[#E5E7EB] hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
                >
                  <span>{preset.title}</span>
                  <span className="ml-1.5 opacity-60 text-[11px]">({preset.level})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generator Form */}
        <form onSubmit={handleGenerate} className="rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#2E2E2E] p-6 sm:p-8 mb-8 shadow-xs space-y-6">
          {/* Topic Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF] mb-2">
              Story Topic & Premise
            </label>
            <textarea
              required
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Describe the story topic, setting, or characters (e.g. A botanist in Victorian London finds a flower that only blooms when someone speaks the truth)..."
              className="w-full p-4 rounded-2xl text-xs sm:text-sm bg-[#FDFBF7] dark:bg-[#16171B] border border-[#E5E7EB] dark:border-[#2E2E2E] text-[#1F2937] dark:text-[#E5E7EB] focus:outline-hidden focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
            />
          </div>

          {/* Level Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF] mb-2.5">
              Target CEFR Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {CEFR_LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setLevel(lvl.id)}
                  className={`p-3 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                    level === lvl.id
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs"
                      : "border-[#E5E7EB] dark:border-[#2E2E2E] hover:border-gray-400 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="text-sm font-bold text-[#1F2937] dark:text-[#E5E7EB]">
                    {lvl.name}
                  </div>
                  <div className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] mt-0.5 line-clamp-1">
                    {lvl.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Category & Word Count Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF] mb-2">
                Genre / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StoryCategory)}
                className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-[#FDFBF7] dark:bg-[#16171B] border border-[#E5E7EB] dark:border-[#2E2E2E] text-[#1F2937] dark:text-[#E5E7EB] focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">
                  Target Word Count ({wordCount} words)
                </label>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  ~{Math.max(1, Math.ceil(wordCount / 60))} min read
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={400}
                step={20}
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full h-2 bg-[#E5E7EB] dark:bg-[#2E2E2E] rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-[#6B7280] dark:text-[#9CA3AF] mt-1 font-mono">
                <span>100w (Quick)</span>
                <span>200w (Standard)</span>
                <span>400w (Extended)</span>
              </div>
            </div>
          </div>

          {/* Optional Gemini API Key Accordion */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 cursor-pointer"
            >
              <span>⚙️ {showApiKeyInput ? "Hide Custom API Key" : "Add Custom Gemini API Key (Optional)"}</span>
            </button>
            {showApiKeyInput && (
              <div className="mt-3 p-4 rounded-2xl bg-[#F7F4EE] dark:bg-[#252528] border border-[#E5E7EB] dark:border-[#2E2E2E]">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy... (Leave empty to use server default or smart fallback)"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#2E2E2E] text-[#1F2937] dark:text-[#E5E7EB]"
                />
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs font-medium leading-relaxed">
              {errorMessage}
            </div>
          )}

          {/* Generate Button & Progress */}
          <div>
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 text-white font-extrabold text-sm sm:text-base transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{generationStep || "Generating Leveled Story..."}</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Generate Leveled Story</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Story Preview & Publishing Studio */}
        {generatedStory && (
          <div className="rounded-3xl bg-white dark:bg-[#1E1E1E] border-2 border-indigo-500/40 p-6 sm:p-8 shadow-xl space-y-8 animate-in fade-in duration-300">
            {/* Preview Action Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E7EB] dark:border-[#2E2E2E]">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                  Ready for Review & Publishing
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] dark:text-[#E5E7EB] font-serif">
                  {generatedStory.title}
                </h2>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                  Slug: <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{generatedStory.slug}</code>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#2E2E2E] bg-[#F7F4EE] dark:bg-[#252528] text-xs font-bold text-[#1F2937] dark:text-[#E5E7EB] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  {isJsonCopied ? "✓ Copied!" : "📋 Copy JSON"}
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPublishing ? (
                    <span>Publishing...</span>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Publish to GoLingread</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Published Success Alert */}
            {publishSuccessSlug && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <strong className="block text-sm font-bold">Story Published Successfully!</strong>
                    <span className="text-xs">It is now live on the catalog and accessible via individual URL.</span>
                  </div>
                </div>

                <Link
                  href={`/story/${publishSuccessSlug}`}
                  target="_blank"
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
                >
                  <span>Open Story Reader</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            )}

            {/* Story Meta Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                Level: {generatedStory.level}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                {generatedStory.category}
              </span>
              <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium">
                ⏱️ {generatedStory.readTimeMinutes} min read • 📝 {generatedStory.wordCount} words
              </span>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-2xl bg-[#FDFBF7] dark:bg-[#16171B] border border-[#E5E7EB] dark:border-[#2E2E2E]">
              <p className="text-xs sm:text-sm font-medium text-[#1F2937] dark:text-[#E5E7EB] italic">
                &ldquo;{generatedStory.summary}&rdquo;
              </p>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                🇹🇷 {generatedStory.summaryTr}
              </p>
            </div>

            {/* Leveled Reading Body with Interactive Word Tokens */}
            <div className="space-y-6 pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">
                Interactive Reader Preview (Click words to inspect tokens):
              </h3>

              <div className="space-y-6 font-story leading-[1.85] text-base sm:text-lg">
                {generatedStory.paragraphs.map((paragraph) => {
                  const isOpen = expandedTranslations[paragraph.id];

                  return (
                    <div key={paragraph.id} className="p-4 rounded-2xl bg-[#FDFBF7] dark:bg-[#16171B] border border-[#E5E7EB] dark:border-[#2E2E2E]">
                      {/* Tokens */}
                      <p className="flex flex-wrap gap-x-1.5 gap-y-1 items-baseline">
                        {paragraph.tokens.map((token, tIndex) => {
                          const isSelected = selectedToken?.clean === token.clean;
                          const isSaved = savedWordsMap.has(token.clean.toLowerCase());

                          return (
                            <button
                              key={`${paragraph.id}-${tIndex}-${token.clean}`}
                              type="button"
                              onClick={() => setSelectedToken(token)}
                              className={`rounded-sm px-0.5 text-left cursor-pointer transition-colors ${
                                isSelected
                                  ? "bg-amber-200 text-amber-950 font-medium"
                                  : isSaved
                                  ? "bg-emerald-100/70 text-emerald-950 border-b border-emerald-400"
                                  : "hover:bg-amber-100 hover:text-amber-950"
                              }`}
                            >
                              {token.text}
                            </button>
                          );
                        })}
                      </p>

                      {/* Translation Toggle */}
                      <div className="mt-3 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => toggleTranslation(paragraph.id)}
                          className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>🇹🇷</span>
                          <span>{isOpen ? "Hide Turkish" : "Show Turkish"}</span>
                        </button>
                      </div>

                      {isOpen && (
                        <div className="mt-2 p-3 rounded-xl bg-white dark:bg-[#1E1E1E] text-xs text-[#4B5563] dark:text-[#9CA3AF] font-sans leading-relaxed border border-[#E5E7EB] dark:border-[#2E2E2E]">
                          {paragraph.turkishTranslation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comprehension Quiz Preview */}
            {generatedStory.quiz && generatedStory.quiz.length > 0 && (
              <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#2E2E2E]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF] mb-4">
                  Comprehension Quiz ({generatedStory.quiz.length} Questions):
                </h3>

                <div className="space-y-4">
                  {generatedStory.quiz.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="p-4 rounded-2xl bg-[#FDFBF7] dark:bg-[#16171B] border border-[#E5E7EB] dark:border-[#2E2E2E]"
                    >
                      <p className="text-xs sm:text-sm font-bold text-[#1F2937] dark:text-[#E5E7EB] mb-3">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                        {q.options.map((opt, optIdx) => (
                          <div
                            key={opt}
                            className={`p-2.5 rounded-xl text-xs font-semibold border ${
                              optIdx === q.correctIndex
                                ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-300"
                                : "bg-white dark:bg-[#1E1E1E] border-[#E5E7EB] dark:border-[#2E2E2E] text-[#6B7280] dark:text-[#9CA3AF]"
                            }`}
                          >
                            <span>{String.fromCharCode(65 + optIdx)}. </span>
                            <span>{opt}</span>
                            {optIdx === q.correctIndex && <span className="ml-1 font-bold">✓ (Correct)</span>}
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] italic">
                        💡 Explanation: {q.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Word Popover Inspector */}
      {selectedToken && (
        <WordPopover
          token={selectedToken}
          isSaved={savedWordsMap.has(selectedToken.clean.toLowerCase())}
          onToggleSave={(t) => toggleSaveWord(t, generatedStory?.title || "AI Story")}
          onClose={() => setSelectedToken(null)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
