import { Story, Paragraph, WordToken } from "@/types";
import { cleanWordToken, lookupWordInLexicon, generatePhoneticIpa } from "./dictionary";
import { isPlaceholderTranslation, translateWordOffline } from "./translator";

/**
 * Validates and repairs a single WordToken
 */
export function enrichWordToken(token: Partial<WordToken>, paragraphContext?: string, storyLevel: Story["level"] = "A2"): WordToken {
  const rawText = token.text || token.clean || "";
  const clean = cleanWordToken(token.clean || rawText) || rawText;

  let translationTr = token.translationTr || "";
  let ipa = token.ipa || "";
  let partOfSpeech = token.partOfSpeech || "noun";
  let level = token.level || storyLevel;
  let exampleSentence = token.exampleSentence;

  // Check if translation is placeholder, empty, or missing
  if (isPlaceholderTranslation(translationTr, clean)) {
    const offlineLookup = translateWordOffline(clean, storyLevel);
    if (offlineLookup.translationTr && !isPlaceholderTranslation(offlineLookup.translationTr, clean)) {
      translationTr = offlineLookup.translationTr;
      partOfSpeech = offlineLookup.partOfSpeech;
      level = offlineLookup.level;
      if (!ipa || ipa === `/${clean.toLowerCase()}/`) {
        ipa = offlineLookup.ipa;
      }
      if (!exampleSentence) {
        exampleSentence = offlineLookup.exampleSentence;
      }
    } else {
      // Direct dictionary lookup
      const dictMatch = lookupWordInLexicon(clean);
      if (dictMatch) {
        translationTr = dictMatch.tr;
        partOfSpeech = dictMatch.pos;
        level = dictMatch.level;
        if (dictMatch.ipa) ipa = dictMatch.ipa;
        if (dictMatch.example) exampleSentence = dictMatch.example;
      } else {
        // Human-friendly title or clean representation
        translationTr = `${clean}`;
      }
    }
  }

  // Ensure IPA is formatted nicely
  if (!ipa || ipa.trim() === "" || ipa === "//") {
    ipa = generatePhoneticIpa(clean);
  }

  // Ensure example sentence exists
  if (!exampleSentence && paragraphContext) {
    exampleSentence = `Used in story context: "${paragraphContext.slice(0, 80)}..."`;
  }

  return {
    text: rawText,
    clean,
    translationTr,
    ipa,
    partOfSpeech: partOfSpeech as WordToken["partOfSpeech"],
    level,
    exampleSentence,
  };
}

/**
 * Validates and enriches all tokens and paragraphs of a Story
 */
export function enrichStoryTokens(story: Story): Story {
  if (!story || !Array.isArray(story.paragraphs)) {
    return story;
  }

  const enrichedParagraphs: Paragraph[] = story.paragraphs.map((p, pIdx) => {
    let rawTokens = p.tokens;

    // Handle edge case where paragraph text was not tokenized
    if (!Array.isArray(rawTokens) || rawTokens.length === 0) {
      const words = (p.id || `paragraph-${pIdx + 1}`).split(/\s+/);
      rawTokens = words.map((w) => ({
        text: w,
        clean: cleanWordToken(w),
        translationTr: "",
        ipa: "",
        partOfSpeech: "noun",
        level: story.level,
      }));
    }

    const tokens: WordToken[] = rawTokens.map((t) =>
      enrichWordToken(t, p.turkishTranslation, story.level)
    );

    return {
      ...p,
      id: p.id || `p-${pIdx + 1}`,
      tokens,
      turkishTranslation: p.turkishTranslation || "",
    };
  });

  return {
    ...story,
    paragraphs: enrichedParagraphs,
  };
}
