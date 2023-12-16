import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree"
import TriggerUpgradeEffect from "../../../../schemas/effects/trigger/TriggerUpgradeEffect"
import Player from "../../../../schemas/gameobjs/Player"
import GameManager from "../../../GameManager"
import { ITriggerType } from "../../../interfaces"
import EffectLogic from "../../EffectLogic"
import { SpecialEffectLogic } from "./SpecialEffectLogic"

export interface ISpecialUpgradeConfig{
    effectLogicId?: string,
    damage?: number,
    area?: number,
    /** id of the dash effect logic to upgrade */
    id: string,
    amount?: 1
    /** extra additive duration multiplier */
    duration?: number
}

/** 
 * This effectlogic will be used to upgrade any DashEffectLogic
*/
export class SpecialUpgrade extends EffectLogic{
    effectLogicId = "Dash-Upgrade" 
    triggerType: ITriggerType = "one time"

    private damage = 0
    private area = 0
    /** id of the dash effect logic to upgrade */
    private id = ""
    private amount = 0
    /** Duration of projectile, applies only to some dashes */
    private duration = 0

    constructor(config?: ISpecialUpgradeConfig){
        super(config)
        this.effectLogicId = config?.effectLogicId ?? this.effectLogicId
        this.area = config?.area ?? this.area
        this.damage = config?.damage ?? this.damage
        this.id = config?.id ?? this.id
        this.amount = config?.amount ?? this.amount
        this.duration = config?.duration ?? this.duration
    }

    public useEffect(playerState: Player, gameManager: GameManager, tree?: WeaponUpgradeTree){
        console.log(`special upgrade, id: ${this.id}, amount: ${this.amount}`)
        playerState.effects.forEach(effect=>{
            if(effect instanceof TriggerUpgradeEffect && effect.effectLogic && effect.effectLogic instanceof SpecialEffectLogic && effect.effectLogic.effectLogicId === this.id){
                effect.effectLogic.increaseBonusArea(this.area)
                effect.effectLogic.increaseBonusAttackMultiplier(this.damage)
                effect.effectLogic.increaseAmount(this.amount)
                effect.effectLogic.increaseBonusDurationMult(this.duration)
            }
        })
    }
}

