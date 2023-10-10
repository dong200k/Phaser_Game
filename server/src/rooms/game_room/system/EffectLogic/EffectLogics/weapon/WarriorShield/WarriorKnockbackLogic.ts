import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree";
import Entity from "../../../../../schemas/gameobjs/Entity";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import WarriorController from "../../../../StateControllers/WarriorController/WarriorController";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import EffectLogic from "../../../EffectLogic";

/** Attacks and ability gets increased knockback. */
export default class WarriorKnockbackLogic extends EffectLogic {

    effectLogicId: string = "WarriorKnockbackLogic";

    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        console.log("------Warrior Knockback Upgrade.-------");
        if(entity instanceof Player && entity.playerController instanceof WarriorController) {
            entity.playerController.upgradeWarriorKnockback();
        }
    }

}
