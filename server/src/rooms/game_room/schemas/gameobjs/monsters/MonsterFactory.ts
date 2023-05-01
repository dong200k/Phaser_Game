import Monster from "./Monster";
import TinyZombie from "./zombie/TinyZombie";

type MonsterName = "TinyZombie";

export default class MonsterFactory {

    public static createMonster(name: MonsterName): Monster {
        return new TinyZombie();
    }

}