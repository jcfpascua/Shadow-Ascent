// Import scenes
import MainMenu from './mainMenu.js';
import Level1 from './level1.js';
import Level2 from './level2.js';
import Level3 from './level3.js';
import VictoryScreen from './victoryScreen.js';
import DefeatScreen from './defeatScreen.js';

// Phaser game configuration
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: window.innerHeight,
  backgroundColor: '#0C1319',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: false
    }
  },
  scene: [
    MainMenu,
    Level1,
    Level2,
    Level3,
    VictoryScreen,
    DefeatScreen
  ]
};

// Create Phaser game instance
const game = new Phaser.Game(config);
