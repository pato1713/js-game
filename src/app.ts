import GameScene from "./scenes/GameScene";

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: document.body,
    width: "100%",
    height: "100%",
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  pixelArt: true,
  scene: [GameScene],
};

const game = new Phaser.Game(config);
