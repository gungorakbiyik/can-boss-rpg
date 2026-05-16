class BossScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BossScene' });
  }

  create() {
    this.playerHp = this.registry.get('hp');
    this.playerMaxHp = this.registry.get('maxHp') || CONFIG.PLAYER_HP;
    this.bossHp = CONFIG.BOSS_HP;
    this.displayPlayerHp = this.playerHp;
    this.displayBossHp = this.bossHp;
    this.currentQueue = [];
    this.wrongQueue = [];
    this.retriedOnce = false;
    this._escWarning = null;

    this.scale.resize(CONFIG.GAME_WIDTH, CONFIG.BOSS_SCENE_HEIGHT);
    document.body.classList.add('boss-active');

    this._setupArena();
    this._loadQuestions();

    this.input.keyboard.on('keydown-ESC', () => this._showEscWarning());
  }

  _setupArena() {
    const W = CONFIG.GAME_WIDTH;
    const H = CONFIG.BOSS_SCENE_HEIGHT;
    const midX = W / 2;
    const labelStyle = { fontSize: '12px', color: '#cccccc', fontFamily: 'system-ui' };
    const numStyle = { fontSize: '11px', color: '#999999', fontFamily: 'system-ui' };

    this.add.rectangle(midX, H / 2, W, H, 0x1a1a2e);
    this.add.text(midX, H * 0.46, 'VS', { fontSize: '28px', color: '#ffffff', fontFamily: 'system-ui' }).setOrigin(0.5);
    this.add.text(30, 3, 'Oyuncu', labelStyle);
    this.add.text(W - 30, 3, 'Boss', labelStyle).setOrigin(1, 0);

    this.playerPos = { x: midX - 250, y: H * 0.72 };
    this.bossPos = { x: midX + 250, y: H * 0.72 };

    this.playerFigure = createPersonFigure(this, this.playerPos.x, this.playerPos.y, {
      bodyColor: CONFIG.PLAYER_COLOR,
      scale: CONFIG.PLAYER_FIGURE_SCALE,
    });
    faceDirection(this.playerFigure, +1);

    const bossLvl = this._getBossLevel(this.registry.get('level') || 1);
    this.bossAppearance = CONFIG.BOSS_APPEARANCE[bossLvl];
    this.bossFigure = createPersonFigure(this, this.bossPos.x, this.bossPos.y, {
      bodyColor: this.bossAppearance.bodyColor,
      headColor: 0x8b4513,
      scale: this.bossAppearance.scale,
      horns: this.bossAppearance.horns,
    });
    faceDirection(this.bossFigure, -1);

    this.hpGraphics = this.add.graphics();
    this.playerHpText = this.add.text(30, 38, '', numStyle);
    this.bossHpText = this.add.text(W - 30, 38, '', numStyle).setOrigin(1, 0);

    this._drawHpBars();
  }

  _drawHpBars() {
    const g = this.hpGraphics;
    const W = CONFIG.GAME_WIDTH;
    const BAR_W = 220, BAR_H = 18, BAR_Y = 16;
    const pHp = Math.round(this.displayPlayerHp);
    const bHp = Math.round(this.displayBossHp);
    const pPct = Math.max(0, pHp / this.playerMaxHp);
    const bPct = Math.max(0, bHp / CONFIG.BOSS_HP);

    g.clear();

    g.fillStyle(0x333333); g.fillRect(30, BAR_Y, BAR_W, BAR_H);
    g.fillStyle(this._hpColor(pPct)); g.fillRect(30, BAR_Y, Math.ceil(BAR_W * pPct), BAR_H);

    g.fillStyle(0x333333); g.fillRect(W - 30 - BAR_W, BAR_Y, BAR_W, BAR_H);
    g.fillStyle(this._hpColor(bPct)); g.fillRect(W - 30 - Math.ceil(BAR_W * bPct), BAR_Y, Math.ceil(BAR_W * bPct), BAR_H);

    this.playerHpText.setText(`${pHp} / ${this.playerMaxHp}`);
    this.bossHpText.setText(`${bHp} / ${CONFIG.BOSS_HP}`);
  }

  _tweenHp(target, isPlayer) {
    const key = isPlayer ? 'displayPlayerHp' : 'displayBossHp';
    this.tweens.add({
      targets: this,
      [key]: target,
      duration: 350,
      ease: 'Power2',
      onUpdate: () => this._drawHpBars(),
    });
  }

  _burstStars(x, y, color) {
    const count = 7;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dot = this.add.circle(x, y, 5, color);
      this.tweens.add({
        targets: dot,
        x: x + Math.cos(angle) * 55,
        y: y + Math.sin(angle) * 45,
        alpha: 0,
        scaleX: 0.1,
        scaleY: 0.1,
        duration: 550,
        ease: 'Power2',
        onComplete: () => dot.destroy(),
      });
    }
  }

  _showEscWarning() {
    if (this._escWarning) this._escWarning.destroy();
    this._escWarning = this.add.text(
      CONFIG.GAME_WIDTH / 2,
      CONFIG.BOSS_SCENE_HEIGHT / 2 - 50,
      'Savasdan kacilmaz!',
      { fontSize: '18px', color: '#e74c3c', backgroundColor: '#000000', padding: { x: 12, y: 6 }, fontFamily: 'system-ui' }
    ).setOrigin(0.5).setDepth(20);
    this.time.delayedCall(1400, () => {
      if (this._escWarning) { this._escWarning.destroy(); this._escWarning = null; }
    });
  }

  _hpColor(pct) {
    if (pct > 0.5) return 0x2ecc71;
    if (pct > 0.25) return 0xf39c12;
    return 0xe74c3c;
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

  _getBossLevel(playerLevel) {
    if (playerLevel < CONFIG.BOSS_LEVEL_MEDIUM_FROM) return 1;
    if (playerLevel < CONFIG.BOSS_LEVEL_HARD_FROM) return 2;
    return 3;
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
        this.retriedOnce = true;
        this.currentQueue = [...this.wrongQueue];
        this.wrongQueue = [];
      } else {
        this.retriedOnce = false;
        this.wrongQueue = [];
        this.currentQueue = this.bossPool.slice().sort(() => Math.random() - 0.5).slice(0, CONFIG.BOSS_QUESTIONS);
      }
    }
    this._renderQuestion(this.currentQueue.shift());
  }

  _renderQuestion(q) {
    const hintCount = (this.registry.get('inventory') || { hints: 0 }).hints || 0;
    const hintArea = hintCount > 0
      ? `<button id="qp-hint" class="qp-hint-btn">Ipucu Kullan (${hintCount})</button>`
      : '';
    const opts = q.options
      .map(o => `<button class="qp-btn" data-value="${o}">${o}</button>`)
      .join('');
    const panel = document.getElementById('question-panel');
    panel.innerHTML = `
      <div class="bp-box">
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
    const inv = { ...(this.registry.get('inventory') || { hints: 0 }) };
    inv.hints = Math.max(0, inv.hints - 1);
    this.registry.set('inventory', inv);
    document.getElementById('qp-hint-text').textContent = `Ipucu: ${q.hint}`;
    btn.disabled = true;
  }

  _handleAnswer(answer, q) {
    document.querySelectorAll('.qp-btn').forEach(b => (b.disabled = true));
    const feedback = document.getElementById('qp-feedback');

    if (answer === q.correct) {
      this.bossHp = Math.max(0, this.bossHp - CONFIG.BOSS_DAMAGE_PER_CORRECT);
      this._tweenHp(this.bossHp, false);
      this._animateBossHit();
      this._burstStars(this.bossPos.x, this.bossPos.y - 20, 0xf39c12);
      feedback.textContent = 'Vurus! Boss hasar aldi.';
      feedback.className = 'qp-feedback qp-correct';
      if (this.bossHp <= 0) {
        this._animateBossDeath();
        this.time.delayedCall(900, () => this._showVictory());
        return;
      }
    } else {
      this.playerHp = Math.max(0, this.playerHp - CONFIG.PLAYER_DAMAGE_PER_WRONG);
      this.wrongQueue.push(q);
      this._tweenHp(this.playerHp, true);
      this._animatePlayerHit();
      feedback.innerHTML = `Yanlış! Doğrusu: <strong>${q.correct}</strong> (−${CONFIG.PLAYER_DAMAGE_PER_WRONG} HP)`;
      feedback.className = 'qp-feedback qp-wrong';
      if (this.playerHp <= 0) {
        this.time.delayedCall(900, () => this._showGameOver());
        return;
      }
    }
    this.time.delayedCall(1200, () => this._nextQuestion());
  }

  _animateBossHit() {
    const bx = this.bossPos.x;
    this.tweens.add({ targets: this.bossFigure, x: { from: bx - 10, to: bx }, duration: 60, yoyo: true, repeat: 3 });
    this.tweens.add({ targets: this.playerFigure, x: { from: this.playerPos.x, to: this.playerPos.x + 45 }, duration: 120, yoyo: true, ease: 'Power2' });
    this.bossFigure.parts.body.setFillStyle(0xff6666);
    this.time.delayedCall(500, () => this.bossFigure.parts.body.setFillStyle(this.bossAppearance.bodyColor));
  }

  _animatePlayerHit() {
    const px = this.playerPos.x;
    this.tweens.add({ targets: this.playerFigure, x: { from: px - 8, to: px }, duration: 60, yoyo: true, repeat: 2 });
    this.playerFigure.parts.body.setFillStyle(0xff4444);
    this.time.delayedCall(400, () => this.playerFigure.parts.body.setFillStyle(CONFIG.PLAYER_COLOR));
  }

  _animateBossDeath() {
    const curX = this.bossFigure.scaleX;
    const curY = this.bossFigure.scaleY;
    this.tweens.add({
      targets: this.bossFigure,
      alpha: 0,
      scaleX: curX * 1.8,
      scaleY: curY * 1.8,
      duration: 600,
      ease: 'Power2',
    });
    this._burstStars(this.bossPos.x, this.bossPos.y, 0xf39c12);
    this._burstStars(this.bossPos.x, this.bossPos.y, 0xe74c3c);
    this.add.text(CONFIG.GAME_WIDTH / 2, CONFIG.BOSS_SCENE_HEIGHT / 2, 'Boss Yenildi!', {
      fontSize: '30px', color: '#f39c12', fontFamily: 'system-ui',
    }).setOrigin(0.5);
  }

  _showVictory() {
    const currentLevel = this.registry.get('level') || 1;
    const coinReward = currentLevel * CONFIG.COIN_BOSS_REWARD_PER_LEVEL;
    const newCoins = (this.registry.get('coins') || 0) + coinReward;
    const newLevel = currentLevel + 1;
    this.registry.set('coins', newCoins);
    this.registry.set('level', newLevel);
    this.registry.set('hp', this.registry.get('maxHp'));
    saveScore(
      this.registry.get('playerName') || 'Anonim',
      newLevel,
      newCoins,
      this.registry.get('maxHp'),
      this.registry.get('inventory')
    );
    const panel = document.getElementById('question-panel');
    panel.innerHTML = `
      <div class="bp-box bp-result">
        <p class="bp-result-title bp-win">Boss Yenildi!</p>
        <p>+${coinReward} coin kazandın! (Toplam: ${newCoins})</p>
        <p>Level ${newLevel}'e geçtin.</p>
        <button id="bp-continue" class="qp-devam">Devam</button>
      </div>
    `;
    document.getElementById('bp-continue').addEventListener('click', () => this._returnToRoom());
  }

  _showGameOver() {
    this.registry.set('hp', this.registry.get('maxHp'));
    const panel = document.getElementById('question-panel');
    panel.innerHTML = `
      <div class="bp-box bp-result">
        <p class="bp-result-title bp-lose">Yenildin!</p>
        <p>Boss'u yenemesek de, devam et.</p>
        <button id="bp-continue" class="qp-devam">Odaya Don</button>
      </div>
    `;
    document.getElementById('bp-continue').addEventListener('click', () => this._returnToRoom());
  }

  _returnToRoom() {
    const panel = document.getElementById('question-panel');
    panel.style.display = 'none';
    panel.classList.remove('boss-panel');
    document.body.classList.remove('boss-active');
    this.scale.resize(CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
    this.scene.stop();
    this.scene.wake('RoomScene');
  }
}
