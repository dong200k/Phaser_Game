import GameManager from "../../../../system/GameManager";
import { IMonsterConfig } from "../../../../system/interfaces";
import Stat from "../../Stat";
import Monster from "../Monster";

export default class TinyZombie extends Monster {

    constructor(gameManager: GameManager) {
        super(gameManager, { // Note: this config object will be used as default values when resetting the monster.
            id: "TinyZombie",
            name: "TinyZombie",
            imageKey: "TinyZombie",
            bounds: {
                type: "rect",
                width: 12,
                height: 18,
            },
            stats: Object.assign(new Stat(), {
                speed: 25,
                attackRange: 20,
                attack: 5,
                magicAttack: 0,
                attackPercent: 0,
                armor: 0,
                magicResist: 0,
                maxHp: 20,
                hp: 20,
                attackSpeed: 0.7,
            }), 
        });
    }

}