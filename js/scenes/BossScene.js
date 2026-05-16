class BossScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BossScene' });
  }

  create() {
    this.playerHp = this.registry.get('hp');
    this.bossHp = CONFIG.BOSS_HP;
    this.currentQueue = [];
    this.wrongQueue = [];
    this.retriedOnce = false;

    this.scale.resize(CONFIG.GAME_WIDTH, CONFIG.BOSS_SCENE_HEIGHT);
    document.body.classList.add('boss-active');

    this._setupArena();
    this._loadQuestions();
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

    this.playerPos = { x: midX - 250, y: H * 0.67 };
    this.bossPos = { x: midX + 250, y: H * 0.62 };

    this.playerRect = this.add.rectangle(this.playerPos.x, this.playerPos.y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_COLOR);
    this.bossRect = this.add.rectangle(this.bossPos.x, this.bossPos.y, 64, 64, CONFIG.BOSS_COLOR);

    this.hpGraphics = this.add.graphics();
    this.playerHpText = this.add.text(30, 38, '', numStyle);
    this.bossHpText = this.add.text(W - 30, 38, '', numStyle).setOrigin(1, 0);

    this._drawHpBars();
  }

  _drawHpBars() {
    const g = this.hpGraphics;
    const W = CONFIG.GAME_WIDTH;
    const BAR_W = 220, BAR_H = 18, BAR_Y = 16;
    const pPct = Math.max(0, this.playerHp / CONFIG.PLAYER_HP);
    const bPct = Math.max(0, this.bossHp / CONFIG.BOSS_HP);

    g.clear();

    g.fillStyle(0x333333); g.fillRect(30, BAR_Y, BAR_W, BAR_H);
    g.fillStyle(this._hpColor(pPct)); g.fillRect(30, BAR_Y, Math.ceil(BAR_W * pPct), BAR_H);

    g.fillStyle(0x333333); g.fillRect(W - 30 - BAR_W, BAR_Y, BAR_W, BAR_H);
    g.fillStyle(this._hpColor(bPct)); g.fillRect(W - 30 - Math.ceil(BAR_W * bPct), BAR_Y, Math.ceil(BAR_W * bPct), BAR_H);

    this.playerHpText.setText(`${this.playerHp} / ${CONFIG.PLAYER_HP}`);
    this.bossHpText.setText(`${this.bossHp} / ${CONFIG.BOSS_HP}`);
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

  _buildQueue(allQuestions) {
    const boss1 = allQuestions.filter(q => q.useFor.includes('boss-1'));
    const shuffled = boss1.slice().sort(() => Math.random() - 0.5);
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
        this._showGameOver();
        return;
      }
    }
    this._renderQuestion(this.currentQueue.shift());
  }

  _renderQuestion(q) {
    const opts = q.options
      .map(o => `<button class="qp-btn" data-value="${o}">${o}</button>`)
      .join('');
    const panel = document.getElementById('question-panel');
    panel.innerHTML = `
      <div class="bp-box">
        <p class="qp-question">${q.text}</p>
        <div class="qp-options">${opts}</div>
        <div id="qp-feedback" class="qp-feedback"></div>
      </div>
    `;
    panel.classList.add('boss-panel');
    panel.style.display = 'flex';
    panel.querySelectorAll('.qp-btn').forEach(btn => {
      btn.addEventListener('click', () => this._handleAnswer(btn.dataset.value, q));
    });
  }

  _handleAnswer(answer, q) {
    document.querySelectorAll('.qp-btn').forEach(b => (b.disabled = true));
    const feedback = document.getElementById('qp-feedback');

    if (answer === q.correct) {
      this.bossHp = Math.max(0, this.bossHp - CONFIG.BOSS_DAMAGE_PER_CORRECT);
      this._drawHpBars();
      this._animateBossHit();
      feedback.textContent = 'Vuruş! Boss hasar aldı.';
      feedback.className = 'qp-feedback qp-correct';
      if (this.bossHp <= 0) {
        this._animateBossDeath();
        this.time.delayedCall(900, () => this._showVictory());
        return;
      }
    } else {
      this.playerHp = Math.max(0, this.playerHp - CONFIG.PLAYER_DAMAGE_PER_WRONG);
      this.wrongQueue.push(q);
      this._drawHpBars();
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
    this.tweens.add({ targets: this.bossRect, x: { from: bx - 10, to: bx }, duration: 60, yoyo: true, repeat: 3 });
    this.tweens.add({ targets: this.playerRect, x: { from: this.playerPos.x, to: this.playerPos.x + 45 }, duration: 120, yoyo: true, ease: 'Power2' });
    this.bossRect.setFillStyle(0xff6666);
    this.time.delayedCall(500, () => this.bossRect.setFillStyle(CONFIG.BOSS_COLOR));
  }

  _animatePlayerHit() {
    const px = this.playerPos.x;
    this.tweens.add({ targets: this.playerRect, x: { from: px - 8, to: px }, duration: 60, yoyo: true, repeat: 2 });
    this.playerRect.setFillStyle(0xff4444);
    this.time.delayedCall(400, () => this.playerRect.setFillStyle(CONFIG.PLAYER_COLOR));
  }

  _animateBossDeath() {
    this.tweens.add({ targets: this.bossRect, alpha: 0, duration: 600 });
    this.add.text(CONFIG.GAME_WIDTH / 2, CONFIG.BOSS_SCENE_HEIGHT / 2, 'Boss Yenildi!', {
      fontSize: '30px', color: '#f39c12', fontFamily: 'system-ui',
    }).setOrigin(0.5);
  }

  _showVictory() {
    const coins = (this.registry.get('coins') || 0) + CONFIG.COIN_BOSS_REWARD;
    const level = (this.registry.get('level') || 1) + 1;
    this.registry.set('coins', coins);
    this.registry.set('level', level);
    this.registry.set('hp', CONFIG.PLAYER_HP);
    const panel = document.getElementById('question-panel');
    panel.innerHTML = `
      <div class="bp-box bp-result">
        <p class="bp-result-title bp-win">Boss Yenildi!</p>
        <p>+${CONFIG.COIN_BOSS_REWARD} coin kazandın! (Toplam: ${coins})</p>
        <p>Level ${level}'e geçtin.</p>
        <button id="bp-continue" class="qp-devam">Devam</button>
      </div>
    `;
    document.getElementById('bp-continue').addEventListener('click', () => this._returnToRoom());
  }

  _showGameOver() {
    this.registry.set('hp', CONFIG.PLAYER_HP);
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
