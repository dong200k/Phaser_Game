import MonsterController from "../../../system/AI/MonsterAI/simplemonster/MonsterController";
import Monster from "./Monster";
import TinyZombie from "./zombie/TinyZombie";

type MonsterName = "TinyZombie";
type BrainType = "Simple";

export default class MonsterFactory {

    public static createMonster(name: MonsterName): Monster {
        let monster = new TinyZombie();
        // let ai = new MonsterController({
        //     monster: monster,
        //     playerManager: 
        // });
        return monster;
    }

}