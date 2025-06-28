export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    const titleFontSize = 36;
    const buttonFontSize = 24;
    const creditFontSize = 16;
    const titleSpacing = 40;
    const buttonSpacing = 32;
    const creditSpacing = 48;

    const totalHeight = titleFontSize + titleSpacing + (3 * buttonFontSize) + (2 * buttonSpacing) + creditSpacing + creditFontSize;
    let offsetY = centerY - totalHeight / 2;

    // Title
    this.add.text(centerX, offsetY, 'Shadow Ascent', {
      fontSize: `${titleFontSize}px`,
      color: '#ffffff'
    }).setOrigin(0.5);
    offsetY += titleFontSize + titleSpacing;

    // Level 1
    const playBtn = this.add.text(centerX, offsetY, 'Level 1', {
      fontSize: `${buttonFontSize}px`,
      color: '#00ff00'
    }).setOrigin(0.5).setInteractive();
    offsetY += buttonFontSize + buttonSpacing;

    // Level 2
    const level2Btn = this.add.text(centerX, offsetY, 'Level 2', {
      fontSize: `${buttonFontSize}px`,
      color: '#00ffff'
    }).setOrigin(0.5).setInteractive();
    offsetY += buttonFontSize + buttonSpacing;

    // Level 3
    const level3Btn = this.add.text(centerX, offsetY, 'Level 3', {
      fontSize: `${buttonFontSize}px`,
      color: '#ffff00'
    }).setOrigin(0.5).setInteractive();
    offsetY += buttonFontSize + creditSpacing;

    // Credits
    this.add.text(centerX, offsetY, 'Made by Rico Dayoc and Jericho Cid Pascua', {
      fontSize: `${creditFontSize}px`,
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
