# Proje Hafızası & Geliştirici Kuralları (Project Memory)

Bu kural dosyası, **GoLingread** projesinin mimari kararlarını, tasarım standartlarını, dil sınırlarını ve geçmişte çözülen hatalardan çıkarılan prensipleri içerir. Gelecekteki tüm geliştirmelerde bu kurallara harfiyen uyulmalıdır.

---

## 🌐 1. Global İngilizce Arayüz & Türkçe Sınırları Kuralı

- **Arayüz Dili (Global UI):** Tüm butonlar, başlıklar, menüler, etiketler, sayaçlar, filtreler ve modal metinleri **İngilizce** olmalıdır.
  - *(Örn: "Stories", "My Vocabulary", "Level Test", "Start Reading", "Min read", "Match Score")*
- **Türkçe Karşılıkların İzin Verildiği Tek Alanlar:**
  1. **Kelime Tıklama Popover Kartı:** Kullanıcının tıkladığı kelimenin bağlamsal Türkçe anlamı (`Contextual Turkish Translation: [Türkçe Karşılık]`).
  2. **Paragraf Çevirisi Açılır Alanı:** Paragrafın sonundaki çeviri butonu tıklandığında açılan Türkçe metin bloğu.
- Arayüz genelinde asla Türkçe ve İngilizce metinler karıştırılmamalıdır.

---

## 🎨 2. Kağıt Teması & Kontrast Duyarlılığı Kuralı (Paper Themes)

- Reader Canvas ve okuyucu içi bileşenlerde (`ReaderCanvas`, `ReaderToolbar`, `StoryQuiz`, `SponsorSidebar`):
  - **Asla sabit `dark:text-...` veya `text-black` sınıfları kullanılmamalıdır.**
  - Çünkü kullanıcı globalde Dark Mode açıkken okuma kağıdı olarak **Cream** veya **Sepia** seçebilir.
  - Tüm başlıklar, kartlar, kenarlıklar ve metinler aktif `readingTheme` (`cream`, `white`, `sepia`, `dark`) nesnesine duyarlı olmalıdır.
- **Kelime Vurgu (Hover) Standartları:**
  - **Cream Teması:** `hover:bg-amber-100 hover:text-amber-950`, seçili: `bg-amber-200 text-amber-950 font-medium`.
  - **Sepia Teması:** `hover:bg-[#E8DCC4] hover:text-[#2B2118]`, seçili: `bg-[#DECDB2] text-[#2B2118] font-medium`.
  - **White Teması:** `hover:bg-indigo-50 hover:text-indigo-950`, seçili: `bg-indigo-100 text-indigo-950 font-medium`.
  - **Dark Teması:** `hover:bg-white/15 hover:text-white`, seçili: `bg-white/25 text-white font-medium`.

---

## 📖 3. Okuma Ergonomisi & Tipografi Standartları

- **Okuma Genişliği:** Maksimum `68ch` (`max-w-[68ch]`).
- **Yazı Tipi:** `Lora` (Google Fonts - Serif), `line-height: 1.8`, `letter-spacing: 0.01em`.
- **Arayüz Yazı Tipi:** `Inter` (Google Fonts - Sans-serif).
- **Sıfır Kayma (Zero Layout Shift):** Kelimelerin üzerine gelindiğinde veya tıklandığında metin satırları asla kaymamalıdır (`px-0.5 rounded-sm`).

---

## 🧠 4. Krashen %95 Hesaplama & Rozet Standartları

Her hikaye için eşleşme oranı `calculateStoryMatch(story, userLevelNumber)` fonksiyonu ile hesaplanır:
- 🟢 **Optimal (≥%95):** `bg-emerald-100 text-emerald-800 border-emerald-200`
- 🟡 **Challenging (%85-%94):** `bg-amber-100 text-amber-800 border-amber-200`
- ⚪ **Advanced (<%85):** `bg-slate-100 text-slate-700 border-slate-200`

---

## ⚡ 5. Git İş Akışı & Auto-Commit

- Tamamlanan her görev sonrasında `npm run lint` ve `npm run build` ile derleme doğrulanmalı, ardından Conventional Commits formatında otomatik commit atılmalıdır:
  - `feat:` Yeni sayfa, bileşen veya özellik
  - `fix:` Hata ve kontrast düzeltmeleri
  - `style:` UI, CSS ve tema düzenlemeleri
  - `docs:` Dokümantasyon ve kural dosyaları
