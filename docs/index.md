# Can Boss RPG — Vizyon

## Tek Cümle

Karakter bir odada uyanır, WASD ile dolaşır, ısınma sorularıyla ısınır, boss kapısından girer ve matematik soruları sorarak boss'u öldürür. Coin kazanır, mağazada +can/ipucu alır. Level atladıkça boss zorlaşır.

## Aktörler

- **Can:** Oyun tasarımcısı. Fikrin sahibi. Detaylı döküman üzerinde çalışıyor.
- **Güngör:** Kod yöneticisi, Claude Code'a komut veren.
- **Claude Code:** Kodu yazan.

## Konsept

### Açılış Odası
- Karakter odada uyanır (animasyon opsiyonel)
- WASD ile dolaşır (top-down 2D)
- Oda duvarlarla çevrili, sınırın dışına çıkamaz
- Odada 3 etkileşim noktası:
  - **Isınma soruları** (kolay, ısınma amaçlı)
  - **Mağaza** (coin ile +can / ipucu satın al)
  - **Boss kapısı** (asıl mücadele)

### Boss Savaşı (Split-Screen)
- Ekran yatay ikiye bölünür
- **Üst yarı (Phaser canvas):**
  - Solda çocuk karakter, sağda boss
  - En üstte iki HP barı (Street Fighter tarzı)
  - Hasar animasyonu, ölüm animasyonu
- **Alt yarı (DOM):**
  - Matematik sorusu
  - Cevap input'u veya seçenekler
  - "Cevapla" butonu
- **Mekanik:**
  - 4 soru per level
  - Doğru = boss'a %25 hasar
  - Yanlış = boss'a hasar yok (ve soru sona kalır, tekrar sorulur)
  - Boss HP 0 = level biter, coin kazanılır
  - Level X soru zorluğu Can'ın belirlediği bir formülle artar (TBD)

### Mağaza
- Boss'u öldürünce / level sonunda erişim
- Coin ile item satın al:
  - +can (HP boost)
  - İpucu (zor soruda gösterilir)
  - *Diğer item'lar Can'ın listesinde*

## Açık Sorular (Can'ın Dökümanı Bekleniyor)

- [ ] Kaç level olacak? Final boss var mı?
- [ ] Her level farklı boss mu yoksa aynı boss güçleniyor mu?
- [ ] Item listesi tam? (+can, ipucu, ne daha?)
- [ ] Coin ekonomisi: level başı kaç coin? Item fiyatları?
- [ ] Oda görseli: arka plan? tile? düz renk?
- [ ] Karakter görseli: emoji? sprite? Can çizecek mi?
- [ ] Boss görseli: kaç farklı boss? görsel kim yapacak?
- [ ] Müzik / ses efekti? (MVP'de olmayabilir)
- [ ] Save sistemi: kaldığı level'dan devam mı, her açılışta sıfırdan mı?
- [ ] Oyun başlığı?
- [ ] Soru bankası: math-quiz'inkini paylaşır mı, ayrı mı?
- [ ] Isınma sorularıyla boss sorularının farkı nedir? (zorluk? puanlama?)

## Math-Quiz İle İlişki

- **Ayrı proje, ayrı repo.** Karışmasın.
- **Paylaşılabilir parçalar:** soru JSON formatı, validation mantığı (kopyalanabilir).
- **Bağımlılık yok** — biri çalışırken diğerinden bağımsız.

## Vizyon Önceliği

1. **Önce:** GitHub Pages'da çalışan minimal şey (Sprint 1)
2. **Sonra:** Can'ın dökümanını incele, sprint'leri planla
3. **Sonra:** Sırayla sprint'leri tamamla, her sprint sonunda Pages'a deploy
