# Karar Log'u

Bu dosya verilen tüm kararların kalıcı kaydıdır. Sadece eklenir, silinmez. Karar geri alınırsa: eski kararı çizgile (`~~strikethrough~~`), altına yeni kararı yaz.

Format: `**[YYYY-MM-DD]** karar — sebep`

---

## 2026-05-16 — İlk Karar Seti

### Platform ve Teknoloji
- **[2026-05-16]** Engine: **Phaser 3** (CDN'den) — Sebep: 2D game engine standartı, sprite/animation/scene hazır, vanilla canvas'la sıfırdan yazmak zaman kaybı.
- **[2026-05-16]** Build step yok, npm yok — Sebep: Phaser CDN'den çekilebiliyor, basit kalsın.
- **[2026-05-16]** Soru UI Phaser'da değil **DOM**'da — Sebep: boss savaşı split-screen, üst yarı Phaser canvas / alt yarı HTML+CSS. Soru UI'sını Phaser ile yazmak hem zor hem gereksiz.
- **[2026-05-16]** Backend yok — localStorage yeter.
- **[2026-05-16]** Yayın: **GitHub Pages** — Sebep: statik, ücretsiz, link ile paylaşılabilir. Bilgisayar/kod taşıma yok.
- **[2026-05-16]** Asset path'leri relative (`./assets/...`) — Sebep: GitHub Pages alt-path'inde absolute path kırılır.

### Kod Yazma Sorumluluğu
- **[2026-05-16]** Kodu Güngör + Claude Code yazar. Can kod yazmıyor. Can'ın katkısı: oyun tasarımı, döküman, test.

### Oyun Konsepti (Can'ın anlattığı)
- **[2026-05-16]** Karakter bir odada uyanır, WASD ile dolaşır.
- **[2026-05-16]** Odada 3 etkileşim noktası: ısınma soruları (basit math), mağaza (coin harcama), boss kapısı.
- **[2026-05-16]** Boss savaşı split-screen: üst yarı karakter+boss+HP (Street Fighter tarzı), alt yarı soru.
- **[2026-05-16]** Boss seviye başına 4 soru, her doğru %25 hasar — Sebep: Can'ın belirlediği oyun mantığı.
- **[2026-05-16]** Yanlış cevap sona kalır, en son tekrar sorulur — Sebep: Can'ın isteği, öğretici.
- **[2026-05-16]** Boss ölünce sonraki level — coin kazanılır, mağazada +can/ipucu alınır.
- **[2026-05-16]** Grafik kalitesi düşük olabilir — Sebep: Can: "kaliteli grafiğe gerek yok".

### Karşı-Tasarım (Yapılmayacaklar)
- **[2026-05-16]** Reklam yok, mikro ödeme yok — çocuk ürünü etiği.
- **[2026-05-16]** Boss şiddeti estetik — patlama/efekt OK, kan/gore yok.

---

## Şablon — Yeni Karar Eklerken

```
**[YYYY-MM-DD]** karar — sebep
```
