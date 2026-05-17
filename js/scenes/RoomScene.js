class RoomScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RoomScene' });
  }

  create() {
    const {
      GAME_WIDTH, GAME_HEIGHT, ROOM_PADDING,
      PLAYER_COLOR, WALL_COLOR,
      ZONE_SIZE, ZONE_MARGIN, BOSS_ZONE_WIDTH, BOSS_ZONE_HEIGHT,
      WARMUP_COLOR, SHOP_COLOR, BOSS_COLOR,
    } = CONFIG;

    const playW = GAME_WIDTH - ROOM_PADDING * 2;
    const playH = GAME_HEIGHT - ROOM_PADDING * 2;
    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2;

    const border = this.add.rectangle(centerX, centerY, playW, playH);
    border.setStrokeStyle(2, WALL_COLOR);

    this.physics.world.setBounds(ROOM_PADDING, ROOM_PADDING, playW, playH);

    if (this.registry.get('coins') === undefined) {
      this.registry.set('coins', 0);
    }
    if (this.registry.get('hp') === undefined) {
      this.registry.set('hp', CONFIG.PLAYER_HP);
    }
    if (this.registry.get('level') === undefined) {
      this.registry.set('level', 1);
    }
    if (this.registry.get('maxHp') === undefined) {
      this.registry.set('maxHp', CONFIG.PLAYER_HP);
    }
    if (!this.registry.get('inventory')) {
      this.registry.set('inventory', { hints: 0, extraHp: 0 });
    }

    const zoneY = ROOM_PADDING + ZONE_SIZE / 2 + ZONE_MARGIN;
    const warmupX = ROOM_PADDING + ZONE_SIZE / 2 + ZONE_MARGIN;
    const shopX = GAME_WIDTH - ROOM_PADDING - ZONE_SIZE / 2 - ZONE_MARGIN;
    const bossY = GAME_HEIGHT - ROOM_PADDING - BOSS_ZONE_HEIGHT / 2 - ZONE_MARGIN;

    this.warmupZone = this._makeZone(warmupX, zoneY, ZONE_SIZE, ZONE_SIZE, WARMUP_COLOR, '📚', 'Isınma', 'warmup');
    this.shopZone = this._makeZone(shopX, zoneY, ZONE_SIZE, ZONE_SIZE, SHOP_COLOR, '🛒', 'Mağaza', 'shop');
    this.bossZone = this._makeZone(centerX, bossY, BOSS_ZONE_WIDTH, BOSS_ZONE_HEIGHT, BOSS_COLOR, '🚪', 'Boss Kapısı', 'boss');

    this.player = createPersonFigure(this, centerX, centerY, {
      bodyColor: PLAYER_COLOR,
      scale: CONFIG.PLAYER_FIGURE_SCALE,
    });
    this.physics.add.existing(this.player);
    this.player.body.setSize(CONFIG.PLAYER_BODY_W, CONFIG.PLAYER_BODY_H);
    this.player.body.setOffset(-CONFIG.PLAYER_BODY_W / 2, -CONFIG.PLAYER_BODY_H / 2 + 4);
    this.player.body.setCollideWorldBounds(true);
    this._facingDir = 1;

    this.promptText = this.add.text(0, 0, "E'ye bas", {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 6, y: 4 },
      fontFamily: 'system-ui',
    }).setOrigin(0.5).setVisible(false).setDepth(10);

    this.activeZone = null;

    [this.warmupZone, this.shopZone, this.bossZone].forEach(zone => {
      this.physics.add.overlap(this.player, zone, () => {
        this.activeZone = zone;
      });
    });

    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      upArrow: Phaser.Input.Keyboard.KeyCodes.UP,
      downArrow: Phaser.Input.Keyboard.KeyCodes.DOWN,
      leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
      rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      interact: Phaser.Input.Keyboard.KeyCodes.E,
      interactAlt: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    this.menuKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this._menuOpen = false;
    this._isMoving = false;

    this._hudMenuBtn = document.getElementById('hud-menu-btn');
    this._menuClickHandler = () => this._openMenu();
    this._hudMenuBtn.addEventListener('click', this._menuClickHandler);
    this._hudMenuBtn.style.display = 'flex';
  }

  shutdown() {
    if (this._hudMenuBtn && this._menuClickHandler) {
      this._hudMenuBtn.removeEventListener('click', this._menuClickHandler);
      this._hudMenuBtn.style.display = 'none';
    }
  }

  _enterZone(type) {
    if (this._menuOpen) return;
    if (type === 'warmup') { this.scene.pause(); this.scene.launch('WarmupScene'); }
    else if (type === 'boss') { this.scene.sleep(); this.scene.launch('BossScene'); }
    else if (type === 'shop') { this.scene.pause(); this.scene.launch('ShopScene'); }
  }

  _makeZone(x, y, w, h, color, icon, label, type) {
    const rect = this.add.rectangle(x, y, w, h, color, 0.22);
    rect.setStrokeStyle(2, color);
    rect.setInteractive(new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h), Phaser.Geom.Rectangle.Contains);
    rect.input.cursor = 'pointer';
    rect.on('pointerdown', () => this._enterZone(type));
    this.physics.add.existing(rect, true);
    this.add.text(x, y - 8, icon, {
      fontSize: '38px',
      fontFamily: 'system-ui, sans-serif',
    }).setOrigin(0.5).setDepth(1);
    this.add.text(x, y + h / 2 - 12, label, {
      fontSize: '12px',
      color: '#ffffff',
      fontFamily: 'system-ui',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(1);
    rect.zoneType = type;
    return rect;
  }

  _openMenu() {
    if (this._menuOpen) return;
    this._menuOpen = true;
    this.player.body.setVelocity(0, 0);
    if (this._isMoving) {
      this._isMoving = false;
      stopWalking(this.player);
    }

    const overlay = document.getElementById('ui-overlay');
    overlay.innerHTML = `
      <div class="rm-menu-box">
        <h2>Menü</h2>
        <button id="menu-resume" class="rm-menu-btn-primary">Devam Et</button>
        <button id="menu-title" class="rm-menu-btn">Ana Menüye Dön</button>
      </div>
    `;
    overlay.style.display = 'flex';

    document.getElementById('menu-resume').addEventListener('click', () => this._closeMenu());
    document.getElementById('menu-title').addEventListener('click', () => this._goToTitle());
  }

  _closeMenu() {
    this._menuOpen = false;
    const overlay = document.getElementById('ui-overlay');
    overlay.style.display = 'none';
    overlay.innerHTML = '';
  }

  _goToTitle() {
    this._closeMenu();
    this.scene.start('TitleScene');
  }

  update() {
    if (this._menuOpen) return;
    if (Phaser.Input.Keyboard.JustDown(this.menuKey)) this._openMenu();

    const { up, down, left, right, upArrow, downArrow, leftArrow, rightArrow, interact, interactAlt } = this.keys;

    const goUp = up.isDown || upArrow.isDown;
    const goDown = down.isDown || downArrow.isDown;
    const goLeft = left.isDown || leftArrow.isDown;
    const goRight = right.isDown || rightArrow.isDown;

    let vx = 0;
    let vy = 0;
    if (goLeft) vx = -1;
    else if (goRight) vx = 1;
    if (goUp) vy = -1;
    else if (goDown) vy = 1;

    const diagScale = (vx !== 0 && vy !== 0) ? Math.SQRT1_2 : 1;
    this.player.body.setVelocity(
      vx * CONFIG.PLAYER_SPEED * diagScale,
      vy * CONFIG.PLAYER_SPEED * diagScale
    );

    const nowMoving = vx !== 0 || vy !== 0;
    if (nowMoving && !this._isMoving) {
      this._isMoving = true;
      startWalking(this, this.player);
    } else if (!nowMoving && this._isMoving) {
      this._isMoving = false;
      stopWalking(this.player);
    }
    if (vx !== 0 && vx !== this._facingDir) {
      this._facingDir = vx;
      faceDirection(this.player, vx);
    }

    if (this.activeZone) {
      this.promptText
        .setPosition(this.activeZone.x, this.activeZone.y - this.activeZone.height / 2 - 16)
        .setVisible(true);

      if (Phaser.Input.Keyboard.JustDown(interact) || Phaser.Input.Keyboard.JustDown(interactAlt)) {
        this._enterZone(this.activeZone.zoneType);
      }
    } else {
      this.promptText.setVisible(false);
    }

    this.activeZone = null;
  }
}
