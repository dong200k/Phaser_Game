import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import ContinuousUpgradeEffect from "../../../../../schemas/effects/continuous/ContinuousUpgradeEffect";
import TriggerUpgradeEffect from "../../../../../schemas/effects/trigger/TriggerUpgradeEffect";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import EffectManager from "../../../../StateManagers/EffectManager";
import { ITriggerType } from "../../../../interfaces";
import EffectLogic from "../../../EffectLogic";
import { RuneGuard } from "./RuneGuard";


interface IFireballUpgradeConfig{
    effectLogicId?: string,
    damage?: number,
    amount?: number,
    cooldownReduction?: number
}

/** 
 * This effectlogic will be used to upgrade the amplifier artifact
*/
export class RuneGuardUpgrade extends EffectLogic{
    effectLogicId = "RuneGuardUpgrade" 
    triggerType: ITriggerType = "one time"

    private damage = 0
    private amount = 0
    private cooldownReduction = 0

    constructor(config?: IFireballUpgradeConfig){
        super(config)
        this.effectLogicId = config?.effectLogicId ?? this.effectLogicId
        this.amount = config?.amount ?? this.amount
        this.damage = config?.damage ?? this.damage
        this.cooldownReduction = config?.cooldownReduction ?? this.cooldownReduction
    }

    public useEffect(playerState: Player, gameManager: GameManager, tree?: WeaponUpgradeTree){
        // console.log("upgrading fireball")
        playerState.effects.forEach(effect=>{
            if(effect instanceof ContinuousUpgradeEffect && effect.effectLogic instanceof RuneGuard){
                effect.effectLogic.increaseAmount(this.amount)
                effect.effectLogic.increaseDamage(this.damage)
                effect.effectLogic.applyCooldownReduction(this.cooldownReduction)
                // console.log(`rune guard upgrade damage: ${this.dama  ge}, cooldownReduction: ${this.cooldownReduction}, amount: ${this.amount}`)
            }
        })
    }
}

