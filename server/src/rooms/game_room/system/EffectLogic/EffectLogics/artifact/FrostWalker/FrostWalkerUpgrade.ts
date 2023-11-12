import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import ContinuousUpgradeEffect from "../../../../../schemas/effects/continuous/ContinuousUpgradeEffect";
import TriggerUpgradeEffect from "../../../../../schemas/effects/trigger/TriggerUpgradeEffect";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import EffectManager from "../../../../StateManagers/EffectManager";
import { ITriggerType } from "../../../../interfaces";
import EffectLogic from "../../../EffectLogic";
import { FrostWalker } from "./FrostWalker";


interface IFireballUpgradeConfig{
    effectLogicId?: string,
    damage?: number,
    area?: number,
    amount?: number,
    duration?: number,
}

/** 
 * This effectlogic will be used to upgrade the amplifier artifact
*/
export class FrostWalkerUpgrade extends EffectLogic{
    effectLogicId = "FrostWalker-Upgrade" 
    triggerType: ITriggerType = "one time"

    private damage = 0
    private area = 0
    private amount = 0
    private duration = 0

    constructor(config?: IFireballUpgradeConfig){
        super(config)
        this.effectLogicId = config?.effectLogicId ?? this.effectLogicId
        this.amount = config?.amount ?? this.amount
        this.area = config?.area ?? this.area
        this.damage = config?.damage ?? this.damage
        this.duration = config?.duration ?? this.duration

    }

    public useEffect(playerState: Player, gameManager: GameManager, tree?: WeaponUpgradeTree){
        playerState.effects.forEach(effect=>{
            if(effect instanceof ContinuousUpgradeEffect && effect.effectLogic instanceof FrostWalker){
                // console.log(`frost walker upgrade: amount: ${this.amount}, area: ${this.area}, damage: ${this.damage}, duration: ${this.duration}`)
                effect.effectLogic.increaseArea(this.area)
                effect.effectLogic.increaseDamage(this.damage)
                effect.effectLogic.increaseAmount(this.amount)
                effect.effectLogic.increaseAmount(this.amount)
                effect.effectLogic.increaseDuration(this.duration)
            }
        })
    }
}

