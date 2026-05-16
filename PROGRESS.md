# Sprint Progress

Bu dosya hangi sprint'te olunduğunu, neyin tamamlandığını ve bilinen sorunları takip eder.

## Genel Durum

- [ ] Sprint 1 — Scaffold + oda + WASD + GitHub Pages deploy
- [ ] Sprint 2 — Etkileşim noktaları (ısınma, mağaza, boss kapısı)
- [ ] Sprint 3 — Isınma soruları
- [ ] Sprint 4 — Boss savaşı (split-screen, HP, soru-hasar)
- [ ] Sprint 5 — Coin ekonomisi + mağaza
- [ ] Sprint 6 — Level progression + save
- [ ] Sprint 7 — Cila + bug fix

**Mevcut Sprint:** Sprint 1

---

## Sprint Detayları

### Sprint 1 — Scaffold + Oda + WASD + Deploy

- **Status:** in_progress
- **Started:** 2026-05-16
- **Completed:** -
- **Prompt:** `prompts/01-scaffold-deploy.md`
- **Test sonucu:** -
- **Bilinen sorunlar:** -
- **Notlar:** Bu sprint'in **iki çıktısı** var: (1) lokal çalışan oda + WASD, (2) GitHub Pages'da canlı URL. Asıl test deploy doğrulaması. Dosyalar oluşturuldu — lokal test + deploy bekliyor.

---

### Sprint 2 — Etkileşim Noktaları

- **Status:** pending
- **Prompt:** `prompts/02-interaction-zones.md`
- **Notlar:** Odada 3 zone (ısınma, mağaza, boss kapısı). Yakına gel + E tuşu → etkileşim. Henüz içerik yok, sadece "şuraya geldin" feedback'i.

---

### Sprint 3 — Isınma Soruları

- **Status:** pending
- **Prompt:** `prompts/03-warmup-questions.md`
- **Notlar:** Basit math soruları (Can'ın seviyesinin biraz altı). DOM modal'da gösterilir. Doğru → küçük ödül (coin?). Bu sprint Can'ın dökümanı geldikten sonra detaylandırılır.

---

### Sprint 4 — Boss Savaşı

- **Status:** pending
- **Prompt:** `prompts/04-boss-battle.md`
- **Notlar:** En kritik sprint. Split-screen: üst Phaser sahnesi (karakter + boss + HP barları), alt DOM (soru). 4 soru = boss ölür. Yanlışlar sona kalır.

---

### Sprint 5 — Coin Ekonomisi + Mağaza

- **Status:** pending
- **Prompt:** `prompts/05-shop-economy.md`
- **Notlar:** Level başına coin. Mağazada +HP, ipucu satın al. Item listesi Can'ın dökümanı ile gelecek.

---

### Sprint 6 — Level Progression + Save

- **Status:** pending
- **Prompt:** `prompts/06-levels-save.md`
- **Notlar:** Boss ölünce next level. Kaç level olacak? Her level farklı boss mu? Can'ın dökümanı.

---

### Sprint 7 — Cila + Bug Fix

- **Status:** pending
- **Prompt:** `prompts/07-polish.md`
- **Notlar:** Animasyonlar, ses (opsiyonel), edge case'ler, final test.

---

## Şablon — Sprint Güncellenirken

```markdown
- **Status:** in_progress | completed | blocked
- **Started:** YYYY-MM-DD HH:MM
- **Completed:** YYYY-MM-DD HH:MM
- **Test sonucu:** Hangi senaryolar denendi, sonuç ne oldu
- **Bilinen sorunlar:**
  - [ ] Sorun 1 (sonraki sprint'te çözülecek)
  - [x] Sorun 2 (çözüldü)
- **Notlar:** ekstra bilgi
```

---

## Cross-Sprint Bug Listesi

*(şimdilik boş)*
