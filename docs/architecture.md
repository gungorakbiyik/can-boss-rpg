# Mimari

## Dosya Yapısı

```
can-boss-rpg/                  (repo root, GitHub Pages'a deploy edilecek)
├── index.html                 (tek HTML sayfa — Phaser yüklenir + DOM UI div'leri)
├── style.css                  (DOM UI stilleri — soru paneli, mağaza, başlık ekranı)
├── js/
│   ├── main.js                (Phaser config + Game oluşturma)
│   ├── config.js              (CONFIG sabitleri)
│   ├── scenes/
│   │   ├── BootScene.js       (asset preload)
│   │   ├── TitleScene.js      (oyun başlığı, oyuncu adı, "Başla")
│   │   ├── RoomScene.js       (açılış odası — WASD + etkileşim zoneları)
│   │   ├── WarmupScene.js     (ısınma sorusu — modal stilinde)
│   │   ├── ShopScene.js       (mağaza UI)
│   │   └── BossScene.js       (boss savaşı — üst yarı Phaser, alt yarı DOM)
│   └── state.js               (global state + localStorage wrapper)
├── data/
│   └── questions.json         (soru bankası)
├── assets/                    (sprite, ses — sprint'lerle dolacak)
└── README.md
```

**Not:** Sprint 1'de sadece `index.html`, `style.css`, `js/main.js`, `js/config.js`, `js/scenes/RoomScene.js` olur. Diğerleri sonraki sprint'lerde eklenecek.

## Phaser Setup (Sprint 1)

`index.html`:
```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Can Boss RPG</title>
  <link rel="stylesheet" href="./style.css">
  <script src="https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js"></script>
</head>
<body>
  <div id="game"></div>
  <div id="ui-overlay"></div>

  <script src="./js/config.js"></script>
  <script src="./js/scenes/RoomScene.js"></script>
  <script src="./js/main.js"></script>
</body>
</html>
```

**ES module yok, klasik script tag.** Sebep: GitHub Pages'da CORS hassasiyeti, lokal `file://` testi için klasik script daha sorunsuz (ama lokal yine `python3 -m http.server` ile test edilir).

## CONFIG (Sprint 1 minimum)

```js
const CONFIG = {
  GAME_WIDTH: 800,
  GAME_HEIGHT: 600,
  PLAYER_SPEED: 160,
  PLAYER_SIZE: 32,
  ROOM_PADDING: 32,
  BG_COLOR: '#2c3e50',
  PLAYER_COLOR: 0x3498db,
};
```

Sprint ilerledikçe burası genişler (BOSS_HP, DAMAGE_PER_CORRECT, QUESTIONS_PER_BOSS, COIN_PER_LEVEL...).

## Phaser Sahne Akışı

```
BootScene (asset preload)
    ↓
TitleScene (oyuncu adı al)
    ↓
RoomScene (ana oda — buradan diğerlerine geçilir)
    ↓
    ├──→ WarmupScene (ısınma)
    ├──→ ShopScene (mağaza)
    └──→ BossScene (savaş) → boss ölünce RoomScene'e dön + level++
```

**Sprint 1'de sadece RoomScene var.** Karakter odada dolaşır, hepsi bu.

## State

İki katman:

**Phaser registry** (oyun içi runtime state — sahneler arası paylaşılan):
```js
this.registry.set('playerName', 'Can');
this.registry.set('level', 1);
this.registry.set('coins', 0);
this.registry.set('hp', 100);
```

**localStorage** (kalıcı state — tarayıcı kapanınca durur):
```js
const STORAGE_KEYS = {
  PLAYER_NAME: 'canBossRpg.playerName',
  LEVEL: 'canBossRpg.level',
  COINS: 'canBossRpg.coins',
  INVENTORY: 'canBossRpg.inventory',
};
```

Wrapper `js/state.js` içinde — sadece bu dosya localStorage'a dokunur.

## Soru JSON Formatı

(Math-quiz'in formatıyla uyumlu, gerekirse adapter yazılır)

```json
{
  "questions": [
    {
      "id": "q001",
      "type": "multiple-choice",
      "text": "3 + 5 × 2 = ?",
      "options": ["11", "13", "16", "10"],
      "correct": "13",
      "hint": "Önce çarpma, sonra toplama yapılır.",
      "explanation": "Çarpma toplamadan önce gelir. 5 × 2 = 10, sonra 3 + 10 = 13.",
      "difficulty": "easy",
      "topic": "islem-onceligi",
      "useFor": ["warmup", "boss-1"]
    }
  ]
}
```

`useFor` alanı önemli — bir soru ısınma için mi, hangi level boss için mi belirlenir. Default: tüm boss'lar için kullanılabilir.

## Split-Screen Boss Savaşı (Sprint 4 detayı)

Layout:
```
┌─────────────────────────────────┐
│  HP Bar (sol)    HP Bar (sağ)   │  ← üst yarı, Phaser canvas
│                                 │
│  [Karakter]      [Boss]         │
│                                 │
├─────────────────────────────────┤
│  Soru: 3 + 5 × 2 = ?            │  ← alt yarı, DOM div
│  [11]  [13]  [16]  [10]         │
│         [Cevapla]               │
└─────────────────────────────────┘
```

CSS Grid veya Flex:
- `#game` (Phaser canvas) yukarıda, `height: 50vh`
- `#question-panel` (DOM) aşağıda, `height: 50vh`

Phaser canvas boyutu boss savaşı sırasında değişir — `game.scale.resize(width, height)` ile.

## GitHub Pages Deploy

→ Detay: `deployment.md`
