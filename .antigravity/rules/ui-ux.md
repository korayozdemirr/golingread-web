# UI & UX Tasarım Prensipleri

Bu kural seti, **GoLingread** projesindeki kullanıcı arayüzü ve kullanıcı deneyimi standartlarını belirler. Projenin ana odağı, kullanıcının dil edinim sürecini en konforlu ve kesintisiz şekilde sürdürebilmesidir.

---

## 🎯 Temel Felsefe
1. **Okuma Odaklılık (Reading-First Design):** Tüm arayüz ögeleri, okuma akışını ve metin konforunu desteklemek üzere tasarlanmalıdır.
2. **Minimalizm ve Sıfır Dikkat Dağınıklığı:** Sayfada dikkat dağıtıcı bannerlar, reklamlar, karmaşık menüler veya yanıp sönen elementler bulunmamalıdır.
3. **Ergonomik Tipografi & Renkler:** Uzun süreli okumalarda göz yorgunluğunu önleyen sıcak tonlar ve yüksek okunabilirlikli yazı tipleri kullanılmalıdır.

---

## 🔤 Tipografi Standartları

- **Metin & Hikaye İçeriği:** `Lora` (Google Fonts - Serif)
  - Hikaye gövde metinlerinde, kitap okuma hissini ve akıcılığını sağlamak için serif font tercih edilir.
  - Satır yüksekliği: `leading-relaxed` (1.75 - 1.85)
  - Paragraf aralığı: `mb-6`
  - Maksimum satır uzunluğu: `max-w-prose` (yaklaşık 65-75 karakter/ch)

- **Arayüz (UI) & Kontroller:** `Inter` (Google Fonts - Sans-Serif)
  - Başlıklar, butonlar, sayaçlar, istatistikler, kelime kartları ve menüler için temiz sans-serif kullanılır.

---

## 🎨 Renk Paleti

### 1. Krem Modu (Light / Day Mode - Varsayılan)
Geleneksel saf beyaz (`#ffffff`) yerine gözü yormayan sıcak kitap kağıdı tonları kullanılır:
- **Arka Plan (Background):** `#FDFBF7` veya `#F7F4EE` (Warm Cream / Soft Paper)
- **Kart & Yüzey (Surface):** `#FFFFFF` (Subtle Warm Border `#E8E2D6`)
- **Metin (Foreground):** `#2A2723` (Deep Charcoal - Saf siyah yerine sıcak kömür)
- **İkincil Metin (Muted):** `#6E675F`
- **Vurgu & İpucu (Accent):** `#3B694F` (Forest/Sage Green) veya `#C47D3B` (Warm Amber)

### 2. Gece Modu (Dark / Night Mode)
- **Arka Plan (Background):** `#121316` (Deep Charcoal Black)
- **Kart & Yüzey (Surface):** `#1B1C20` (Border `#2A2B32`)
- **Metin (Foreground):** `#E6E4DF` (Soft Warm White)
- **İkincil Metin (Muted):** `#9A9790`

---

## 📖 Okuma Alanı Standartları

1. **Genişlik Kısıtlaması:** Okuma alanı asla tam ekran genişliğinde olmamalı, merkezi `max-w-3xl` veya `max-w-2xl` konteyner içerisinde sunulmalıdır.
2. **Kişiselleştirilebilir Okuma Araçları:**
   - Font boyutu ölçekleme (A- / A+)
   - Satır aralığı ve tema değiştirme hızlı menüsü
3. **Etkileşimli Kelimeler (Clickable Tokens):**
   - Her kelime üzerine gelindiğinde (hover) hafif arka plan rengi veya alt çizgi ile tıklanabilir olduğunu hissettirmeli (`cursor-pointer`).
   - Tıklama animasyonu yumuşak ve gecikmesiz olmalıdır.
