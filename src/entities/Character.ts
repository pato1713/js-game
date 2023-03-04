export interface ICharacter {
  health: number;
  speed?: number;
  mana?: number;
}

class Character implements ICharacter {
  health: number;
  speed: number;
  mana: number;

  constructor(config: ICharacter) {
    this.health = config.health;
    this.speed = config.speed ?? 0;
    this.mana = config.mana ?? 0;
  }
}

export default Character;
