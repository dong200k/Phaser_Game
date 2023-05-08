import Monster from "../../schemas/gameobjs/monsters/Monster";
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
            playerManager: playerManager,
            monster: monster,
        });
    }

}