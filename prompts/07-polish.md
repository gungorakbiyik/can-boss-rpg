# Sprint 7 — Cila + Bug Fix

## Önce Şunları Oku

1. `CLAUDE.md`, `DECISIONS.md`, `PROGRESS.md` — **özellikle "Cross-Sprint Bug Listesi"**
2. Tüm docs/ dosyaları (final review)
3. **Can'ın dökümanı + Can'ın test geri bildirimleri**

## Hedef

Oyun çalışıyor ama hap gibi olmadı. Bu sprint görseli + hissi tatlandırır.

## Yapılacaklar

### Animasyonlar
- Karakter hareket sırasında basit "yürüyüş" efekti (squash/stretch)
- Boss vuruşunda shake
- Doğru cevap → karakterden çıkan particle (yıldız?)
- Boss ölümü → particle patlama
- HP barı azalırken smooth tween

### Görsel
- Karakter sprite (Can'ın seçimi — emoji veya çizim)
- Boss sprite (en az 2-3 farklı boss level'a göre)
- Oda arka planı (tile veya tek görsel)
- Buton stilleri tutarlı (mağaza, soru, başlık)

### Ses (Opsiyonel)
- Doğru cevap sesi
- Yanlış cevap sesi
- Boss ölüm sesi
- Background loop (opsiyonel — Can isterse)
- Asset: freesound.org veya Pixabay

### Bug Fix
- `PROGRESS.md`'deki "Cross-Sprint Bug Listesi"'ndeki tüm sorunları çöz
- Edge case'ler:
  - Coin yokken mağaza
  - Boss savaşında ESC basıldı (önemli — savaştan çıkış nasıl?)
  - Soru havuzu tükendi
  - Mobil hareket (WASD yok — joystick UI? veya "mobil desteklenmiyor" uyarısı?)

### Final Test
- Tüm akışı 2-3 kere baştan sona oyna
- Farklı tarayıcılarda test (Chrome, Safari, Firefox)
- Mobil tarayıcıda aç (Safari iOS) — en azından menü çalışsın
- Canlı URL'de test
- Console'da hata yok

## Yapma

- Yeni mekanik ekleme (sadece var olanı iyileştir)
- Kapsam dışı feature (yeni level, yeni karakter customization vs.)
- Refactor sadece refactor olsun diye

## Test

- Tam playthrough: title → oyun → 2-3 level → save → reload → devam
- Tüm sahneler animasyonlu
- Ses çalıyor (eklendiyse)
- Bug listesi temiz

## Bitirince

- `PROGRESS.md` — Sprint 7 completed, final URL, bilinen sorunlar (varsa)
- `DECISIONS.md` — final kararlar
- Repo'da `README.md` güncelle: ekran görüntüsü (opsiyonel), oyna linki, nasıl oynanır

## Sunum

Can'a göster. Oyna, test ettir. Geri bildirim al. Eğer ufak şeyler çıkarsa: nokta atış commit'ler. Büyük şeyler çıkarsa: v1.1 sprint planı.
