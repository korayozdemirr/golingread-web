import { Story } from "@/types";

export const MOCK_STORIES: Story[] = [
  {
    id: "story-1",
    title: "The Whispering Library",
    titleTr: "Fısıldayan Kütüphane",
    slug: "the-whispering-library",
    level: "A2",
    category: "Mystery",
    readTimeMinutes: 4,
    wordCount: 148,
    coverImage: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    summary: "Leo discovers an ancient locked room in the town library where books seem to talk in quiet murmurs.",
    summaryTr: "Leo, kasaba kütüphanesinde kitapların fısıltıyla konuştuğu kadim, kilitli bir oda keşfeder.",
    requiredVocabularyLevel: 2, // A2
    featured: true,
    paragraphs: [
      {
        id: "p1-1",
        tokens: [
          { text: "Leo", clean: "Leo", translationTr: "Leo (Özel İsim)", ipa: "/ˈliː.oʊ/", partOfSpeech: "noun", level: "A1" },
          { text: "loved", clean: "loved", translationTr: "severdi / çok beğenirdi", ipa: "/lʌvd/", partOfSpeech: "verb", level: "A1" },
          { text: "spending", clean: "spending", translationTr: "vakit geçirmeyi", ipa: "/ˈspen.dɪŋ/", partOfSpeech: "verb", level: "A2" },
          { text: "his", clean: "his", translationTr: "onun / kendi", ipa: "/hɪz/", partOfSpeech: "pron", level: "A1" },
          { text: "rainy", clean: "rainy", translationTr: "yağmurlu", ipa: "/ˈreɪ.ni/", partOfSpeech: "adj", level: "A1" },
          { text: "afternoons", clean: "afternoons", translationTr: "öğleden sonraları", ipa: "/ˌæf.tɚˈnuːnz/", partOfSpeech: "noun", level: "A1" },
          { text: "in", clean: "in", translationTr: "içinde / -de", ipa: "/ɪn/", partOfSpeech: "prep", level: "A1" },
          { text: "the", clean: "the", translationTr: "belirli artikel", ipa: "/ðə/", partOfSpeech: "det", level: "A1" },
          { text: "old", clean: "old", translationTr: "eski / yaşlı", ipa: "/oʊld/", partOfSpeech: "adj", level: "A1" },
          { text: "town", clean: "town", translationTr: "kasaba", ipa: "/taʊn/", partOfSpeech: "noun", level: "A1" },
          { text: "library.", clean: "library", translationTr: "kütüphane", ipa: "/ˈlaɪ.brər.i/", partOfSpeech: "noun", level: "A1" },
          { text: "The", clean: "The", translationTr: "belirli artikel", ipa: "/ðə/", partOfSpeech: "det", level: "A1" },
          { text: "building", clean: "building", translationTr: "bina / yapı", ipa: "/ˈbɪl.dɪŋ/", partOfSpeech: "noun", level: "A2" },
          { text: "smelled", clean: "smelled", translationTr: "kokuyordu", ipa: "/smeld/", partOfSpeech: "verb", level: "A2" },
          { text: "like", clean: "like", translationTr: "gibi", ipa: "/laɪk/", partOfSpeech: "prep", level: "A1" },
          { text: "warm", clean: "warm", translationTr: "sıcak / ılık", ipa: "/wɔːrm/", partOfSpeech: "adj", level: "A1" },
          { text: "cinnamon", clean: "cinnamon", translationTr: "tarçın", ipa: "/ˈsɪn.ə.mən/", partOfSpeech: "noun", level: "B1", exampleSentence: "A sprinkle of cinnamon makes the coffee smell sweet." },
          { text: "and", clean: "and", translationTr: "ve", ipa: "/ænd/", partOfSpeech: "conj", level: "A1" },
          { text: "aged", clean: "aged", translationTr: "yıllanmış / eskimiş", ipa: "/eɪdʒd/", partOfSpeech: "adj", level: "B1" },
          { text: "paper.", clean: "paper", translationTr: "kağıt", ipa: "/ˈpeɪ.pɚ/", partOfSpeech: "noun", level: "A1" },
        ],
        turkishTranslation: "Leo, yağmurlu öğleden sonralarını kasabanın eski kütüphanesinde geçirmeyi çok severdi. Bina sıcak tarçın ve yıllanmış kağıt gibi kokardı.",
      },
      {
        id: "p1-2",
        tokens: [
          { text: "One", clean: "One", translationTr: "Bir", ipa: "/wʌn/", partOfSpeech: "det", level: "A1" },
          { text: "Tuesday,", clean: "Tuesday", translationTr: "Salı günü", ipa: "/ˈtuːz.deɪ/", partOfSpeech: "noun", level: "A1" },
          { text: "he", clean: "he", translationTr: "o", ipa: "/hiː/", partOfSpeech: "pron", level: "A1" },
          { text: "noticed", clean: "noticed", translationTr: "fark etti", ipa: "/ˈnoʊ.tɪst/", partOfSpeech: "verb", level: "A2" },
          { text: "a", clean: "a", translationTr: "bir", ipa: "/ə/", partOfSpeech: "det", level: "A1" },
          { text: "narrow", clean: "narrow", translationTr: "dar", ipa: "/ˈner.oʊ/", partOfSpeech: "adj", level: "A2" },
          { text: "wooden", clean: "wooden", translationTr: "ahşap / tahta", ipa: "/ˈwʊd.ən/", partOfSpeech: "adj", level: "A2" },
          { text: "door", clean: "door", translationTr: "kapı", ipa: "/dɔːr/", partOfSpeech: "noun", level: "A1" },
          { text: "behind", clean: "behind", translationTr: "arkasında", ipa: "/bɪˈhaɪnd/", partOfSpeech: "prep", level: "A1" },
          { text: "the", clean: "the", translationTr: "belirli artikel", ipa: "/ðə/", partOfSpeech: "det", level: "A1" },
          { text: "history", clean: "history", translationTr: "tarih", ipa: "/ˈhɪs.tər.i/", partOfSpeech: "noun", level: "A1" },
          { text: "section.", clean: "section", translationTr: "bölüm / reyon", ipa: "/ˈsek.ʃən/", partOfSpeech: "noun", level: "A2" },
          { text: "The", clean: "The", translationTr: "belirli artikel", ipa: "/ðə/", partOfSpeech: "det", level: "A1" },
          { text: "door", clean: "door", translationTr: "kapı", ipa: "/dɔːr/", partOfSpeech: "noun", level: "A1" },
          { text: "was", clean: "was", translationTr: "idi", ipa: "/wɑːz/", partOfSpeech: "verb", level: "A1" },
          { text: "slightly", clean: "slightly", translationTr: "hafifçe / birazcık", ipa: "/ˈslaɪt.li/", partOfSpeech: "adv", level: "B1", exampleSentence: "She smiled slightly when she heard the news." },
          { text: "open,", clean: "open", translationTr: "açık / aralık", ipa: "/ˈoʊ.pən/", partOfSpeech: "adj", level: "A1" },
          { text: "and", clean: "and", translationTr: "ve", ipa: "/ænd/", partOfSpeech: "conj", level: "A1" },
          { text: "a", clean: "a", translationTr: "bir", ipa: "/ə/", partOfSpeech: "det", level: "A1" },
          { text: "soft", clean: "soft", translationTr: "yumuşak / hafif", ipa: "/sɑːft/", partOfSpeech: "adj", level: "A1" },
          { text: "whisper", clean: "whisper", translationTr: "fısıltı", ipa: "/ˈwɪs.pɚ/", partOfSpeech: "noun", level: "B1", exampleSentence: "He spoke in a quiet whisper." },
          { text: "called", clean: "called", translationTr: "çağırdı / seslendi", ipa: "/kɔːld/", partOfSpeech: "verb", level: "A1" },
          { text: "out", clean: "out", translationTr: "dışarıya doğru", ipa: "/aʊt/", partOfSpeech: "adv", level: "A1" },
          { text: "from", clean: "from", translationTr: "-den / -dan", ipa: "/frʌm/", partOfSpeech: "prep", level: "A1" },
          { text: "the", clean: "the", translationTr: "belirli artikel", ipa: "/ðə/", partOfSpeech: "det", level: "A1" },
          { text: "darkness.", clean: "darkness", translationTr: "karanlık", ipa: "/ˈdɑːrk.nəs/", partOfSpeech: "noun", level: "A2" },
        ],
        turkishTranslation: "Bir salı günü, tarih bölümünün arkasında dar ahşap bir kapı fark etti. Kapı hafifçe aralıktı ve karanlığın içinden yumuşak bir fısıltı seslendi.",
      },
      {
        id: "p1-3",
        tokens: [
          { text: "Inside,", clean: "Inside", translationTr: "İçeride", ipa: "/ɪnˈsaɪd/", partOfSpeech: "adv", level: "A1" },
          { text: "hundreds", clean: "hundreds", translationTr: "yüzlerce", ipa: "/ˈhʌn.drədz/", partOfSpeech: "noun", level: "A2" },
          { text: "of", clean: "of", translationTr: "-in / -ın", ipa: "/ʌv/", partOfSpeech: "prep", level: "A1" },
          { text: "glowing", clean: "glowing", translationTr: "ışıldayan / parıldayan", ipa: "/ˈɡloʊ.ɪŋ/", partOfSpeech: "adj", level: "B1", exampleSentence: "The glowing lamp illuminated the tiny room." },
          { text: "books", clean: "books", translationTr: "kitaplar", ipa: "/bʊks/", partOfSpeech: "noun", level: "A1" },
          { text: "floated", clean: "floated", translationTr: "havada süzülüyordu", ipa: "/ˈfloʊ.tɪd/", partOfSpeech: "verb", level: "B1", exampleSentence: "The paper boat floated gently down the stream." },
          { text: "gently", clean: "gently", translationTr: "nazikçe / sakince", ipa: "/ˈdʒent.li/", partOfSpeech: "adv", level: "A2" },
          { text: "above", clean: "above", translationTr: "üzerinde", ipa: "/əˈbʌv/", partOfSpeech: "prep", level: "A2" },
          { text: "the", clean: "the", translationTr: "belirli artikel", ipa: "/ðə/", partOfSpeech: "det", level: "A1" },
          { text: "floor.", clean: "floor", translationTr: "zemin / döşeme", ipa: "/flɔːr/", partOfSpeech: "noun", level: "A1" },
          { text: "Leo", clean: "Leo", translationTr: "Leo", ipa: "/ˈliː.oʊ/", partOfSpeech: "noun", level: "A1" },
          { text: "stepped", clean: "stepped", translationTr: "adım attı", ipa: "/stept/", partOfSpeech: "verb", level: "A2" },
          { text: "forward", clean: "forward", translationTr: "öne doğru", ipa: "/ˈfɔːr.wɚd/", partOfSpeech: "adv", level: "A2" },
          { text: "and", clean: "and", translationTr: "ve", ipa: "/ænd/", partOfSpeech: "conj", level: "A1" },
          { text: "reached", clean: "reached", translationTr: "uzandı / ulaştı", ipa: "/riːtʃt/", partOfSpeech: "verb", level: "A2" },
          { text: "for", clean: "for", translationTr: "için / -e doğru", ipa: "/fɔːr/", partOfSpeech: "prep", level: "A1" },
          { text: "the", clean: "the", translationTr: "belirli artikel", ipa: "/ðə/", partOfSpeech: "det", level: "A1" },
          { text: "brightest", clean: "brightest", translationTr: "en parlak", ipa: "/ˈbraɪ.tɪst/", partOfSpeech: "adj", level: "A2" },
          { text: "one.", clean: "one", translationTr: "olanı", ipa: "/wʌn/", partOfSpeech: "pron", level: "A1" },
        ],
        turkishTranslation: "İçeride, yüzlerce parıldayan kitap zeminin üzerinde sakince havada süzülüyordu. Leo öne doğru bir adım attı ve en parlak olana doğru uzandı.",
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "Where did Leo spend his rainy afternoons?",
        options: ["In a coffee shop", "In the town library", "At the city museum", "In his backyard"],
        correctIndex: 1,
        explanation: "The story states that Leo loved spending his rainy afternoons in the old town library.",
      },
      {
        id: "q2",
        question: "What were the books doing inside the secret room?",
        options: ["Burning quietly", "Floating gently above the floor", "Falling off the shelves", "Singing loudly"],
        correctIndex: 1,
        explanation: "The text explains that 'hundreds of glowing books floated gently above the floor.'",
      },
    ],
  },
  {
    id: "story-2",
    title: "A Morning in Kyoto",
    titleTr: "Kyoto'da Bir Sabah",
    slug: "a-morning-in-kyoto",
    level: "A1",
    category: "Daily Life",
    readTimeMinutes: 3,
    wordCount: 110,
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    summary: "Follow Kenji as he walks through bamboo forests and enjoys hot green tea at sunrise.",
    summaryTr: "Kenji'nin bambu ormanlarında yürüyüşünü ve gün doğumunda sıcak yeşil çayını yudumlamasını takip edin.",
    requiredVocabularyLevel: 1, // A1
    featured: false,
    paragraphs: [
      {
        id: "p2-1",
        tokens: [
          { text: "The", clean: "The", translationTr: "belirli artikel", ipa: "/ðə/", partOfSpeech: "det", level: "A1" },
          { text: "sun", clean: "sun", translationTr: "güneş", ipa: "/sʌn/", partOfSpeech: "noun", level: "A1" },
          { text: "rises", clean: "rises", translationTr: "doğar / yükselir", ipa: "/ˈraɪ.zɪz/", partOfSpeech: "verb", level: "A1" },
          { text: "slowly", clean: "slowly", translationTr: "yavaşça", ipa: "/ˈsloʊ.li/", partOfSpeech: "adv", level: "A1" },
          { text: "over", clean: "over", translationTr: "üzerinde", ipa: "/ˈoʊ.vɚ/", partOfSpeech: "prep", level: "A1" },
          { text: "the", clean: "the", translationTr: "belirli artikel", ipa: "/ðə/", partOfSpeech: "det", level: "A1" },
          { text: "green", clean: "green", translationTr: "yeşil", ipa: "/ɡriːn/", partOfSpeech: "adj", level: "A1" },
          { text: "mountains.", clean: "mountains", translationTr: "dağlar", ipa: "/ˈmaʊn.tənz/", partOfSpeech: "noun", level: "A1" },
          { text: "Kenji", clean: "Kenji", translationTr: "Kenji", ipa: "/ˈken.dʒi/", partOfSpeech: "noun", level: "A1" },
          { text: "wakes", clean: "wakes", translationTr: "uyanır", ipa: "/weɪks/", partOfSpeech: "verb", level: "A1" },
          { text: "up", clean: "up", translationTr: "yukarı / uyanmak (phrasal)", ipa: "/ʌp/", partOfSpeech: "prep", level: "A1" },
          { text: "early", clean: "early", translationTr: "erken", ipa: "/ˈɝː.li/", partOfSpeech: "adv", level: "A1" },
          { text: "every", clean: "every", translationTr: "her", ipa: "/ˈev.ri/", partOfSpeech: "det", level: "A1" },
          { text: "day.", clean: "day", translationTr: "gün", ipa: "/deɪ/", partOfSpeech: "noun", level: "A1" },
        ],
        turkishTranslation: "Güneş yeşil dağların üzerinden yavaşça doğar. Kenji her gün erken uyanır.",
      },
      {
        id: "p2-2",
        tokens: [
          { text: "He", clean: "He", translationTr: "O", ipa: "/hiː/", partOfSpeech: "pron", level: "A1" },
          { text: "makes", clean: "makes", translationTr: "yapar / hazırlar", ipa: "/meɪks/", partOfSpeech: "verb", level: "A1" },
          { text: "a", clean: "a", translationTr: "bir", ipa: "/ə/", partOfSpeech: "det", level: "A1" },
          { text: "cup", clean: "cup", translationTr: "fincan", ipa: "/kʌp/", partOfSpeech: "noun", level: "A1" },
          { text: "of", clean: "of", translationTr: "-in / -den oluşan", ipa: "/ʌv/", partOfSpeech: "prep", level: "A1" },
          { text: "warm", clean: "warm", translationTr: "ılık / sıcak", ipa: "/wɔːrm/", partOfSpeech: "adj", level: "A1" },
          { text: "green", clean: "green", translationTr: "yeşil", ipa: "/ɡriːn/", partOfSpeech: "adj", level: "A1" },
          { text: "tea.", clean: "tea", translationTr: "çay", ipa: "/tiː/", partOfSpeech: "noun", level: "A1" },
          { text: "Then,", clean: "Then", translationTr: "Sonra / Ardından", ipa: "/ðen/", partOfSpeech: "adv", level: "A1" },
          { text: "he", clean: "he", translationTr: "o", ipa: "/hiː/", partOfSpeech: "pron", level: "A1" },
          { text: "walks", clean: "walks", translationTr: "yürür", ipa: "/wɔːks/", partOfSpeech: "verb", level: "A1" },
          { text: "along", clean: "along", translationTr: "boyunca", ipa: "/əˈlɑːŋ/", partOfSpeech: "prep", level: "A2" },
          { text: "the", clean: "the", translationTr: "belirli artikel", ipa: "/ðə/", partOfSpeech: "det", level: "A1" },
          { text: "peaceful", clean: "peaceful", translationTr: "huzurlu / sakin", ipa: "/ˈpiːs.fəl/", partOfSpeech: "adj", level: "A2", exampleSentence: "The garden was very peaceful in the morning." },
          { text: "river.", clean: "river", translationTr: "nehir / ırmak", ipa: "/ˈrɪv.ɚ/", partOfSpeech: "noun", level: "A1" },
        ],
        turkishTranslation: "Bir fincan sıcak yeşil çay hazırlar. Ardından, huzurlu nehir boyunca yürür.",
      },
    ],
    quiz: [
      {
        id: "q2-1",
        question: "What does Kenji drink in the morning?",
        options: ["Black coffee", "Warm green tea", "Orange juice", "Fresh milk"],
        correctIndex: 1,
        explanation: "The story states that Kenji makes a cup of warm green tea.",
      },
    ],
  },
  {
    id: "story-3",
    title: "The Clockwork Forest",
    titleTr: "Saat Düzenekli Orman",
    slug: "the-clockwork-forest",
    level: "B1",
    category: "Sci-Fi",
    readTimeMinutes: 5,
    wordCount: 175,
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    summary: "In a world made of brass and gears, an engineer named Clara investigates why the metallic trees stopped ticking.",
    summaryTr: "Pirinç ve dişlilerden oluşan bir dünyada mühendis Clara, metalik ağaçların neden tıkırtısını durdurduğunu araştırır.",
    requiredVocabularyLevel: 3, // B1
    featured: true,
    paragraphs: [
      {
        id: "p3-1",
        tokens: [
          { text: "The", clean: "The", translationTr: "belirli artikel", ipa: "/ðə/", partOfSpeech: "det", level: "A1" },
          { text: "trees", clean: "trees", translationTr: "ağaçlar", ipa: "/triːz/", partOfSpeech: "noun", level: "A1" },
          { text: "in", clean: "in", translationTr: "içinde", ipa: "/ɪn/", partOfSpeech: "prep", level: "A1" },
          { text: "the", clean: "the", translationTr: "belirli artikel", ipa: "/ðə/", partOfSpeech: "det", level: "A1" },
          { text: "valley", clean: "valley", translationTr: "vadi", ipa: "/ˈvæl.i/", partOfSpeech: "noun", level: "B1" },
          { text: "were", clean: "were", translationTr: "idiler", ipa: "/wɝː/", partOfSpeech: "verb", level: "A1" },
          { text: "not", clean: "not", translationTr: "değil", ipa: "/nɑːt/", partOfSpeech: "adv", level: "A1" },
          { text: "made", clean: "made", translationTr: "yapılmış", ipa: "/meɪd/", partOfSpeech: "verb", level: "A2" },
          { text: "of", clean: "of", translationTr: "-den / -dan", ipa: "/ʌv/", partOfSpeech: "prep", level: "A1" },
          { text: "wood.", clean: "wood", translationTr: "ahşap / odun", ipa: "/wʊd/", partOfSpeech: "noun", level: "A2" },
          { text: "Instead,", clean: "Instead", translationTr: "Bunun yerine", ipa: "/ɪnˈsted/", partOfSpeech: "adv", level: "B1", exampleSentence: "I didn't drink tea; instead, I chose water." },
          { text: "their", clean: "their", translationTr: "onların", ipa: "/ðer/", partOfSpeech: "pron", level: "A1" },
          { text: "trunks", clean: "trunks", translationTr: "gövdeleri", ipa: "/trʌŋks/", partOfSpeech: "noun", level: "B2", exampleSentence: "The ancient oak trunk was thick and sturdy." },
          { text: "gleamed", clean: "gleamed", translationTr: "ışıldadı / parıldadı", ipa: "/ɡliːmd/", partOfSpeech: "verb", level: "B2", exampleSentence: "Her polished silver necklace gleamed under the stage light." },
          { text: "with", clean: "with", translationTr: "ile", ipa: "/wɪð/", partOfSpeech: "prep", level: "A1" },
          { text: "polished", clean: "polished", translationTr: "cilalı / parlatılmış", ipa: "/ˈpɑː.lɪʃt/", partOfSpeech: "adj", level: "B1" },
          { text: "copper", clean: "copper", translationTr: "bakır", ipa: "/ˈkɑː.pɚ/", partOfSpeech: "noun", level: "B1" },
          { text: "and", clean: "and", translationTr: "ve", ipa: "/ænd/", partOfSpeech: "conj", level: "A1" },
          { text: "intricate", clean: "intricate", translationTr: "karmaşık / ince işlenmiş", ipa: "/ˈɪn.trə.kət/", partOfSpeech: "adj", level: "B2", exampleSentence: "The clock mechanism had an intricate arrangement of gears." },
          { text: "brass", clean: "brass", translationTr: "pirinç (alaşım)", ipa: "/bræs/", partOfSpeech: "noun", level: "B1" },
          { text: "gears.", clean: "gears", translationTr: "dişliler", ipa: "/ɡɪrz/", partOfSpeech: "noun", level: "B1" },
        ],
        turkishTranslation: "Vadideki ağaçlar odundan yapılmamıştı. Bunun yerine gövdeleri, parlatılmış bakır ve ince işlenmiş pirinç dişlilerle ışıldıyordu.",
      },
      {
        id: "p3-2",
        tokens: [
          { text: "Clara", clean: "Clara", translationTr: "Clara", ipa: "/ˈklær.ə/", partOfSpeech: "noun", level: "A1" },
          { text: "listened", clean: "listened", translationTr: "dinledi", ipa: "/ˈlɪs.ənd/", partOfSpeech: "verb", level: "A1" },
          { text: "closely.", clean: "closely", translationTr: "yakından / dikkatle", ipa: "/ˈkloʊs.li/", partOfSpeech: "adv", level: "A2" },
          { text: "For", clean: "For", translationTr: "boyunca / -dir", ipa: "/fɔːr/", partOfSpeech: "prep", level: "A1" },
          { text: "centuries,", clean: "centuries", translationTr: "yüzyıllar", ipa: "/ˈsen.tʃər.iz/", partOfSpeech: "noun", level: "B1" },
          { text: "the", clean: "the", translationTr: "belirli artikel", ipa: "/ðə/", partOfSpeech: "det", level: "A1" },
          { text: "forest", clean: "forest", translationTr: "orman", ipa: "/ˈfɔːr.ɪst/", partOfSpeech: "noun", level: "A2" },
          { text: "had", clean: "had", translationTr: "sahipti", ipa: "/hæd/", partOfSpeech: "verb", level: "A1" },
          { text: "produced", clean: "produced", translationTr: "üretmişti", ipa: "/prəˈduːst/", partOfSpeech: "verb", level: "B1" },
          { text: "a", clean: "a", translationTr: "bir", ipa: "/ə/", partOfSpeech: "det", level: "A1" },
          { text: "rhythmic", clean: "rhythmic", translationTr: "ritmik", ipa: "/ˈrɪð.mɪk/", partOfSpeech: "adj", level: "B2", exampleSentence: "The rhythmic beating of the drums echoed across the hall." },
          { text: "melody,", clean: "melody", translationTr: "melodi / ezgi", ipa: "/ˈmel.ə.di/", partOfSpeech: "noun", level: "B1" },
          { text: "but", clean: "but", translationTr: "ama / fakat", ipa: "/bʌt/", partOfSpeech: "conj", level: "A1" },
          { text: "today,", clean: "today", translationTr: "bugün", ipa: "/təˈdeɪ/", partOfSpeech: "noun", level: "A1" },
          { text: "every", clean: "every", translationTr: "her", ipa: "/ˈev.ri/", partOfSpeech: "det", level: "A1" },
          { text: "single", clean: "single", translationTr: "tek bir", ipa: "/ˈsɪŋ.ɡəl/", partOfSpeech: "adj", level: "A2" },
          { text: "gear", clean: "gear", translationTr: "dişli", ipa: "/ɡɪr/", partOfSpeech: "noun", level: "B1" },
          { text: "was", clean: "was", translationTr: "idi", ipa: "/wɑːz/", partOfSpeech: "verb", level: "A1" },
          { text: "frozen", clean: "frozen", translationTr: "donmuş / hareketsiz", ipa: "/ˈfroʊ.zən/", partOfSpeech: "adj", level: "B1" },
          { text: "in", clean: "in", translationTr: "içinde", ipa: "/ɪn/", partOfSpeech: "prep", level: "A1" },
          { text: "place.", clean: "place", translationTr: "yerinde", ipa: "/pleɪs/", partOfSpeech: "noun", level: "A1" },
        ],
        turkishTranslation: "Clara dikkatle dinledi. Yüzyıllardır orman ritmik bir melodi üretmişti, ancak bugün her bir dişli yerinde donup kalmıştı.",
      },
    ],
    quiz: [
      {
        id: "q3-1",
        question: "What material were the tree trunks in the forest made of?",
        options: ["Solid stone", "Copper and brass gears", "Pine and cedar wood", "Transparent glass"],
        correctIndex: 1,
        explanation: "The story mentions that the trunks gleamed with polished copper and intricate brass gears.",
      },
    ],
  },
  {
    id: "story-4",
    title: "The Philosophy of Lost Keys",
    titleTr: "Kayıp Anahtarların Felsefesi",
    slug: "philosophy-of-lost-keys",
    level: "B2",
    category: "Philosophy",
    readTimeMinutes: 6,
    wordCount: 190,
    coverImage: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80",
    summary: "A reflective essay examining how losing ordinary everyday objects reveals our relationship with memory and patience.",
    summaryTr: "Gündelik sıradan eşyaları kaybetmenin hafıza ve sabırla olan ilişkimizi nasıl ortaya koyduğunu inceleyen düşündürücü bir deneme.",
    requiredVocabularyLevel: 4, // B2
    featured: false,
    paragraphs: [
      {
        id: "p4-1",
        tokens: [
          { text: "Misplacing", clean: "Misplacing", translationTr: "Yanlış yere koymak", ipa: "/ˌmɪsˈpleɪ.sɪŋ/", partOfSpeech: "verb", level: "B2", exampleSentence: "Misplacing your keys right before leaving the house is frustrating." },
          { text: "one's", clean: "one's", translationTr: "birinin / insanın", ipa: "/wʌnz/", partOfSpeech: "pron", level: "B1" },
          { text: "keys", clean: "keys", translationTr: "anahtarlarını", ipa: "/kiːz/", partOfSpeech: "noun", level: "A1" },
          { text: "is", clean: "is", translationTr: "-dir", ipa: "/ɪz/", partOfSpeech: "verb", level: "A1" },
          { text: "seldom", clean: "seldom", translationTr: "nadiren / pek az", ipa: "/ˈsel.dəm/", partOfSpeech: "adv", level: "B2", exampleSentence: "We seldom realize the value of quiet moments." },
          { text: "a", clean: "a", translationTr: "bir", ipa: "/ə/", partOfSpeech: "det", level: "A1" },
          { text: "matter", clean: "matter", translationTr: "mesele / konu", ipa: "/ˈmæt̬.ɚ/", partOfSpeech: "noun", level: "A2" },
          { text: "of", clean: "of", translationTr: "-in", ipa: "/ʌv/", partOfSpeech: "prep", level: "A1" },
          { text: "mere", clean: "mere", translationTr: "salt / yalnızca", ipa: "/mɪr/", partOfSpeech: "adj", level: "B2", exampleSentence: "It was a mere coincidence that they met again." },
          { text: "forgetfulness.", clean: "forgetfulness", translationTr: "unutkanlık", ipa: "/fɚˈɡet.fəl.nəs/", partOfSpeech: "noun", level: "B2" },
          { text: "Rather,", clean: "Rather", translationTr: "Daha ziyade / Bilakis", ipa: "/ˈræð.ɚ/", partOfSpeech: "adv", level: "B1" },
          { text: "it", clean: "it", translationTr: "o", ipa: "/ɪt/", partOfSpeech: "pron", level: "A1" },
          { text: "is", clean: "is", translationTr: "-dir", ipa: "/ɪz/", partOfSpeech: "verb", level: "A1" },
          { text: "a", clean: "a", translationTr: "bir", ipa: "/ə/", partOfSpeech: "det", level: "A1" },
          { text: "profound", clean: "profound", translationTr: "derin / köklü", ipa: "/prəˈfaʊnd/", partOfSpeech: "adj", level: "C1", exampleSentence: "The book had a profound impact on my philosophical outlook." },
          { text: "pause", clean: "pause", translationTr: "duraklama / mola", ipa: "/pɑːz/", partOfSpeech: "noun", level: "B1" },
          { text: "in", clean: "in", translationTr: "içinde", ipa: "/ɪn/", partOfSpeech: "prep", level: "A1" },
          { text: "our", clean: "our", translationTr: "bizim", ipa: "/aʊr/", partOfSpeech: "pron", level: "A1" },
          { text: "hectic", clean: "hectic", translationTr: "telaşlı / yoğun", ipa: "/ˈhek.tɪk/", partOfSpeech: "adj", level: "B2", exampleSentence: "After a hectic week at work, she slept all weekend." },
          { text: "routines.", clean: "routines", translationTr: "rutinlerimizde", ipa: "/ruːˈtiːnz/", partOfSpeech: "noun", level: "A2" },
        ],
        turkishTranslation: "İnsanın anahtarlarını yanlış yere koyması, nadiren salt bir unutkanlık meselesidir. Bilakis, telaşlı rutinlerimizin içinde derin bir duraklamadır.",
      },
    ],
    quiz: [
      {
        id: "q4-1",
        question: "According to the author, what does misplacing keys represent?",
        options: ["Carelessness and laziness", "A profound pause in hectic routines", "A sign of bad luck", "An urgent need to buy new locks"],
        correctIndex: 1,
        explanation: "The text states that losing keys is 'a profound pause in our hectic routines.'",
      },
    ],
  },
];

