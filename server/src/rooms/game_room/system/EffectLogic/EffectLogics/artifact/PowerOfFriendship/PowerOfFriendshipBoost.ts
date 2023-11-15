import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import ContinuousUpgradeEffect from "../../../../../schemas/effects/continuous/ContinuousUpgradeEffect";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import EffectManager from "../../../../StateManagers/EffectManager";
import { ITriggerType } from "../../../../interfaces";
import EffectLogic from "../../../EffectLogic";
import { PowerOfFriendship } from "./PowerOfFriendship";


interface IAmplifierBoostConfig{
    bonusIncrease: number,
    effectLogicId: string,
    perPlayerBonusIncrease: number,
}

/** 
 * This effectlogic will be used to upgrade the amplifier artifact
*/
export class PowerOfFriendshipBoost extends EffectLogic{
    effectLogicId = "POF"
    triggerType: ITriggerType = "one time"

    private bonusIncrease: number = 0.01
    private perPlayerBonusIncrease: number = 0.01

    constructor(config?: IAmplifierBoostConfig){
        super(config)
        this.bonusIncrease = config?.bonusIncrease ?? this.bonusIncrease
        this.perPlayerBonusIncrease = config?.perPlayerBonusIncrease ?? this.perPlayerBonusIncrease
        this.effectLogicId = config?.effectLogicId ?? this.effectLogicId
    }

    public useEffect(playerState: Player, gameManager: GameManager, tree?: WeaponUpgradeTree){
        playerState.effects.forEach(effect=>{
            if(effect instanceof ContinuousUpgradeEffect && effect.effectLogic instanceof PowerOfFriendship){
                effect.effectLogic.increaseBaseBonus(this.bonusIncrease)
                effect.effectLogic.increasePlayerBonus(this.perPlayerBonusIncrease)
            }
        })
    }
}

