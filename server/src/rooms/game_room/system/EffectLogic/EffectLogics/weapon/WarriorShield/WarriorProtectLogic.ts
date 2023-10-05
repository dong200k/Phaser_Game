import Entity from "../../../../../schemas/gameobjs/Entity";
import GameManager from "../../../../GameManager";
import EffectLogic from "../../../EffectLogic";

/** Players near you gain armor. */
export default class WarriorProtectLogic extends EffectLogic {

    effectLogicId: string = "WarriorProtectLogic";

    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        console.log("------Warrior Protect Upgrade.-------");
    }

}
