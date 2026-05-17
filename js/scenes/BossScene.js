class BossScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BossScene' });
  }

  create() {
    this.playerHp    = this.registry.get('hp');
    this.playerMaxHp = this.registry.get('maxHp') || CONFIG.PLAYER_HP;
    this.bossHp      = CONFIG.BOSS_HP;
    this.currentQueue = [];
    this.wrongQueue   = [];
    this.retriedOnce  = false;

    document.body.classList.add('boss-active');
    document.getElementById('game').style.display = 'none';

    this._setupHtmlArena();
    this._loadQuestions();

    this.input.keyboard.on('keydown-ESC', () => this._showEscWarning());
  }

  _playerSVG(size) {
    return `<svg width="${size}" height="${Math.round(size * 1.45)}" viewBox="0 0 40 58"
        style="filter:drop-shadow(0 0 6px rgba(52,152,219,0.5));transition:filter .3s">
      <circle cx="20" cy="11" r="9.5" fill="#ffd59e" stroke="#c8a87a" stroke-width="1"/>
      <circle cx="16.5" cy="10" r="1.8" fill="#1e3448"/>
      <circle cx="23.5" cy="10" r="1.8" fill="#1e3448"/>
      <path d="M17 13 Q20 11 23 13" stroke="#7a90a8" stroke-width="1" fill="none"/>
      <rect x="12" y="22" width="16" height="16" rx="2" fill="#3498db"/>
      <rect x="4"  y="22" width="7"  height="4"  rx="2" fill="#3498db"/>
      <rect x="29" y="22" width="7"  height="4"  rx="2" fill="#3498db"/>
      <rect x="13" y="38" width="6"  height="13" rx="2" fill="#8B5E3C"/>
      <rect x="21" y="38" width="6"  height="13" rx="2" fill="#8B5E3C"/>
    </svg>`;
  }

  _bossSVG(size, level) {
    const bodyColor = level >= 3 ? '#7c3aed' : level >= 2 ? '#dc2626' : '#b91c1c';
    return `<svg width="${size}" height="${Math.round(size * 1.5)}" viewBox="0 0 50 75"
        style="filter:drop-shadow(0 0 8px ${bodyColor});transition:filter .3s">
      <polygon points="13,20 8,3 19,16"  fill="#f0c040" stroke="#c8a020" stroke-width="1"/>
      <polygon points="37,20 42,3 31,16" fill="#f0c040" stroke="#c8a020" stroke-width="1"/>
      <circle cx="25" cy="24" r="14" fill="#8B5E3C" stroke="#5a3e2b" stroke-width="1.5"/>
      <ellipse cx="19" cy="23" rx="3" ry="3.5" fill="#ff4500"/>
      <ellipse cx="31" cy="23" rx="3" ry="3.5" fill="#ff4500"/>
      <circle cx="19" cy="24" r="1.2" fill="#0f1419"/>
      <circle cx="31" cy="24" r="1.2" fill="#0f1419"/>
      <path d="M18 31 L22 34 L25 31 L28 34 L32 31"
            stroke="#1a0a00" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <rect x="12" y="40" width="26" height="22" rx="2" fill="${bodyColor}"/>
      <rect x="2"  y="40" width="9"  height="5"  rx="2" fill="${bodyColor}"/>
      <rect x="39" y="40" width="9"  height="5"  rx="2" fill="${bodyColor}"/>
      <rect x="0"  y="43" width="7"  height="6"  rx="1" fill="#8B5E3C"/>
      <rect x="43" y="43" width="7"  height="6"  rx="1" fill="#8B5E3C"/>
      <rect x="14" y="62" width="9"  height="12" rx="2" fill="#8B5E3C"/>
      <rect x="27" y="62" width="9"  height="12" rx="2" fill="#8B5E3C"/>
    </svg>`;
  }

  _setupHtmlArena() {
    const playerName = this.registry.get('playerName') || 'Oyuncu';
    const level      = this.registry.get('level') || 1;
    const bossLvl    = this._getBossLevel(level);

    document.getElementById('bs-player-name').textContent = playerName;
    document.getElementById('bs-player-char').innerHTML   = this._playerSVG(78);
    document.getElementById('bs-boss-char').innerHTML     = this._bossSVG(88, bossLvl);
    document.getElementById('boss-stage').style.display  = 'flex';

    this._updateHpBars();
  }

  _updateHpBars() {
    const pPct = Math.max(0, (this.playerHp / this.playerMaxHp) * 100);
    const bPct = Math.max(0, (this.bossHp   / CONFIG.BOSS_HP)   * 100);

    document.getElementById('bs-player-fill').style.width    = `${pPct}%`;
    document.getElementById('bs-boss-fill').style.width      = `${bPct}%`;
    document.getElementById('bs-player-hp-text').textContent = `${Math.round(this.playerHp)} / ${this.playerMaxHp}`;
    document.getElementById('bs-boss-hp-text').textContent   = `${Math.round(this.bossHp)} / ${CONFIG.BOSS_HP}`;
  }

  _showEscWarning() {
    const msg = document.getElementById('bp-battle-message');
    if (!msg) return;
    msg.textContent  = '⚠ Savaştan kaçılamaz!';
    msg.style.color  = '#ec4899';
    this.time.delayedCall(1400, () => {
      if (msg) { msg.textContent = ''; msg.style.color = ''; }
    });
  }

  _getBossLevel(playerLevel) {
    if (playerLevel < CONFIG.BOSS_LEVEL_MEDIUM_FROM) return 1;
    if (playerLevel < CONFIG.BOSS_LEVEL_HARD_FROM)   return 2;
    return 3;
  }

  _loadQuestions() {
    const cached = this.registry.get('allQuestions');
    if (cached) {
      this._buildQueue(cached);
    } else {
      fetch('./data/questions.json')
        .then(r => r.json())
        .then(data => {
          this.registry.set('allQuestions', data.questions);
          this._buildQueue(data.questions);
        });
    }
  }

  _buildQueue(allQuestions) {
    const bossLvl = this._getBossLevel(this.registry.get('level') || 1);
    this.bossPool = allQuestions.filter(q => q.useFor.includes('boss') && q.bossLevel === bossLvl);
    const shuffled = this.bossPool.slice().sort(() => Math.random() - 0.5);
    this.currentQueue = shuffled.slice(0, CONFIG.BOSS_QUESTIONS);
    this._nextQuestion();
  }

  _nextQuestion() {
    if (this.currentQueue.length === 0) {
      if (!this.retriedOnce && this.wrongQueue.length > 0) {
        this.retriedOnce  = true;
        this.currentQueue = [...this.wrongQueue];
        this.wrongQueue   = [];
      } else {
        this.retriedOnce  = false;
        this.wrongQueue   = [];
        this.currentQueue = this.bossPool.slice().sort(() => Math.random() - 0.5).slice(0, CONFIG.BOSS_QUESTIONS);
      }
    }
    this._renderQuestion(this.currentQueue.shift());
  }

  _renderQuestion(q) {
    const hintCount = (this.registry.get('inventory') || { hints: 0 }).hints || 0;
    const hintArea  = hintCount > 0
      ? `<button id="qp-hint" class="qp-hint-btn">💡 İpucu Kullan (${hintCount})</button>`
      : '';
    const LABELS = ['A', 'B', 'C', 'D'];
    const opts = q.options
      .map((o, i) => `<button class="qp-btn" data-value="${o}">
        <span class="qp-btn-label">${LABELS[i]}</span>
        <span>${o}</span>
      </button>`)
      .join('');

    const panel = document.getElementById('question-panel');
    panel.innerHTML = `
      <div class="bp-box">
        <div id="bp-battle-message" class="battle-message"></div>
        <p class="qp-question">${q.text}</p>
        <div class="qp-options">${opts}</div>
        <p id="qp-hint-text" class="qp-hint-text"></p>
        ${hintArea}
        <div id="qp-feedback" class="qp-feedback"></div>
      </div>
    `;
    panel.classList.add('boss-panel');
    panel.style.display = 'flex';

    panel.querySelectorAll('.qp-btn').forEach(btn => {
      btn.addEventListener('click', () => this._handleAnswer(btn.dataset.value, q));
    });
    const hintBtn = document.getElementById('qp-hint');
    if (hintBtn) hintBtn.addEventListener('click', () => this._useHint(q, hintBtn));
  }

  _useHint(q, btn) {
    const inv  = { ...(this.registry.get('inventory') || { hints: 0 }) };
    inv.hints  = Math.max(0, inv.hints - 1);
    this.registry.set('inventory', inv);
    document.getElementById('qp-hint-text').textContent = `İpucu: ${q.hint}`;
    btn.disabled = true;
  }

  _handleAnswer(answer, q) {
    document.querySelectorAll('.qp-btn').forEach(b => {
      b.disabled = true;
      if (b.dataset.value === q.correct) b.classList.add('correct');
      else if (b.dataset.value === answer) b.classList.add('wrong');
    });

    const feedback  = document.getElementById('qp-feedback');
    const battleMsg = document.getElementById('bp-battle-message');

    if (answer === q.correct) {
      this.bossHp = Math.max(0, this.bossHp - CONFIG.BOSS_DAMAGE_PER_CORRECT);
      this._updateHpBars();
      this._animateBossHit();
      if (battleMsg) battleMsg.textContent = `⚔ Vuruş! Boss'a ${CONFIG.BOSS_DAMAGE_PER_CORRECT} hasar!`;
      if (this.bossHp <= 0) {
        this.time.delayedCall(900, () => this._showVictory());
        return;
      }
    } else {
      this.playerHp = Math.max(0, this.playerHp - CONFIG.PLAYER_DAMAGE_PER_WRONG);
      this.wrongQueue.push(q);
      this._updateHpBars();
      this._animatePlayerHit();
      feedback.innerHTML = `Yanlış! Doğrusu: <strong>${q.correct}</strong>`;
      if (battleMsg) battleMsg.textContent = `💔 Yanlış! −${CONFIG.PLAYER_DAMAGE_PER_WRONG} HP`;
      if (this.playerHp <= 0) {
        this.time.delayedCall(900, () => this._showGameOver());
        return;
      }
    }
    this.time.delayedCall(1200, () => this._nextQuestion());
  }

  _animateBossHit() {
    const el = document.getElementById('bs-boss-char');
    if (!el) return;
    el.classList.add('hit-shake');
    el.querySelector('svg').style.filter = 'drop-shadow(0 0 16px #4ade80)';
    this.time.delayedCall(400, () => {
      el.classList.remove('hit-shake');
      const bossLvl   = this._getBossLevel(this.registry.get('level') || 1);
      const bodyColor = bossLvl >= 3 ? '#7c3aed' : bossLvl >= 2 ? '#dc2626' : '#b91c1c';
      el.querySelector('svg').style.filter = `drop-shadow(0 0 8px ${bodyColor})`;
    });
  }

  _animatePlayerHit() {
    const el = document.getElementById('bs-player-char');
    if (!el) return;
    el.classList.add('hit-shake');
    el.querySelector('svg').style.filter = 'drop-shadow(0 0 16px #ec4899)';
    this.time.delayedCall(400, () => {
      el.classList.remove('hit-shake');
      el.querySelector('svg').style.filter = 'drop-shadow(0 0 6px rgba(52,152,219,0.5))';
    });
  }

  _showVictory() {
    const currentLevel = this.registry.get('level') || 1;
    const coinReward   = currentLevel * CONFIG.COIN_BOSS_REWARD_PER_LEVEL;
    const newCoins     = (this.registry.get('coins') || 0) + coinReward;
    const newLevel     = currentLevel + 1;
    this.registry.set('coins', newCoins);
    this.registry.set('level', newLevel);
    this.registry.set('hp', this.registry.get('maxHp'));
    saveScore(
      this.registry.get('playerName') || 'Anonim',
      newLevel, newCoins,
      this.registry.get('maxHp'),
      this.registry.get('inventory')
    );
    const panel = document.getElementById('question-panel');
    panel.innerHTML = `
      <div class="bp-box bp-result">
        <p class="bp-result-title bp-win">🏆 Boss Yenildi!</p>
        <p>+${coinReward} 🪙 coin kazandın! (Toplam: ${newCoins})</p>
        <p>Level ${newLevel}'e geçtin.</p>
        <button id="bp-continue" class="qp-devam">Devam →</button>
      </div>
    `;
    document.getElementById('bp-continue').addEventListener('click', () => this._returnToRoom());
  }

  _showGameOver() {
    this.registry.set('hp', this.registry.get('maxHp'));
    const panel = document.getElementById('question-panel');
    panel.innerHTML = `
      <div class="bp-box bp-result">
        <p class="bp-result-title bp-lose">💀 Yenildin!</p>
        <p>Boss'u yenemesek de, devam et.</p>
        <button id="bp-continue" class="qp-devam">Odaya Dön →</button>
      </div>
    `;
    document.getElementById('bp-continue').addEventListener('click', () => this._returnToRoom());
  }

  _returnToRoom() {
    const panel = document.getElementById('question-panel');
    panel.style.display = 'none';
    panel.classList.remove('boss-panel');
    document.getElementById('boss-stage').style.display = 'none';
    document.getElementById('game').style.display       = '';
    document.body.classList.remove('boss-active');
    this.scene.stop();
    this.scene.wake('RoomScene');
  }
}
