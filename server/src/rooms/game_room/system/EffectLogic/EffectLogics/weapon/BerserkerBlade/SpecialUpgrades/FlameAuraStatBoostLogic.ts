import Player from "../../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../../GameManager";
import EffectLogic from "../../../../EffectLogic"
import BerserkerComboController from "../../../../../StateControllers/BerserkerController/BerserkerComboController";
import TriggerUpgradeEffect from "../../../../../../schemas/effects/trigger/TriggerUpgradeEffect";
import BerserkerAbilityLogic from "../../../abilities/BerserkerAbility/BerserkerAbility";

/**
 * Unlocks a combo if the player has the berserker controller.
 */
export default class FlameAuraStatBoostLogic extends EffectLogic{
    effectLogicId: string = "FlameAuraStatBoost"

    public useEffect(playerState: Player, gameManager: GameManager, ...args: any): void {
        let effectLogic = playerState.currentAbility?.getEffectLogic()
        if(effectLogic && effectLogic instanceof BerserkerAbilityLogic){
            effectLogic.toggleStatBoostWhenUnder10Percent()
        }
    }

}