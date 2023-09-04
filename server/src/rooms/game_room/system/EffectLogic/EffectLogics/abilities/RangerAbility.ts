import Player from "../../../../schemas/gameobjs/Player"
import GameManager from "../../../GameManager"
import EffectLogic from "../../EffectLogic"

export default class RangerAbilityLogic extends EffectLogic{
    effectLogicId = "ranger-ability"

    public useEffect(playerState: Player, gameManager: GameManager){
        console.log("Using ranger ability")
    }
}