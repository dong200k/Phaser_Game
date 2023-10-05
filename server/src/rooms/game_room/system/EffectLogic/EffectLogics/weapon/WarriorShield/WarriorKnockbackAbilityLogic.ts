import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree";
import Entity from "../../../../../schemas/gameobjs/Entity";
import GameManager from "../../../../GameManager";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import EffectLogic from "../../../EffectLogic";


export default class WarriorKnockbackAbilityLogic extends EffectLogic {

    effectLogicId: string = "WarriorKnockbackAbilityLogic";

    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        console.log("------Warrior Knockback Ability Upgrade.-------");
    }

}
