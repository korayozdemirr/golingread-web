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

interface FallbackParagraph {
  text: string;
  turkishTranslation: string;
  words: Record<string, string>;
}

interface FallbackNarrative {
  title: string;
  titleTr: string;
  summary: string;
  summaryTr: string;
  paragraphs: FallbackParagraph[];
  quiz: Story["quiz"];
}

/**
 * Intelligent theme-aware procedural story generator for offline / fallback scenarios
 */
/**
 * Intelligent theme-aware procedural story generator for offline / fallback scenarios
 */
function buildAdaptiveFallbackStory(topic: string, level: CEFRLevel, category: StoryCategory, targetWordCount: number = 180): FallbackNarrative {
  const lower = topic.toLowerCase();
  const isExtended = targetWordCount >= 280;

  // 1. Food / Cooking Theme
  if (lower.includes("cook") || lower.includes("chef") || lower.includes("kitchen") || lower.includes("food") || lower.includes("restaurant") || lower.includes("soup") || lower.includes("bread") || lower.includes("tea") || lower.includes("coffee")) {
    const paragraphs: FallbackParagraph[] = [
      {
        text: "Every morning, the quiet kitchen smelled of fresh bread and warm spices. Leo loved preparing simple meals using garden vegetables and olive oil for his neighbors. He always believed that good food brings people closer together.",
        turkishTranslation: "Her sabah, sessiz mutfak taze ekmek ve ılık baharat kokardı. Leo, komşuları için bahçe sebzeleri ve zeytinyağı kullanarak basit yemekler hazırlamayı çok severdi. İyi yemeğin insanları birbirine yakınlaştırdığına her zaman inanırdı.",
        words: { Every: "Her", morning: "sabah", quiet: "sessiz", kitchen: "mutfak", smelled: "kokardı", fresh: "taze", bread: "ekmek", warm: "ılık", spices: "baharatlar", loved: "severdi", preparing: "hazırlamayı", simple: "basit", meals: "yemekler", using: "kullanarak", garden: "bahçe", vegetables: "sebzeler", olive: "zeytin", oil: "yağ", neighbors: "komşular", believed: "inandı", food: "yemek", brings: "getirir", people: "insanlar", closer: "daha yakın", together: "birlikte" },
      },
      {
        text: "One rainy afternoon, while cleaning the wooden pantry shelves, he noticed a small bronze box hidden behind old tea jars. Inside lay a handwritten notebook filled with antique recipes and heartwarming cooking advice from his grandmother.",
        turkishTranslation: "Yağmurlu bir öğleden sonra, ahşap kiler raflarını temizlerken eski çay kavanozlarının arkasına gizlenmiş küçük bronz bir kutu fark etti. İçinde büyükannesinden kalma antika tarifler ve iç ısıtan yemek pişirme tavsiyeleriyle dolu el yazması bir defter vardı.",
        words: { rainy: "yağmurlu", afternoon: "öğleden sonra", cleaning: "temizlerken", wooden: "ahşap", pantry: "kiler", shelves: "raflar", noticed: "fark etti", bronze: "bronz", box: "kutu", hidden: "gizli", behind: "arkasında", jars: "kavanozlar", Inside: "içeride", handwritten: "el yazısı", notebook: "defter", filled: "dolu", antique: "antika", recipes: "tarifler", advice: "tavsiye", grandmother: "büyükanne" },
      },
      {
        text: "He decided to cook the legendary autumn vegetable soup described in the old pages. He carefully chopped fresh carrots, sweet onions, and fragrant herbs, letting the soup simmer gently over low heat for several hours.",
        turkishTranslation: "Eski sayfalarda tarif edilen efsanevi sonbahar sebze çorbasını pişirmeye karar verdi. Taze havuçları, tatlı soğanları ve mis kokulu otları özenle doğrayarak çorbanın kısık ateşte birkaç saat usulca kaynamasına izin verdi.",
        words: { decided: "karar verdi", cook: "pişirmek", legendary: "efsanevi", autumn: "sonbahar", vegetable: "sebze", soup: "çorba", described: "tarif edilen", pages: "sayfalar", carefully: "özenle", chopped: "doğradı", carrots: "havuçlar", sweet: "tatlı", onions: "soğanlar", fragrant: "mis kokulu", herbs: "otlar / baharatlar", simmer: "kısık ateşte kaynamak", gently: "usulca", hours: "saatler" },
      },
    ];

    if (isExtended) {
      paragraphs.push(
        {
          text: "The delicious aroma spread through the cobblestone alleyways, inviting travelers, teachers, and shopkeepers to gather near the kitchen window. Everyone sat around the long wooden table, sharing warm conversations and tasting the hearty soup.",
          turkishTranslation: "Lezzetli koku arnavut kaldırımlı sokaklara yayılarak gezginleri, öğretmenleri ve dükkan sahiplerini mutfak penceresinin yanında toplanmaya davet etti. Herkes uzun ahşap masanın etrafına oturdu, sıcak sohbetler paylaştı ve doyurucu çorbayı tattı.",
          words: { aroma: "koku", spread: "yayıldı", cobblestone: "arnavut kaldırımı", alleyways: "dar sokaklar", inviting: "davet eden", shopkeepers: "dükkan sahipleri", gather: "toplanmak", window: "pencere", table: "masa", sharing: "paylaşarak", conversations: "sohbetler", tasting: "tadarak", hearty: "doyurucu / besleyici" },
        },
        {
          text: "By evening, the empty bowls and smiling faces proved that true happiness comes from simple generosity. Leo placed the recipe notebook safely on the front counter, ready for tomorrow's delicious adventures.",
          turkishTranslation: "Akşama doğru boş kasedeler ve gülümseyen yüzler gerçek mutluluğun samimi cömertlikten geldiğini kanıtladı. Leo tarif defterini yarının lezzetli maceralarına hazır halde ön tezgahın üzerine güvenle yerleştirdi.",
          words: { evening: "akşam", empty: "boş", bowls: "kaseler", smiling: "gülümseyen", faces: "yüzler", happiness: "mutluluk", generosity: "cömertlik", placed: "yerleştirdi", counter: "tezgah", ready: "hazır", tomorrow: "yarın", adventures: "maceralar" },
        }
      );
    } else {
      paragraphs.push({
        text: "When he served the delicious hot soup to the townspeople, everyone smiled with joy. Leo realized that true cooking is not only about ingredients, but about sharing love and patience.",
        turkishTranslation: "Kasaba halkına lezzetli sıcak çorbayı sunduğunda herkes sevinçle gülümsedi. Leo gerçek aşçılığın sadece malzemelerle değil, sevgi ve sabrı paylaşmakla ilgili olduğunu anladı.",
        words: { served: "sundu", delicious: "lezzetli", hot: "sıcak", soup: "çorba", townspeople: "kasaba halkı", everyone: "herkes", smiled: "gülümsedi", joy: "sevinç", realized: "fark etti", true: "gerçek", ingredients: "malzemeler", sharing: "paylaşma", love: "sevgi", patience: "sabır" },
      });
    }

    return {
      title: "The Secret Recipe in the Old Kitchen",
      titleTr: "Eski Mutfaktaki Gizli Tarif",
      summary: "A passionate cook discovers an ancient handwritten recipe book filled with heartwarming dishes.",
      summaryTr: "Tutkulu bir aşçı, içi iç ısıtan yemeklerle dolu el yazması kadim bir tarif kitabı keşfeder.",
      paragraphs,
      quiz: [
        {
          id: "q-1",
          question: "What did Leo find behind the pantry shelf?",
          options: ["A bronze box with an antique recipe notebook", "A bag of gold coins", "A broken clock", "A strange key"],
          correctIndex: 0,
          explanation: "Leo found a small bronze box containing an antique recipe notebook.",
        },
        {
          id: "q-2",
          question: "What did Leo learn about true cooking?",
          options: ["It requires expensive tools", "It is about sharing love, patience and generosity", "It should be done quickly", "It is very difficult"],
          correctIndex: 1,
          explanation: "Leo realized true cooking is about sharing love, patience and generosity with others.",
        },
      ],
    };
  }

  // 2. Default & Adaptive Narrative
  const cleanTitle = topic
    .split(" ")
    .slice(0, 5)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const baseParagraphs: FallbackParagraph[] = [
    {
      text: `In a peaceful historical town surrounded by gentle green hills, a curious person began an exciting new chapter. When ${topic.toLowerCase()} became the center of daily conversations, neighbors and travelers gathered near the town square to listen with keen interest.`,
      turkishTranslation: `Yeşil tepelerle çevrili huzurlu tarihi bir kasabada, meraklı bir kişi heyecan verici yeni bir döneme başladı. ${topic} günlük sohbetlerin merkezine oturduğunda, komşular ve gezginler büyük bir ilgiyle dinlemek için kasaba meydanında toplandılar.`,
      words: { peaceful: "huzurlu", historical: "tarihi", town: "kasaba", surrounded: "çevrili", hills: "tepeler", curious: "meraklı", exciting: "heyecan verici", center: "merkez", conversations: "sohbetler", neighbors: "komşular", travelers: "gezginler", gathered: "toplandı", square: "meydan", interest: "ilgi" },
    },
    {
      text: `As the morning hours passed gently, soft sunlight guided the travelers along the ancient stone pathways. Walking through the lively market, friendly shopkeepers shared helpful tips, warm smiles, and encouraging stories about past discoveries.`,
      turkishTranslation: `Sabah saatleri usulca geçerken, yumuşak güneş ışığı kadim taş patikalar boyunca yolculara rehberlik etti. Hareketli pazarda yürürken, dost canlısı dükkan sahipleri faydalı ipuçları, sıcak gülümsemeler ve geçmiş keşiflere dair cesaret verici hikayeler paylaştılar.`,
      words: { morning: "sabah", hours: "saatler", passed: "geçti", gently: "usulca", sunlight: "güneş ışığı", guided: "rehberlik etti", ancient: "kadim / antik", pathways: "yollar", lively: "hareketli / canlı", market: "pazar", shopkeepers: "dükkan sahipleri", helpful: "faydalı", tips: "ipuçları", smiles: "gülümsemeler", stories: "hikayeler", discoveries: "keşifler" },
    },
    {
      text: `Every step forward revealed new details about the town's rich heritage and creative spirit. People from different backgrounds worked together, exchanging ideas and building strong bonds of friendship through mutual cooperation.`,
      turkishTranslation: `İleriye atılan her adım, kasabanın zengin mirası ve yaratıcı ruhu hakkında yeni ayrıntılar ortaya çıkardı. Farklı geçmişlere sahip insanlar karşılıklı işbirliği yoluyla fikir alışverişinde bulunarak ve güçlü dostluk bağları kurarak birlikte çalıştılar.`,
      words: { step: "adım", forward: "ileri", revealed: "ortaya çıkardı", details: "ayrıntılar", heritage: "miras", creative: "yaratıcı", spirit: "ruh", backgrounds: "geçmişler", worked: "çalıştı", exchanging: "alışverişinde bulunarak", ideas: "fikirler", bonds: "bağlar", friendship: "dostluk", mutual: "karşılıklı", cooperation: "işbirliği" },
    },
  ];

  if (isExtended) {
    baseParagraphs.push(
      {
        text: `Later in the afternoon, they reached the old observatory located at the top of the hill. From this quiet viewpoint, the entire valley looked magnificent under the golden afternoon sky, showing the true harmony between nature and human endeavor.`,
        turkishTranslation: `Öğleden sonra tepenin zirvesinde bulunan eski gözlemevine ulaştılar. Bu sessiz bakış açısından tüm vadi, doğa ile insan emeği arasındaki gerçek uyumu sergileyerek altın sarısı öğleden sonra göğü altında muhteşem görünüyordu.`,
        words: { afternoon: "öğleden sonra", reached: "ulaştı", observatory: "gözlemevi", located: "bulunan", hill: "tepe", viewpoint: "bakış noktası", valley: "vadi", magnificent: "muhteşem", golden: "altın sarısı", harmony: "uyum", nature: "doğa", endeavor: "çaba / emek" },
      },
      {
        text: `By sunset, the memorable journey concluded with a sense of wonder and lasting gratitude. Looking back across the open horizon, everyone understood that learning and exploring with an open heart transforms ordinary moments into extraordinary wisdom.`,
        turkishTranslation: `Gün batımına doğru, unutulmaz yolculuk bir hayret duygusu ve kalıcı bir minnettarlıkla sona erdi. Uçsuz bucaksız ufka dönüp bakıldığında, açık bir kalple öğrenmenin ve keşfetmenin sıradan anları olağanüstü bir bilgeliğe dönüştürdüğünü herkes anladı.`,
        words: { sunset: "gün batımı", memorable: "unutulmaz", journey: "yolculuk", concluded: "sona erdi", wonder: "hayret", gratitude: "minnettarlık", horizon: "ufuk", understood: "anladı", exploring: "keşfetmek", transforms: "dönüştürür", moments: "anlar", extraordinary: "olağanüstü", wisdom: "bilgelik" },
      }
    );
  } else {
    baseParagraphs.push({
      text: `By sunset, the journey brought deep understanding and happiness. Looking back at the open road, it was clear that every great discovery begins with a single curious step and the courage to explore.`,
      turkishTranslation: `Gün batımına doğru yolculuk derin bir anlayış ve mutluluk getirdi. Açık yola dönüp bakıldığında, her büyük keşfin tek bir meraklı adımla ve keşfetme cesaretiyle başladığı açıktı.`,
      words: { sunset: "gün batımı", journey: "yolculuk", understanding: "anlayış", happiness: "mutluluk", discovery: "keşif", single: "tek bir", step: "adım", courage: "cesaret", explore: "keşfetmek" },
    });
  }

  return {
    title: cleanTitle || `The Secrets of ${category}`,
    titleTr: `${cleanTitle || category} Yolculuğu`,
    summary: `An inspiring ${category.toLowerCase()} narrative exploring ${topic} with graded CEFR ${level} language.`,
    summaryTr: `${topic} konusunu ${level} seviyesine uygun duru bir dille ele alan etkileyici bir ${category.toLowerCase()} hikayesi.`,
    paragraphs: baseParagraphs,
    quiz: [
      {
        id: "q-1",
        question: "Where did the people gather to discuss the news?",
        options: ["Near the town square", "Inside a dark cave", "At an airport gate", "Behind closed doors"],
        correctIndex: 0,
        explanation: "The story mentions people gathered near the town square with keen interest.",
      },
      {
        id: "q-2",
        question: "What conclusion was reached by sunset?",
        options: ["The journey was a mistake", "Great discoveries begin with curiosity and courage", "Everyone should leave the town", "It was too cold to stay outside"],
        correctIndex: 1,
        explanation: "The story concludes that great discoveries begin with curiosity and the courage to explore.",
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
  const narrative = buildAdaptiveFallbackStory(topic, level, category, targetWordCount);
  const slug = slugify(narrative.title) + `-${Date.now().toString().slice(-4)}`;

  const covers = CATEGORY_COVERS[category] || CATEGORY_COVERS.Mystery;
  const coverImage = covers[Math.floor(Math.random() * covers.length)];

  const structuredParagraphs = tokenizeParagraphs(narrative.paragraphs, level);
  const totalWords = structuredParagraphs.reduce((acc, p) => acc + p.tokens.length, 0);

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
    summary: narrative.summary,
    summaryTr: narrative.summaryTr,
    requiredVocabularyLevel: LEVEL_VOCAB_MAP[level] || 2,
    paragraphs: structuredParagraphs,
    quiz: narrative.quiz,
  };

  return enrichStoryTokens(rawStory);
}

/**
 * Converts raw paragraph texts into structured WordToken paragraphs
 */
function tokenizeParagraphs(
  rawParagraphs: Array<{
    id?: string;
    text?: string;
    turkishTranslation?: string;
    words?: Record<string, string>;
    tokens?: WordToken[];
  }>,
  storyLevel: CEFRLevel
): Paragraph[] {
  return rawParagraphs.map((p, idx) => {
    const pId = p.id || `p-${idx + 1}`;
    const trText = p.turkishTranslation || "";
    const wordsMap = p.words || {};

    if (Array.isArray(p.tokens) && p.tokens.length > 0) {
      return {
        id: pId,
        turkishTranslation: trText,
        tokens: p.tokens.map((t) => enrichWordToken(t, trText, storyLevel)),
      };
    }

    const rawWords = (p.text || "").trim().split(/\s+/).filter(Boolean);
    const tokens: WordToken[] = rawWords.map((w) => {
      const clean = cleanWordToken(w);
      // Find translation in wordsMap (case insensitive)
      let translationTr = "";
      if (wordsMap[w]) {
        translationTr = wordsMap[w];
      } else if (wordsMap[clean]) {
        translationTr = wordsMap[clean];
      } else if (wordsMap[clean.toLowerCase()]) {
        translationTr = wordsMap[clean.toLowerCase()];
      } else {
        const foundKey = Object.keys(wordsMap).find(
          (k) => k.toLowerCase() === clean.toLowerCase()
        );
        if (foundKey) translationTr = wordsMap[foundKey];
      }

      return enrichWordToken(
        {
          text: w,
          clean: clean || w,
          translationTr: translationTr || undefined,
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
        const targetParagraphs = Math.max(3, Math.min(8, Math.ceil(wordCount / 65)));
        const wordsPerParagraph = Math.round(wordCount / targetParagraphs);

        const prompt = `You are a world-class ESL author specializing in Stephen Krashen's 95% Comprehensible Input ($i+1$) graded readers for English learners.

Create an engaging, beautifully structured, CEFR ${level}-graded story based on this topic:
"${topic}"

CATEGORY: ${category}
TARGET CEFR LEVEL: ${level}

STRICT WORD COUNT & PARAGRAPH REQUIREMENTS:
1. TOTAL WORD COUNT: MUST be approximately ${wordCount} words (strict range: ${Math.round(wordCount * 0.9)} - ${Math.round(wordCount * 1.15)} words). DO NOT write a short summary!
2. EXACTLY ${targetParagraphs} PARAGRAPHS: You MUST generate exactly ${targetParagraphs} rich, detailed paragraphs.
3. PARAGRAPH LENGTH: Each of the ${targetParagraphs} paragraphs MUST contain approximately ${wordsPerParagraph} words (4 to 7 detailed sentences per paragraph).
4. CEFR ${level} CALIBRATION:
- For A1: Use simple present & past, 500 headwords, clear sentence structures.
- For A2: Everyday routines, past simple, common connectors (and, but, because, when, while, after).
- For B1: Descriptive narratives, compound sentences, intermediate vocabulary.
- For B2/C1: Rich atmosphere, nuanced vocabulary, idiomatic expressions.
5. PARAGRAPH TRANSLATIONS: For each of the ${targetParagraphs} paragraphs, provide the complete, fluent, and accurate Turkish translation.
6. VOCABULARY MAPPING: For each paragraph, provide a "words" object with Turkish translations for words in that paragraph. Example: {"kitchen": "mutfak", "chef": "şef / aşçı"}.
7. COMPREHENSION QUIZ: Provide 2 multiple-choice comprehension questions with 4 options each, correctIndex (0-3), and clear explanation.
8. Return ONLY a valid JSON object (no markdown backticks, no conversational text).

JSON STRUCTURE:
{
  "title": "Engaging Title in English",
  "titleTr": "Akıcı ve Doğal Türkçe Başlık",
  "slug": "kebab-case-title-slug",
  "summary": "1-2 sentence English summary capturing the story arc.",
  "summaryTr": "1-2 cümlelik akıcı Türkçe hikaye özeti.",
  "paragraphs": [
    {
      "id": "p-1",
      "text": "First detailed paragraph text (${wordsPerParagraph} words)...",
      "turkishTranslation": "Birinci paragrafın eksiksiz ve akıcı Türkçe çevirisi...",
      "words": {
        "Every": "Her",
        "morning": "sabah"
      }
    }
  ],
  "quiz": [
    {
      "id": "q-1",
      "question": "Comprehension question 1?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct."
    },
    {
      "id": "q-2",
      "question": "Comprehension question 2?",
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
                  maxOutputTokens: 8192,
                },
              }),
              signal: AbortSignal.timeout(25000),
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

    // High quality adaptive Fallback Generator
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
