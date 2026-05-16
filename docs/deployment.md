# GitHub Pages Deploy Rehberi

Bu döküman **Sprint 1 için kritik**. Asıl test edilen şey burası — Phaser'lı bir oyun GitHub Pages'da çalışıyor mu?

## Hızlı Cevap

**Evet, sorunsuz çalışır.** Phaser %100 client-side, statik dosyalar yeter. Build adımı yok.

## Adımlar

### 1. Lokal Klasör Hazır mı?

Proje vault dışına alındığında dosya yapısı:

```
can-boss-rpg/
├── index.html
├── style.css
├── js/
│   ├── main.js
│   ├── config.js
│   └── scenes/
│       └── RoomScene.js
└── README.md
```

### 2. Lokal Test (Deploy'dan Önce)

`file://` ile açma — fetch/JSON yükleme CORS hatası verir. Mutlaka HTTP sunucusu:

```bash
cd can-boss-rpg
python3 -m http.server 8000
```

Tarayıcıda → `http://localhost:8000` → her şey çalışıyor mu kontrol et.

### 3. Git Repo Oluştur

```bash
cd can-boss-rpg
git init
git add .
git commit -m "initial scaffold: room + WASD movement"
```

### 4. GitHub'da Repo Aç

- github.com → "New repository"
- Repo adı: `can-boss-rpg` (URL'de görünecek)
- **Public** seç (Pages public repo'lar için tüm hesaplarda ücretsiz, private Pro hesap ister)
- README/license/gitignore EKLEME (lokal'de zaten var)
- Create

### 5. Lokal'i Remote'a Bağla

GitHub'ın verdiği komutlar (örnek):

```bash
git remote add origin https://github.com/gungorakbiyik/can-boss-rpg.git
git branch -M main
git push -u origin main
```

### 6. GitHub Pages'ı Aç

- Repo → Settings → Pages (sol menü)
- Source: **Deploy from a branch**
- Branch: **main**, folder: **/ (root)**
- Save

1-2 dakika sonra üstte yeşil bant: "Your site is live at https://gungorakbiyik.github.io/can-boss-rpg/"

### 7. URL'i Test Et

Tarayıcıdan canlı linke git → oyun açılmalı, WASD ile karakter hareket etmeli.

## Kritik Path Kuralları (BUNA UY)

GitHub Pages alt-path'inde yayınlar: `gungorakbiyik.github.io/can-boss-rpg/`. Bu yüzden:

### ✅ Doğru (relative)
```html
<link rel="stylesheet" href="./style.css">
<script src="./js/main.js"></script>
```
```js
fetch('./data/questions.json')
this.load.image('player', './assets/player.png')
```

### ❌ Yanlış (absolute — alt-path'te kırılır)
```html
<link rel="stylesheet" href="/style.css">
<script src="/js/main.js"></script>
```
```js
fetch('/data/questions.json')
this.load.image('player', '/assets/player.png')
```

## Sonraki Push'larda

Lokal değişiklik → commit → push:

```bash
git add .
git commit -m "sprint 2: interaction zones added"
git push
```

Pages otomatik yeniden deploy eder (~1 dakika). Sayfa cache'lenmiş olabilir — Ctrl+Shift+R ile hard refresh.

## Custom Domain (İleride, MVP'de değil)

İstenirse `boss-rpg.can.com` gibi domain bağlanabilir. Şimdilik `*.github.io` yeter.

## Sorun Giderme

### Sayfa açıldı ama oyun boş / Phaser yüklenmedi
- Console'a bak (F12)
- Genelde path hatası: `./` ile başlatmayı unutmuşsundur
- Phaser CDN'i yüklendi mi? `<script src="https://cdn.jsdelivr.net/npm/phaser@3...">` var mı?

### 404 — sayfa bulunamadı
- Pages aktif mi? Settings → Pages'ta yeşil bant var mı?
- `index.html` repo kökünde mi? Alt klasörde olmamalı.

### JSON yüklenmiyor (CORS)
- Lokal'de `python3 -m http.server` kullanıyor musun? `file://` çalışmaz.
- Pages'da otomatik HTTPS, sorun olmaz.

### Mobil'de çalışmıyor
- Phaser canvas viewport ayarı: `index.html`'de `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- WASD mobil'de yok — sonraki sprint'lerde dokunmatik kontrol eklenebilir (joystick UI)

## Repo Görünürlüğü (Gizlilik)

- **Public:** Pages ücretsiz, herkes kodu görür. MVP için OK.
- **Private (Pro):** Pages yine çalışır ama kodu sadece sen görürsün. Can'ın hassas bilgisi yoksa public yeter.

Repo'da Can'ın gerçek ismi/fotoğrafı geçmesin → "Can" yerine `playerName` değişkeni, varsayılan boş.

## Sprint 1 Sonu Checklist

- [ ] Lokal `python3 -m http.server` ile çalışıyor
- [ ] Repo açıldı, ilk commit pushlandı
- [ ] Pages aktif, canlı URL erişilebilir
- [ ] Canlı URL'de WASD ile karakter dolaşıyor
- [ ] Console'da hata yok
- [ ] Mobil'de (Safari iOS) en azından açılıyor (kontrol opsiyonel)
