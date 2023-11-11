import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import ContinuousUpgradeEffect from "../../../../../schemas/effects/continuous/ContinuousUpgradeEffect";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import EffectManager from "../../../../StateManagers/EffectManager";
import { ITriggerType } from "../../../../interfaces";
import EffectLogic from "../../../EffectLogic";
import { Amplifier } from "./Amplifier";


interface IAmplifierBoostConfig{
    bonusIncrease: number,
    effectLogicId: string
}

/** 
 * This effectlogic will be used to upgrade the amplifier artifact
*/
export class AmplifierBoost extends EffectLogic{
    effectLogicId = "Amplifier" 
    triggerType: ITriggerType = "one time"

    private bonusIncrease: number = 0.01

    constructor(config?: IAmplifierBoostConfig){
        super(config)
        this.bonusIncrease = config?.bonusIncrease ?? this.bonusIncrease
        this.effectLogicId = config?.effectLogicId ?? this.effectLogicId
    }

    public useEffect(playerState: Player, gameManager: GameManager, tree?: WeaponUpgradeTree){
        playerState.effects.forEach(effect=>{
            if(effect instanceof ContinuousUpgradeEffect && effect.effectLogic instanceof Amplifier){
                effect.effectLogic.increaseBonusCap(this.bonusIncrease)
            }
        })
    }
}

