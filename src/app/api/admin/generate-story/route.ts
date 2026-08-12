import { NextRequest, NextResponse } from "next/server";
import { Story, CEFRLevel, StoryCategory, Paragraph, WordToken } from "@/types";
import { isAdminEmail } from "@/lib/auth-admin";
import { enrichStoryTokens, enrichWordToken } from "@/lib/story-enricher";
import { cleanWordToken } from "@/lib/dictionary";
import { getAvailableGeminiModels } from "@/lib/gemini";

const LEVEL_VOCAB_MAP: Record<CEFRLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

const CATEGORY_COVERS: Record<StoryCategory, string[]> = {
  Mystery: [
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
  ],
  "Sci-Fi": [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
  ],
  "Daily Life": [
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80",
  ],
  History: [
    "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1533158307587-828f0a76ef46?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
  ],
  Adventure: [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  ],
  Philosophy: [
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1507842229456-7495b3f11467?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80",
  ],
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Themed fallback story templates when offline or without external AI API
 */
function getThemedFallbackNarrative(topic: string, category: StoryCategory) {
  const lowerTopic = topic.toLowerCase();

  // Airport & Travel Theme
  if (lowerTopic.includes("airport") || lowerTopic.includes("flight") || lowerTopic.includes("plane") || lowerTopic.includes("travel")) {
    return {
      title: "The Busy Airport Morning",
      titleTr: "Yoğun Bir Havalimanı Sabahı",
      paragraphs: [
        {
          text: "Every morning, the quiet airport terminal woke up with soft light shining through the wide windows. Passengers carried their luggage and waited patiently near the departure gate for the announcement.",
          tr: "Her sabah, sessiz havalimanı terminali geniş pencerelerden süzülen yumuşak ışıkla uyanırdı. Yolcular bagajlarını taşır ve anons için kalkış kapısının yanında sabırla beklerlerdi.",
        },
        {
          text: "When the airplane arrived on the runway, a gentle voice called the travelers for boarding. Looking at the blue sky ahead, everyone felt ready for a new journey full of wonder and discovery.",
          tr: "Uçak piste indiğinde, nazik bir ses yolcuları uçağa biniş için çağırdı. İlerideki mavi gökyüzüne bakarken herkes merak ve keşif dolu yeni bir yolculuğa hazır hissetti.",
        },
        {
          text: "By sunset, the flight landed safely at the destination. Walking through the city streets with a calm heart, the traveler understood that every journey begins with curiosity and patience.",
          tr: "Gün batımına doğru uçak hedefe güvenle indi. Sakin bir kalple şehir sokaklarında yürürken, gezgin her yolculuğun merak ve sabırla başladığını anladı.",
        },
      ],
      quiz: [
        {
          id: "q-1",
          question: "Where did the passengers wait for the announcement?",
          options: ["Near the departure gate", "In a dark forest", "At the library entrance", "Outside the city"],
          correctIndex: 0,
          explanation: "The story mentions passengers waited patiently near the departure gate.",
        },
        {
          id: "q-2",
          question: "How did the flight conclude by sunset?",
          options: [
            "It was cancelled due to rain",
            "It landed safely at the destination",
            "The plane flew backward",
            "The travelers returned home immediately",
          ],
          correctIndex: 1,
          explanation: "The story states that by sunset the flight landed safely at the destination.",
        },
      ],
    };
  }

  // General Adaptive Narrative
  const cleanTitle = topic
    .split(" ")
    .slice(0, 5)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: cleanTitle || `The Secrets of ${category}`,
    titleTr: `${cleanTitle || category} Gizemi`,
    paragraphs: [
      {
        text: `Every morning, the quiet town held a secret known only to those who listened carefully. When ${topic.toLowerCase()} was first discovered, nobody expected how much it would change the ordinary days ahead.`,
        tr: `Her sabah, sessiz kasaba sadece dikkatle dinleyenlerin bildiği bir sır barındırırdı. ${topic} ilk keşfedildiğinde, kimse ilerideki sıradan günleri ne kadar değiştireceğini tahmin etmemişti.`,
      },
      {
        text: `As the hours passed gently, soft light illuminated the path forward. Walking through the narrow streets, a gentle breeze whispered stories of ancient memories and timeless wonders that time had forgotten.`,
        tr: `Saatler usulca geçerken, yumuşak bir ışık önlerindeki yolu aydınlattı. Dar sokaklarda yürürken, hafif bir esinti zamanın unuttuğu kadim hatıraların ve zamansız mucizelerin hikayelerini fısıldadı.`,
      },
      {
        text: `By sunset, the mystery was finally understood. With newfound wisdom and a peaceful heart, looking back at the journey proved that true discovery always begins with curiosity and patience.`,
        tr: `Gün batımına doğru, gizem nihayet anlaşıldı. Yeni edinilen bilgelik ve huzurlu bir kalple yolculuğa dönüp bakıldığında, gerçek keşfin her zaman merak ve sabırla başladığı kanıtlandı.`,
      },
    ],
    quiz: [
      {
        id: "q-1",
        question: `What was the main discovery related to ${topic.toLowerCase()}?`,
        options: [
          "It revealed an ancient secret",
          "It disappeared immediately",
          "It was broken beyond repair",
          "Nobody paid attention",
        ],
        correctIndex: 0,
        explanation: "The story reveals how the discovery changed the ordinary days of the quiet town.",
      },
      {
        id: "q-2",
        question: "How did the journey conclude by sunset?",
        options: [
          "With confusion and sadness",
          "With peaceful understanding and curiosity",
          "With a sudden storm",
          "Everyone left the town",
        ],
        correctIndex: 1,
        explanation: "The narrator reflects that true discovery always begins with curiosity and patience.",
      },
    ],
  };
}

