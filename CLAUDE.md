# Can Boss RPG — Claude Code Proje Kuralları

Bu dosya Claude Code'un her seansta okuyacağı kuraldır. Burada yazanlar tüm diğer talimatların önündedir.

## Proje Nedir

11 yaşında bir öğrencinin (Can) hayalindeki oyun. 2D top-down RPG: karakter bir odada uyanır, WASD ile dolaşır, odadaki noktalarla etkileşir (ısınma soruları, mağaza, boss). Boss savaşı split-screen — üst yarıda karakterler + HP barı, alt yarıda matematik soruları. Her doğru cevap boss'a %25 hasar. Coin kazanılır, mağazada +can / ipucu alınır.

**Bu proje [[../../can-math-quiz/]]'den ayrı.** Math-quiz okul ödevi, bu Can'ın gerçek oyun fikri. Soru bankası formatı paylaşılabilir ama codebase ayrı.

**Aktörler:**
- **Güngör (baba):** Kodu yöneten, Claude Code'a komut veren. Kararları o verir.
- **Can:** Tasarım sahibi. Fikir + detay dökümanı + test eder. **Kod yazmıyor.**
- **Claude Code:** Kodu yazan. Bu dosyaya ve `docs/` altındaki tasarım dokümanlarına uyar.

## Stack

- **Phaser 3** (CDN'den, `<script>` tag ile)
- **HTML/CSS** (soru UI ve mağaza UI için, oyun alanı dışında)
- **JSON** (soru bankası)
- **localStorage** (coin, save, level progress)
- **GitHub Pages** (deploy)

**Build adımı yok.** npm yok, bundler yok. CDN'den Phaser çek, `index.html`'i aç, çalışsın.

## Mutlak Kurallar

1. **Bağımlılık ekleme** — Phaser ve Google Fonts dışında CDN'den hiçbir şey çekme. npm yok.
2. **Build step yok** — Dosya değişti → tarayıcıyı yenile → çalışmalı.
3. **Backend yok** — Her şey istemci tarafında. localStorage kullan.
4. **GitHub Pages uyumlu kal** — Asset path'leri **relative** (`./assets/...`), absolute (`/assets/...`) yasak. Pages alt-path'inde kırılır.
5. **Sadece prompt'taki kapsamı yap** — Out-of-scope feature'lar bir sonraki sprint'in işi.
6. **Karar verme, sor** — Tasarım dokümanlarında olmayan bir konuda kendi başına karar verme. `DECISIONS.md`'ye karar düşmeden önce onay al.
7. **Yorum yazma** — Kod yorumsuz. İsimlendirme açıklayıcı olsun. WHY-yorumu sadece gerçekten beklenmedik bir durum varsa.
8. **Magic number yok** — Sabitler bir `CONFIG` objesinde tanımlı.
9. **Türkçe kullanıcı arayüzü, İngilizce kod identifier'ları.**
10. **Phaser sahnelerini bölünmüş tut** — Her sahne (Room, BossArena, Shop) ayrı dosya/sınıf. Tek mega-sahne yazma.

## Her Seansta Yapılacaklar

Yeni bir seans başlatıldığında sırasıyla:

1. Bu dosyayı (`CLAUDE.md`) oku.
2. `DECISIONS.md`'yi oku — önceki kararları öğren.
3. `PROGRESS.md`'yi oku — hangi sprint'tesin gör.
4. O sprint'in prompt dosyasını oku (`prompts/0X-...md`).
5. Prompt'ta belirtilen `docs/...md` dosyalarını oku.
6. **Ondan sonra** kod yazmaya başla.

## Dokümanlar (`docs/` altında)

| Dosya | İçerik |
|-------|--------|
| `docs/index.md` | Vizyon, konsept, açık sorular |
| `docs/architecture.md` | Dosya yapısı, Phaser sahne organizasyonu, state, localStorage |
| `docs/gameplay.md` | Oyun akışı (oda → boss → mağaza → level), kontroller |
| `docs/deployment.md` | **GitHub Pages deploy rehberi — Sprint 1 için kritik** |
| `docs/features.md` | Feature listesi + sprint planı |

## Karar Takip Sistemi

- **`docs/...md`** → Tasarım dokümanları (büyük değişiklik kullanıcı kararıyla)
- **`DECISIONS.md`** → Karar log'u, sadece eklenir. Format: `**[YYYY-MM-DD]** karar — sebep`
- **`PROGRESS.md`** → Sprint durumu, sürekli güncellenir

## Kod Stili

- **Dosya başlarında** sabitler:
  ```js
  const CONFIG = {
    PLAYER_SPEED: 160,
    ROOM_WIDTH: 800,
    ROOM_HEIGHT: 600,
    BOSS_HP: 100,
    DAMAGE_PER_CORRECT: 25,
    QUESTIONS_PER_BOSS: 4,
  };
  ```
- **Fonksiyonlar küçük.** 30 satırdan uzun fonksiyon yazma.
- **Phaser sahneleri ayrı sınıf:** `class RoomScene extends Phaser.Scene { ... }`
- **State Phaser registry'de** veya tek `state` objesinde (architecture.md'de detay).
- **Soru UI Phaser'da değil DOM'da** — boss savaşının alt yarısı `<div id="question-panel">`, Phaser canvas üstte. Soru tasarımı CSS ile yapılır, Phaser ile uğraşılmaz.

## Test Yaklaşımı

- Unit test yok. Manuel tarayıcı testi.
- Lokal test: `python3 -m http.server` → `http://localhost:8000` (file:// çalışmaz, fetch CORS kırılır)
- Her sprint sonunda: tarayıcıda test + GitHub Pages'a push + canlı linkte test
- Browser hedefi: Chrome, Safari (Mac), Firefox güncel sürümleri

## GitHub Pages Kuralları (Sürekli Geçerli)

- Repo public veya Pro hesabında private
- Branch: `main`, folder: `/` (root)
- Asset path'leri **relative** (`./assets/img.png`, `/assets/...` değil)
- `questions.json` `fetch('./questions.json')` ile çekilir
- `<base href>` kullanma — Pages alt-path'i otomatik halleder
- Yayın URL'i: `https://<kullaniciadi>.github.io/can-boss-rpg/`

## Yasaklar

- ❌ `npm install`, `package.json`
- ❌ Build araçları (Webpack, Vite)
- ❌ Framework (React, Vue) — Phaser zaten engine, ek kütüphane gerekmez
- ❌ TypeScript
- ❌ Sunucu/backend
- ❌ Absolute asset path (`/assets/...`)
- ❌ Bağımsız kararla yeni feature ekleme
- ❌ Kumar, şiddet (boss savaşı estetik kalsın — patlama OK, kan/gore yok)

## Sorduğun Sorular İçin

Belirsiz şey varsa kod yazmadan **sor**. Yanlış varsayım + sonra silme = vakit kaybı.

## Can'ın Dökümanı

Can şu an detaylı bir döküman hazırlıyor. Geldiğinde:
- `docs/can-doc.md` olarak kaydedilecek
- İlgili kararlar `DECISIONS.md`'ye işlenecek
- Etkilenen sprint prompt'ları güncellenecek
- O zamana kadar `docs/index.md`'deki "Açık Sorular" listesi geçerli
