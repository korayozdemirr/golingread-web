# İş Mantığı & Dil Edinimi Standartları (Business Logic)

Bu kural seti, **GoLingread** platformunun dil öğrenme metodolojisini, kavranabilirlik metriklerini ve kelime etkileşim kurallarını tanımlar.

---

## 🧠 1. Stephen Krashen & %95 Comprehensible Input ($i+1$)

Dilbilimci Stephen Krashen'ın "Girdi Hipotezi"ne (Input Hypothesis) göre, doğal ve kalıcı dil edinimi, kullanıcının mevcut seviyesinin bir adım üzerindeki ($i+1$) ve büyük oranda anlaşılan metinleri tüketmesiyle gerçekleşir.

- Bir metnin **doğal bir şekilde edinilebilmesi** için metindeki kelimelerin en az **%95'inin** kullanıcı tarafından bilinmesi (veya bağlamdan rahatlıkla çıkarılabilmesi) gerekir.
- Bilinmeyen kelime oranı %5'in üzerinde olduğunda metin okuma akıcılığını kaybeder ve kullanıcıyı yorar.

---

## 🏷️ 2. Anlaşılabilirlik Rozet Mantığı (Badge Logic)

Her hikaye/metin, kullanıcının güncel kelime haznesine göre dinamik olarak analiz edilir ve aşağıdaki rozetlerle etiketlenir:

| Rozet | Anlaşılabilirlik Oranı | Durum | Açıklama |
|---|---|---|---|
| 🟢 **Yeşil Rozet** | **%95 ve Üzeri** | **Optimal / Okumaya Hazır** | Kullanıcı için ideal $i+1$ dil edinimi seviyesi. Akıcı şekilde okunabilir. |
| 🟡 **Sarı Rozet** | **%85 - %94** | **Geliştirici / Orta Seviye** | Biraz çaba ve kelimeye bakma gerektirir; kelime haznesini geliştirmek için uygundur. |
| 🔴 **Kırmızı / Turuncu** | **<%85** | **Zor / Tavsiye Edilmez** | Yoğun sözlük kullanımı gerektirir, doğal dil edinim akışını bozar. |

---

## 👆 3. Kelime Tıklama & Etkileşim Kuralları (Word Interactions)

1. **Tokenize Edilmiş Kelimeler:**
   - Metin içerisindeki her kelime bağımsız bir etkileşimli nesnedir (token).
   - Noktalama işaretleri kelimeden ayırt edilmelidir.

2. **Anlık Bilgi Kartı (Quick Modal / Tooltip):**
   - Kullanıcı bir kelimeye tıkladığında sayfa yenilenmeden hızlı bir popover/kart açılır.
   - **İçerik:**
     - Türkçe bağlamsal çevirisi
     - Fonetik okunuş (IPA)
     - Sesli telaffuz dinleme (TTS / Audio)
     - Kelime kökü (Lemma / Root form)
     - Örnek cümle içinde kullanımı

3. **Kelime Durumu Yönetimi:**
   - **"Kelimeyi Kaydet" (Save to Deck):** Tıklanan kelime tek dokunuşla kullanıcının kelime defterine (Spaced Repetition havuzuna) eklenebilmelidir.
   - **Durumlar:**
     - ⚪ *Bilinmeyen / Yeni (Unknown)*
     - 🟡 *Öğreniliyor (Learning)*
     - 🟢 *Öğrenildi / Biliniyor (Mastered)*
