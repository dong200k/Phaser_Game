import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree";
import EffectFactory from "../../../../schemas/effects/EffectFactory";
import PiercingEffect from "../../../../schemas/effects/temp/PiercingEffect";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import EffectManager from "../../../StateManagers/EffectManager";
import EffectLogic from "../../EffectLogic";

/**
 * Gives the player 1 extra piercing untimed or until the effect is removed.
 */
export default class Piercing1Logic extends EffectLogic{
    effectLogicId = "Piercing1"
    piercingEffect?: PiercingEffect 
    piercing = 1

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree){
        this.piercingEffect = EffectFactory.createPiercingEffect(this.piercing, tree, false)
        EffectManager.addEffectsTo(playerState, this.piercingEffect)
    }

    public removeEffect(playerState: Player, gameManager: GameManager, ...args: any){
        if(this.piercingEffect) EffectManager.removeEffectFrom(playerState, this.piercingEffect)
    }
}