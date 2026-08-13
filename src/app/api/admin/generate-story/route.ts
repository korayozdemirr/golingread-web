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
function buildAdaptiveFallbackStory(topic: string, level: CEFRLevel, category: StoryCategory): FallbackNarrative {
  const lower = topic.toLowerCase();

  // 1. Food / Cooking Theme
  if (lower.includes("cook") || lower.includes("chef") || lower.includes("kitchen") || lower.includes("food") || lower.includes("restaurant") || lower.includes("soup") || lower.includes("bread") || lower.includes("tea") || lower.includes("coffee")) {
    return {
      title: "The Secret Recipe in the Old Kitchen",
      titleTr: "Eski Mutfaktaki Gizli Tarif",
      summary: "A passionate cook discovers an ancient handwritten recipe book filled with heartwarming dishes.",
      summaryTr: "Tutkulu bir aşçı, içi iç ısıtan yemeklerle dolu el yazması kadim bir tarif kitabı keşfeder.",
      paragraphs: [
        {
          text: "Every morning, the quiet kitchen smelled of fresh bread and warm spices. Leo loved preparing simple meals using garden vegetables and olive oil for his neighbors.",
          turkishTranslation: "Her sabah, sessiz mutfak taze ekmek ve ılık baharat kokardı. Leo, komşuları için bahçe sebzeleri ve zeytinyağı kullanarak basit yemekler hazırlamayı çok severdi.",
          words: { Every: "Her", morning: "sabah", quiet: "sessiz", kitchen: "mutfak", smelled: "kokardı", fresh: "taze", bread: "ekmek", warm: "ılık", spices: "baharatlar", loved: "severdi", preparing: "hazırlamayı", simple: "basit", meals: "yemekler", using: "kullanarak", garden: "bahçe", vegetables: "sebzeler", olive: "zeytin", oil: "yağ", neighbors: "komşular" },
        },
        {
          text: "One rainy afternoon, he found a small wooden box behind the pantry shelf. Inside lay an old notebook filled with golden notes about cooking with patience and kindness.",
          turkishTranslation: "Yağmurlu bir öğleden sonra, kiler rafının arkasında küçük ahşap bir kutu buldu. İçinde sabır ve nezaketle yemek pişirmeye dair altın notlarla dolu eski bir defter vardı.",
          words: { rainy: "yağmurlu", afternoon: "öğleden sonra", found: "buldu", small: "küçük", wooden: "ahşap", box: "kutu", behind: "arkasında", shelf: "raf", Inside: "içeride", notebook: "defter", filled: "dolu", golden: "altın", notes: "notlar", cooking: "yemek pişirme", patience: "sabır", kindness: "nezaket" },
        },
        {
          text: "When he served the delicious hot soup to the townspeople, everyone smiled with joy. Leo realized that true cooking is not only about ingredients, but about sharing love.",
          turkishTranslation: "Kasaba halkına lezzetli sıcak çorbayı sunduğunda herkes sevinçle gülümsedi. Leo gerçek aşçılığın sadece malzemelerle değil, sevgiyi paylaşmakla ilgili olduğunu anladı.",
          words: { served: "sundu / ikram etti", delicious: "lezzetli", hot: "sıcak", soup: "çorba", townspeople: "kasaba halkı", everyone: "herkes", smiled: "gülümsedi", joy: "sevinç", realized: "fark etti", true: "gerçek", ingredients: "malzemeler", sharing: "paylaşma", love: "sevgi" },
        },
      ],
      quiz: [
        {
          id: "q-1",
          question: "What did Leo find behind the pantry shelf?",
          options: ["A wooden box with an old recipe notebook", "A bag of gold coins", "A broken clock", "A strange key"],
          correctIndex: 0,
          explanation: "Leo found a small wooden box containing an old notebook with cooking notes.",
        },
        {
          id: "q-2",
          question: "What did Leo learn about true cooking?",
          options: ["It requires expensive tools", "It is about sharing love and patience", "It should be done quickly", "It is very difficult"],
          correctIndex: 1,
          explanation: "Leo realized true cooking is about sharing love and patience with others.",
        },
      ],
    };
  }

  // 2. Travel & Airport Theme
  if (lower.includes("airport") || lower.includes("flight") || lower.includes("plane") || lower.includes("travel") || lower.includes("journey") || lower.includes("train") || lower.includes("station") || lower.includes("city")) {
    return {
      title: "The Traveler and the Morning Flight",
      titleTr: "Gezgin ve Sabah Uçuşu",
      summary: "A curious traveler arrives at a busy airport terminal ready for a journey of discovery.",
      summaryTr: "Meraklı bir gezgin, keşif dolu bir yolculuğa hazır halde kalabalık bir havalimanı terminaline varır.",
      paragraphs: [
        {
          text: "Early in the morning, the wide airport terminal woke up with bright lights and gentle music. Passengers held their tickets and waited patiently near the departure gate.",
          turkishTranslation: "Sabahın erken saatlerinde, geniş havalimanı terminali parlak ışıklar ve hafif bir müzikle uyandı. Yolcular biletlerini tuttu ve kalkış kapısının yanında sabırla beklediler.",
          words: { Early: "Erkenden", morning: "sabah", wide: "geniş", airport: "havalimanı", terminal: "terminal", bright: "parlak", lights: "ışıklar", gentle: "hafif / nazik", music: "müzik", Passengers: "Yolcular", held: "tuttu", tickets: "biletler", waited: "bekledi", departure: "kalkış", gate: "kapı" },
        },
        {
          text: "When the airplane arrived at the runway, the pilot announced that boarding was ready. Looking through the clean window, the traveler saw the rising sun over the clouds.",
          turkishTranslation: "Uçak piste yanaştığında pilot uçağa binişin hazır olduğunu duyurdu. Temiz pencereden bakan gezgin, bulutların üzerindeki doğan güneşi gördü.",
          words: { airplane: "uçak", arrived: "vardı", runway: "pist", pilot: "pilot", announced: "duyurdu", boarding: "biniş", ready: "hazır", window: "pencere", traveler: "gezgin", rising: "doğan", sun: "güneş", clouds: "bulutlar" },
        },
        {
          text: "By evening, the plane landed safely in a new city. Walking down the stone streets with a happy heart, the traveler knew that every destination brings unforgettable memories.",
          turkishTranslation: "Akşama doğru uçak yeni bir şehre güvenle indi. Mutlu bir kalple taş sokaklarda yürürken, gezgin her varış noktasının unutulmaz anılar getirdiğini biliyordu.",
          words: { evening: "akşam", plane: "uçak", landed: "indi", safely: "güvenle", city: "şehir", Walking: "yürüyerek", streets: "sokaklar", happy: "mutlu", heart: "kalp", destination: "varış noktası", unforgettable: "unutulmaz", memories: "anılar" },
        },
      ],
      quiz: [
        {
          id: "q-1",
          question: "Where were the passengers waiting in the morning?",
          options: ["Near the departure gate", "In a train station", "Outside on the street", "At a coffee shop"],
          correctIndex: 0,
          explanation: "The passengers waited near the departure gate for the boarding announcement.",
        },
        {
          id: "q-2",
          question: "What did the traveler see through the window?",
          options: ["Rainstorm", "The rising sun over the clouds", "A dark forest", "A tall mountain"],
          correctIndex: 1,
          explanation: "The traveler saw the rising sun over the clouds through the clean window.",
        },
      ],
    };
  }

  // 3. Mystery & Detective Theme
  if (lower.includes("detective") || lower.includes("mystery") || lower.includes("secret") || lower.includes("lost") || lower.includes("clock") || lower.includes("key") || lower.includes("door") || lower.includes("room")) {
    return {
      title: "The Mystery of the Hidden Key",
      titleTr: "Gizli Anahtarın Sırrı",
      summary: "A quiet apprentice discovers an antique locked chest with clues leading across the old town.",
      summaryTr: "Sakin bir çırak, eski kasabanın dört bir yanına uzanan ipuçlarıyla kilitli antika bir sandık keşfeder.",
      paragraphs: [
        {
          text: "In the quiet corner of an old antique shop, Leo discovered a small bronze key hidden beneath an ancient wooden clock. The key had strange letters carved into its smooth surface.",
          turkishTranslation: "Eski bir antika dükkanının sessiz köşesinde Leo, kadim bir ahşap saatin altına gizlenmiş küçük bronz bir anahtar keşfetti. Anahtarın pürüzsüz yüzeyine garip harfler kazınmıştı.",
          words: { quiet: "sessiz", corner: "köşe", antique: "antika", shop: "dükkan", discovered: "keşfetti", small: "küçük", bronze: "bronz", key: "anahtar", hidden: "gizli / saklanmış", clock: "saat", strange: "garip", letters: "harfler", surface: "yüzey" },
        },
        {
          text: "He carefully followed the clues written in an old diary found inside the workshop desk. Each step led him through narrow stone paths toward the historical library tower.",
          turkishTranslation: "Atölye masasının içinde bulunan eski bir günlükte yazılı ipuçlarını dikkatle takip etti. Her adım onu dar taş yollardan tarihi kütüphane kulesine doğru yönlendirdi.",
          words: { carefully: "dikkatle", followed: "takip etti", clues: "ipuçları", diary: "günlük", workshop: "atölye", desk: "çalışma masası", narrow: "dar", paths: "patikalar / yollar", library: "kütüphane", tower: "kule" },
        },
        {
          text: "When he opened the iron door at the top of the tower, soft sunlight revealed a collection of forgotten maps and peaceful paintings of the ancient world.",
          turkishTranslation: "Kulenin tepesindeki demir kapıyı açtığında, yumuşak güneş ışığı antik dünyanın unutulmuş haritaları ve huzurlu tablolarından oluşan bir koleksiyonu aydınlattı.",
          words: { opened: "açtı", iron: "demir", door: "kapı", tower: "kule", sunlight: "güneş ışığı", revealed: "ortaya çıkardı", maps: "haritalar", paintings: "tablolar", ancient: "antik / kadim", world: "dünya" },
        },
      ],
      quiz: [
        {
          id: "q-1",
          question: "Where did Leo find the bronze key?",
          options: ["Beneath an ancient wooden clock", "In a river", "Under his bed", "At the train station"],
          correctIndex: 0,
          explanation: "Leo found the small bronze key beneath an ancient wooden clock in the antique shop.",
        },
        {
          id: "q-2",
          question: "What was discovered behind the iron door?",
          options: ["Gold coins", "Forgotten maps and paintings", "A locked box", "An empty room"],
          correctIndex: 1,
          explanation: "Opening the iron door revealed forgotten maps and peaceful paintings of the ancient world.",
        },
      ],
    };
  }

  // 4. Default Coherent Narrative (Adaptive to Topic)
  const cleanTitle = topic
    .split(" ")
    .slice(0, 5)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: cleanTitle || `The Secrets of ${category}`,
    titleTr: `${cleanTitle || category} Yolculuğu`,
    summary: `An inspiring ${category.toLowerCase()} narrative exploring ${topic} with graded CEFR ${level} language.`,
    summaryTr: `${topic} konusunu ${level} seviyesine uygun duru bir dille ele alan etkileyici bir ${category.toLowerCase()} hikayesi.`,
    paragraphs: [
      {
        text: `In a peaceful town surrounded by green hills, a curious person began an exciting new chapter. When ${topic.toLowerCase()} became the center of daily conversations, everyone gathered to listen with wonder.`,
        turkishTranslation: `Yeşil tepelerle çevrili huzurlu bir kasabada, meraklı bir kişi heyecan verici yeni bir döneme başladı. ${topic} günlük sohbetlerin merkezine oturduğunda, herkes merakla dinlemek için toplandı.`,
        words: { peaceful: "huzurlu", town: "kasaba", surrounded: "çevrili", hills: "tepeler", curious: "meraklı", exciting: "heyecan verici", center: "merkez", conversations: "sohbetler", gathered: "toplandı", wonder: "hayret / merak" },
      },
      {
        text: `As the days passed gently, soft light guided the travelers along the stone pathway. Walking through the colorful market, friendly neighbors shared warm smiles and encouraging words.`,
        turkishTranslation: `Günler usulca geçerken, yumuşak ışık taş yol boyunca yolculara rehberlik etti. Renkli pazarda yürürken, dost canlısı komşular sıcak gülümsemeler ve cesaret verici sözler paylaştılar.`,
        words: { passed: "geçti", gently: "usulca / nazikçe", guided: "rehberlik etti", pathway: "yol", market: "pazar", neighbors: "komşular", smiles: "gülümsemeler", encouraging: "cesaret verici" },
      },
      {
        text: `By sunset, the journey brought deep understanding and happiness. Looking back at the open road, it was clear that every great discovery begins with a single curious step.`,
        turkishTranslation: `Gün batımına doğru yolculuk derin bir anlayış ve mutluluk getirdi. Açık yola dönüp bakıldığında, her büyük keşfin tek bir meraklı adımla başladığı açıktı.`,
        words: { sunset: "gün batımı", journey: "yolculuk", understanding: "anlayış", happiness: "mutluluk", discovery: "keşif", single: "tek bir", step: "adım" },
      },
    ],
    quiz: [
      {
        id: "q-1",
        question: "How did the neighbors react in the market?",
        options: ["They shared warm smiles and encouraging words", "They were angry", "They closed all the doors", "Nobody spoke"],
        correctIndex: 0,
        explanation: "The story states that friendly neighbors shared warm smiles and encouraging words in the colorful market.",
      },
      {
        id: "q-2",
        question: "What conclusion was reached by sunset?",
        options: ["The journey was too long", "Every great discovery begins with a single curious step", "The town was forgotten", "It started raining"],
        correctIndex: 1,
        explanation: "The story concludes that every great discovery begins with a single curious step.",
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
  const narrative = buildAdaptiveFallbackStory(topic, level, category);
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
        const prompt = `You are a world-class ESL author specializing in Stephen Krashen's 95% Comprehensible Input ($i+1$) graded readers for English learners.

Create an engaging, beautifully structured, CEFR ${level}-graded story based on this topic:
"${topic}"

CATEGORY: ${category}
TARGET CEFR LEVEL: ${level}
TARGET WORD COUNT: Around ${wordCount} words (distributed across 3 engaging paragraphs).

RULES FOR CEFR ${level}:
- For A1: Use simple present & past, 500 headwords, short sentences (6-10 words).
- For A2: Everyday routines, past simple, common connectors (and, but, because, when), sentences (8-14 words).
- For B1: Descriptive narratives, compound sentences, intermediate vocabulary.
- For B2/C1: Rich atmosphere, nuanced vocabulary, idiomatic expressions.

CRITICAL INSTRUCTIONS:
1. Write a complete, coherent, engaging story strictly relevant to "${topic}".
2. For each paragraph, provide a natural and complete Turkish translation.
3. For each paragraph, provide a "words" JSON dictionary mapping English words to their natural Turkish translation in this specific story context. Example: {"kitchen": "mutfak", "chef": "şef / aşçı", "delicious": "lezzetli"}.
4. Provide 2 comprehension quiz questions with 4 options each, correctIndex (0-3), and clear explanation.
5. Return ONLY a valid JSON object (no markdown backticks, no conversational text).

JSON STRUCTURE:
{
  "title": "Engaging Catchy Title in English",
  "titleTr": "Akıcı ve Doğal Türkçe Başlık",
  "slug": "kebab-case-title-slug",
  "summary": "1-2 sentence English summary capturing the essence of the story.",
  "summaryTr": "1-2 cümlelik akıcı ve etkileyici Türkçe hikaye özeti.",
  "paragraphs": [
    {
      "id": "p-1",
      "text": "Full natural English paragraph text here...",
      "turkishTranslation": "Paragrafın eksiksiz ve akıcı Türkçe çevirisi...",
      "words": {
        "Every": "Her",
        "morning": "sabah"
      }
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
      "question": "Second question in English?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "explanation": "Explanation for the correct answer."
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
                  maxOutputTokens: 2500,
                },
              }),
              signal: AbortSignal.timeout(20000),
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
