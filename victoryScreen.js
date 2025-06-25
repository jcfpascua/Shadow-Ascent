export default class VictoryScreen extends Phaser.Scene {
  constructor() {
    super('VictoryScreen');
  }

  create() {
    this.add.text(100, 100, 'Victory! You Win!', { fontSize: '32px', fill: '#00ff00' });

    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('MainMenu');
    });
  }
}
