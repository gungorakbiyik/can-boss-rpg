const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: CONFIG.GAME_WIDTH,
  height: CONFIG.GAME_HEIGHT,
  parent: 'game',
  backgroundColor: CONFIG.BG_COLOR,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scene: [TitleScene, RoomScene, WarmupScene, BossScene, ShopScene],
});

const coinAmount = document.getElementById('coin-amount');
const hudLevel   = document.getElementById('hud-level');

const syncHUD = (parent, key, value) => {
  if (key === 'coins') coinAmount.textContent = value;
  if (key === 'level')  hudLevel.textContent  = value;
};
game.registry.events.on('setdata',    syncHUD);
game.registry.events.on('changedata', syncHUD);
