# Sprint 6 — Level Progression + Save

## Önce Şunları Oku

1. `CLAUDE.md`, `DECISIONS.md`, `PROGRESS.md`
2. `docs/architecture.md` — "State"
3. `docs/gameplay.md` — "Save / Persistence"

## Hedef

Boss öldükçe level artar, zorluk yükselir. Tarayıcı kapatıp açınca kaldığı yerden devam edilebilir.

## Yapılacaklar

1. **`js/state.js`** — localStorage wrapper:
   - `saveState()`, `loadState()`, `clearState()`
   - Anahtarlar: `canBossRpg.playerName`, `.level`, `.coins`, `.maxHp`, `.inventory`
2. **TitleScene'i ekle:**
   - "Yeni Oyun" / "Devam Et" (kayıt varsa görünür)
   - "Yeni Oyun" → onay sor → eski kaydı sil
3. **Level zorluk artışı:**
   - Level 1: basit (6. sınıf)
   - Level 2-3: orta
   - Level 4+: zor (7-8. sınıf)
   - `questions.json`'da `level: 1`, `level: 2` etiketleri ile filtre
4. **Boss savaşı sonrası:**
   - Coin ödülü = level × 10 (TBD)
   - Level += 1
   - State kaydedilir
   - RoomScene'e dön

## Yapma

- Final boss (Sprint 7 veya v1.1)
- Hikaye / cutscene (v2)

## Test

- 1. boss öldü → level 2'ye geç, coin kazandı, kaydedildi
- Tarayıcıyı kapat, tekrar aç → "Devam Et" görün → level 2'den başla
- "Yeni Oyun" → onay → level 1'e dön, coin 0
- Soruların zorluğu level'la artıyor

## Belirsizlik Olursa

- Kaç level olacak? Final boss var mı?
- Level başı coin ödülü formülü?
- Zorluk artış eğrisi: ne kadar dik?
