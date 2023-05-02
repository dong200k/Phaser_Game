import Monster from "./Monster";
import TinyZombie from "./zombie/TinyZombie";

export type MonsterId = "TinyZombie";

export default class MonsterFactory {

    /**
     * Creates a new monster based on the monster's id.
     * @param id The id of the monster. Can be accessed through MonsterId.
     * @returns A monster.
     */
    public static createMonster(id: MonsterId): Monster {
        let monster = new TinyZombie();
        switch(id) {
            case "TinyZombie": monster = new TinyZombie(); break;
        }
        return monster;
    }

}