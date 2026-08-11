# Git İş Akışı & Conventional Commits Standartları

Bu kural seti, projedeki versiyon kontrolü, commit mesaj formatı ve görev sonrası otomatik commit standartlarını tanımlar.

---

## 📌 1. Conventional Commits Formatı

Tüm commit mesajları aşağıdaki standart yapıya uygun olmalıdır:

```text
<type>(<scope>): <kısa ve net açıklama>

[isteğe bağlı detaylı açıklama]
```

### Desteklenen Türler (Types)
- **`feat:`** Yeni bir özellik veya kullanıcıya yönelik işlevsellik eklendiğinde.
- **`fix:`** Bir hata veya beklenmeyen davranış düzeltildiğinde.
- **`style:`** Kod çalışma mantığını değiştirmeyen UI/UX, CSS, font veya biçimlendirme değişikliklerinde.
- **`refactor:`** Kodun okunabilirliğini artıran ancak davranışını değiştirmeyen yapısal düzenlemelerde.
- **`docs:`** Dokümantasyon, README veya AI kural dosyalarında yapılan değişikliklerde.
- **`perf:`** Performans iyileştirmelerinde.
- **`test:`** Test ekleme veya mevcut testleri güncellemede.
- **`chore:`** Paket kurulumları, konfigürasyon dosyaları veya derleme araçları değişikliklerinde.

---

## ⚡ 2. Görev Tamamlama Sonrası Otomatik Commit Kuralı

1. **İş Paketi Tamamlandığında:**
   - Tanımlanan bir görev, bileşen geliştirme veya hata düzeltme adımı tamamlanıp doğrulandığında bekletilmeden commit oluşturulmalıdır.
2. **Commit Adımları:**
   - `git status` ile değişen dosyalar listelenir.
   - Yapılan işe ait ilgili dosyalar `git add <dosyalar>` ile stage edilir.
   - Anlamlı ve standartlara uygun bir commit mesajı ile `git commit -m "..."` komutu çalıştırılır.
3. **Commit Bütünlüğü:**
   - Birbiriyle ilgisiz değişiklikler tek bir commit içerisine toplanmamalıdır (Atomic commits).
