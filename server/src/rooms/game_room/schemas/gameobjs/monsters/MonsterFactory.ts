import Monster from "./Monster";
import TinyZombie from "./zombie/TinyZombie";

export type MonsterType = "TinyZombie";

export default class MonsterFactory {

    /**
     * Creates a new monster based on the monster's id.
     * @param type The id of the monster. Can be accessed through MonsterId.
     * @returns A monster.
     */
    public static createMonster(type: MonsterType): Monster {
        let monster = new TinyZombie();
        switch(type) {
            case "TinyZombie": monster = new TinyZombie(); break;
        }
        return monster;
    }

}