# Sprint 2 — Etkileşim Zone'ları

## Önce Şunları Oku

1. `CLAUDE.md`
2. `DECISIONS.md`
3. `PROGRESS.md` (Sprint 1 bittiğinden emin ol)
4. `docs/architecture.md`
5. `docs/gameplay.md` — özellikle "Oda — Etkileşim Mantığı"

## Hedef

Odaya 3 etkileşim noktası ekle: **Isınma**, **Mağaza**, **Boss kapısı**. Karakter yakına gelince üstünde prompt görünür ("Press E"). E'ye basınca console'a "warmup açıldı" / "mağaza açıldı" / "boss savaşı başlıyor" yazsın. Asıl sahneler sonraki sprint'lerde.

## Yapılacaklar

1. **3 Zone Yerleşimi** — odanın 3 farklı köşesinde
   - Isınma: sol üst
   - Mağaza: sağ üst
   - Boss kapısı: alt orta (kapı gibi görünsün, daha büyük)
2. **Görsel:** her zone bir renkli dikdörtgen (label'lı) — sprite yok
   - Isınma: yeşil
   - Mağaza: sarı
   - Boss: kırmızı
3. **Phaser overlap:** karakter zone içine girince zone üstüne "Press E" text'i çiz
4. **Tuş input:** E veya Space tuşu — overlap aktifken basılırsa konsola log
5. **Çıkış:** zone'dan çıkınca prompt kaybolur

## Yapma

- Soru göstermek (Sprint 3)
- Mağaza UI'sı (Sprint 5)
- Boss savaşı (Sprint 4)
- Sahne değişimi (sadece console.log yeter şimdilik)

## Test

- Her zone'a yaklaş → prompt görün
- E'ye bas → console'a log düşsün
- Zone'dan çık → prompt kaybolsun
- Mobil'de zone'lar görünüyor mu (kontrol opsiyonel)

## Bitirince

PROGRESS.md güncelle, push'la, canlı URL'de test et.

## Belirsizlik Olursa

- Zone konumları yukarıdaki gibi mi, başka mı?
- Prompt yazısı "Press E" mi, "E ile aç" mı (Türkçe)?
- E tuşu mu Space mı default — ikisi de mi?
