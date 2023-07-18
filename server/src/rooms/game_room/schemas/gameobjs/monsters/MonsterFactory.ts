import GameManager from "../../../system/GameManager";
import Monster from "./Monster";
import TinyZombie from "./zombie/TinyZombie";

export type MonsterType = "TinyZombie";

export default class MonsterFactory {

    /**
     * Creates a new monster based on the monster's id.
     * @param gameManager The gameManager this monster belongs to.
     * @param type The id of the monster. Can be accessed through MonsterId.
     * @returns A monster.
     */
    public static createMonster(gameManager: GameManager, type: MonsterType | string): Monster {
        let monster;
        switch(type) {
            case "TinyZombie": monster = new TinyZombie(gameManager); break;
            default: monster = new TinyZombie(gameManager);
        }
        return monster;
    }

}