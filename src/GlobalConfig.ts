import Player from "./entities/Player";

export class Config {
  mainPlayer: Player;
  score: number;
  enemysKilled: number;

  constructor() {
    this.mainPlayer = new Player({ health: 100 });
  }
}

class GlobalConfig {
  static config: Config;

  static getInstance() {
    if (GlobalConfig.config !== undefined) {
      return GlobalConfig.config;
    }

    return new Config();
  }
}

export default GlobalConfig;
