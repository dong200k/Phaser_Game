import EffectFactory from "../../../../../schemas/effects/EffectFactory"
import Player from "../../../../../schemas/gameobjs/Player"
import GameManager from "../../../../GameManager"
import StateMachine from "../../../../StateMachine/StateMachine"
import EffectManager from "../../../../StateManagers/EffectManager"
import EffectLogic from "../../../EffectLogic"
import RangerAbilityController from "./RangerAbilityController"

export default class RangerAbilityLogic extends EffectLogic{
    effectLogicId = "ranger-ability"

    private rangerAbilityController?: RangerAbilityController

    public useEffect(playerState: Player, gameManager: GameManager, ){
        // Create a controller if it hasn't been created
        if(!this.rangerAbilityController){
            this.rangerAbilityController = new RangerAbilityController({
                player: playerState,
                gameManager: gameManager
            })
            this.rangerAbilityController.update(0)
        }
        this.rangerAbilityController.startAbility()
    }

    update(deltaT: number){
        this.rangerAbilityController?.update(deltaT)
    }
}