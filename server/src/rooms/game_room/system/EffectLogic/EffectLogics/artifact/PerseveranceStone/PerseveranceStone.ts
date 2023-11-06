import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import EffectManager from "../../../../StateManagers/EffectManager";
import { ITriggerType } from "../../../../interfaces";
import EffectLogic from "../../../EffectLogic";

/** 
 * This artifact will give player more armor the lower their health gets
*/
export class PerseveranceStone extends EffectLogic{
    effectLogicId = "Perseverance" 
    triggerType: ITriggerType = "none"

    /** Total bonus armor possible*/
    private armorCap = 25
    private prevBonus = 0

    private statEffectId?: string

    public useEffect(playerState: Player, gameManager: GameManager, tree?: WeaponUpgradeTree){
        let missingHealthPercent = 1 - playerState.stat.hp / playerState.stat.maxHp
        let bonus = missingHealthPercent * this.armorCap

        this.grantBonus(playerState, bonus)
    }

    private grantBonus(playerState: Player, bonus: number){
        if(this.prevBonus === bonus) return
        this.prevBonus = bonus

        // console.log(`Perseverance Artifact: Granting bonus ${bonus} armor`)

        // Remove existing bonus
        if(this.statEffectId){
            EffectManager.removeStatEffectFrom(playerState, this.statEffectId)
        }

        // Add new bonus
        let statEffect = EffectFactory.createStatEffect({armor: bonus, magicResist: bonus})
        this.statEffectId = EffectManager.addStatEffectsTo(playerState, statEffect)
    }

    public increaseArmorCap(num: number){
        this.armorCap += num
        // console.log(`Perseverance Artifact: Increasing bonus armor cap`)
        // console.log(`New armor cap: ${this.armorCap}`)
    }

}

