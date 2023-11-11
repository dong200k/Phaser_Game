import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree";
import EffectFactory from "../../../../schemas/effects/EffectFactory";
import ContinuousEffectUntimed from "../../../../schemas/effects/continuous/ContinuousEffectUntimed";
import ShieldEffect from "../../../../schemas/effects/temp/ShieldEffect";
import Player from "../../../../schemas/gameobjs/Player";
import { CategoryType } from "../../../Collisions/Category";
import DatabaseManager from "../../../Database/DatabaseManager";
import { getFinalAttackRange } from "../../../Formulas/formulas";
import GameManager from "../../../GameManager";
import EffectManager from "../../../StateManagers/EffectManager";
import { ITriggerType } from "../../../interfaces";
import EffectLogic from "../../EffectLogic";

/** 
 * Artifact that will give player more max health
*/
export class beets extends EffectLogic{
    effectLogicId = "max-health-20" 
    triggerType: ITriggerType = "none"

    public useEffect(playerState: Player, gameManager: GameManager, tree?: WeaponUpgradeTree){
        let newMaxHp = Math.round(playerState.stat.maxHp * 1.2)
        playerState.stat.hp += newMaxHp - playerState.stat.maxHp
        playerState.stat.maxHp = newMaxHp

    }
}