// Helper to calculate Krashen comprehension match based on user CEFR level number (1: A1, 2: A2, 3: B1, 4: B2, 5: C1)
export function calculateStoryMatch(story: Story, userLevelNumber: number): {
  percentage: number;
  badgeType: "optimal" | "challenging" | "difficult";
  badgeLabel: string;
  badgeColorClass: string;
} {
  const diff = story.requiredVocabularyLevel - userLevelNumber;
  let percentage: number;

  if (diff <= -2) {
    percentage = 99;
  } else if (diff === -1) {
    percentage = 98;
  } else if (diff === 0) {
    // Exact level match -> Ideal Krashen 95-96%
    percentage = 96;
  } else if (diff === 1) {
    // 1 level above (i+1)
    percentage = 89;
  } else if (diff === 2) {
    percentage = 79;
  } else {
    percentage = 68;
  }

  if (percentage >= 95) {
    return {
      percentage,
      badgeType: "optimal",
      badgeLabel: `%${percentage} Eşleşme • Optimal (%95+)`,
      badgeColorClass: "bg-[#E8F5E9] text-[#1B5E20] border-[#A5D6A7] dark:bg-[#143820] dark:text-[#81C784] dark:border-[#2E7D32]",
    };
  } else if (percentage >= 85) {
    return {
      percentage,
      badgeType: "challenging",
      badgeLabel: `%${percentage} Eşleşme • Geliştirici (%85-94)`,
      badgeColorClass: "bg-[#FFF8E1] text-[#B78103] border-[#FFE082] dark:bg-[#3E3211] dark:text-[#FFD54F] dark:border-[#66521A]",
    };
  } else {
    return {
      percentage,
      badgeType: "difficult",
      badgeLabel: `%${percentage} Eşleşme • Zor Seviye`,
      badgeColorClass: "bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2] dark:bg-[#3B161B] dark:text-[#E57373] dark:border-[#5E1E26]",
    };
  }
}
