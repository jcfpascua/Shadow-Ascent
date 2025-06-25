export default class DefeatScreen extends Phaser.Scene {
  constructor() {
    super('DefeatScreen');
  }

  create() {
    this.add.text(100, 100, 'Game Over', { fontSize: '32px', fill: '#ff0000' });

    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('MainMenu');
    });
  }
}
