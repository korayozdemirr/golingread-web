import { NextRequest, NextResponse } from "next/server";
import { Story, CEFRLevel, StoryCategory, WordToken } from "@/types";

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
 * Intelligent fallback generator when no external AI API key is configured.
 */
function generateFallbackStory(
  topic: string,
  level: CEFRLevel,
  category: StoryCategory,
  targetWordCount: number
): Story {
  const cleanTitle = topic
    .split(" ")
    .slice(0, 5)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const title = cleanTitle || `The Secrets of ${category}`;
  const slug = slugify(title) + `-${Date.now().toString().slice(-4)}`;

  const covers = CATEGORY_COVERS[category] || CATEGORY_COVERS.Mystery;
  const coverImage = covers[Math.floor(Math.random() * covers.length)];

  // Craft leveled paragraphs
  const p1Text = `Every morning, the quiet town held a secret known only to those who listened carefully. When ${topic.toLowerCase()} was first discovered, nobody expected how much it would change the ordinary days ahead.`;
  const p1Tr = `Her sabah, sessiz kasaba sadece dikkatle dinleyenlerin bildiği bir sır barındırırdı. ${topic} ilk keşfedildiğinde, kimse ilerideki sıradan günleri ne kadar değiştireceğini tahmin etmemişti.`;

  const p2Text = `As the hours passed gently, gentle light illuminated the path forward. Walking through the narrow streets, a soft breeze whispered stories of ancient memories and timeless wonders that time had forgotten.`;
  const p2Tr = `Saatler usulca geçerken, yumuşak bir ışık önlerindeki yolu aydınlattı. Dar sokaklarda yürürken, hafif bir esinti zamanın unuttuğu kadim hatıraların ve zamansız mucizelerin hikayelerini fısıldadı.`;

  const p3Text = `By sunset, the mystery was finally understood. With newfound wisdom and a peaceful heart, looking back at the journey proved that true discovery always begins with curiosity and patience.`;
  const p3Tr = `Gün batımına doğru, gizem nihayet anlaşıldı. Yeni edinilen bilgelik ve huzurlu bir kalple yolculuğa dönüp bakıldığında, gerçek keşfin her zaman merak ve sabırla başladığı kanıtlandı.`;

  const paragraphsRaw = [
    { text: p1Text, tr: p1Tr },
    { text: p2Text, tr: p2Tr },
    { text: p3Text, tr: p3Tr },
  ];

  const paragraphs = paragraphsRaw.map((p, pIdx) => {
    const words = p.text.split(/\s+/);
    const tokens: WordToken[] = words.map((w) => {
      const clean = w.replace(/[^\w]/g, "");
      return {
        text: w,
        clean: clean || w,
        translationTr: `${clean} anlamı`,
        ipa: `/${clean.toLowerCase()}/`,
        partOfSpeech: "noun",
        level: level,
        exampleSentence: `They observed the ${clean.toLowerCase()} closely.`,
      };
    });

    return {
      id: `p-${pIdx + 1}`,
      tokens,
      turkishTranslation: p.tr,
    };
  });

  const totalWords = paragraphs.reduce((acc, p) => acc + p.tokens.length, 0);

  return {
    id: `gen-${Date.now()}`,
    title,
    titleTr: `${title} (Türkçe Başlık)`,
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
        question: "How did the journey end by sunset?",
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, level = "A2", category = "Daily Life", wordCount = 180, apiKey } = body;

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Topic prompt is required." },
        { status: 400 }
      );
    }

    const effectiveApiKey =
      apiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    // If Gemini API Key is available, call Gemini API
    if (effectiveApiKey) {
      const prompt = `You are an expert ESL/EFL author specialized in Stephen Krashen's 95% Comprehensible Input hypothesis.
Write an engaging, graded English reading story based on the topic: "${topic}".

Target CEFR Level: ${level}
Category: ${category}
Target Word Count: ${wordCount} words

CRITICAL INSTRUCTIONS:
1. Adhere strictly to CEFR ${level} English vocabulary and grammatical structures.
2. Return ONLY a valid, raw JSON object (NO markdown backticks, NO explanation).
3. JSON Structure:
{
  "title": "Short catchy English title",
  "titleTr": "Turkish translation of title",
  "slug": "kebab-case-slug",
  "summary": "1-2 sentence English summary",
  "summaryTr": "1-2 sentence Turkish summary",
  "level": "${level}",
  "category": "${category}",
  "readTimeMinutes": 3,
  "wordCount": 180,
  "paragraphs": [
    {
      "id": "p-1",
      "turkishTranslation": "Full natural Turkish translation of this paragraph.",
      "tokens": [
        {
          "text": "Exact word with punctuation (e.g. 'library,')",
          "clean": "Word without punctuation (e.g. 'library')",
          "translationTr": "Contextual Turkish translation",
          "ipa": "/ˈlaɪ.brər.i/",
          "partOfSpeech": "noun" (or verb/adj/adv/prep/pron/conj/det),
          "level": "${level}",
          "exampleSentence": "Example sentence using the clean word."
        }
      ]
    }
  ],
  "quiz": [
    {
      "id": "q-1",
      "question": "Comprehension question in English",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct."
    },
    {
      "id": "q-2",
      "question": "Second question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "explanation": "Explanation."
    }
  ]
}`;

      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveApiKey}`;
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
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            const covers = CATEGORY_COVERS[category as StoryCategory] || CATEGORY_COVERS.Mystery;
            const coverImage = covers[Math.floor(Math.random() * covers.length)];

            const story: Story = {
              id: `story-${Date.now()}`,
              title: parsed.title,
              titleTr: parsed.titleTr || parsed.title,
              slug: parsed.slug || slugify(parsed.title),
              level: (parsed.level as CEFRLevel) || level,
              category: (parsed.category as StoryCategory) || category,
              readTimeMinutes: parsed.readTimeMinutes || 3,
              wordCount: parsed.wordCount || wordCount,
              coverImage,
              summary: parsed.summary,
              summaryTr: parsed.summaryTr || parsed.summary,
              requiredVocabularyLevel: LEVEL_VOCAB_MAP[level as CEFRLevel] || 2,
              paragraphs: parsed.paragraphs,
              quiz: parsed.quiz || [],
            };

            return NextResponse.json({ success: true, story });
          }
        }
      } catch {
        // Fallback to local generator if external API fails
      }
    }

    // Fallback Generator
    const story = generateFallbackStory(
      topic,
      level as CEFRLevel,
      category as StoryCategory,
      wordCount
    );

    return NextResponse.json({ success: true, story });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal generation error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
