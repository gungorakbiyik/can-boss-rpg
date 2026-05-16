class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    this._renderTitle();
  }

  _renderTitle() {
    const scores = getScores();
    const rows = scores.length > 0
      ? scores.map((s, i) => `<tr><td>${i + 1}</td><td>${s.name}</td><td>Lv ${s.level}</td><td>${s.coins} coin</td></tr>`).join('')
      : '<tr><td colspan="4" style="text-align:center;color:#666">Henüz kayıt yok</td></tr>';

    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    const mobileBanner = isMobile
      ? '<div class="tp-mobile-warn">Bu oyun klavye gerektirir. Bilgisayardan oynamani oneririz.</div>'
      : '';

    const panel = document.getElementById('title-panel');
    panel.innerHTML = `
      <div class="tp-box">
        <h1 class="tp-title">Can Boss RPG</h1>
        ${mobileBanner}
        <div class="tp-start-section">
          <input id="tp-name" class="tp-input" placeholder="Ismin?" maxlength="16" autocomplete="off">
          <button id="tp-start" class="tp-btn">Oyunu Basla</button>
        </div>
        <div class="tp-leaderboard">
          <h3>En Iyi Oyuncular</h3>
          <table class="tp-table">
            <thead><tr><th>#</th><th>Isim</th><th>Level</th><th>Coin</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
    panel.style.display = 'flex';

    const nameInput = document.getElementById('tp-name');
    nameInput.focus();
    nameInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') this._startGame(nameInput.value.trim());
    });
    document.getElementById('tp-start').addEventListener('click', () => {
      this._startGame(nameInput.value.trim());
    });
  }

  _startGame(name) {
    if (!name) return;
    const existing = getScores().find(s => s.name === name);
    if (existing) {
      this._showReturnConfirm(name, existing);
    } else {
      this._launchGame(name, null);
    }
  }

  _showReturnConfirm(name, existing) {
    const panel = document.getElementById('title-panel');
    panel.innerHTML = `
      <div class="tp-box">
        <h1 class="tp-title">Can Boss RPG</h1>
        <div class="tp-confirm">
          <p><strong>${name}</strong> zaten kayıtlı!</p>
          <p class="tp-stat">Lv ${existing.level} &mdash; ${existing.coins} coin</p>
          <p>Bu kişiyle devam etmek ister misin?</p>
          <div class="tp-confirm-btns">
            <button id="tp-confirm-yes" class="tp-btn">Evet, devam et</button>
            <button id="tp-confirm-no" class="tp-btn-secondary">Hayır, farklı isim</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('tp-confirm-yes').addEventListener('click', () => {
      this._launchGame(name, existing);
    });
    document.getElementById('tp-confirm-no').addEventListener('click', () => {
      this._renderTitle();
    });
  }

  _launchGame(name, existing) {
    this.registry.set('playerName', name);
    this.registry.set('coins', existing ? existing.coins : 0);
    this.registry.set('level', existing ? existing.level : 1);
    this.registry.set('maxHp', existing && existing.maxHp ? existing.maxHp : CONFIG.PLAYER_HP);
    this.registry.set('hp', existing && existing.maxHp ? existing.maxHp : CONFIG.PLAYER_HP);
    this.registry.set('inventory', existing && existing.inventory ? existing.inventory : { hints: 0, extraHp: 0 });
    this.registry.set('warmupUsedIds', []);
    document.getElementById('title-panel').style.display = 'none';
    this.scene.start('RoomScene');
  }
}