/**
 * Fallback generator with fully authentic token translations and IPA
 */
function generateFallbackStory(
  topic: string,
  level: CEFRLevel,
  category: StoryCategory,
  targetWordCount: number
): Story {
  const narrative = getThemedFallbackNarrative(topic, category);
  const slug = slugify(narrative.title) + `-${Date.now().toString().slice(-4)}`;

  const covers = CATEGORY_COVERS[category] || CATEGORY_COVERS.Mystery;
  const coverImage = covers[Math.floor(Math.random() * covers.length)];

  const paragraphs = narrative.paragraphs.map((p, pIdx) => {
    const words = p.text.split(/\s+/);
    const tokens: WordToken[] = words.map((w) => {
      const clean = cleanWordToken(w);
      return enrichWordToken(
        {
          text: w,
          clean: clean || w,
        },
        p.tr,
        level
      );
    });

    return {
      id: `p-${pIdx + 1}`,
      tokens,
      turkishTranslation: p.tr,
    };
  });

  const totalWords = paragraphs.reduce((acc, p) => acc + p.tokens.length, 0);

  const rawStory: Story = {
    id: `gen-${Date.now()}`,
    title: narrative.title,
    titleTr: narrative.titleTr,
    slug,
    level,
    category,
    readTimeMinutes: Math.max(1, Math.ceil(totalWords / 60)),
    wordCount: totalWords || targetWordCount,
    coverImage,
    summary: `An inspiring ${category.toLowerCase()} story exploring ${topic.toLowerCase()} with curated level ${level} vocabulary.`,
    summaryTr: `${topic} konusunu ${level} seviyesine uygun kelimelerle ele alan etkileyici bir ${category.toLowerCase()} hikayesi.`,
    requiredVocabularyLevel: LEVEL_VOCAB_MAP[level] || 2,
    paragraphs,
    quiz: narrative.quiz,
  };

  return enrichStoryTokens(rawStory);
}

/**
 * Converts raw paragraph texts into structured WordToken paragraphs
 */
