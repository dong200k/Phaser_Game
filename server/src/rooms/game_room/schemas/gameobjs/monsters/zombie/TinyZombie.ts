import { IMonsterConfig } from "../../../../system/interfaces";
import Stat from "../../Stat";
import Monster from "../Monster";

export default class TinyZombie extends Monster {

    constructor(config?:IMonsterConfig) {
        super(Object.assign({
            name: "TinyZombie",
            width: 12,
            height: 18,
            stat: new Stat(),
        }, config));
        this.stat.attackRange = 30;
    }

}