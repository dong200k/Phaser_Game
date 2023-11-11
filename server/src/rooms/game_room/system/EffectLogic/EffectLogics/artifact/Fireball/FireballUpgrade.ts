import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import ContinuousUpgradeEffect from "../../../../../schemas/effects/continuous/ContinuousUpgradeEffect";
import TriggerUpgradeEffect from "../../../../../schemas/effects/trigger/TriggerUpgradeEffect";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import EffectManager from "../../../../StateManagers/EffectManager";
import { ITriggerType } from "../../../../interfaces";
import EffectLogic from "../../../EffectLogic";
import { Fireball } from "./Fireball";


interface IFireballUpgradeConfig{
    effectLogicId?: string,
    damage?: number,
    area?: number,
    amount?: number
}

/** 
 * This effectlogic will be used to upgrade the amplifier artifact
*/
export class FireballUpgrade extends EffectLogic{
    effectLogicId = "Fireball" 
    triggerType: ITriggerType = "one time"

    private damage = 0
    private area = 0
    private amount = 0

    constructor(config?: IFireballUpgradeConfig){
        super(config)
        this.effectLogicId = config?.effectLogicId ?? this.effectLogicId
        this.amount = config?.amount ?? this.amount
        this.area = config?.area ?? this.area
        this.damage = config?.damage ?? this.damage
    }

    public useEffect(playerState: Player, gameManager: GameManager, tree?: WeaponUpgradeTree){
        // console.log("upgrading fireball")
        playerState.effects.forEach(effect=>{
            if(effect instanceof TriggerUpgradeEffect && effect.effectLogic instanceof Fireball){
                effect.effectLogic.increaseFireballAmount(this.amount)
                effect.effectLogic.increaseFireballArea(this.area)
                effect.effectLogic.increaseFireballDamage(this.damage)
            }
        })
    }
}

