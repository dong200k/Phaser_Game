import MathUtil from "../../../../../../util/MathUtil";
import EffectFactory from "../../../../schemas/effects/EffectFactory";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import EffectManager from "../../../StateManagers/EffectManager";
import { ITriggerType } from "../../../interfaces";
import EffectLogic from "../../EffectLogic";

/** triggered by player skill, grants * 5 speed temporarily
 * TODO: show cool animations
*/
export class HermesBoots extends EffectLogic{
    effectLogicId = "Hermes-Boots" 
    triggerType: ITriggerType = "player skill"

    public useEffect(playerState: Player){
        // EffectManager.addEffectsTo(playerState, EffectFactory.createSpeedMultiplierEffectTimed(5, 1))
        EffectManager.addEffectsTo(playerState, EffectFactory.createCollisionImmuneEffectTimed(1))
    }
}
