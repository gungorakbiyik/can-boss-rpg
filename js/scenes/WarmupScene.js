class WarmupScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WarmupScene' });
  }

  create() {
    this.correctCount = 0;
    this.questionIndex = 0;

    const cached = this.registry.get('warmupQuestions');
    if (cached) {
      this._buildQueue(cached);
    } else {
      fetch('./data/questions.json')
        .then(r => r.json())
        .then(data => {
          const warmup = data.questions.filter(q => q.useFor.includes('warmup'));
          this.registry.set('warmupQuestions', warmup);
          this._buildQueue(warmup);
        });
    }
  }

  _buildQueue(questions) {
    let usedIds = this.registry.get('warmupUsedIds') || [];
    let available = questions.filter(q => !usedIds.includes(q.id));
    if (available.length < CONFIG.WARMUP_QUESTIONS) {
      usedIds = [];
      available = questions;
    }
    const shuffled = available.slice().sort(() => Math.random() - 0.5);
    this.queue = shuffled.slice(0, CONFIG.WARMUP_QUESTIONS);
    this.totalQuestions = this.queue.length;
    this.registry.set('warmupUsedIds', [...usedIds, ...this.queue.map(q => q.id)]);
    this._showQuestion();
  }

  _showQuestion() {
    this._renderPanel(this.queue[this.questionIndex]);
  }

  _renderPanel(q) {
    const panel = document.getElementById('question-panel');
    const LABELS = ['A', 'B', 'C', 'D'];
    const optionButtons = q.options
      .map((opt, i) => `<button class="qp-btn" data-value="${opt}">
        <span class="qp-btn-label">${LABELS[i]}</span>
        <span>${opt}</span>
      </button>`)
      .join('');
    panel.innerHTML = `
      <div class="qp-box">
        <div class="qp-counter">📚 ISINMA &nbsp; ${this.questionIndex + 1} / ${this.totalQuestions}</div>
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
    document.querySelectorAll('.qp-btn').forEach(b => {
      b.disabled = true;
      if (b.dataset.value === q.correct) b.classList.add('correct');
      else if (b.dataset.value === answer) b.classList.add('wrong');
    });

    const feedback = document.getElementById('qp-feedback');
    const devam = document.getElementById('qp-devam');

    if (answer === q.correct) {
      this.correctCount++;
      feedback.textContent = '✓ Aferin!';
      feedback.className = 'qp-feedback qp-correct';
    } else {
      feedback.innerHTML = `✗ Yanlış. Doğrusu: <strong>${q.correct}</strong><br><small>${q.explanation || ''}</small>`;
      feedback.className = 'qp-feedback qp-wrong';
    }

    devam.classList.remove('qp-hidden');
    devam.addEventListener('click', () => this._nextQuestion(), { once: true });
  }

  _nextQuestion() {
    this.questionIndex++;
    if (this.questionIndex < this.totalQuestions) {
      this._showQuestion();
    } else {
      this._showResult();
    }
  }

  _showResult() {
    const reward = this.correctCount * CONFIG.COIN_WARMUP_REWARD;
    const coins = (this.registry.get('coins') || 0) + reward;
    this.registry.set('coins', coins);

    const panel = document.getElementById('question-panel');
    panel.innerHTML = `
      <div class="qp-box wu-result-box">
        <div class="qp-counter">📚 ISINMA SONU</div>
        <div class="wu-result-score">${this.correctCount}<span class="wu-result-total"> / ${this.totalQuestions}</span></div>
        <p class="qp-feedback ${reward > 0 ? 'qp-correct' : 'qp-wrong'}">
          ${reward > 0 ? `+${reward} 🪙 coin kazandın!` : 'Coin kazanmak için doğru cevapla!'}
        </p>
        <button id="qp-close" class="qp-devam">Odaya Dön →</button>
      </div>
    `;
    panel.style.display = 'flex';
    document.getElementById('qp-close').addEventListener('click', () => this._close());
  }

  _close() {
    document.getElementById('question-panel').style.display = 'none';
    this.scene.stop();
    this.scene.resume('RoomScene');
  }
}
