# Gameplay

## Oyun Akışı

```
[Açılış / Başlık]
    ↓ "Başla" → isim al
[Oda — uyandın]
    ↓ WASD ile dolaş
    ├──→ [Isınma Soruları] (basit math, ısınma)
    │       ↓ doğru → küçük ödül (coin?)
    │       ↓ tekrar odaya dön
    ├──→ [Mağaza]
    │       ↓ coin ile +can / ipucu al
    │       ↓ tekrar odaya dön
    └──→ [Boss Kapısı]
            ↓ savaş başlar
        [Boss Savaşı — split screen]
            ↓ 4 soru, doğru = %25 hasar
            ↓ boss öldü
        [Level Sonu]
            ↓ coin kazandın, level++
            ↓ odaya dön (yeni level)
```

## Kontroller

- **WASD** — karakter hareketi (oda içi)
- **E** veya **Space** — etkileşim noktasında "konuş/aç"
- **ESC** — modal/panel kapat (mağaza, soru)
- **Mouse / Touch** — soru seçeneklerine tıkla, mağaza item'ına tıkla

## Oda — Etkileşim Mantığı

Karakter bir zone'a girdiğinde:
1. Zone üstünde "Press E" promptu görünür
2. E'ye basılınca ilgili sahne açılır (WarmupScene / ShopScene / BossScene)
3. Sahne kapanınca karakter yine odadadır, aynı yerde

Zone'lar Phaser'da `Phaser.GameObjects.Zone` veya görünür `Sprite` olarak çizilir. Çarpışma değil, "overlap" — karakter zone'un üzerinden geçebilir, prompt görünür.

## Boss Savaşı — Detaylı Mekanik

### Başlangıç
- Karakter HP: Mağazada satın aldıklarıyla artırılmış başlangıç HP'si (default 100)
- Boss HP: 100 (her doğru cevap %25 düşürür → 4 doğru = ölür)
- Soru havuzu: bu level için seçilen 4 soru
- Yanlış havuzu: boş

### Tur Yapısı
```
1. Sırada bekleyen ilk soruyu göster
2. Oyuncu cevaplar
3a. Doğru → boss HP -= 25, "Vuruş!" animasyonu, sıradaki soruya geç
3b. Yanlış → soru "yanlış havuzu"na eklenir, sıradaki soruya geç
4. Tüm 4 soru bittikten sonra:
   - Boss HP > 0 ise → yanlış havuzundaki soruları tekrar sor (yanlış havuzu boşalana kadar)
   - Boss HP = 0 → zafer
5. Yanlış havuzu da bittiğinde boss hala ayakta ise → hangi durumda? (TBD: oyuncu öldü mü?)
```

### Açık Mekanik Soruları (TBD)
- [ ] Boss hiç hasar vermiyor mu? Yoksa zaman/yanlış başına oyuncuya da hasar mı? (Can'ın dökümanı netleştirecek)
- [ ] Süre baskısı var mı? Soru başına timer? (default: yok, MVP basit)
- [ ] İpucu kullanımı boss savaşında nasıl? Yarı puan? Yarı hasar?
- [ ] Yanlış havuzu da bitince boss ölmediyse oyun bitti mi yoksa yeni soru havuzu mu? (Can'ın kararı)

### Görsel/Animasyon
- Doğru cevap → karakter saldırı animasyonu (basit: sprite ileri-geri), boss sallanır, HP barı düşer
- Yanlış cevap → "kaçırdın" feedback'i, boss kıkırdar (opsiyonel)
- Boss ölümü → patlama efekti (Phaser particles), zafer ekranı

## Mağaza

- Coin ile item satın al
- Item efektleri **kalıcı** veya **tek savaş** olabilir (TBD)
- Item örnekleri:
  - **+10 HP** (sonraki savaş için)
  - **İpucu (1 adet)** (sonraki savaşta zor soruda kullan)
  - *Diğerleri Can'ın listesi*

## Save / Persistence

Her level sonunda localStorage'a yaz:
- Oyuncu adı
- Level
- Toplam coin
- Envanter (sahip olunan item'lar, miktarları)

Açılışta:
- Önceki kayıt varsa "Devam et" / "Yeni oyun" seçeneği
- "Yeni oyun" eski kaydı sıfırlar (onay sor)

## Tasarım Felsefesi

- **Can öncelik:** Can oynamaktan zevk almalı. Bu okul ödevi değil, eğlence olsun.
- **Math gizli, oyun açık:** Soru sorma "ders" gibi değil "boss vurma" mekanizması.
- **Zorluk eğrisi yumuşak:** Erken level'lar Can'ın seviyesinde, sonrakiler 7-8. sınıf konularına kayabilir (Can isterse).
