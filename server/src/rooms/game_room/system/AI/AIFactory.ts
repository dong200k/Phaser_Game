import Monster from "../../schemas/gameobjs/monsters/Monster";
import BerserkerBossController from "../StateControllers/BossControllers/BerserkerBossController/BerserkerBossController";
import PlayerManager from "../StateManagers/PlayerManager";
import MonsterController from "./MonsterAI/simplemonster/MonsterController";

export default class AIFactory {

    /**
     * Creates a simple AI that will follow the nearest player.
     * @param monster The monster this AI will belong to.
     * @param playerManager The playerManager.
     * @returns A MonsterController.
     */
    public static createSimpleAI(monster: Monster, playerManager: PlayerManager) {
        return new MonsterController({
            monster: monster,
        });
    }

    /**
     * Creates a monster ai controller from a key. If you have a custom monster controller,
     * you can add it here with the key and the constructor.
     * @param monster The monster this ai controller belongs to.
     * @param key The key of the ai controller.
     * @returns A MonsterController.
     */
    public static createAIFromKey(monster: Monster, key: string): MonsterController {
        let mc: MonsterController;
        switch(key) {
            case "Default": mc = new MonsterController({monster}); break;
            case "BerserkerBoss": mc = new BerserkerBossController({monster}); break;
            default: mc = new MonsterController({monster});
        }
        return mc;
    }

}