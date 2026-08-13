import { CEFRLevel, WordToken } from "@/types";

export interface LexiconEntry {
  tr: string;
  ipa?: string;
  pos: WordToken["partOfSpeech"];
  level: CEFRLevel;
  example?: string;
}

/**
 * Built-in English-Turkish High Frequency & Graded Vocabulary Lexicon
 */
export const EN_TR_LEXICON: Record<string, LexiconEntry> = {
  // Common Travel & Airport Vocabulary
  airport: { tr: "havalimanı / havaalanı", ipa: "/ˈer.pɔːrt/", pos: "noun", level: "A1", example: "We arrived at the airport two hours before the flight." },
  airports: { tr: "havalimanları", ipa: "/ˈer.pɔːrts/", pos: "noun", level: "A1" },
  airplane: { tr: "uçak", ipa: "/ˈer.pleɪn/", pos: "noun", level: "A1", example: "The airplane took off smoothly into the clouds." },
  plane: { tr: "uçak", ipa: "/pleɪn/", pos: "noun", level: "A1" },
  planes: { tr: "uçaklar", ipa: "/pleɪnz/", pos: "noun", level: "A1" },
  flight: { tr: "uçuş / sefer", ipa: "/flaɪt/", pos: "noun", level: "A1", example: "Her flight to London was delayed by an hour." },
  flights: { tr: "uçuşlar", ipa: "/flaɪts/", pos: "noun", level: "A1" },
  fly: { tr: "uçmak", ipa: "/flaɪ/", pos: "verb", level: "A1" },
  flying: { tr: "uçan / uçuş", ipa: "/ˈflaɪ.ɪŋ/", pos: "verb", level: "A2" },
  flew: { tr: "uçtu", ipa: "/fluː/", pos: "verb", level: "A2" },
  flown: { tr: "uçmuş", ipa: "/floʊn/", pos: "verb", level: "B1" },
  pilot: { tr: "pilot", ipa: "/ˈpaɪ.lət/", pos: "noun", level: "A2" },
  passenger: { tr: "yolcu", ipa: "/ˈpæs.ən.dʒɚ/", pos: "noun", level: "A2", example: "The passengers waited patiently in the terminal." },
  passengers: { tr: "yolcular", ipa: "/ˈpæs.ən.dʒɚz/", pos: "noun", level: "A2" },
  terminal: { tr: "terminal / yolcu salonu", ipa: "/ˈtɝː.mə.nəl/", pos: "noun", level: "A2" },
  gate: { tr: "kapı (uçuş kapısı)", ipa: "/ɡeɪt/", pos: "noun", level: "A1" },
  gates: { tr: "kapılar", ipa: "/ɡeɪts/", pos: "noun", level: "A1" },
  ticket: { tr: "bilet", ipa: "/ˈtɪk.ɪt/", pos: "noun", level: "A1" },
  tickets: { tr: "biletler", ipa: "/ˈtɪk.ɪts/", pos: "noun", level: "A1" },
  boarding: { tr: "uçağa biniş / biniş", ipa: "/ˈbɔːr.dɪŋ/", pos: "noun", level: "A2", example: "Boarding will start in fifteen minutes." },
  board: { tr: "uçağa / gemiye binmek", ipa: "/bɔːrd/", pos: "verb", level: "A2" },
  boarded: { tr: "uçağa bindi", ipa: "/ˈbɔːr.dɪd/", pos: "verb", level: "A2" },
  passport: { tr: "pasaport", ipa: "/ˈpæs.pɔːrt/", pos: "noun", level: "A1" },
  passports: { tr: "pasaportlar", ipa: "/ˈpæs.pɔːrts/", pos: "noun", level: "A1" },
  luggage: { tr: "bagaj / bavul", ipa: "/ˈlʌɡ.ɪdʒ/", pos: "noun", level: "A2" },
  baggage: { tr: "bagaj", ipa: "/ˈbæɡ.ɪdʒ/", pos: "noun", level: "A2" },
  suitcase: { tr: "valiz / bavul", ipa: "/ˈsuːt.keɪs/", pos: "noun", level: "A2" },
  suitcases: { tr: "valizler", ipa: "/ˈsuːt.keɪ.sɪz/", pos: "noun", level: "A2" },
  bag: { tr: "çanta / torba", ipa: "/bæɡ/", pos: "noun", level: "A1" },
  bags: { tr: "çantalar", ipa: "/bæɡz/", pos: "noun", level: "A1" },
  security: { tr: "güvenlik", ipa: "/səˈkjʊr.ə.t̬i/", pos: "noun", level: "A2" },
  customs: { tr: "gümrük", ipa: "/ˈkʌs.təmz/", pos: "noun", level: "B1" },
  checkin: { tr: "giriş işlemi / bilet kontrolü", ipa: "/ˈtʃek.ɪn/", pos: "noun", level: "A2" },
  departure: { tr: "kalkış / gidiş", ipa: "/dɪˈpɑːr.tʃɚ/", pos: "noun", level: "A2" },
  departures: { tr: "kalkışlar", ipa: "/dɪˈpɑːr.tʃɚz/", pos: "noun", level: "A2" },
  arrival: { tr: "varış / geliş", ipa: "/əˈraɪ.vəl/", pos: "noun", level: "A2" },
  arrivals: { tr: "varışlar / gelen yolcu", ipa: "/əˈraɪ.vəlz/", pos: "noun", level: "A2" },
  arrive: { tr: "varmak / ulaşmak", ipa: "/əˈraɪv/", pos: "verb", level: "A1" },
  arrived: { tr: "vardı / ulaştı", ipa: "/əˈraɪvd/", pos: "verb", level: "A1" },
  arriving: { tr: "varan / varmakta olan", ipa: "/əˈraɪ.vɪŋ/", pos: "verb", level: "A2" },
  depart: { tr: "kalkmak / hareket etmek", ipa: "/dɪˈpɑːrt/", pos: "verb", level: "A2" },
  departed: { tr: "kalktı / hareket etti", ipa: "/dɪˈpɑːr.tɪd/", pos: "verb", level: "A2" },
  delay: { tr: "gecikme / rötara uğramak", ipa: "/dɪˈleɪ/", pos: "noun", level: "A2" },
  delayed: { tr: "gecikmeli / ertelenmiş", ipa: "/dɪˈleɪd/", pos: "adj", level: "A2" },
  cancel: { tr: "iptal etmek", ipa: "/ˈkæn.səl/", pos: "verb", level: "A2" },
  cancelled: { tr: "iptal edildi", ipa: "/ˈkæn.səld/", pos: "adj", level: "A2" },
  canceled: { tr: "iptal edildi", ipa: "/ˈkæn.səld/", pos: "adj", level: "A2" },
  land: { tr: "inmek (uçak) / kara", ipa: "/lænd/", pos: "verb", level: "A2" },
  landed: { tr: "indi (uçak)", ipa: "/ˈlæn.dɪd/", pos: "verb", level: "A2" },
  landing: { tr: "iniş", ipa: "/ˈlæn.dɪŋ/", pos: "noun", level: "A2" },
  takeoff: { tr: "kalkış (uçak)", ipa: "/ˈteɪk.ɑːf/", pos: "noun", level: "A2" },
  runway: { tr: "uçak pisti", ipa: "/ˈrʌn.weɪ/", pos: "noun", level: "B1" },
  announcement: { tr: "duyuru / anons", ipa: "/əˈnaʊns.mənt/", pos: "noun", level: "B1", example: "A voice over the speaker made an announcement." },
  announcements: { tr: "duyurular / anonslar", ipa: "/əˈnaʊns.mənts/", pos: "noun", level: "B1" },
  announce: { tr: "duyurmak / ilan etmek", ipa: "/əˈnaʊns/", pos: "verb", level: "B1" },
  announced: { tr: "duyurdu / anons etti", ipa: "/əˈnaʊnst/", pos: "verb", level: "B1" },
  loudspeaker: { tr: "hoparlör", ipa: "/ˌlaʊdˈspiː.kɚ/", pos: "noun", level: "B1" },
  speaker: { tr: "hoparlör / konuşmacı", ipa: "/ˈspiː.kɚ/", pos: "noun", level: "A2" },
  journey: { tr: "yolculuk / seyahat", ipa: "/ˈdʒɝː.ni/", pos: "noun", level: "A2" },
  travel: { tr: "seyahat etmek / yolculuk", ipa: "/ˈtræv.əl/", pos: "verb", level: "A1" },
  traveler: { tr: "gezgin / yolcu", ipa: "/ˈtræv.əl.ɚ/", pos: "noun", level: "A2" },
  travelers: { tr: "gezginler / yolcular", ipa: "/ˈtræv.əl.ɚz/", pos: "noun", level: "A2" },
  travelling: { tr: "seyahat etme", ipa: "/ˈtræv.əl.ɪŋ/", pos: "verb", level: "A2" },
  traveled: { tr: "seyahat etti", ipa: "/ˈtræv.əld/", pos: "verb", level: "A2" },
  trip: { tr: "gezi / seyahat", ipa: "/trɪp/", pos: "noun", level: "A1" },
  destination: { tr: "varış noktası / hedef", ipa: "/ˌdes.təˈneɪ.ʃən/", pos: "noun", level: "B1" },

  // Pronouns & Determiners
  the: { tr: "belirli artikel (o/bu)", ipa: "/ðə/", pos: "det", level: "A1" },
  a: { tr: "bir (belirsiz artikel)", ipa: "/ə/", pos: "det", level: "A1" },
  an: { tr: "bir (sesli harf önünde)", ipa: "/æn/", pos: "det", level: "A1" },
  this: { tr: "bu", ipa: "/ðɪs/", pos: "det", level: "A1" },
  that: { tr: "şu / o", ipa: "/ðæt/", pos: "det", level: "A1" },
  these: { tr: "bunlar", ipa: "/ðiːz/", pos: "det", level: "A1" },
  those: { tr: "şunlar / onlar", ipa: "/ðoʊz/", pos: "det", level: "A1" },
  i: { tr: "ben", ipa: "/aɪ/", pos: "pron", level: "A1" },
  you: { tr: "sen / siz", ipa: "/juː/", pos: "pron", level: "A1" },
  he: { tr: "o (erkek)", ipa: "/hiː/", pos: "pron", level: "A1" },
  she: { tr: "o (kadın)", ipa: "/ʃiː/", pos: "pron", level: "A1" },
  it: { tr: "o (cansız/hayvan)", ipa: "/ɪt/", pos: "pron", level: "A1" },
  we: { tr: "biz", ipa: "/wiː/", pos: "pron", level: "A1" },
  they: { tr: "onlar", ipa: "/ðeɪ/", pos: "pron", level: "A1" },
  me: { tr: "beni / bana", ipa: "/miː/", pos: "pron", level: "A1" },
  him: { tr: "onu / ona (erkek)", ipa: "/hɪm/", pos: "pron", level: "A1" },
  her: { tr: "onun / onu (kadın)", ipa: "/hɝː/", pos: "pron", level: "A1" },
  us: { tr: "bizi / bize", ipa: "/ʌs/", pos: "pron", level: "A1" },
  them: { tr: "onları / onlara", ipa: "/ðem/", pos: "pron", level: "A1" },
  my: { tr: "benim", ipa: "/maɪ/", pos: "pron", level: "A1" },
  your: { tr: "senin / sizin", ipa: "/jʊr/", pos: "pron", level: "A1" },
  his: { tr: "onun / kendi (erkek)", ipa: "/hɪz/", pos: "pron", level: "A1" },
  its: { tr: "onun (cansız/hayvan)", ipa: "/ɪts/", pos: "pron", level: "A1" },
  our: { tr: "bizim", ipa: "/aʊr/", pos: "pron", level: "A1" },
  their: { tr: "onların", ipa: "/ðer/", pos: "pron", level: "A1" },
  all: { tr: "tüm / hepsi", ipa: "/ɔːl/", pos: "det", level: "A1" },
  every: { tr: "her / her bir", ipa: "/ˈev.ri/", pos: "det", level: "A1" },
  each: { tr: "her biri", ipa: "/iːtʃ/", pos: "det", level: "A2" },
  some: { tr: "bazı / biraz", ipa: "/sʌm/", pos: "det", level: "A1" },
  any: { tr: "herhangi / hiç", ipa: "/ˈen.i/", pos: "det", level: "A1" },
  no: { tr: "hiçbir / hayır", ipa: "/noʊ/", pos: "det", level: "A1" },
  one: { tr: "bir / kişi / olanı", ipa: "/wʌn/", pos: "pron", level: "A1" },
  many: { tr: "birçok / çok sayıda", ipa: "/ˈmen.i/", pos: "det", level: "A1" },
  much: { tr: "çok / fazla", ipa: "/mʌtʃ/", pos: "det", level: "A1" },
  more: { tr: "daha fazla / daha", ipa: "/mɔːr/", pos: "adv", level: "A1" },
  most: { tr: "en çok / çoğu", ipa: "/moʊst/", pos: "adv", level: "A2" },
  few: { tr: "az / birkaç", ipa: "/fjuː/", pos: "det", level: "A2" },
  other: { tr: "diğer / başka", ipa: "/ˈʌð.ɚ/", pos: "adj", level: "A1" },
  another: { tr: "başka bir / diğeri", ipa: "/əˈnʌð.ɚ/", pos: "det", level: "A1" },

  // Auxiliary & Common Verbs
  is: { tr: "-dır / -dir (olmak)", ipa: "/ɪz/", pos: "verb", level: "A1" },
  am: { tr: "-yim (olmak)", ipa: "/æm/", pos: "verb", level: "A1" },
  are: { tr: "-dirler (olmak)", ipa: "/ɑːr/", pos: "verb", level: "A1" },
  was: { tr: "idi (geçmiş zaman)", ipa: "/wɑːz/", pos: "verb", level: "A1" },
  were: { tr: "idiler (geçmiş zaman)", ipa: "/wɝː/", pos: "verb", level: "A1" },
  be: { tr: "olmak", ipa: "/biː/", pos: "verb", level: "A1" },
  been: { tr: "olmuş / bulunmuş", ipa: "/bɪn/", pos: "verb", level: "A2" },
  being: { tr: "olma / varlık", ipa: "/ˈbiː.ɪŋ/", pos: "verb", level: "B1" },
  have: { tr: "sahip olmak", ipa: "/hæv/", pos: "verb", level: "A1" },
  has: { tr: "sahip olmak (tekil)", ipa: "/hæz/", pos: "verb", level: "A1" },
  had: { tr: "sahipti / vardı", ipa: "/hæd/", pos: "verb", level: "A1" },
  having: { tr: "sahip olma", ipa: "/ˈhæv.ɪŋ/", pos: "verb", level: "A2" },
  do: { tr: "yapmak", ipa: "/duː/", pos: "verb", level: "A1" },
  does: { tr: "yapar", ipa: "/dʌz/", pos: "verb", level: "A1" },
  did: { tr: "yaptı", ipa: "/dɪd/", pos: "verb", level: "A1" },
  done: { tr: "yapılmış / bitmiş", ipa: "/dʌn/", pos: "verb", level: "A2" },
  go: { tr: "gitmek", ipa: "/ɡoʊ/", pos: "verb", level: "A1" },
  goes: { tr: "gider", ipa: "/ɡoʊz/", pos: "verb", level: "A1" },
  went: { tr: "gitti", ipa: "/went/", pos: "verb", level: "A1" },
  gone: { tr: "gitmiş / kaybolmuş", ipa: "/ɡɑːn/", pos: "verb", level: "A2" },
  going: { tr: "giden / gitmekte olan", ipa: "/ˈɡoʊ.ɪŋ/", pos: "verb", level: "A1" },
  come: { tr: "gelmek", ipa: "/kʌm/", pos: "verb", level: "A1" },
  came: { tr: "geldi", ipa: "/keɪm/", pos: "verb", level: "A1" },
  coming: { tr: "gelen / yaklaşan", ipa: "/ˈkʌm.ɪŋ/", pos: "verb", level: "A1" },
  see: { tr: "görmek", ipa: "/siː/", pos: "verb", level: "A1" },
  saw: { tr: "gördü", ipa: "/sɔː/", pos: "verb", level: "A1" },
  seen: { tr: "görülmüş / görmüş", ipa: "/siːn/", pos: "verb", level: "A2" },
  seeing: { tr: "görme", ipa: "/ˈsiː.ɪŋ/", pos: "verb", level: "A2" },
  look: { tr: "bakmak / görünmek", ipa: "/lʊk/", pos: "verb", level: "A1" },
  looked: { tr: "baktı / göründü", ipa: "/lʊkt/", pos: "verb", level: "A1" },
  looking: { tr: "bakan / arayan", ipa: "/ˈlʊk.ɪŋ/", pos: "verb", level: "A1" },
  walk: { tr: "yürümek", ipa: "/wɔːk/", pos: "verb", level: "A1" },
  walked: { tr: "yürüdü", ipa: "/wɔːkt/", pos: "verb", level: "A1" },
  walking: { tr: "yürüyüş / yürüyen", ipa: "/ˈwɔː.kɪŋ/", pos: "verb", level: "A1" },
  wait: { tr: "beklemek", ipa: "/weɪt/", pos: "verb", level: "A1" },
  waited: { tr: "bekledi", ipa: "/ˈweɪ.tɪd/", pos: "verb", level: "A1" },
  waiting: { tr: "bekleyen / bekleme", ipa: "/ˈweɪ.tɪŋ/", pos: "verb", level: "A1", example: "He sat in the waiting room quietly." },
  hear: { tr: "duymak / işitmek", ipa: "/hɪr/", pos: "verb", level: "A1" },
  heard: { tr: "duydu / işitti", ipa: "/hɝːd/", pos: "verb", level: "A2" },
  hearing: { tr: "duyma / işitme", ipa: "/ˈhɪr.ɪŋ/", pos: "verb", level: "A2" },
  listen: { tr: "dinlemek", ipa: "/ˈlɪs.ən/", pos: "verb", level: "A1" },
  listened: { tr: "dinledi", ipa: "/ˈlɪs.ənd/", pos: "verb", level: "A1" },
  listening: { tr: "dinleyen / dinleme", ipa: "/ˈlɪs.ən.ɪŋ/", pos: "verb", level: "A1" },
  carefully: { tr: "dikkatlice / özenle", ipa: "/ˈker.fəl.i/", pos: "adv", level: "A2" },
  speak: { tr: "konuşmak", ipa: "/spiːk/", pos: "verb", level: "A1" },
  spoke: { tr: "konuştu", ipa: "/spoʊk/", pos: "verb", level: "A2" },
  spoken: { tr: "konuşulan / söylenmiş", ipa: "/ˈspoʊ.kən/", pos: "verb", level: "B1" },
  say: { tr: "söylemek / demek", ipa: "/seɪ/", pos: "verb", level: "A1" },
  said: { tr: "dedi / söyledi", ipa: "/sed/", pos: "verb", level: "A1" },
  saying: { tr: "söyleyen / deyiş", ipa: "/ˈseɪ.ɪŋ/", pos: "verb", level: "A2" },
  tell: { tr: "anlatmak / söylemek", ipa: "/tel/", pos: "verb", level: "A1" },
  told: { tr: "anlattı / söyledi", ipa: "/toʊld/", pos: "verb", level: "A1" },
  feel: { tr: "hissetmek", ipa: "/fiːl/", pos: "verb", level: "A1" },
  felt: { tr: "hissetti", ipa: "/felt/", pos: "verb", level: "A2" },
  feeling: { tr: "duygu / his", ipa: "/ˈfiː.lɪŋ/", pos: "noun", level: "A2" },
  find: { tr: "bulmak", ipa: "/faɪnd/", pos: "verb", level: "A1" },
  found: { tr: "buldu / keşfetti", ipa: "/faʊnd/", pos: "verb", level: "A1" },
  finding: { tr: "bulma / bulgu", ipa: "/ˈfaɪn.dɪŋ/", pos: "noun", level: "B1" },
  know: { tr: "bilmek / tanımak", ipa: "/noʊ/", pos: "verb", level: "A1" },
  knew: { tr: "biliyordu / bildi", ipa: "/nuː/", pos: "verb", level: "A2" },
  known: { tr: "bilinen / tanınan", ipa: "/noʊn/", pos: "adj", level: "A2" },
  knowing: { tr: "bilerek / bilme", ipa: "/ˈnoʊ.ɪŋ/", pos: "adj", level: "B1" },
  think: { tr: "düşünmek", ipa: "/θɪŋk/", pos: "verb", level: "A1" },
  thought: { tr: "düşündü / düşünce", ipa: "/θɔːt/", pos: "noun", level: "A2" },
  thinking: { tr: "düşünme / düşünce", ipa: "/ˈθɪŋ.kɪŋ/", pos: "noun", level: "A2" },
  discover: { tr: "keşfetmek", ipa: "/dɪˈskʌv.ɚ/", pos: "verb", level: "A2" },
  discovered: { tr: "keşfetti", ipa: "/dɪˈskʌv.ɚd/", pos: "verb", level: "A2" },
  discovery: { tr: "keşif", ipa: "/dɪˈskʌv.ɚ.i/", pos: "noun", level: "B1" },
  change: { tr: "değiştirmek / değişim", ipa: "/tʃeɪndʒ/", pos: "verb", level: "A1" },
  changed: { tr: "değişti / değiştirdi", ipa: "/tʃeɪndʒd/", pos: "verb", level: "A1" },
  changing: { tr: "değişen", ipa: "/ˈtʃeɪn.dʒɪŋ/", pos: "adj", level: "A2" },
  start: { tr: "başlamak", ipa: "/stɑːrt/", pos: "verb", level: "A1" },
  started: { tr: "başladı", ipa: "/ˈstɑːr.tɪd/", pos: "verb", level: "A1" },
  starting: { tr: "başlangıç / başlayan", ipa: "/ˈstɑːr.tɪŋ/", pos: "verb", level: "A2" },
  begin: { tr: "başlamak", ipa: "/bɪˈɡɪn/", pos: "verb", level: "A1" },
  began: { tr: "başladı", ipa: "/bɪˈɡæn/", pos: "verb", level: "A2" },
  begun: { tr: "başlamış", ipa: "/bɪˈɡʌn/", pos: "verb", level: "B1" },
  beginning: { tr: "başlangıç", ipa: "/bɪˈɡɪn.ɪŋ/", pos: "noun", level: "A2" },
  begins: { tr: "başlar", ipa: "/bɪˈɡɪnz/", pos: "verb", level: "A1" },
  step: { tr: "adım / adım atmak", ipa: "/step/", pos: "verb", level: "A2" },
  stepped: { tr: "adım attı", ipa: "/stept/", pos: "verb", level: "A2" },
  stepping: { tr: "adım atan", ipa: "/ˈstep.ɪŋ/", pos: "verb", level: "A2" },
  reach: { tr: "ulaşmak / uzanmak", ipa: "/riːtʃ/", pos: "verb", level: "A2" },
  reached: { tr: "ulaştı / uzandı", ipa: "/riːtʃt/", pos: "verb", level: "A2" },
  reaching: { tr: "ulaşan", ipa: "/ˈriː.tʃɪŋ/", pos: "verb", level: "B1" },
  watch: { tr: "izlemek / kol saati", ipa: "/wɑːtʃ/", pos: "verb", level: "A1" },
  watched: { tr: "izledi", ipa: "/wɑːtʃt/", pos: "verb", level: "A1" },
  watching: { tr: "izleme / izleyen", ipa: "/ˈwɑː.tʃɪŋ/", pos: "verb", level: "A1" },
  hold: { tr: "tutmak / barındırmak", ipa: "/hoʊld/", pos: "verb", level: "A2" },
  held: { tr: "tuttu / barındırdı", ipa: "/held/", pos: "verb", level: "A2" },
  holding: { tr: "tutan", ipa: "/ˈhoʊl.dɪŋ/", pos: "verb", level: "A2" },
  open: { tr: "açmak / açık", ipa: "/ˈoʊ.pən/", pos: "adj", level: "A1" },
  opened: { tr: "açtı", ipa: "/ˈoʊ.pənd/", pos: "verb", level: "A1" },
  opening: { tr: "açılış / açılan", ipa: "/ˈoʊ.pən.ɪŋ/", pos: "noun", level: "A2" },
  close: { tr: "kapatmak / yakın", ipa: "/kloʊz/", pos: "verb", level: "A1" },
  closed: { tr: "kapandı / kapalı", ipa: "/kloʊzd/", pos: "adj", level: "A1" },
  closely: { tr: "yakından / dikkatle", ipa: "/ˈkloʊs.li/", pos: "adv", level: "B1" },
  pass: { tr: "geçmek / pas vermek", ipa: "/pæs/", pos: "verb", level: "A2" },
  passed: { tr: "geçti / geride kaldı", ipa: "/pæst/", pos: "verb", level: "A2" },
  passing: { tr: "geçen", ipa: "/ˈpæs.ɪŋ/", pos: "adj", level: "B1" },
  whisper: { tr: "fısıldamak / fısıltı", ipa: "/ˈwɪs.pɚ/", pos: "verb", level: "B1" },
  whispered: { tr: "fısıldadı", ipa: "/ˈwɪs.pɚd/", pos: "verb", level: "B1" },
  whispering: { tr: "fısıldayan", ipa: "/ˈwɪs.pɚ.ɪŋ/", pos: "adj", level: "B1" },
  illuminate: { tr: "aydınlatmak", ipa: "/ɪˈluː.mə.neɪt/", pos: "verb", level: "B2" },
  illuminated: { tr: "aydınlattı / ışık saçtı", ipa: "/ɪˈluː.mə.neɪ.tɪd/", pos: "verb", level: "B2" },
  shine: { tr: "parlamak / ışıldamak", ipa: "/ʃaɪn/", pos: "verb", level: "A2" },
  shone: { tr: "parladı", ipa: "/ʃoʊn/", pos: "verb", level: "B1" },
  shining: { tr: "parıldayan", ipa: "/ˈʃaɪ.nɪŋ/", pos: "adj", level: "A2" },
  glow: { tr: "parıltı / parıldamak", ipa: "/ɡloʊ/", pos: "verb", level: "B1" },
  glowing: { tr: "ışıldayan / parlayan", ipa: "/ˈɡloʊ.ɪŋ/", pos: "adj", level: "B1" },
  glowed: { tr: "ışıldadı", ipa: "/ɡloʊd/", pos: "verb", level: "B1" },
  float: { tr: "süzülmek / batmadan yüzmek", ipa: "/floʊt/", pos: "verb", level: "B1" },
  floated: { tr: "havada süzüldü", ipa: "/ˈfloʊ.tɪd/", pos: "verb", level: "B1" },
  floating: { tr: "süzülen", ipa: "/ˈfloʊ.tɪŋ/", pos: "adj", level: "B1" },
  expect: { tr: "ummak / beklemek", ipa: "/ɪkˈspekt/", pos: "verb", level: "A2" },
  expected: { tr: "bekledi / umdu", ipa: "/ɪkˈspek.tɪd/", pos: "verb", level: "A2" },
  prove: { tr: "kanıtlamak", ipa: "/pruːv/", pos: "verb", level: "B1" },
  proved: { tr: "kanıtladı", ipa: "/pruːvd/", pos: "verb", level: "B1" },
  understand: { tr: "anlamak", ipa: "/ˌʌn.dɚˈstænd/", pos: "verb", level: "A1" },
  understood: { tr: "anlaşıldı / anladı", ipa: "/ˌʌn.dɚˈstʊd/", pos: "verb", level: "A2" },
  understanding: { tr: "anlayış / kavrama", ipa: "/ˌʌn.dɚˈstæn.dɪŋ/", pos: "noun", level: "B1" },

  // Prepositions & Conjunctions
  in: { tr: "içinde / -de / -da", ipa: "/ɪn/", pos: "prep", level: "A1" },
  on: { tr: "üzerinde / -de", ipa: "/ɑːn/", pos: "prep", level: "A1" },
  at: { tr: "-de / -da (yer/zaman)", ipa: "/æt/", pos: "prep", level: "A1" },
  to: { tr: "-e / -a doğru / için", ipa: "/tuː/", pos: "prep", level: "A1" },
  for: { tr: "için / boyunca", ipa: "/fɔːr/", pos: "prep", level: "A1" },
  with: { tr: "ile / birlikte", ipa: "/wɪð/", pos: "prep", level: "A1" },
  without: { tr: "-sız / olmadan", ipa: "/wɪˈðaʊt/", pos: "prep", level: "A2" },
  about: { tr: "hakkında / yaklaşık", ipa: "/əˈbaʊt/", pos: "prep", level: "A1" },
  from: { tr: "-den / -dan", ipa: "/frʌm/", pos: "prep", level: "A1" },
  by: { tr: "tarafından / ile / -e doğru", ipa: "/baɪ/", pos: "prep", level: "A1" },
  under: { tr: "altında", ipa: "/ˈʌn.dɚ/", pos: "prep", level: "A1" },
  over: { tr: "üzerinden / boyunca", ipa: "/ˈoʊ.vɚ/", pos: "prep", level: "A2" },
  above: { tr: "üzerinde / yukarısında", ipa: "/əˈbʌv/", pos: "prep", level: "A2" },
  below: { tr: "aşağısında / altında", ipa: "/bɪˈloʊ/", pos: "prep", level: "A2" },
  behind: { tr: "arkasında", ipa: "/bɪˈhaɪnd/", pos: "prep", level: "A1" },
  through: { tr: "içinden / boyunca", ipa: "/θruː/", pos: "prep", level: "A2" },
  between: { tr: "arasında", ipa: "/bɪˈtwiːn/", pos: "prep", level: "A2" },
  into: { tr: "içine doğru", ipa: "/ˈɪn.tuː/", pos: "prep", level: "A1" },
  out: { tr: "dışarı / dışarıya", ipa: "/aʊt/", pos: "adv", level: "A1" },
  up: { tr: "yukarı", ipa: "/ʌp/", pos: "adv", level: "A1" },
  down: { tr: "aşağı", ipa: "/daʊn/", pos: "adv", level: "A1" },
  and: { tr: "ve", ipa: "/ænd/", pos: "conj", level: "A1" },
  but: { tr: "fakat / ama", ipa: "/bʌt/", pos: "conj", level: "A1" },
  or: { tr: "veya / ya da", ipa: "/ɔːr/", pos: "conj", level: "A1" },
  so: { tr: "bu yüzden / öylece", ipa: "/soʊ/", pos: "conj", level: "A1" },
  because: { tr: "çünkü", ipa: "/bɪˈkɑːz/", pos: "conj", level: "A1" },
  when: { tr: "zaman / -dığında", ipa: "/wen/", pos: "conj", level: "A1" },
  while: { tr: "iken / esnasında", ipa: "/waɪl/", pos: "conj", level: "A2" },
  as: { tr: "olarak / gibi / iken", ipa: "/æz/", pos: "prep", level: "A2" },
  if: { tr: "eğer / ise", ipa: "/ɪf/", pos: "conj", level: "A1" },
  then: { tr: "sonra / o zaman", ipa: "/ðen/", pos: "adv", level: "A1" },
  after: { tr: "sonra / ardından", ipa: "/ˈæf.tɚ/", pos: "prep", level: "A1" },
  before: { tr: "önce / önünde", ipa: "/bɪˈfɔːr/", pos: "prep", level: "A1" },
  until: { tr: "-e kadar", ipa: "/ənˈtɪl/", pos: "prep", level: "A2" },

  // Adjectives & Descriptors
  quiet: { tr: "sessiz / sakin", ipa: "/ˈkwaɪ.ət/", pos: "adj", level: "A1" },
  quietly: { tr: "sessizce / sakince", ipa: "/ˈkwaɪ.ət.li/", pos: "adv", level: "A2" },
  soft: { tr: "yumuşak / hafif", ipa: "/sɑːft/", pos: "adj", level: "A1" },
  softly: { tr: "yumuşakça / usulca", ipa: "/ˈsɑːft.li/", pos: "adv", level: "A2" },
  gentle: { tr: "nazik / yumuşak / ılık", ipa: "/ˈdʒen.təl/", pos: "adj", level: "A2" },
  gently: { tr: "nazikçe / sakince / usulca", ipa: "/ˈdʒent.li/", pos: "adv", level: "A2" },
  loud: { tr: "yüksek sesli", ipa: "/laʊd/", pos: "adj", level: "A1" },
  loudly: { tr: "yüksek sesle", ipa: "/ˈlaʊd.li/", pos: "adv", level: "A2" },
  busy: { tr: "yoğun / meşgul / kalabalık", ipa: "/ˈbɪz.i/", pos: "adj", level: "A1" },
  crowded: { tr: "kalabalık", ipa: "/ˈkraʊ.dɪd/", pos: "adj", level: "A2" },
  empty: { tr: "boş", ipa: "/ˈemp.ti/", pos: "adj", level: "A2" },
  bright: { tr: "parlak / aydınlık", ipa: "/braɪt/", pos: "adj", level: "A2" },
  brightest: { tr: "en parlak", ipa: "/ˈbraɪ.tɪst/", pos: "adj", level: "A2" },
  dark: { tr: "karanlık / koyu", ipa: "/dɑːrk/", pos: "adj", level: "A1" },
  darkness: { tr: "karanlık", ipa: "/ˈdɑːrk.nəs/", pos: "noun", level: "A2" },
  calm: { tr: "sakin / dingin", ipa: "/kɑːm/", pos: "adj", level: "A2" },
  peaceful: { tr: "huzurlu / barışçıl", ipa: "/ˈpiːs.fəl/", pos: "adj", level: "A2" },
  patient: { tr: "sabırlı / hasta", ipa: "/ˈpeɪ.ʃənt/", pos: "adj", level: "A2" },
  patience: { tr: "sabır", ipa: "/ˈpeɪ.ʃəns/", pos: "noun", level: "B1" },
  curious: { tr: "meraklı", ipa: "/ˈkjʊr.i.əs/", pos: "adj", level: "B1" },
  curiosity: { tr: "merak", ipa: "/ˌkjʊr.iˈɑː.sə.t̬i/", pos: "noun", level: "B1" },
  wise: { tr: "bilge / akıllı", ipa: "/waɪz/", pos: "adj", level: "B1" },
  wisdom: { tr: "bilgelik / akıl", ipa: "/ˈwɪz.dəm/", pos: "noun", level: "B2" },
  new: { tr: "yeni", ipa: "/nuː/", pos: "adj", level: "A1" },
  newfound: { tr: "yeni edinilmiş", ipa: "/ˈnuː.faʊnd/", pos: "adj", level: "B2" },
  old: { tr: "eski / yaşlı", ipa: "/oʊld/", pos: "adj", level: "A1" },
  ancient: { tr: "kadim / antik / çok eski", ipa: "/ˈeɪn.ʃənt/", pos: "adj", level: "B1" },
  timeless: { tr: "zamansız / ebedi", ipa: "/ˈtaɪm.ləs/", pos: "adj", level: "B2" },
  ordinary: { tr: "sıradan / olağan", ipa: "/ˈɔːr.dən.er.i/", pos: "adj", level: "B1" },
  extraordinary: { tr: "olağanüstü / fevkalade", ipa: "/ɪkˈstrɔːr.dən.er.i/", pos: "adj", level: "B2" },
  narrow: { tr: "dar", ipa: "/ˈner.oʊ/", pos: "adj", level: "A2" },
  wide: { tr: "geniş", ipa: "/waɪd/", pos: "adj", level: "A2" },
  secret: { tr: "sır / gizli", ipa: "/ˈsiː.krət/", pos: "noun", level: "A2" },
  secrets: { tr: "sırlar", ipa: "/ˈsiː.krəts/", pos: "noun", level: "A2" },
  mystery: { tr: "gizem / esrar", ipa: "/ˈmɪs.tɚ.i/", pos: "noun", level: "B1" },
  mysteries: { tr: "gizemler", ipa: "/ˈmɪs.tɚ.iz/", pos: "noun", level: "B1" },
  mysterious: { tr: "gizemli / esrarengiz", ipa: "/mɪˈstɪr.i.əs/", pos: "adj", level: "B1" },
  true: { tr: "gerçek / doğru", ipa: "/truː/", pos: "adj", level: "A1" },
  truth: { tr: "hakikat / gerçek", ipa: "/truːθ/", pos: "noun", level: "A2" },
  truly: { tr: "gerçekten", ipa: "/ˈtruː.li/", pos: "adv", level: "B1" },

  // Nouns & Entities
  morning: { tr: "sabah", ipa: "/ˈmɔːr.nɪŋ/", pos: "noun", level: "A1" },
  afternoon: { tr: "öğleden sonra", ipa: "/ˌæf.tɚˈnuːn/", pos: "noun", level: "A1" },
  evening: { tr: "akşam", ipa: "/ˈiːv.nɪŋ/", pos: "noun", level: "A1" },
  night: { tr: "gece", ipa: "/naɪt/", pos: "noun", level: "A1" },
  sunset: { tr: "gün batımı", ipa: "/ˈsʌn.set/", pos: "noun", level: "A2" },
  sunrise: { tr: "gün doğumu", ipa: "/ˈsʌn.raɪz/", pos: "noun", level: "A2" },
  day: { tr: "gün", ipa: "/deɪ/", pos: "noun", level: "A1" },
  days: { tr: "günler", ipa: "/deɪz/", pos: "noun", level: "A1" },
  hour: { tr: "saat (süre)", ipa: "/aʊr/", pos: "noun", level: "A1" },
  hours: { tr: "saatler", ipa: "/aʊrz/", pos: "noun", level: "A1" },
  time: { tr: "zaman / vakit", ipa: "/taɪm/", pos: "noun", level: "A1" },
  times: { tr: "zamanlar / defalar", ipa: "/taɪmz/", pos: "noun", level: "A1" },
  town: { tr: "kasaba / şehir", ipa: "/taʊn/", pos: "noun", level: "A1" },
  city: { tr: "şehir / kent", ipa: "/ˈsɪt.i/", pos: "noun", level: "A1" },
  street: { tr: "sokak / cadde", ipa: "/striːt/", pos: "noun", level: "A1" },
  streets: { tr: "sokaklar", ipa: "/striːts/", pos: "noun", level: "A1" },
  path: { tr: "yol / patika", ipa: "/pæθ/", pos: "noun", level: "A2" },
  paths: { tr: "yollar", ipa: "/pæðz/", pos: "noun", level: "A2" },
  forward: { tr: "öne doğru / ileri", ipa: "/ˈfɔːr.wɚd/", pos: "adv", level: "A2" },
  ahead: { tr: "önde / ileride", ipa: "/əˈhed/", pos: "adv", level: "A2" },
  heart: { tr: "kalp / yürek", ipa: "/hɑːrt/", pos: "noun", level: "A1" },
  breeze: { tr: "esinti / meltem", ipa: "/briːz/", pos: "noun", level: "B1" },
  wind: { tr: "rüzgar", ipa: "/wɪnd/", pos: "noun", level: "A1" },
  light: { tr: "ışık / aydınlık", ipa: "/laɪt/", pos: "noun", level: "A1" },
  memory: { tr: "hatıra / hafıza", ipa: "/ˈmem.ər.i/", pos: "noun", level: "A2" },
  memories: { tr: "hatıralar / anılar", ipa: "/ˈmem.ər.iz/", pos: "noun", level: "A2" },
  wonder: { tr: "mucize / merak etmek", ipa: "/ˈwʌn.dɚ/", pos: "noun", level: "B1" },
  wonders: { tr: "mucizeler / harikalar", ipa: "/ˈwʌn.dɚz/", pos: "noun", level: "B1" },
  forgotten: { tr: "unutulmuş", ipa: "/fɚˈɡɑː.tən/", pos: "adj", level: "A2" },
  nobody: { tr: "hiç kimse", ipa: "/ˈnoʊ.bɑː.di/", pos: "pron", level: "A1" },
  everybody: { tr: "herkes", ipa: "/ˈev.riˌbɑː.di/", pos: "pron", level: "A1" },
  someone: { tr: "biri / birisi", ipa: "/ˈsʌm.wʌn/", pos: "pron", level: "A1" },
  anyone: { tr: "herhangi biri", ipa: "/ˈen.i.wʌn/", pos: "pron", level: "A1" },
  first: { tr: "ilk / birinci", ipa: "/fɝːst/", pos: "adj", level: "A1" },
  last: { tr: "son / sonuncu", ipa: "/læst/", pos: "adj", level: "A1" },
  finally: { tr: "sonunda / nihayet", ipa: "/ˈfaɪ.nəl.i/", pos: "adv", level: "A2" },
  always: { tr: "her zaman / daima", ipa: "/ˈɔːl.weɪz/", pos: "adv", level: "A1" },
  never: { tr: "asla / hiçbir zaman", ipa: "/ˈnev.ɚ/", pos: "adv", level: "A1" },
  often: { tr: "sık sık / genellikle", ipa: "/ˈɑːf.tən/", pos: "adv", level: "A1" },
  sometimes: { tr: "bazen / ara sıra", ipa: "/ˈsʌm.taɪmz/", pos: "adv", level: "A1" },
  how: { tr: "nasıl / ne kadar", ipa: "/haʊ/", pos: "adv", level: "A1" },
  what: { tr: "ne / neyi", ipa: "/wɑːt/", pos: "pron", level: "A1" },
  where: { tr: "nerede / nereye", ipa: "/wer/", pos: "adv", level: "A1" },
  why: { tr: "neden / niçin", ipa: "/waɪ/", pos: "adv", level: "A1" },
  which: { tr: "hangi / hangisi", ipa: "/wɪtʃ/", pos: "det", level: "A1" },
  who: { tr: "kim / kimi", ipa: "/huː/", pos: "pron", level: "A1" },
  whose: { tr: "kimin", ipa: "/huːz/", pos: "pron", level: "A2" },
  only: { tr: "yalnızca / sadece", ipa: "/ˈoʊn.li/", pos: "adv", level: "A1" },
  just: { tr: "sadece / henüz", ipa: "/dʒʌst/", pos: "adv", level: "A1" },
  very: { tr: "çok / oldukça", ipa: "/ˈver.i/", pos: "adv", level: "A1" },
  back: { tr: "geri / arka", ipa: "/bæk/", pos: "adv", level: "A1" },
  story: { tr: "hikaye / öykü", ipa: "/ˈstɔːr.i/", pos: "noun", level: "A1" },
  stories: { tr: "hikayeler / masallar", ipa: "/ˈstɔːr.iz/", pos: "noun", level: "A1" },
  book: { tr: "kitap", ipa: "/bʊk/", pos: "noun", level: "A1" },
  books: { tr: "kitaplar", ipa: "/bʊks/", pos: "noun", level: "A1" },
  room: { tr: "oda", ipa: "/ruːm/", pos: "noun", level: "A1" },
  rooms: { tr: "odalar", ipa: "/ruːmz/", pos: "noun", level: "A1" },
  window: { tr: "pencere", ipa: "/ˈwɪn.doʊ/", pos: "noun", level: "A1" },
  windows: { tr: "pencereler", ipa: "/ˈwɪn.doʊz/", pos: "noun", level: "A1" },
  door: { tr: "kapı", ipa: "/dɔːr/", pos: "noun", level: "A1" },
  doors: { tr: "kapılar", ipa: "/dɔːrz/", pos: "noun", level: "A1" },
  table: { tr: "masa", ipa: "/ˈteɪ.bəl/", pos: "noun", level: "A1" },
  chair: { tr: "sandalye", ipa: "/tʃer/", pos: "noun", level: "A1" },
  water: { tr: "su", ipa: "/ˈwɑː.t̬ɚ/", pos: "noun", level: "A1" },
  coffee: { tr: "kahve", ipa: "/ˈkɑː.fi/", pos: "noun", level: "A1" },
  tea: { tr: "çay", ipa: "/tiː/", pos: "noun", level: "A1" },
  cup: { tr: "fincan / kupa", ipa: "/kʌp/", pos: "noun", level: "A1" },
  people: { tr: "insanlar / halk", ipa: "/ˈpiː.pəl/", pos: "noun", level: "A1" },
  person: { tr: "kişi / insan", ipa: "/ˈpɝː.sən/", pos: "noun", level: "A1" },
  world: { tr: "dünya", ipa: "/wɝːld/", pos: "noun", level: "A1" },
  earth: { tr: "yeryüzü / dünya", ipa: "/ɝːθ/", pos: "noun", level: "A2" },
  sky: { tr: "gökyüzü", ipa: "/skaɪ/", pos: "noun", level: "A1" },
  sun: { tr: "güneş", ipa: "/sʌn/", pos: "noun", level: "A1" },
  moon: { tr: "ay", ipa: "/muːn/", pos: "noun", level: "A1" },
  star: { tr: "yıldız", ipa: "/stɑːr/", pos: "noun", level: "A1" },
  stars: { tr: "yıldızlar", ipa: "/stɑːrz/", pos: "noun", level: "A1" },
  cloud: { tr: "bulut", ipa: "/klaʊd/", pos: "noun", level: "A1" },
  clouds: { tr: "bulutlar", ipa: "/klaʊdz/", pos: "noun", level: "A1" },
  rain: { tr: "yağmur", ipa: "/reɪn/", pos: "noun", level: "A1" },
  rainy: { tr: "yağmurlu", ipa: "/ˈreɪ.ni/", pos: "adj", level: "A1" },
  snow: { tr: "kar", ipa: "/snoʊ/", pos: "noun", level: "A1" },
  sea: { tr: "deniz", ipa: "/siː/", pos: "noun", level: "A1" },
  ocean: { tr: "okyanus", ipa: "/ˈoʊ.ʃən/", pos: "noun", level: "A2" },
  tree: { tr: "ağaç", ipa: "/triː/", pos: "noun", level: "A1" },
  trees: { tr: "ağaçlar", ipa: "/triːz/", pos: "noun", level: "A1" },
  flower: { tr: "çiçek", ipa: "/ˈflaʊ.ɚ/", pos: "noun", level: "A1" },
  flowers: { tr: "çiçekler", ipa: "/ˈflaʊ.ɚz/", pos: "noun", level: "A1" },
  forest: { tr: "orman", ipa: "/ˈfɔːr.ɪst/", pos: "noun", level: "A2" },
  mountain: { tr: "dağ", ipa: "/ˈmaʊn.tən/", pos: "noun", level: "A2" },
  mountains: { tr: "dağlar", ipa: "/ˈmaʊn.tənz/", pos: "noun", level: "A2" },
  river: { tr: "nehir / ırmak", ipa: "/ˈrɪv.ɚ/", pos: "noun", level: "A2" },
  // Food & Kitchen
  chef: { tr: "şef / aşçı", ipa: "/ʃef/", pos: "noun", level: "A2" },
  cook: { tr: "yemek pişirmek / aşçı", ipa: "/kʊk/", pos: "verb", level: "A1" },
  cooked: { tr: "pişirdi", ipa: "/kʊkt/", pos: "verb", level: "A1" },
  cooking: { tr: "yemek pişirme / aşçılık", ipa: "/ˈkʊk.ɪŋ/", pos: "noun", level: "A1" },
  kitchen: { tr: "mutfak", ipa: "/ˈkɪtʃ.ən/", pos: "noun", level: "A1" },
  recipe: { tr: "yemek tarifi", ipa: "/ˈres.ə.pi/", pos: "noun", level: "A2" },
  recipes: { tr: "tarifler", ipa: "/ˈres.ə.piz/", pos: "noun", level: "A2" },
  meal: { tr: "öğün / yemek", ipa: "/miːl/", pos: "noun", level: "A1" },
  meals: { tr: "yemekler", ipa: "/miːlz/", pos: "noun", level: "A1" },
  dish: { tr: "yemek / tabak", ipa: "/dɪʃ/", pos: "noun", level: "A2" },
  dishes: { tr: "yemekler / bulaşıklar", ipa: "/ˈdɪʃ.ɪz/", pos: "noun", level: "A2" },
  bread: { tr: "ekmek", ipa: "/bred/", pos: "noun", level: "A1" },
  soup: { tr: "çorba", ipa: "/suːp/", pos: "noun", level: "A1" },
  spices: { tr: "baharatlar", ipa: "/ˈspaɪ.sɪz/", pos: "noun", level: "B1" },
  spice: { tr: "baharat", ipa: "/spaɪs/", pos: "noun", level: "B1" },
  spicy: { tr: "baharatlı / acı", ipa: "/ˈspaɪ.si/", pos: "adj", level: "A2" },
  sweet: { tr: "tatlı", ipa: "/swiːt/", pos: "adj", level: "A1" },
  delicious: { tr: "lezzetli / nefis", ipa: "/dɪˈlɪʃ.əs/", pos: "adj", level: "A2" },
  fresh: { tr: "taze", ipa: "/freʃ/", pos: "adj", level: "A1" },
  vegetable: { tr: "sebze", ipa: "/ˈvedʒ.tə.bəl/", pos: "noun", level: "A1" },
  vegetables: { tr: "sebzeler", ipa: "/ˈvedʒ.tə.bəlz/", pos: "noun", level: "A1" },
  fruit: { tr: "meyve", ipa: "/fruːt/", pos: "noun", level: "A1" },
  fruits: { tr: "meyveler", ipa: "/fruːts/", pos: "noun", level: "A1" },
  olive: { tr: "zeytin", ipa: "/ˈɑː.lɪv/", pos: "noun", level: "A2" },
  oil: { tr: "yağ", ipa: "/ɔɪl/", pos: "noun", level: "A1" },
  salt: { tr: "tuz", ipa: "/sɑːlt/", pos: "noun", level: "A1" },
  pepper: { tr: "biber / karabiber", ipa: "/ˈpep.ɚ/", pos: "noun", level: "A1" },
  sugar: { tr: "şeker", ipa: "/ˈʃʊɡ.ɚ/", pos: "noun", level: "A1" },
  milk: { tr: "süt", ipa: "/mɪlk/", pos: "noun", level: "A1" },
  cheese: { tr: "peynir", ipa: "/tʃiːz/", pos: "noun", level: "A1" },
  egg: { tr: "yumurta", ipa: "/eɡ/", pos: "noun", level: "A1" },
  eggs: { tr: "yumurtalar", ipa: "/eɡz/", pos: "noun", level: "A1" },
  prepare: { tr: "hazırlamak", ipa: "/prɪˈper/", pos: "verb", level: "A2" },
  prepared: { tr: "hazırladı", ipa: "/prɪˈperd/", pos: "verb", level: "A2" },
  preparing: { tr: "hazırlayan", ipa: "/prɪˈper.ɪŋ/", pos: "verb", level: "A2" },
  serve: { tr: "servis etmek / sunmak", ipa: "/sɝːv/", pos: "verb", level: "A2" },
  served: { tr: "servis etti / sundu", ipa: "/sɝːvd/", pos: "verb", level: "A2" },
  serving: { tr: "servis etme", ipa: "/ˈsɝː.vɪŋ/", pos: "noun", level: "A2" },

  // Places, Buildings & Nature
  shop: { tr: "dükkan / mağaza", ipa: "/ʃɑːp/", pos: "noun", level: "A1" },
  shops: { tr: "dükkanlar", ipa: "/ʃɑːps/", pos: "noun", level: "A1" },
  market: { tr: "pazar / çarşı", ipa: "/ˈmɑːr.kɪt/", pos: "noun", level: "A1" },
  markets: { tr: "pazarlar", ipa: "/ˈmɑːr.kɪts/", pos: "noun", level: "A1" },
  restaurant: { tr: "restoran / lokanta", ipa: "/ˈres.tə.rɑːnt/", pos: "noun", level: "A1" },
  garden: { tr: "bahçe", ipa: "/ˈɡɑːr.dən/", pos: "noun", level: "A1" },
  gardens: { tr: "bahçeler", ipa: "/ˈɡɑːr.dənz/", pos: "noun", level: "A1" },
  park: { tr: "park", ipa: "/pɑːrk/", pos: "noun", level: "A1" },
  bridge: { tr: "köprü", ipa: "/brɪdʒ/", pos: "noun", level: "A2" },
  bridges: { tr: "köprüler", ipa: "/ˈbrɪdʒ.ɪz/", pos: "noun", level: "A2" },
  castle: { tr: "kale / şato", ipa: "/ˈkæs.əl/", pos: "noun", level: "A2" },
  castles: { tr: "kaleler", ipa: "/ˈkæs.əlz/", pos: "noun", level: "A2" },
  tower: { tr: "kule", ipa: "/ˈtaʊ.ɚ/", pos: "noun", level: "A2" },
  towers: { tr: "kuleler", ipa: "/ˈtaʊ.ɚz/", pos: "noun", level: "A2" },
  village: { tr: "köy", ipa: "/ˈvɪl.ɪdʒ/", pos: "noun", level: "A1" },
  island: { tr: "ada", ipa: "/ˈaɪ.lənd/", pos: "noun", level: "A2" },
  lake: { tr: "göl", ipa: "/leɪk/", pos: "noun", level: "A2" },
  hill: { tr: "tepe", ipa: "/hɪl/", pos: "noun", level: "A2" },
  hills: { tr: "tepeler", ipa: "/hɪlz/", pos: "noun", level: "A2" },
  stone: { tr: "taş", ipa: "/stoʊn/", pos: "noun", level: "A1" },
  stones: { tr: "taşlar", ipa: "/stoʊnz/", pos: "noun", level: "A1" },
  iron: { tr: "demir", ipa: "/ˈaɪ.ɚn/", pos: "noun", level: "A2" },
  bronze: { tr: "bronz / tunç", ipa: "/brɑːnz/", pos: "noun", level: "B1" },
  gold: { tr: "altın", ipa: "/ɡoʊld/", pos: "noun", level: "A1" },
  golden: { tr: "altından / altın sarısı", ipa: "/ˈɡoʊl.dən/", pos: "adj", level: "A2" },
  silver: { tr: "gümüş", ipa: "/ˈsɪl.vɚ/", pos: "noun", level: "A2" },

  // People, Roles & Relationships
  detective: { tr: "dedektif", ipa: "/dɪˈtek.tɪv/", pos: "noun", level: "A2" },
  apprentice: { tr: "çırak", ipa: "/əˈpren.t̬ɪs/", pos: "noun", level: "B2" },
  master: { tr: "usta / sahip", ipa: "/ˈmæs.tɚ/", pos: "noun", level: "B1" },
  artist: { tr: "sanatçı / ressam", ipa: "/ˈɑːr.t̬ɪst/", pos: "noun", level: "A1" },
  author: { tr: "yazar", ipa: "/ˈɑː.θɚ/", pos: "noun", level: "A2" },
  student: { tr: "öğrenci", ipa: "/ˈstuː.dənt/", pos: "noun", level: "A1" },
  students: { tr: "öğrenciler", ipa: "/ˈstuː.dənts/", pos: "noun", level: "A1" },
  teacher: { tr: "öğretmen", ipa: "/ˈtiː.tʃɚ/", pos: "noun", level: "A1" },
  friend: { tr: "arkadaş / dost", ipa: "/frend/", pos: "noun", level: "A1" },
  friends: { tr: "arkadaşlar", ipa: "/frendz/", pos: "noun", level: "A1" },
  friendly: { tr: "dost canlısı / sıcak", ipa: "/ˈfrend.li/", pos: "adj", level: "A1" },
  neighbor: { tr: "komşu", ipa: "/ˈneɪ.bɚ/", pos: "noun", level: "A2" },
  neighbors: { tr: "komşular", ipa: "/ˈneɪ.bɚz/", pos: "noun", level: "A2" },
  child: { tr: "çocuk", ipa: "/tʃaɪld/", pos: "noun", level: "A1" },
  children: { tr: "çocuklar", ipa: "/ˈtʃɪl.drən/", pos: "noun", level: "A1" },
  boy: { tr: "erkek çocuk", ipa: "/bɔɪ/", pos: "noun", level: "A1" },
  girl: { tr: "kız çocuk", ipa: "/ɡɝːl/", pos: "noun", level: "A1" },
  man: { tr: "adam / erkek", ipa: "/mæn/", pos: "noun", level: "A1" },
  men: { tr: "adamlar", ipa: "/men/", pos: "noun", level: "A1" },
  woman: { tr: "kadın", ipa: "/ˈwʊm.ən/", pos: "noun", level: "A1" },
  women: { tr: "kadınlar", ipa: "/ˈwɪm.ɪn/", pos: "noun", level: "A1" },
  family: { tr: "aile", ipa: "/ˈfæm.əl.i/", pos: "noun", level: "A1" },
  father: { tr: "baba", ipa: "/ˈfɑː.ðɚ/", pos: "noun", level: "A1" },
  mother: { tr: "anne", ipa: "/ˈmʌð.ɚ/", pos: "noun", level: "A1" },
  brother: { tr: "erkek kardeş", ipa: "/ˈbrʌð.ɚ/", pos: "noun", level: "A1" },
  sister: { tr: "kız kardeş", ipa: "/ˈsɪs.tɚ/", pos: "noun", level: "A1" },
  grandfather: { tr: "büyükbaba / dede", ipa: "/ˈɡræn.fɑː.ðɚ/", pos: "noun", level: "A1" },
  grandmother: { tr: "büyükanne / nine", ipa: "/ˈɡræn.mʌð.ɚ/", pos: "noun", level: "A1" },

  // Objects & Tools
  box: { tr: "kutu", ipa: "/bɑːks/", pos: "noun", level: "A1" },
  boxes: { tr: "kutular", ipa: "/ˈbɑːk.sɪz/", pos: "noun", level: "A1" },
  shelf: { tr: "raf", ipa: "/ʃelf/", pos: "noun", level: "A2" },
  notebook: { tr: "defter", ipa: "/ˈnoʊt.bʊk/", pos: "noun", level: "A1" },
  diary: { tr: "günlük", ipa: "/ˈdaɪ.ɚ.i/", pos: "noun", level: "A2" },
  letter: { tr: "mektup / harf", ipa: "/ˈlet̬.ɚ/", pos: "noun", level: "A1" },
  letters: { tr: "harfler / mektuplar", ipa: "/ˈlet̬.ɚz/", pos: "noun", level: "A1" },
  clue: { tr: "ipucu", ipa: "/kluː/", pos: "noun", level: "B1" },
  clues: { tr: "ipuçları", ipa: "/kluːz/", pos: "noun", level: "B1" },
  map: { tr: "harita", ipa: "/mæp/", pos: "noun", level: "A1" },
  maps: { tr: "haritalar", ipa: "/mæps/", pos: "noun", level: "A1" },
  painting: { tr: "tablo / resim", ipa: "/ˈpeɪn.tɪŋ/", pos: "noun", level: "A2" },
  paintings: { tr: "tablolar", ipa: "/ˈpeɪn.tɪŋz/", pos: "noun", level: "A2" },
  picture: { tr: "resim / fotoğraf", ipa: "/ˈpɪk.tʃɚ/", pos: "noun", level: "A1" },
  pocket: { tr: "cep", ipa: "/ˈpɑː.kɪt/", pos: "noun", level: "A2" },
  coat: { tr: "palto / mont", ipa: "/koʊt/", pos: "noun", level: "A1" },
  shoes: { tr: "ayakkabılar", ipa: "/ʃuːz/", pos: "noun", level: "A1" },

  // Feelings, Mind & Qualities
  happy: { tr: "mutlu", ipa: "/ˈhæp.i/", pos: "adj", level: "A1" },
  happiness: { tr: "mutluluk", ipa: "/ˈhæp.i.nəs/", pos: "noun", level: "A2" },
  smile: { tr: "gülümsemek / tebessüm", ipa: "/smaɪl/", pos: "verb", level: "A1" },
  smiled: { tr: "gülümsedi", ipa: "/smaɪld/", pos: "verb", level: "A1" },
  smiling: { tr: "gülümseyen", ipa: "/ˈsmaɪ.lɪŋ/", pos: "adj", level: "A1" },
  joy: { tr: "sevinç / neşe", ipa: "/dʒɔɪ/", pos: "noun", level: "B1" },
  kind: { tr: "nazik / kibar / tür", ipa: "/kaɪnd/", pos: "adj", level: "A1" },
  kindness: { tr: "nezaket / iyilik", ipa: "/ˈkaɪnd.nəs/", pos: "noun", level: "A2" },
  love: { tr: "sevgi / sevmek", ipa: "/lʌv/", pos: "verb", level: "A1" },
  loved: { tr: "sevdi", ipa: "/lʌvd/", pos: "verb", level: "A1" },
  hope: { tr: "umut / ummak", ipa: "/hoʊp/", pos: "noun", level: "A1" },
  hoped: { tr: "umdu", ipa: "/hoʊpt/", pos: "verb", level: "A2" },
  afraid: { tr: "korkmuş", ipa: "/əˈfreɪd/", pos: "adj", level: "A1" },
  brave: { tr: "cesur", ipa: "/breɪv/", pos: "adj", level: "A2" },
  courage: { tr: "cesaret", ipa: "/ˈkɝː.ɪdʒ/", pos: "noun", level: "B1" },
  simple: { tr: "basit / yalın", ipa: "/ˈsɪm.pəl/", pos: "adj", level: "A1" },
  deep: { tr: "derin", ipa: "/diːp/", pos: "adj", level: "A2" },
  clear: { tr: "açık / net / berrak", ipa: "/klɪr/", pos: "adj", level: "A1" },
  clearly: { tr: "açıkça / net bir şekilde", ipa: "/ˈklɪr.li/", pos: "adv", level: "A2" },
  ready: { tr: "hazır", ipa: "/ˈred.i/", pos: "adj", level: "A1" },
  safely: { tr: "güvenle / sağ salim", ipa: "/ˈseɪf.li/", pos: "adv", level: "A2" },
  safe: { tr: "güvenli", ipa: "/seɪf/", pos: "adj", level: "A1" },
  unforgettable: { tr: "unutulmaz", ipa: "/ˌʌn.fɚˈɡet̬.ə.bəl/", pos: "adj", level: "B2" },
  exciting: { tr: "heyecan verici", ipa: "/ɪkˈsaɪ.t̬ɪŋ/", pos: "adj", level: "A1" },
  excited: { tr: "heyecanlı", ipa: "/ɪkˈsaɪ.t̬ɪd/", pos: "adj", level: "A1" },
  strange: { tr: "garip / tuhaf", ipa: "/streɪndʒ/", pos: "adj", level: "A2" },

  // Common Action Verbs
  solve: { tr: "çözmek", ipa: "/sɑːlv/", pos: "verb", level: "A2" },
  solved: { tr: "çözdü", ipa: "/sɑːlvd/", pos: "verb", level: "A2" },
  share: { tr: "paylaşmak", ipa: "/ʃer/", pos: "verb", level: "A1" },
  shared: { tr: "paylaştı", ipa: "/ʃerd/", pos: "verb", level: "A1" },
  sharing: { tr: "paylaşım / paylaşan", ipa: "/ˈʃer.ɪŋ/", pos: "verb", level: "A2" },
  gather: { tr: "toplanmak / bir araya gelmek", ipa: "/ˈɡæð.ɚ/", pos: "verb", level: "B1" },
  gathered: { tr: "toplandı", ipa: "/ˈɡæð.ɚd/", pos: "verb", level: "B1" },
  follow: { tr: "takip etmek", ipa: "/ˈfɑː.loʊ/", pos: "verb", level: "A1" },
  followed: { tr: "takip etti", ipa: "/ˈfɑː.loʊd/", pos: "verb", level: "A1" },
  guide: { tr: "rehberlik etmek / kılavuz", ipa: "/ɡaɪd/", pos: "verb", level: "B1" },
  guided: { tr: "rehberlik etti", ipa: "/ˈɡaɪ.dɪd/", pos: "verb", level: "B1" },
  reveal: { tr: "ortaya çıkarmak / göstermek", ipa: "/rɪˈviːl/", pos: "verb", level: "B2" },
  revealed: { tr: "ortaya çıkardı", ipa: "/rɪˈviːld/", pos: "verb", level: "B2" },
  realize: { tr: "farkına varmak / anlamak", ipa: "/ˈriː.ə.laɪz/", pos: "verb", level: "A2" },
  realized: { tr: "farkına vardı", ipa: "/ˈriː.ə.laɪzd/", pos: "verb", level: "A2" },
  lead: { tr: "önderlik etmek / yol göstermek", ipa: "/liːd/", pos: "verb", level: "A2" },
  led: { tr: "yol gösterdi / ulaştırdı", ipa: "/led/", pos: "verb", level: "A2" },
  care: { tr: "özen / bakım / önemsemek", ipa: "/ker/", pos: "noun", level: "A2" },
  surround: { tr: "çevrelemek / kuşatmak", ipa: "/səˈraʊnd/", pos: "verb", level: "B1" },
  surrounded: { tr: "çevrili / kuşatılmış", ipa: "/səˈraʊn.dɪd/", pos: "adj", level: "B1" },
};

