# Sprint 4 — Boss Savaşı (Split-Screen)

> **Not:** En kritik sprint. Can'ın dökümanı geldikten sonra detaylandırılacak. Aşağıda iskelet plan.

## Önce Şunları Oku

1. `CLAUDE.md`, `DECISIONS.md`, `PROGRESS.md`
2. `docs/architecture.md` — "Split-Screen Boss Savaşı"
3. `docs/gameplay.md` — "Boss Savaşı — Detaylı Mekanik"
4. **Varsa** `docs/can-doc.md`

## Hedef

Boss zone'undan E ile gir → split-screen savaş sahnesi → 4 soruda boss'u öldür → odaya dön (level++ + coin).

## Yapılacaklar

1. **`js/scenes/BossScene.js`:**
   - Üst yarı Phaser canvas (resize'la): karakter (sol), boss (sağ), iki HP barı (en üst)
   - Alt yarı DOM (#question-panel): soru + cevap
2. **HP Bar:**
   - Street Fighter tarzı yatay bar
   - Soldan dolu, sağa boşalır
   - Renk: yeşil → sarı → kırmızı (HP düştükçe)
3. **Karakter ve Boss:**
   - Sprint 4'te basit dikdörtgen (Rectangle) yeter, sprite Sprint 7'de
   - Boss daha büyük (~64x64), karakter ~32x32
4. **Soru Akışı:**
   - 4 soru kuyruğu (questions.json'dan `useFor: "boss-1"` filtreli)
   - Doğru → boss HP -= 25, "vuruş" animasyonu (boss shake)
   - Yanlış → soruyu "yanlış kuyruğu"na ekle, sıradakine geç
   - 4 soru bittikten sonra yanlış kuyruğunu tekrar sor
   - Boss HP 0 → zafer ekranı + coin ödülü + RoomScene'e dön (level++)
5. **Animasyonlar (basit):**
   - Doğru: karakter sağa-sola sallanır, boss shake
   - Boss ölümü: opacity 0'a fade + "Boss yenildi!" yazı

## Açık Sorular (Can'ın dökümanı netleştirecek)

- Boss da hasar verir mi? (Yoksa sadece oyuncu vuruyor mu?)
- Yanlış kuyruğu da bittiğinde boss ölmediyse ne olur? (Yeni 4 soru? Oyun bitti?)
- Coin ödülü kaç? Level başına sabit mi, performansa bağlı mı?

## Yapma

- Mağaza (Sprint 5)
- Level progression (Sprint 6 — Sprint 4 sonunda console.log: "level 2'ye geçildi")
- Sprite'lı karakter (Sprint 7)
- Müzik/ses (Sprint 7)

## Test

- Boss zone → E → split-screen açılır
- HP barları görünür (oyuncu 100, boss 100)
- Soru gel, doğru cevapla → boss HP 75
- Yanlış cevapla → kuyruğa eklendi, sıradaki gel
- 4 soruda boss ölmedi mi → yanlışlar tekrar sorulur
- Boss öldü → zafer ekranı → RoomScene
- Coin arttı (registry'de)

## Belirsizlik Olursa

Mutlaka sor — bu sprint büyük. Yanlış varsayım = çok kod silme.
