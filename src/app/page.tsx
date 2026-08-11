"use client";

import { useState } from "react";

interface WordData {
  word: string;
  clean: string;
  translation: string;
  ipa: string;
  partOfSpeech: string;
  isNew?: boolean;
}

const sampleStoryTokens: WordData[] = [
  { word: "Leo", clean: "Leo", translation: "Leo (isim)", ipa: "/ˈliː.oʊ/", partOfSpeech: "noun" },
  { word: "walked", clean: "walked", translation: "yürüdü", ipa: "/wɔːkt/", partOfSpeech: "verb" },
  { word: "into", clean: "into", translation: "içine doğru", ipa: "/ˈɪn.tuː/", partOfSpeech: "prep" },
  { word: "the", clean: "the", translation: "o / belirli artikel", ipa: "/ðə/", partOfSpeech: "det" },
  { word: "quiet", clean: "quiet", translation: "sessiz, sakin", ipa: "/ˈkwaɪ.ət/", partOfSpeech: "adj" },
  { word: "library,", clean: "library", translation: "kütüphane", ipa: "/ˈlaɪ.brər.i/", partOfSpeech: "noun" },
  { word: "holding", clean: "holding", translation: "tutarak, elinde tutarak", ipa: "/ˈhoʊl.dɪŋ/", partOfSpeech: "verb" },
  { word: "an", clean: "an", translation: "bir", ipa: "/æn/", partOfSpeech: "det" },
  { word: "ancient", clean: "ancient", translation: "antik, çok eski", ipa: "/ˈeɪn.ʃənt/", partOfSpeech: "adj", isNew: true },
  { word: "journal.", clean: "journal", translation: "günlük / seyir defteri", ipa: "/ˈdʒɜːr.nəl/", partOfSpeech: "noun" },
  { word: "He", clean: "He", translation: "O (erkek)", ipa: "/hiː/", partOfSpeech: "pron" },
  { word: "knew", clean: "knew", translation: "biliyordu", ipa: "/nuː/", partOfSpeech: "verb" },
  { word: "that", clean: "that", translation: "şu / ki", ipa: "/ðæt/", partOfSpeech: "conj" },
  { word: "each", clean: "each", translation: "her bir", ipa: "/iːtʃ/", partOfSpeech: "det" },
  { word: "page", clean: "page", translation: "sayfa", ipa: "/peɪdʒ/", partOfSpeech: "noun" },
  { word: "contained", clean: "contained", translation: "içeriyordu", ipa: "/kənˈteɪnd/", partOfSpeech: "verb" },
  { word: "fascinating", clean: "fascinating", translation: "büyüleyici, hayranlık uyandırıcı", ipa: "/ˈfæs.ən.eɪ.tɪŋ/", partOfSpeech: "adj", isNew: true },
  { word: "secrets", clean: "secrets", translation: "sırlar", ipa: "/ˈsiː.krəts/", partOfSpeech: "noun" },
  { word: "about", clean: "about", translation: "hakkında", ipa: "/əˈbaʊt/", partOfSpeech: "prep" },
  { word: "the", clean: "the", translation: "belirli artikel", ipa: "/ðə/", partOfSpeech: "det" },
  { word: "forgotten", clean: "forgotten", translation: "unutulmuş", ipa: "/fərˈɡɑː.tən/", partOfSpeech: "adj" },
  { word: "realm.", clean: "realm", translation: "diyar, krallık", ipa: "/relm/", partOfSpeech: "noun", isNew: true },
];