/**
 * Remove punctuation and normalize a single word token
 */
export function cleanWordToken(raw: string): string {
  if (!raw) return "";
  return raw
    .trim()
    .replace(/^[^a-zA-Z0-9]+/, "")
    .replace(/[^a-zA-Z0-9]+$/, "");
}

/**
 * Lemmatize / stem English words to find matching lexicon entry
 */
export function lookupWordInLexicon(rawWord: string): LexiconEntry | null {
  const clean = cleanWordToken(rawWord).toLowerCase();
  if (!clean) return null;

  // 1. Direct match
  if (EN_TR_LEXICON[clean]) {
    return EN_TR_LEXICON[clean];
  }

  // 2. Handle possessive (e.g. "traveler's", "passenger's")
  if (clean.endsWith("'s") || clean.endsWith("s'")) {
    const base = clean.replace(/'s$/, "").replace(/s'$/, "");
    if (EN_TR_LEXICON[base]) {
      const match = EN_TR_LEXICON[base];
      return {
        ...match,
        tr: `${match.tr} (aitlik: -in/-ın)`,
      };
    }
  }

  // 3. Plurals (-s, -es, -ies)
  if (clean.endsWith("ies") && clean.length > 4) {
    const base = clean.slice(0, -3) + "y";
    if (EN_TR_LEXICON[base]) {
      const match = EN_TR_LEXICON[base];
      return { ...match, tr: `${match.tr} (çoğul)` };
    }
  }

  if (clean.endsWith("es") && clean.length > 3) {
    const base = clean.slice(0, -2);
    if (EN_TR_LEXICON[base]) {
      const match = EN_TR_LEXICON[base];
      return { ...match, tr: `${match.tr} (çoğul)` };
    }
  }

  if (clean.endsWith("s") && clean.length > 3) {
    const base = clean.slice(0, -1);
    if (EN_TR_LEXICON[base]) {
      const match = EN_TR_LEXICON[base];
      return { ...match, tr: `${match.tr} (çoğul)` };
    }
  }

  // 4. Past tense / Participle (-ed, -d)
  if (clean.endsWith("ed") && clean.length > 3) {
    // tried -> try
    if (clean.endsWith("ied") && clean.length > 4) {
      const base = clean.slice(0, -3) + "y";
      if (EN_TR_LEXICON[base]) {
        const match = EN_TR_LEXICON[base];
        return { ...match, tr: `${match.tr} (geçmiş zaman)`, pos: "verb" };
      }
    }
    // stopped -> stop
    if (clean.length > 4 && clean[clean.length - 3] === clean[clean.length - 4]) {
      const base = clean.slice(0, -3);
      if (EN_TR_LEXICON[base]) {
        const match = EN_TR_LEXICON[base];
        return { ...match, tr: `${match.tr} (geçmiş zaman)`, pos: "verb" };
      }
    }
    const baseE = clean.slice(0, -1); // e.g. "changed" -> "change"
    if (EN_TR_LEXICON[baseE]) {
      const match = EN_TR_LEXICON[baseE];
      return { ...match, tr: `${match.tr} (geçmiş zaman)`, pos: "verb" };
    }
    const base = clean.slice(0, -2); // e.g. "walked" -> "walk"
    if (EN_TR_LEXICON[base]) {
      const match = EN_TR_LEXICON[base];
      return { ...match, tr: `${match.tr} (geçmiş zaman)`, pos: "verb" };
    }
  }

  // 5. Continuous (-ing)
  if (clean.endsWith("ing") && clean.length > 4) {
    // stopping -> stop
    if (clean.length > 5 && clean[clean.length - 4] === clean[clean.length - 5]) {
      const base = clean.slice(0, -4);
      if (EN_TR_LEXICON[base]) {
        const match = EN_TR_LEXICON[base];
        return { ...match, tr: `${match.tr} (-iyor / şimdiki zaman)`, pos: "verb" };
      }
    }
    // making -> make
    const baseE = clean.slice(0, -3) + "e";
    if (EN_TR_LEXICON[baseE]) {
      const match = EN_TR_LEXICON[baseE];
      return { ...match, tr: `${match.tr} (-iyor / yapan)`, pos: "verb" };
    }
    // walking -> walk
    const base = clean.slice(0, -3);
    if (EN_TR_LEXICON[base]) {
      const match = EN_TR_LEXICON[base];
      return { ...match, tr: `${match.tr} (-iyor / yapan)`, pos: "verb" };
    }
  }

  // 6. Adverb suffix (-ly)
  if (clean.endsWith("ly") && clean.length > 3) {
    const base = clean.slice(0, -2);
    if (EN_TR_LEXICON[base]) {
      const match = EN_TR_LEXICON[base];
      return { ...match, tr: `${match.tr} bir şekilde`, pos: "adv" };
    }
  }

  return null;
}

/**
 * Generate a clean phonetic IPA approximation for standard English words
 */
export function generatePhoneticIpa(word: string): string {
  const clean = cleanWordToken(word).toLowerCase();
  const entry = lookupWordInLexicon(clean);
  if (entry?.ipa) return entry.ipa;

  return `/${clean}/`;
}
