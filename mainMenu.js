export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const centerX = this.scale.width / 2;
    const itemSpacing = 40;
    const items = [
      { text: 'Level 1', color: '#00ff00' },
      { text: 'Level 2', color: '#00ffff' },
      { text: 'Level 3', color: '#ffff00' }
    ];
    const titleHeight = 60;
    const creditsHeight = 60;
    const totalMenuHeight = titleHeight + items.length * itemSpacing + creditsHeight;
    let offsetY = (this.scale.height - totalMenuHeight) / 2 + titleHeight;

    this.add.text(centerX, offsetY - titleHeight, 'Shadow Ascent', {
      fontSize: '36px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const btns = [];
    items.forEach((item, i) => {
      const btn = this.add.text(centerX, offsetY + i * itemSpacing, item.text, {
        fontSize: '24px',
        color: item.color
      }).setOrigin(0.5).setInteractive();
      btns.push(btn);
    });

    this.add.text(centerX, offsetY + items.length * itemSpacing + 20, 'Made by Rico Dayoc and Jericho Cid Pascua', {
      fontSize: '16px',
      color: '#aaaaaa'
    }).setOrigin(0.5);

    btns[0].on('pointerdown', () => {
      this.scene.start('Level1');
    });
    btns[1].on('pointerdown', () => {
      this.scene.start('Level2');
    });
    btns[2].on('pointerdown', () => {
      this.scene.start('Level3');
    });
  }
}
