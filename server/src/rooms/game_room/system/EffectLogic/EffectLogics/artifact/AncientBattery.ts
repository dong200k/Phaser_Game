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
 * Artifact that will fully charge up player's charge attack after rolling when cooldown is up.
*/
export class AncientBattery extends EffectLogic{
    effectLogicId = "Ancient-Battery" 
    triggerType: ITriggerType = "none"

    public useEffect(playerState: Player, gameManager: GameManager, tree?: WeaponUpgradeTree){
        playerState.playerController.getRollState().setEnterChargeStateOnRollFinish(true)
    }
}

