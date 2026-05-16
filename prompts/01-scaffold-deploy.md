# Sprint 1 — Scaffold + Oda + WASD + GitHub Pages Deploy

## Önce Şunları Oku

1. `CLAUDE.md` (proje kuralları — özellikle path kuralları)
2. `DECISIONS.md` (verilen kararlar)
3. `PROGRESS.md` (mevcut durum)
4. `docs/architecture.md` — özellikle "Dosya Yapısı", "Phaser Setup", "CONFIG"
5. `docs/deployment.md` — GitHub Pages adımları
6. `docs/gameplay.md` — "Kontroller"

Bu dosyaları okumadan kod yazma.

## Hedef

**İki çıktı:**

1. **Lokal:** Tarayıcıda Phaser sahnesi açılır, içinde dikdörtgen bir karakter var, WASD ile odanın içinde dolaşır, duvarların dışına çıkamaz.
2. **Canlı:** GitHub Pages'da aynı şey aynı şekilde çalışır.

Bu sprint'in **asıl testi deploy** — Phaser + GitHub Pages stack'inin çalıştığını doğrulamak.

## Yapılacaklar

### 1. Dosya İskeleti

```
can-boss-rpg/
├── index.html
├── style.css
├── README.md
└── js/
    ├── main.js
    ├── config.js
    └── scenes/
        └── RoomScene.js
```

### 2. `index.html`

- `<!DOCTYPE html>` + Turkish lang
- Viewport meta (mobil için)
- Phaser CDN: `https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js`
- `<div id="game"></div>` (Phaser buraya canvas basacak)
- Script'leri sırayla yükle: `config.js` → `RoomScene.js` → `main.js`
- **Path'ler relative** (`./style.css`, `./js/main.js`) — `/` ile başlatma

### 3. `style.css`

- CSS reset (basit, body margin 0)
- `body { background: #1a1a1a; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: system-ui, sans-serif; }`
- `#game canvas { display: block; }`

### 4. `js/config.js`

```js
const CONFIG = {
  GAME_WIDTH: 800,
  GAME_HEIGHT: 600,
  PLAYER_SPEED: 160,
  PLAYER_SIZE: 32,
  ROOM_PADDING: 32,
  BG_COLOR: '#2c3e50',
  PLAYER_COLOR: 0x3498db,
  WALL_COLOR: 0x34495e,
};
```

### 5. `js/scenes/RoomScene.js`

```js
class RoomScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RoomScene' });
  }

  create() {
    // Oda arka planı
    // Karakter (basit dikdörtgen — sprite yok, Phaser.GameObjects.Rectangle)
    // Duvarlar (4 kenar — invisible static physics body)
    // Karakteri physics dünyasına ekle
    // WASD tuş input'ları (this.input.keyboard.addKeys)
  }

  update() {
    // Tuşlara göre velocity uygula
    // Diagonal hareket normalize edilsin (hız artmasın)
  }
}
```

**Detaylar:**
- Karakter: `Phaser.GameObjects.Rectangle` mavi, 32x32
- Duvarlar: invisible static bodies, oda kenarlarına
- Hareket: `setVelocity(vx, vy)` — diagonal'da Math.SQRT1_2 ile normalize
- Arrow keys'i de kabul et (WASD birinci, arrow yedek)

### 6. `js/main.js`

```js
const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: CONFIG.GAME_WIDTH,
  height: CONFIG.GAME_HEIGHT,
  parent: 'game',
  backgroundColor: CONFIG.BG_COLOR,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scene: [RoomScene],
});
```

### 7. `README.md`

Repo'da görünecek mini README:
- Proje ne (1 cümle)
- Lokal nasıl çalıştırılır (`python3 -m http.server`)
- Canlı link (Pages URL — deploy sonrası eklenir)

## Yapma

- Sprite yükleme (asset hazır değil — Rectangle yeter)
- Etkileşim zoneları (Sprint 2)
- Soru sahneleri (Sprint 3+)
- Animasyon, ses (Sprint 7)
- TitleScene (Sprint 1'de sadece RoomScene)
- Save / localStorage (Sprint 6)

## Test Senaryoları

### Lokal Test
```bash
cd can-boss-rpg
python3 -m http.server 8000
```

1. `http://localhost:8000` açılır — Phaser canvas görünür
2. Mavi dikdörtgen karakter ortada
3. W → yukarı, S → aşağı, A → sola, D → sağa
4. Diagonal (W+D) → çapraz hareket, hızlı değil normal
5. Duvarlara çarpınca durur, dışarı çıkamaz
6. Console'da hata yok

### Deploy Adımları (deployment.md'den)

1. `git init && git add . && git commit -m "sprint 1: scaffold + room + WASD"`
2. GitHub'da `can-boss-rpg` repo aç (public)
3. `git remote add origin ... && git push -u origin main`
4. Settings → Pages → main branch, root folder, Save
5. Yeşil bant görününce canlı URL'e git
6. Aynı senaryoları canlı URL'de tekrarla

## Bitirince

1. `PROGRESS.md`'de Sprint 1'i `completed` işaretle, başlangıç/bitiş tarihi yaz.
2. Test sonucunu özetle (lokal: OK, canlı: OK).
3. **Canlı URL'i `PROGRESS.md` notlara ekle** — sonraki sprint'lerde referans olsun.
4. Yeni karar verdiysen `DECISIONS.md`'ye ekle.
5. Bilinen sorun varsa "Bilinen Sorunlar" listesine yaz.

## Belirsizlik Olursa

Sor, varsayma:
- Karakter rengi default mavi mi, Can başka renk dedi mi?
- Oyun boyutu 800x600 yeter mi, full-screen mi olsun?
- Duvar görünür mü görünmez mi? (default: görünür kenar, ince çizgi)
- Repo adı `can-boss-rpg` mi, başka mı?
- Repo public mi private mi?
