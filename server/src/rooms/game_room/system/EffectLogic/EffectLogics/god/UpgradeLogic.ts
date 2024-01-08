import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree";
import ContinuousUpgradeEffect from "../../../../schemas/effects/continuous/ContinuousUpgradeEffect";
import TriggerUpgradeEffect from "../../../../schemas/effects/trigger/TriggerUpgradeEffect";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import EffectLogic from "../../EffectLogic";
import GodUpgrade from "./GodUpgrade";

export interface IUpgradeLogicConfig {
    effectLogicId?: string,
    effectToUpgradeId?: string
}
export default class UpgradeLogic extends EffectLogic{
    private effectToUpgradeId = ""
    constructor(config?: IUpgradeLogicConfig){
        super(config)
        this.effectLogicId = config?.effectLogicId ?? this.effectLogicId
        this.effectToUpgradeId = config?.effectToUpgradeId ?? this.effectToUpgradeId
    }

    public useEffect(playerState: Player, gameManager: GameManager, tree?: WeaponUpgradeTree){
        // console.log("upgrading fireball")
        playerState.effects.forEach(effect=>{
            if((effect instanceof TriggerUpgradeEffect || effect instanceof ContinuousUpgradeEffect) 
                && effect.effectLogic instanceof GodUpgrade
                && effect.effectLogic.effectLogicId === this.effectToUpgradeId){
                effect.effectLogic.upgrade()
            }
        })
    }
}