import GameManager from "../../../../system/GameManager";
import { IMonsterConfig } from "../../../../system/interfaces";
import Stat from "../../Stat";
import Monster from "../Monster";

export default class TinyZombie extends Monster {

    constructor(gameManager: GameManager) {
        super(gameManager, { // Note: this config object will be used as default values when resetting the monster.
            name: "TinyZombie",
            width: 12, // 12
            height: 18, // 18
            stat: Object.assign(new Stat(), {
                speed: 25,
                attackRange: 20,
                attack: 5,
                magicAttack: 0,
                attackPercent: 1,
                armor: 0,
                magicResist: 0,
                maxHp: 100,
                hp: 100,
            }), 
        });
    }

}