function tokenizeParagraphs(
  rawParagraphs: Array<{ id?: string; text?: string; turkishTranslation?: string; tokens?: WordToken[] }>,
  storyLevel: CEFRLevel
): Paragraph[] {
  return rawParagraphs.map((p, idx) => {
    const pId = p.id || `p-${idx + 1}`;
    const trText = p.turkishTranslation || "";

    if (Array.isArray(p.tokens) && p.tokens.length > 0) {
      return {
        id: pId,
        turkishTranslation: trText,
        tokens: p.tokens.map((t) => enrichWordToken(t, trText, storyLevel)),
      };
    }

    const words = (p.text || "").trim().split(/\s+/).filter(Boolean);
    const tokens: WordToken[] = words.map((w) => {
      const clean = cleanWordToken(w);
      return enrichWordToken(
        {
          text: w,
          clean: clean || w,
        },
        trText,
        storyLevel
      );
    });

    return {
      id: pId,
      turkishTranslation: trText,
      tokens,
    };
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, level = "A2", category = "Daily Life", wordCount = 180, apiKey, userEmail } = body;

    const requestEmail = req.headers.get("x-user-email") || userEmail;
    if (!isAdminEmail(requestEmail)) {
      return NextResponse.json(
        { error: "Forbidden: Administrator authorization required." },
        { status: 403 }
      );
    }

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Topic prompt is required." },
        { status: 400 }
      );
    }

    const effectiveApiKey =
      apiKey?.trim() ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    let geminiErrorLog = "";

    // If Gemini API Key is available, call Gemini API
    if (effectiveApiKey) {
      const discovery = await getAvailableGeminiModels(effectiveApiKey);
      if (!discovery.success || discovery.models.length === 0) {
        geminiErrorLog = discovery.error || "No available Gemini models found for this API key.";
      } else {
        const prompt = `You are an expert ESL/EFL graded reading author specialized in Stephen Krashen's 95% Comprehensible Input hypothesis ($i+1$).

Write a captivating, beautifully structured English reading story based on the premise:
"${topic}"

REQUIREMENTS:
1. Target CEFR Level: ${level} (Strictly adapt grammar, vocabulary, sentence length, and syntax to CEFR ${level}).
2. Category: ${category}
3. Target Word Count: Around ${wordCount} words (distributed across 3-4 engaging paragraphs).
4. For each paragraph, provide the complete, high quality, natural Turkish translation.
5. Provide 2 comprehension quiz questions with 4 options each, correct index, and concise explanation.
6. Return ONLY valid JSON (no markdown backticks, no conversational intro).

JSON FORMAT:
{
  "title": "Engaging Catchy English Title",
  "titleTr": "Doğal ve Çekici Türkçe Başlık",
  "slug": "kebab-case-title-slug",
  "summary": "1-2 sentence English summary capturing the essence of the story.",
  "summaryTr": "1-2 cümlelik akıcı ve etkileyici Türkçe hikaye özeti.",
  "paragraphs": [
    {
      "id": "p-1",
      "text": "Full natural English paragraph here...",
      "turkishTranslation": "Bu paragrafın eksiksiz ve akıcı Türkçe çevirisi..."
    },
    {
      "id": "p-2",
      "text": "Second English paragraph...",
      "turkishTranslation": "İkinci paragrafın Türkçe çevirisi..."
    },
    {
      "id": "p-3",
      "text": "Third English paragraph...",
      "turkishTranslation": "Üçüncü paragrafın Türkçe çevirisi..."
    }
  ],
  "quiz": [
    {
      "id": "q-1",
      "question": "Comprehension question in English?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct."
    },
    {
      "id": "q-2",
      "question": "Second comprehension question in English?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "explanation": "Explanation for the correct choice."
    }
  ]
}`;

        for (const model of discovery.models.slice(0, 3)) {
          try {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/${model.name}:generateContent?key=${effectiveApiKey}`;
            const response = await fetch(geminiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  responseMimeType: "application/json",
                  temperature: 0.7,
                },
              }),
              signal: AbortSignal.timeout(15000),
            });

            if (response.ok) {
              const data = await response.json();
              const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (rawText) {
                const cleanJson = rawText.replace(/```json\s*/g, "").replace(/```\s*$/g, "").trim();
                const parsed = JSON.parse(cleanJson);

                const covers = CATEGORY_COVERS[category as StoryCategory] || CATEGORY_COVERS.Mystery;
                const coverImage = covers[Math.floor(Math.random() * covers.length)];

                const structuredParagraphs = tokenizeParagraphs(parsed.paragraphs || [], level as CEFRLevel);
                const calculatedWordCount = structuredParagraphs.reduce((acc, p) => acc + p.tokens.length, 0);

                const story: Story = {
                  id: `story-${Date.now()}`,
                  title: parsed.title || topic,
                  titleTr: parsed.titleTr || parsed.title || topic,
                  slug: parsed.slug ? slugify(parsed.slug) : slugify(parsed.title || topic),
                  level: (parsed.level as CEFRLevel) || (level as CEFRLevel),
                  category: (parsed.category as StoryCategory) || (category as StoryCategory),
                  readTimeMinutes: Math.max(1, Math.ceil(calculatedWordCount / 60)),
                  wordCount: calculatedWordCount || wordCount,
                  coverImage,
                  summary: parsed.summary || `An engaging story about ${topic}.`,
                  summaryTr: parsed.summaryTr || `${topic} hakkında etkileyici bir hikaye.`,
                  requiredVocabularyLevel: LEVEL_VOCAB_MAP[level as CEFRLevel] || 2,
                  paragraphs: structuredParagraphs,
                  quiz: parsed.quiz || [],
                };

                const enrichedStory = enrichStoryTokens(story);
                return NextResponse.json({
                  success: true,
                  story: enrichedStory,
                  source: "gemini",
                  model: model.id,
                });
              }
            } else {
              const errorBody = await response.json().catch(() => null);
              const errMsg = errorBody?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
              geminiErrorLog = `[${model.id}] ${errMsg}`;
            }
          } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : "Fetch failed";
            geminiErrorLog = `[${model.id}] ${errMsg}`;
          }
        }
      }
    }

    // High quality themed Fallback Generator
    const story = generateFallbackStory(
      topic,
      level as CEFRLevel,
      category as StoryCategory,
      wordCount
    );

    return NextResponse.json({
      success: true,
      story,
      source: "fallback",
      errorDetails: effectiveApiKey && geminiErrorLog ? geminiErrorLog : undefined,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal generation error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
