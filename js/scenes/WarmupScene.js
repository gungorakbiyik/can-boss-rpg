class WarmupScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WarmupScene' });
  }

  create() {
    const cached = this.registry.get('warmupQuestions');
    if (cached) {
      this.questions = cached;
      this._showQuestion();
    } else {
      fetch('./data/questions.json')
        .then(r => r.json())
        .then(data => {
          const warmup = data.questions.filter(q => q.useFor.includes('warmup'));
          this.registry.set('warmupQuestions', warmup);
          this.questions = warmup;
          this._showQuestion();
        });
    }
  }

  _showQuestion() {
    let usedIds = this.registry.get('warmupUsedIds') || [];
    let available = this.questions.filter(q => !usedIds.includes(q.id));
    if (available.length === 0) {
      usedIds = [];
      available = this.questions;
    }
    const q = available[Math.floor(Math.random() * available.length)];
    usedIds.push(q.id);
    this.registry.set('warmupUsedIds', usedIds);
    this._renderPanel(q);
  }

  _renderPanel(q) {
    const panel = document.getElementById('question-panel');
    const optionButtons = q.options
      .map(opt => `<button class="qp-btn" data-value="${opt}">${opt}</button>`)
      .join('');
    panel.innerHTML = `
      <div class="qp-box">
        <p class="qp-question">${q.text}</p>
        <div class="qp-options">${optionButtons}</div>
        <div id="qp-feedback" class="qp-feedback"></div>
        <button id="qp-devam" class="qp-devam qp-hidden">Devam →</button>
      </div>
    `;
    panel.style.display = 'flex';
    panel.querySelectorAll('.qp-btn').forEach(btn => {
      btn.addEventListener('click', () => this._handleAnswer(btn.dataset.value, q));
    });
  }

  _handleAnswer(answer, q) {
    document.querySelectorAll('.qp-btn').forEach(b => (b.disabled = true));
    const feedback = document.getElementById('qp-feedback');
    const devam = document.getElementById('qp-devam');

    if (answer === q.correct) {
      const coins = (this.registry.get('coins') || 0) + CONFIG.COIN_WARMUP_REWARD;
      this.registry.set('coins', coins);
      feedback.textContent = `Aferin! +${CONFIG.COIN_WARMUP_REWARD} coin kazandın. (Toplam: ${coins})`;
      feedback.className = 'qp-feedback qp-correct';
    } else {
      feedback.innerHTML = `Yanlış. Doğrusu: <strong>${q.correct}</strong><br><small>${q.explanation}</small>`;
      feedback.className = 'qp-feedback qp-wrong';
    }

    devam.classList.remove('qp-hidden');
    devam.addEventListener('click', () => this._close());
  }

  _close() {
    document.getElementById('question-panel').style.display = 'none';
    this.scene.stop();
    this.scene.resume('RoomScene');
  }
}
