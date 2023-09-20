import Player from "../../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../../GameManager";
import EffectLogic from "../../../../EffectLogic"
import BerserkerComboController from "../../../../../StateControllers/BerserkerController/BerserkerComboController";
import BerserkerChargeAttackLogic from "./BerserkerChargeAttackLogic";
import TriggerUpgradeEffect from "../../../../../../schemas/effects/trigger/TriggerUpgradeEffect";

/**
 * Unlocks a combo if the player has the berserker controller.
 */
export default class DoubleGetsugaLogic extends EffectLogic{
    effectLogicId: string = "DoubleGetsugaLogic"

    public useEffect(playerState: Player, gameManager: GameManager, ...args: any): void {
        playerState.effects.forEach(e=>{
            if(e instanceof TriggerUpgradeEffect && e.effectLogic instanceof BerserkerChargeAttackLogic){
                e.effectLogic.incrementGetsugaCount()
            }
        })
    }

}