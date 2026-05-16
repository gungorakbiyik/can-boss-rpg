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
  scene: [RoomScene, WarmupScene, BossScene, ShopScene],
});

const coinHud = document.getElementById('coin-hud');
const syncCoinHUD = (parent, key, value) => {
  if (key === 'coins') coinHud.textContent = `Coin: ${value}`;
};
game.registry.events.on('setdata', syncCoinHUD);
game.registry.events.on('changedata', syncCoinHUD);
