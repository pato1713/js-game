import Character, { ICharacter } from "./Character";
import uuid from "uuid";

class Player extends Character {
  id: string;

  constructor(config: ICharacter) {
    super(config);

    // this.id = uuid.v4();
  }

  loadSpritesheet(loader: Phaser.Loader.LoaderPlugin, url: string) {
    loader.spritesheet(this.id, url, {
      frameWidth: 44,
      frameHeight: 64,
      spacing: 84,
      // margin: 1,
    });
  }
}

export default Player;
