import { WordToken, CEFRLevel } from "@/types";
import { lookupWordInLexicon, cleanWordToken, generatePhoneticIpa } from "./dictionary";

// Client-side in-memory translation cache
const TRANSLATION_CACHE = new Map<string, WordToken>();

/**
 * Checks if a given translation string is a placeholder or broken dummy text
 */
export function isPlaceholderTranslation(tr?: string, cleanWord?: string): boolean {
  if (!tr || typeof tr !== "string") return true;
  const trimmed = tr.trim().toLowerCase();
  if (trimmed === "") return true;

  // Placeholder patterns: "airport anlamı", "when anlamı", "meaning of...", "undefined"
  if (trimmed.endsWith(" anlamı") || trimmed.endsWith(" anlami")) return true;
  if (trimmed.startsWith("anlamı:") || trimmed.startsWith("anlami:")) return true;
  if (trimmed === "anlamı" || trimmed === "anlami" || trimmed === "translation") return true;
  if (trimmed.includes("[object") || trimmed.includes("undefined") || trimmed.includes("null")) return true;

  // If translation is identical to the english clean word
  if (cleanWord && trimmed === cleanWord.trim().toLowerCase()) {
    // Exceptions: names, numbers, or universal acronyms might match, but usually single words should differ
    if (cleanWord.length > 2 && isNaN(Number(cleanWord))) {
      return true;
    }
  }

  return false;
}

/**
 * Translate a single word synchronously using the comprehensive dictionary
 */
export function translateWordOffline(rawWord: string, fallbackLevel: CEFRLevel = "A2"): WordToken {
  const clean = cleanWordToken(rawWord) || rawWord;
  const match = lookupWordInLexicon(clean);

  if (match) {
    return {
      text: rawWord,
      clean,
      translationTr: match.tr,
      ipa: match.ipa || generatePhoneticIpa(clean),
      partOfSpeech: match.pos,
      level: match.level || fallbackLevel,
      exampleSentence: match.example || `She noticed the ${clean.toLowerCase()} immediately.`,
    };
  }

  return {
    text: rawWord,
    clean,
    translationTr: "",
    ipa: generatePhoneticIpa(clean),
    partOfSpeech: "noun",
    level: fallbackLevel,
  };
}

/**
 * Translate a single word with online fallback (client or server)
 */
export async function translateWordOnline(
  rawWord: string,
  contextSentence?: string,
  fallbackLevel: CEFRLevel = "A2"
): Promise<WordToken> {
  const clean = cleanWordToken(rawWord) || rawWord;
  const cacheKey = clean.toLowerCase();

  if (TRANSLATION_CACHE.has(cacheKey)) {
    const cached = TRANSLATION_CACHE.get(cacheKey)!;
    return { ...cached, text: rawWord };
  }

  // 1. Try offline lexicon
  const offlineToken = translateWordOffline(rawWord, fallbackLevel);
  if (offlineToken.translationTr && !isPlaceholderTranslation(offlineToken.translationTr, clean)) {
    TRANSLATION_CACHE.set(cacheKey, offlineToken);
    return offlineToken;
  }

  // 2. Call internal /api/translate or external translation API
  try {
    const query = encodeURIComponent(clean);
    const contextQuery = contextSentence ? `&context=${encodeURIComponent(contextSentence)}` : "";
    const res = await fetch(`/api/translate?word=${query}${contextQuery}`);
    
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.token) {
        const token: WordToken = {
          text: rawWord,
          clean: data.token.clean || clean,
          translationTr: data.token.translationTr,
          ipa: data.token.ipa || generatePhoneticIpa(clean),
          partOfSpeech: data.token.partOfSpeech || "noun",
          level: data.token.level || fallbackLevel,
          exampleSentence: data.token.exampleSentence,
        };
        TRANSLATION_CACHE.set(cacheKey, token);
        return token;
      }
    }
  } catch {
    // Network or API failure fallback
  }

  // 3. Fallback translation formatting
  const token: WordToken = {
    text: rawWord,
    clean,
    translationTr: offlineToken.translationTr || `${clean}`,
    ipa: generatePhoneticIpa(clean),
    partOfSpeech: "noun",
    level: fallbackLevel,
  };
  return token;
}