export default function Home() {
  const [selectedWord, setSelectedWord] = useState<WordData | null>(sampleStoryTokens[8]);
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set(["ancient"]));

  const toggleSaveWord = (cleanWord: string) => {
    setSavedWords((prev) => {
      const next = new Set(prev);
      if (next.has(cleanWord)) {
        next.delete(cleanWord);
      } else {
        next.add(cleanWord);
      }
      return next;
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-[#E8E2D6] dark:border-[#2A2B32] bg-[#FDFBF7]/80 dark:bg-[#121316]/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-tight text-[#2A2723] dark:text-[#E6E4DF]">
              📚 GoLing<span className="text-[#2D6A4F] dark:text-[#52B788]">read</span>
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#E8F5E9] dark:bg-[#143820] text-[#1B5E20] dark:text-[#81C784] border border-[#C8E6C9] dark:border-[#1E4D2B]">
              %95 Comprehensible Input
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6E675F] dark:text-[#9A9790]">
              Stephen Krashen Metodolojisi
            </span>
          </div>
        </div>
      </header>

      {/* Main Reading Preview Area */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 flex-1">
        {/* Intro Card */}
        <div className="mb-8 p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#1B1C20] border border-[#E8E2D6] dark:border-[#2A2B32] shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#2A2723] dark:text-[#E6E4DF]">
              Doğal Dil Edinimi ile İngilizce Okuma Deneyimi
            </h1>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-[#E8F5E9] dark:bg-[#143820] text-[#1B5E20] dark:text-[#81C784] border border-[#A5D6A7] dark:border-[#2E7D32]">
                <span className="w-2 h-2 rounded-full bg-[#2E7D32] dark:bg-[#81C784]" />
                %96 Anlaşılabilirlik (Optimal)
              </span>
            </div>
          </div>
          <p className="text-sm sm:text-base text-[#6E675F] dark:text-[#9A9790] leading-relaxed">
            Metindeki kelimelerin üzerine tıklayarak anlık bağlamsal Türkçe çevirisini, okunuşunu görebilir ve kelime defterinize ekleyebilirsiniz.
          </p>
        </div>

        {/* Reading Article Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reader Area (2 cols) */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#1B1C20] border border-[#E8E2D6] dark:border-[#2A2B32] shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E8E2D6]/60 dark:border-[#2A2B32]">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#6E675F] dark:text-[#9A9790]">
                Bölüm 1: The Library of Shadows
              </span>
              <span className="text-xs text-[#6E675F] dark:text-[#9A9790]">
                B1 Seviyesi • 3 Yeni Kelime
              </span>
            </div>

            {/* Interactive Story Text */}
            <div className="font-story text-xl sm:text-2xl leading-[2.1] text-[#2A2723] dark:text-[#E6E4DF] flex flex-wrap gap-x-2 gap-y-1">
              {sampleStoryTokens.map((token, index) => {
                const isSelected = selectedWord?.clean === token.clean;
                const isSaved = savedWords.has(token.clean);

                return (
                  <button
                    key={`${token.clean}-${index}`}
                    type="button"
                    onClick={() => setSelectedWord(token)}
                    className={`transition-all rounded-md px-1 py-0.5 inline-block text-left cursor-pointer ${
                      isSelected
                        ? "bg-[#2D6A4F] text-white ring-2 ring-[#2D6A4F] dark:bg-[#52B788] dark:text-[#121316] dark:ring-[#52B788]"
                        : token.isNew
                        ? "bg-[#FFF8E1] text-[#795548] dark:bg-[#3E3211] dark:text-[#FFE082] underline decoration-dotted decoration-[#FFA000]"
                        : isSaved
                        ? "bg-[#E8F5E9] text-[#1B5E20] dark:bg-[#143820] dark:text-[#81C784]"
                        : "hover:bg-[#F0EBE1] dark:hover:bg-[#2A2B32]"
                    }`}
                  >
                    {token.word}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Word Inspector Sidebar (1 col) */}
          <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#1B1C20] border border-[#E8E2D6] dark:border-[#2A2B32] shadow-xs flex flex-col justify-between">
            {selectedWord ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-[#6E675F] dark:text-[#9A9790]">
                      Seçilen Kelime
                    </span>
                    <h2 className="text-2xl font-bold text-[#2A2723] dark:text-[#E6E4DF]">
                      {selectedWord.clean}
                    </h2>
                    <span className="text-xs text-[#6E675F] dark:text-[#9A9790] font-mono">
                      {selectedWord.ipa} • {selectedWord.partOfSpeech}
                    </span>
                  </div>
                  {selectedWord.isNew && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[#FFF8E1] text-[#F57F17] dark:bg-[#3E3211] dark:text-[#FFD54F]">
                      Yeni
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-[#E8E2D6] dark:border-[#2A2B32]">
                  <span className="text-xs text-[#6E675F] dark:text-[#9A9790] block mb-1">
                    Bağlamsal Türkçe Karşılığı:
                  </span>
                  <p className="text-base font-semibold text-[#2D6A4F] dark:text-[#52B788]">
                    {selectedWord.translation}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleSaveWord(selectedWord.clean)}
                  className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    savedWords.has(selectedWord.clean)
                      ? "bg-[#E8F5E9] text-[#1B5E20] border border-[#A5D6A7] dark:bg-[#143820] dark:text-[#81C784] dark:border-[#2E7D32]"
                      : "bg-[#2D6A4F] text-white hover:bg-[#245640] dark:bg-[#52B788] dark:text-[#121316] dark:hover:bg-[#40966E]"
                  }`}
                >
                  {savedWords.has(selectedWord.clean)
                    ? "✓ Kelime Defterine Eklendi"
                    : "+ Kelime Defterine Ekle"}
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-[#6E675F] dark:text-[#9A9790] text-sm">
                Kelime detayını ve çevirisini görmek için metindeki bir kelimeye tıklayın.
              </div>
            )}

            {/* Krashen Badge Legend */}
            <div className="pt-6 mt-6 border-t border-[#E8E2D6] dark:border-[#2A2B32] space-y-2">
              <span className="text-xs font-semibold text-[#6E675F] dark:text-[#9A9790] block uppercase tracking-wider">
                Seviye Rozetleri
              </span>
              <div className="flex flex-col gap-1.5 text-xs text-[#6E675F] dark:text-[#9A9790]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
                  <span><strong>%95+ Yeşil:</strong> Optimal Akıcı Okuma</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F57F17]" />
                  <span><strong>%85 - %94 Sarı:</strong> Geliştirici Seviye</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C62828]" />
                  <span><strong>&lt;%85 Kırmızı:</strong> Zorlayıcı</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E2D6] dark:border-[#2A2B32] py-6 text-center text-xs text-[#6E675F] dark:text-[#9A9790]">
        GoLingread • Stephen Krashen %95 Comprehensible Input Reading Engine
      </footer>
    </div>
  );
}
