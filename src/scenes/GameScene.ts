import Phaser from "phaser";
import sky from "../assets/sky.png";
import platform from "../assets/platform.png";
import star from "../assets/star.png";
import bomb from "../assets/bomb.png";
import idle from "../assets/fire-wizard/Idle_edited.png";
import run from "../assets/fire-wizard/Run_edited.png";
import jump from "../assets/fire-wizard/Jump_edited.png";
import GlobalConfig, { Config } from "../GlobalConfig";
import Player from "../entities/Player";

class GameScene extends Phaser.Scene {
  cursors;
  player;
  score = 0;
  scoreText;
  gameOver = false;
  stars;
  bombs;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  globalConfig: Config;
  mainPlayer: Player;

  constructor(config) {
    super(config);
    this.globalConfig = GlobalConfig.getInstance();
    this.mainPlayer = this.globalConfig.mainPlayer;
  }

  preload() {
    this.textures.addBase64("sky", sky);
    this.load.image("ground", platform);
    this.load.image("star", star);
    this.load.image("bomb", bomb);
    this.load.image("run", run);
    this.load.spritesheet("running", run, {
      frameWidth: 44,
      frameHeight: 66,
      spacing: 84,
      // margin: 1,
    });
    this.load.spritesheet("idle_spritesheet", idle, {
      frameWidth: 33,
      frameHeight: 66,
      spacing: 95,
      // margin: 1,
    });
    this.load.spritesheet("jump_spritesheet", jump, {
      frameWidth: 44,
      frameHeight: 66,
      spacing: 84,
      // margin: 1,
    });
  }

  create() {
    const image = this.add.image(
      window.innerWidth / 2,
      window.innerHeight / 2,
      "sky"
    );
    image.scaleX = 3;
    image.scaleY = 2;
    this.platforms = this.physics.add.staticGroup();
    this.platforms
      .create(400, this.game.scale.height, "ground")
      .setScale(8)
      .refreshBody();
    this.platforms.create(600, 420, "ground");
    this.platforms.create(50, 250, "ground");
    this.platforms.create(750, 40, "ground");
    this.platforms.create(1250, 420, "ground");
    this.platforms.create(1800, 120, "ground");
    this.platforms.create(400, 600, "ground");

    this.player = this.physics.add.sprite(100, 450, "idle_spritesheet", 0);
    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.bombs = this.physics.add.group();

    this.anims.create({
      key: "running_animation",
      frames: this.anims.generateFrameNumbers("running", { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "idle_animation",
      frames: this.anims.generateFrameNumbers("idle_spritesheet", {
        start: 0,
        end: 6,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "jump_animation",
      frames: this.anims.generateFrameNumbers("jump_spritesheet", {
        start: 0,
        end: 8,
      }),
      frameRate: 7,
      repeat: 0,
    });

    this.physics.add.collider(this.player, this.platforms);

    this.stars = this.physics.add.group({
      key: "star",
      repeat: 27,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000",
    });

    this.physics.add.collider(this.bombs, this.platforms);

    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      null,
      this
    );
  }

  update() {
    if (this.cursors.space.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
      this.player.anims.play("jump_animation");
    } else if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.flipX = true;
      if (this.player.body.touching.down)
        this.player.anims.play("running_animation", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.flipX = false;
      if (this.player.body.touching.down)
        this.player.anims.play("running_animation", true);
    } else if (this.player.body.touching.down) {
      this.player.setVelocityX(0);

      this.player.anims.play("idle_animation", true);
    }
  }

  /* OTHER METHODS */
  private collectStar(player, star) {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText("Score: " + this.score);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      const x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      const bomb = this.bombs.create(x, 16, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }

  private hitBomb() {
    this.physics.pause();

    this.player.setTint(0xff0000);

    this.player.anims.play("idle_animation");

    this.gameOver = true;
  }
}

export default GameScene;
