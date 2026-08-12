import { NextRequest, NextResponse } from "next/server";
import { lookupWordInLexicon, cleanWordToken, generatePhoneticIpa } from "@/lib/dictionary";
import { WordToken, CEFRLevel } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const word = searchParams.get("word");
    const context = searchParams.get("context") || "";

    if (!word || typeof word !== "string" || word.trim().length === 0) {
      return NextResponse.json({ error: "Word parameter is required." }, { status: 400 });
    }

    const clean = cleanWordToken(word);
    if (!clean) {
      return NextResponse.json({ error: "Invalid word token." }, { status: 400 });
    }

    // 1. Check local comprehensive dictionary
    const dictMatch = lookupWordInLexicon(clean);
    if (dictMatch) {
      const token: WordToken = {
        text: word,
        clean,
        translationTr: dictMatch.tr,
        ipa: dictMatch.ipa || generatePhoneticIpa(clean),
        partOfSpeech: dictMatch.pos,
        level: dictMatch.level,
        exampleSentence: dictMatch.example || (context ? `In context: "${context}"` : undefined),
      };
      return NextResponse.json({ success: true, token });
    }

    // 2. Try Google Translate public API (Fast & free)
    try {
      const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tr&dt=t&q=${encodeURIComponent(clean)}`;
      const gRes = await fetch(gUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(3000),
      });

      if (gRes.ok) {
        const gData = await gRes.json();
        // gData structure: [[["çeviri","original",...]]]
        const translatedText = gData?.[0]?.[0]?.[0];
        if (translatedText && typeof translatedText === "string" && translatedText.trim().length > 0) {
          const token: WordToken = {
            text: word,
            clean,
            translationTr: translatedText.trim(),
            ipa: generatePhoneticIpa(clean),
            partOfSpeech: "noun",
            level: "A2" as CEFRLevel,
            exampleSentence: context || `The word "${clean}" is used in this story.`,
          };
          return NextResponse.json({ success: true, token });
        }
      }
    } catch {
      // ignore and try next provider
    }

    // 3. Try MyMemory Translation API fallback
    try {
      const mUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|tr`;
      const mRes = await fetch(mUrl, { signal: AbortSignal.timeout(3000) });
      if (mRes.ok) {
        const mData = await mRes.json();
        const translatedText = mData?.responseData?.translatedText;
        if (translatedText && typeof translatedText === "string" && translatedText.trim().length > 0) {
          const cleanTranslation = translatedText.replace(/^[0-9.]+\s*/, "").trim();
          const token: WordToken = {
            text: word,
            clean,
            translationTr: cleanTranslation,
            ipa: generatePhoneticIpa(clean),
            partOfSpeech: "noun",
            level: "A2" as CEFRLevel,
            exampleSentence: context || `She noted the word "${clean}".`,
          };
          return NextResponse.json({ success: true, token });
        }
      }
    } catch {
      // fallback
    }

    // 4. Ultimate clean fallback
    const fallbackToken: WordToken = {
      text: word,
      clean,
      translationTr: clean,
      ipa: generatePhoneticIpa(clean),
      partOfSpeech: "noun",
      level: "A2" as CEFRLevel,
    };

    return NextResponse.json({ success: true, token: fallbackToken });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Translation error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
