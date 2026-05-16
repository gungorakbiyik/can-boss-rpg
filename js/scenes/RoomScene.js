class RoomScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RoomScene' });
  }

  create() {
    const { GAME_WIDTH, GAME_HEIGHT, ROOM_PADDING, PLAYER_SIZE, PLAYER_COLOR, WALL_COLOR } = CONFIG;

    const playW = GAME_WIDTH - ROOM_PADDING * 2;
    const playH = GAME_HEIGHT - ROOM_PADDING * 2;
    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2;

    const border = this.add.rectangle(centerX, centerY, playW, playH);
    border.setStrokeStyle(2, WALL_COLOR);

    this.physics.world.setBounds(ROOM_PADDING, ROOM_PADDING, playW, playH);

    this.player = this.add.rectangle(centerX, centerY, PLAYER_SIZE, PLAYER_SIZE, PLAYER_COLOR);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      upArrow: Phaser.Input.Keyboard.KeyCodes.UP,
      downArrow: Phaser.Input.Keyboard.KeyCodes.DOWN,
      leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
      rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    });
  }

  update() {
    const { up, down, left, right, upArrow, downArrow, leftArrow, rightArrow } = this.keys;

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
  }
}
