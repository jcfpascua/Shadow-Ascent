export default class Level3 extends Phaser.Scene {
  constructor() {
    super('Level3');
  }

  // Preload assets
  preload() {
    this.load.image('brick', 'Assets/brick_1.png');
    this.load.image('flag', 'Assets/flag/flag.png');
    for (let i = 2; i <= 3; i++) {
      this.load.image(`floor${i}`, `Assets/Platforms/ceiling_${i}.png`);
    }
    for (let i = 0; i <= 17; i++) {
      const frame = i.toString().padStart(3, '0');
      this.load.image(`idle_${i}`, `Assets/Character Sprite/Fallen_Angels_2/PNG Sequences/Idle/0_Fallen_Angels_Idle_${frame}.png`);
    }
    this.load.image('idle0', 'Assets/Character Sprite/Fallen_Angels_2/PNG/PNG Sequences/Idle/0_Fallen_Angels_Idle_000.png');
    // Preload running frames (12 frames, 000-011)
    for (let i = 0; i <= 11; i++) {
      const frame = i.toString().padStart(3, '0');
      this.load.image(`run_${i}`, `Assets/Character Sprite/Fallen_Angels_2/PNG/PNG Sequences/Running/0_Fallen_Angels_Running_${frame}.png`);
    }
    // Load jump sound effect
    this.load.audio('jumpSound', 'Assets/SFX/jump_trim.wav');
    // Load shadow sound effects
    this.load.audio('shadowDrop', 'Assets/SFX/shadow_drop1.wav');
    this.load.audio('shadowSwap', 'Assets/SFX/shadow_swap.wav');
  }

  // Create game objects and setup scene
  create() {
    const tileSize = 32;
    const screenHeight = this.scale.height;
    const layerCount = 100;
    const spacingY = 110;

    // Create platform groups
    this.platforms = this.physics.add.staticGroup();
    this.movingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
    this.shadow = null;

    // Create ground platforms
    for (let i = 0; i < 30; i++) {
      const tileKey = `floor${Phaser.Math.Between(2, 3)}`;
      this.platforms.create(i * tileSize, screenHeight - tileSize, tileKey).setOrigin(0).refreshBody();
    }

    // Create layered platforms and moving platforms
    let prevXs = [300];
    for (let level = 1; level <= layerCount; level++) {
      const y = screenHeight - tileSize - level * spacingY;
      const platformCount = Phaser.Math.Between(3, 5);
      const levelXs = [];

      for (let i = 0; i < platformCount; i++) {
        let x = Phaser.Math.Clamp((prevXs[i % prevXs.length] || 400) + Phaser.Math.Between(-150, 150), 50, 700);
        if (levelXs.every(val => Math.abs(val - x) >= 80)) {
          levelXs.push(x);
          const width = Phaser.Math.Between(1, 2);
          for (let j = 0; j < width; j++) {
            const px = x + j * tileSize;
            const tileKey = `floor${Phaser.Math.Between(2, 3)}`;
            this.platforms.create(px, y, tileKey).setOrigin(0).refreshBody();
          }
        }
      }

      // Add moving platforms at higher levels
      if (level >= 20) {
        const halfY = y + spacingY / 2;
        const mpX = Phaser.Math.Between(100, 600);
        const tileKey = `floor${Phaser.Math.Between(2, 3)}`;
        const moving = this.movingPlatforms.create(mpX, halfY, tileKey).setOrigin(0);
        moving.setVelocityX(Phaser.Math.Between(-80, 80));
        moving.setCollideWorldBounds(true);
        moving.setBounce(1);
      }

      prevXs = [...levelXs];
      this.add.text(10, y - 8, `L${level}`, { fontSize: '12px', fill: '#ffffff' });

      if (level === layerCount) {
        this.topY = y;
        this.topX = levelXs[0];
      }
    }

    // Create player
    this.player = this.physics.add.sprite(100, screenHeight - 200, 'idle0');
    this.player.setDisplaySize(64, 64);
    this.player.setSize(32, 32);
    this.player.setCollideWorldBounds(true);
    this.player.play('idle');

    // Create running animation
    this.anims.create({
      key: 'run',
      frames: Array.from({length: 12}, (_, i) => ({ key: `run_${i}` })),
      frameRate: 16,
      repeat: -1
    });

    // Setup collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.movingPlatforms);

    // Create flag
    this.flag = this.physics.add.sprite(this.topX + 16, this.topY - 40, 'flag');
    this.flag.setImmovable(true);
    this.flag.body.allowGravity = false;
    this.physics.add.overlap(this.player, this.flag, () => this.scene.start('VictoryScreen'));

    // Create timer
    this.timer = this.time.addEvent({ delay: 180000 });
    this.timerText = this.add.text(16, 16, 'Time: 3:00', {
      fontSize: '20px',
      fill: '#ffffff'
    }).setScrollFactor(0);

    // Setup camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, this.topY - 100, this.scale.width, screenHeight - this.topY + 100);
    this.physics.world.setBounds(0, this.topY - 100, this.scale.width, screenHeight - this.topY + 100);
    this.cameras.main.roundPixels = true;

    // Setup controls and double jump variables
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyQ = this.input.keyboard.addKey('Q');
    this.keyW = this.input.keyboard.addKey('W');
    this.keySpace = this.input.keyboard.addKey('SPACE');
    this.jumps = 0;
    this.maxJumps = 1;
    this.jumpButtonDown = false;
  }

  // Update loop: handle movement, jumping, shadow, and timer
  update() {
    const speed = 160;
    const jumpPower = -500;

    // Handle left/right movement and running animation
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.flipX = true;
      if (this.player.anims.currentAnim?.key !== 'run') this.player.play('run');
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.flipX = false;
      if (this.player.anims.currentAnim?.key !== 'run') this.player.play('run');
    } else {
      this.player.setVelocityX(0);
      if (this.player.anims.currentAnim?.key !== 'idle') this.player.play('idle');
    }

    // Double jump logic
    if ((this.cursors.up.isDown || (this.keySpace && this.keySpace.isDown)) && this.jumps < this.maxJumps && !this.jumpButtonDown) {
      this.player.setVelocityY(jumpPower);
      this.jumps++;
      this.jumpButtonDown = true;
      this.sound.play('jumpSound');
    }
    if (!(this.cursors.up.isDown || (this.keySpace && this.keySpace.isDown))) {
      this.jumpButtonDown = false;
    }
    if (this.player.body.touching.down) {
      this.jumps = 0;
    }

    // Shadow placement logic
    if (Phaser.Input.Keyboard.JustDown(this.keyQ)) {
      if (!this.shadow) {
        this.shadow = this.physics.add.sprite(this.player.x, this.player.y, 'idle0');
        this.shadow.setDisplaySize(64, 64);
        this.shadow.setSize(32, 32);
        this.shadow.setAlpha(0.5);
        this.shadow.body.allowGravity = false;
        this.shadow.setImmovable(true);
        this.sound.play('shadowDrop');
      }
    }

    // Shadow swap logic
    if (Phaser.Input.Keyboard.JustDown(this.keyW) && this.shadow) {
      this.player.setPosition(this.shadow.x, this.shadow.y);
      this.shadow.destroy();
      this.shadow = null;
      this.sound.play('shadowSwap');
    }

    // Timer countdown
    const totalSec = Math.max(0, Math.floor((180000 - this.timer.getElapsed()) / 1000));
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    this.timerText.setText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`);

    if (totalSec <= 0) {
      this.scene.start('DefeatScreen');
    }
  }
}
