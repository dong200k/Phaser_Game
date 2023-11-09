import Entity from "../../../../../schemas/gameobjs/Entity";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import WarriorController from "../../../../StateControllers/WarriorController/WarriorController";
import EffectLogic from "../../../EffectLogic";

/** Players near you gain armor. */
export default class WarriorProtectLogic extends EffectLogic {

    effectLogicId: string = "WarriorProtectLogic";

    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        console.log("------Warrior Protect Upgrade.-------");
        if(entity instanceof Player && entity.playerController instanceof WarriorController) {
            entity.playerController.upgradeWarriorAura();
        }
    }

}
