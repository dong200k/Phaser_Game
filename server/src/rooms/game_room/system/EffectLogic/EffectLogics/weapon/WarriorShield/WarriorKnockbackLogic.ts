import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree";
import Entity from "../../../../../schemas/gameobjs/Entity";
import GameManager from "../../../../GameManager";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import EffectLogic from "../../../EffectLogic";

/** Attacks and ability gets increased knockback. */
export default class WarriorKnockbackLogic extends EffectLogic {

    effectLogicId: string = "WarriorKnockbackLogic";

    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        console.log("------Warrior Knockback Upgrade.-------");
    }

}
