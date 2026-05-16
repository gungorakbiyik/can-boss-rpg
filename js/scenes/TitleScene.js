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

    const panel = document.getElementById('title-panel');
    panel.innerHTML = `
      <div class="tp-box">
        <h1 class="tp-title">Can Boss RPG</h1>
        <div class="tp-start-section">
          <input id="tp-name" class="tp-input" placeholder="İsmin?" maxlength="16" autocomplete="off">
          <button id="tp-start" class="tp-btn">Oyunu Başlat</button>
        </div>
        <div class="tp-leaderboard">
          <h3>En İyi Oyuncular</h3>
          <table class="tp-table">
            <thead><tr><th>#</th><th>İsim</th><th>Level</th><th>Coin</th></tr></thead>
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
    this.registry.set('playerName', name);
    document.getElementById('title-panel').style.display = 'none';
    this.scene.start('RoomScene');
  }
}
