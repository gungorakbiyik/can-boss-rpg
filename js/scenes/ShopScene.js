class ShopScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ShopScene' });
  }

  create() {
    this._renderShop();
  }

  _renderShop() {
    const coins = this.registry.get('coins') || 0;
    const inv = this.registry.get('inventory') || { hints: 0, extraHp: 0 };
    const maxHp = this.registry.get('maxHp') || CONFIG.PLAYER_HP;
    const panel = document.getElementById('shop-panel');

    panel.innerHTML = `
      <div class="sp-box">
        <h2 class="sp-title">Magaza</h2>
        <p class="sp-coins">Coin: ${coins}</p>
        <div class="sp-items">
          ${this._itemCard('+10 Max HP', `Mevcut max HP: ${maxHp}. Kalici.`, CONFIG.SHOP_HP_PRICE, 'hp', coins)}
          ${this._itemCard('Ipucu (1 adet)', `Sahip olunan: ${inv.hints} adet.`, CONFIG.SHOP_HINT_PRICE, 'hint', coins)}
        </div>
        <button id="sp-close" class="sp-close">Kapat</button>
      </div>
    `;
    panel.style.display = 'flex';

    panel.querySelector('[data-item="hp"]').addEventListener('click', () => this._buy('hp'));
    panel.querySelector('[data-item="hint"]').addEventListener('click', () => this._buy('hint'));
    document.getElementById('sp-close').addEventListener('click', () => this._close());
  }

  _itemCard(name, desc, price, itemKey, coins) {
    const disabled = coins < price ? 'disabled' : '';
    return `
      <div class="sp-item">
        <div class="sp-item-info">
          <strong>${name}</strong>
          <span>${desc}</span>
        </div>
        <button class="sp-buy-btn" data-item="${itemKey}" ${disabled}>${price} coin</button>
      </div>
    `;
  }

  _buy(itemKey) {
    const coins = this.registry.get('coins') || 0;
    const inv = { ...(this.registry.get('inventory') || { hints: 0, extraHp: 0 }) };

    if (itemKey === 'hp' && coins >= CONFIG.SHOP_HP_PRICE) {
      inv.extraHp = (inv.extraHp || 0) + CONFIG.SHOP_HP_AMOUNT;
      const newMax = CONFIG.PLAYER_HP + inv.extraHp;
      this.registry.set('coins', coins - CONFIG.SHOP_HP_PRICE);
      this.registry.set('maxHp', newMax);
      this.registry.set('hp', newMax);
    } else if (itemKey === 'hint' && coins >= CONFIG.SHOP_HINT_PRICE) {
      inv.hints = (inv.hints || 0) + 1;
      this.registry.set('coins', coins - CONFIG.SHOP_HINT_PRICE);
    } else {
      return;
    }

    this.registry.set('inventory', inv);
    this._renderShop();
  }

  _close() {
    document.getElementById('shop-panel').style.display = 'none';
    this.scene.stop();
    this.scene.resume('RoomScene');
  }
}
