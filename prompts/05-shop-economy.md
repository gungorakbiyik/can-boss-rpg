# Sprint 5 — Coin Ekonomisi + Mağaza

> **Not:** Can'ın dökümanı item listesi ve fiyatlandırma için kritik.

## Önce Şunları Oku

1. `CLAUDE.md`, `DECISIONS.md`, `PROGRESS.md`
2. `docs/gameplay.md` — "Mağaza"
3. **Varsa** `docs/can-doc.md`

## Hedef

Coin sayacı her sahnede görünür. Mağaza zone'undan E ile gir → item listesi → coin yetiyorsa satın al → efekt envantere işlenir.

## Yapılacaklar

1. **Coin HUD:** Tüm sahnelerde sağ üstte coin sayacı (Phaser text veya DOM overlay)
2. **`js/scenes/ShopScene.js`:**
   - DOM-tabanlı UI (#shop-panel div) tercih edilir — kolay tasarım
   - Item kartları: ikon + isim + açıklama + fiyat + "Satın al"
   - Coin yetersizse buton disable
   - "Kapat" butonu → RoomScene
3. **Başlangıç item listesi (TBD — Can'ın listesinden):**
   - +10 max HP (sonraki savaş için kalıcı) — 20 coin
   - İpucu (tek kullanımlık) — 10 coin
4. **Envanter state:**
   - Registry'de tutulan `inventory` objesi
   - Boss savaşında ipucu varsa "İpucu kullan" butonu görünür
   - +HP item'ı satın alınırsa karakterin maxHP'si artar

## Yapma

- localStorage'a yazma (Sprint 6)
- Item çeşidini genişletme (MVP'de 2-3 item yeter)
- Animasyonlu mağaza UI (Sprint 7)

## Test

- Coin sayacı her sahnede görünür
- Mağaza → item listesi açılır
- Coin yetiyor → satın al → coin düşer, envantere eklenir
- Coin yetmiyor → buton disable
- Boss savaşında ipucu kullanılabilir

## Belirsizlik Olursa

- Item listesi tam ne olacak? (Can'ın liste)
- Fiyatlar? Coin ekonomisi: level başı kaç coin kazanılır?
- +HP item'ı kalıcı mı tek savaş mı?
