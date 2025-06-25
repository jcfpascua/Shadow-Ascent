export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const centerX = this.scale.width / 2;
    let offsetY = 150;

    this.add.text(centerX, 80, 'Shadow Ascent', {
      fontSize: '36px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const playBtn = this.add.text(centerX, offsetY, 'Play (Level 1)', {
      fontSize: '24px',
      color: '#00ff00'
    }).setOrigin(0.5).setInteractive();

    offsetY += 40;

    const level2Btn = this.add.text(centerX, offsetY, 'Level 2', {
      fontSize: '24px',
      color: '#00ffff'
    }).setOrigin(0.5).setInteractive();

    offsetY += 40;

    const level3Btn = this.add.text(centerX, offsetY, 'Level 3', {
      fontSize: '24px',
      color: '#ffff00'
    }).setOrigin(0.5).setInteractive();

    offsetY += 60;

    this.add.text(centerX, offsetY, 'Credits: Made by Seed', {
      fontSize: '16px',
      color: '#aaaaaa'
    }).setOrigin(0.5);

    playBtn.on('pointerdown', () => {
      this.scene.start('Level1');
    });

    level2Btn.on('pointerdown', () => {
      this.scene.start('Level2');
    });

    level3Btn.on('pointerdown', () => {
      this.scene.start('Level3');
    });
  }
}
