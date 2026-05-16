# Sprint 3 — Isınma Soruları

> **Not:** Bu sprint Can'ın detaylı dökümanı geldikten sonra detaylandırılacak. Aşağıdaki taslak, dökümandan önce başlanırsa geçerli.

## Önce Şunları Oku

1. `CLAUDE.md`, `DECISIONS.md`, `PROGRESS.md`
2. `docs/architecture.md` — "Soru JSON Formatı"
3. `docs/gameplay.md` — "Oda — Etkileşim Mantığı"
4. **Varsa** `docs/can-doc.md` (Can'ın dökümanı)

## Hedef

Isınma zone'una girip E'ye basınca soru görünsün. Soru cevaplanınca odaya geri dön.

## Yapılacaklar

1. **`data/questions.json`** oluştur — en az 5 ısınma sorusu (basit, 6. sınıf altı)
   - Math-quiz'in formatıyla uyumlu (`id`, `type`, `text`, `options`, `correct`, `hint`, `explanation`, `difficulty`, `useFor: ["warmup"]`)
2. **`js/scenes/WarmupScene.js`:**
   - Phaser sahne, açılınca rastgele bir warmup sorusu seç
   - DOM overlay olarak göster (`#question-panel` div) — Phaser canvas'ın üstünde modal
   - Soru, seçenekler, "Cevapla" butonu
   - Doğru → "Aferin!" + küçük coin ödülü (örn: 5 coin)
   - Yanlış → "Yanlış, doğrusu X" + açıklama
   - "Devam" butonu → RoomScene'e dön
3. **State:** coin Phaser registry'de tutulsun (Sprint 5'te localStorage'a yazılır)

## Yapma

- Mağaza UI (Sprint 5)
- Boss savaşı (Sprint 4)
- Save (Sprint 6)
- Karmaşık animasyon (Sprint 7)

## Test

- Isınma zone → E → soru görün
- Doğru cevap → coin++ feedback
- Yanlış cevap → açıklama görün
- "Devam" → odaya dön, karakter aynı yerde
- 3-4 kere oyna, farklı sorular gelsin (tekrar etmesin, tükenince sıfırlansın)

## Belirsizlik Olursa

- Soru kaynağı: Can yazacak mı, Claude üretsin mi taslak olarak?
- Coin ödülü 5 mi, 10 mu? Can'ın ekonomi planı var mı?
- Modal mı yoksa tam sahne mı? (Modal hızlı, sahne daha gösterişli)
