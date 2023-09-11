import EffectFactory from "../../../../schemas/effects/EffectFactory"
import Player from "../../../../schemas/gameobjs/Player"
import GameManager from "../../../GameManager"
import EffectManager from "../../../StateManagers/EffectManager"
import EffectLogic from "../../EffectLogic"

export default class RangerAbilityLogic extends EffectLogic{
    effectLogicId = "ranger-ability"

    public useEffect(playerState: Player, gameManager: GameManager){
        console.log("Using ranger ability")
        // EffectManager.addEffectsTo(playerState, EffectFactory.createPiercingEffect(10, true, 2))
    }
}