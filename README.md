# Can Boss RPG

11 yaşındaki Can'ın tasarladığı 2D top-down RPG. Bir odada uyan, WASD ile dolaş, boss'larla matematik sorularıyla savaş.

**Oyna:** https://gungorakbiyik.github.io/can-boss-rpg/

## Nasıl Oynanır

1. İsmini yaz, "Oyunu Başlat" butonuna tıkla.
2. Odada WASD veya ok tuşlarıyla hareket et.
3. Renkli alanlara gir, **E** veya **Space** ile etkileş:
   - **Isınma (yeşil):** Matematik soruları çöz, coin kazan (+5 coin)
   - **Mağaza (sarı):** Coin harca — max HP yükselt veya ipucu al
   - **Boss Kapısı (kırmızı):** Boss savaşı başlat
4. Boss savaşında 4 soruyu doğru cevapla, boss'u yık (+level × 10 coin).
5. Her level sorular zorlaşır. Aynı isimle tekrar girersen kaldığın yerden devam edersin.

## Kontroller

| Tuş | Eylem |
|-----|-------|
| WASD / Ok tuşları | Hareket |
| E / Space | Etkileşim |
| ESC | Menü (odada) |

## Lokal Çalıştırma

```bash
python3 -m http.server 8000
```

Tarayıcıda → `http://localhost:8000`

> Not: `file://` ile açma — `fetch` CORS hatası verir.

## Teknik

- Phaser 3 (CDN)
- Saf HTML/CSS/JS — build adımı yok
- localStorage kayıt sistemi
- GitHub Pages deploy
