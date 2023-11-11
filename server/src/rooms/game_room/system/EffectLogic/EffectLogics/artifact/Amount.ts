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
 * Artifact that will increase players amount stat
*/
export class Amount extends EffectLogic{
    effectLogicId = "amount-1" 
    triggerType: ITriggerType = "one time"

    public useEffect(playerState: Player, gameManager: GameManager, tree?: WeaponUpgradeTree){
        playerState.stat.amount += 1
    }
}

