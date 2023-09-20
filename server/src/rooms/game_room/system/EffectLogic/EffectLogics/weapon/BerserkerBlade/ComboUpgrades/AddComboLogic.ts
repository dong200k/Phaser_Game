import Player from "../../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../../GameManager";
import EffectLogic from "../../../../EffectLogic"
import BerserkerComboController from "../../../../../StateControllers/BerserkerController/BerserkerComboController";

/**
 * Unlocks a combo if the player has the berserker controller.
 */
export default class AddComboLogic extends EffectLogic{
    effectLogicId: string = "AddComboLogic"

    public useEffect(playerState: Player, gameManager: GameManager, ...args: any): void {
        let playerController = playerState.playerController
        if(playerController instanceof BerserkerComboController){
            playerController.incrementUnlockedCombos()
        }
    }

}