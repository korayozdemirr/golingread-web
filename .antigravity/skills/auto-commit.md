---
name: auto-commit
description: Görev veya aşama tamamlandığında git durumunu kontrol edip standart commit mesajıyla değişiklikleri commit eder.
---

# Auto Commit Yeteneği (Skill)

Bu yetenek, bir geliştirme adımı veya görev başarıyla tamamlandığında ve doğrulandığında `git` durumunu kontrol eder, dosyaları stage eder ve Conventional Commits formatına uygun bir mesajla commit oluşturur.

---

## 🛠️ Yürütme Adımları

1. **Durum Kontrolü (Inspect Status):**
   ```bash
   git status
   ```
   - Değiştirilen, yeni eklenen veya silinen dosyalar incelenir.

2. **Dosyaların Stage Edilmesi (Stage Files):**
   ```bash
   git add .
   ```
   *(veya göreve özel belirli dosya yolları)*

3. **Commit Oluşturma (Create Commit):**
   ```bash
   git commit -m "<type>: <yapılan işin kısa ve net özeti>"
   ```

---

## 📝 Mesaj Türü Belirleme Rehberi

- **`feat:`** Yeni sayfa, bileşen veya API entegrasyonu tamamlandığında.
- **`fix:`** Hata, çökme veya mantık hatası giderildiğinde.
- **`style:`** Renk, tipografi, padding, responsive UI düzenlemeleri yapıldığında.
- **`refactor:`** Kod temizliği, tip tanımlamaları ve optimizasyonlar yapıldığında.
- **`docs:`** Dokümantasyon veya kılavuzlar güncellendiğinde.
