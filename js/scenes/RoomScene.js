class RoomScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RoomScene' });
  }

  create() {
    const {
      GAME_WIDTH, GAME_HEIGHT, ROOM_PADDING,
      PLAYER_SIZE, PLAYER_COLOR, WALL_COLOR,
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

    const zoneY = ROOM_PADDING + ZONE_SIZE / 2 + ZONE_MARGIN;
    const warmupX = ROOM_PADDING + ZONE_SIZE / 2 + ZONE_MARGIN;
    const shopX = GAME_WIDTH - ROOM_PADDING - ZONE_SIZE / 2 - ZONE_MARGIN;
    const bossY = GAME_HEIGHT - ROOM_PADDING - BOSS_ZONE_HEIGHT / 2 - ZONE_MARGIN;

    this.warmupZone = this._makeZone(warmupX, zoneY, ZONE_SIZE, ZONE_SIZE, WARMUP_COLOR, 'Isınma', 'warmup');
    this.shopZone = this._makeZone(shopX, zoneY, ZONE_SIZE, ZONE_SIZE, SHOP_COLOR, 'Mağaza', 'shop');
    this.bossZone = this._makeZone(centerX, bossY, BOSS_ZONE_WIDTH, BOSS_ZONE_HEIGHT, BOSS_COLOR, 'Boss Kapısı', 'boss');

    this.player = this.add.rectangle(centerX, centerY, PLAYER_SIZE, PLAYER_SIZE, PLAYER_COLOR);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

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
  }

  _makeZone(x, y, w, h, color, label, type) {
    const rect = this.add.rectangle(x, y, w, h, color, 0.8);
    this.physics.add.existing(rect, true);
    this.add.text(x, y, label, {
      fontSize: '13px',
      color: '#ffffff',
      fontFamily: 'system-ui',
    }).setOrigin(0.5).setDepth(1);
    rect.zoneType = type;
    return rect;
  }

  update() {
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

    const scale = (vx !== 0 && vy !== 0) ? Math.SQRT1_2 : 1;
    this.player.body.setVelocity(
      vx * CONFIG.PLAYER_SPEED * scale,
      vy * CONFIG.PLAYER_SPEED * scale
    );

    if (this.activeZone) {
      this.promptText
        .setPosition(this.activeZone.x, this.activeZone.y - this.activeZone.height / 2 - 16)
        .setVisible(true);

      if (Phaser.Input.Keyboard.JustDown(interact) || Phaser.Input.Keyboard.JustDown(interactAlt)) {
        console.log(`${this.activeZone.zoneType} açıldı`);
      }
    } else {
      this.promptText.setVisible(false);
    }

    this.activeZone = null;
  }
}
