import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import EffectManager from "../../../../StateManagers/EffectManager";
import { ITriggerType } from "../../../../interfaces";
import EffectLogic from "../../../EffectLogic";

/** 
 * This artifact will give player more attack speed as they slay more monsters.
*/
export class Amplifier extends EffectLogic{
    effectLogicId = "Amplifier" 
    triggerType: ITriggerType = "none"

    /** Threshold needed to gain the bonus stats */
    private monsterThreshold = 10
    /** bonus attack speed percent gained for every monsterThreshold monsters slain */
    private attackSpeedBonus = 0.01
    /** Total bonus possible */
    private bonusCap = 0.05
    private prevBonus = 0

    private monstersSlainInitially = 0
    private firstUse = true

    private statEffectId?: string

    public useEffect(playerState: Player, gameManager: GameManager, tree?: WeaponUpgradeTree){
        if(this.firstUse){
            this.firstUse = false
            this.monstersSlainInitially = playerState.monstersKilled
        }

        // Compute attack speed bonus
        let monstersSlain = playerState.monstersKilled - this.monstersSlainInitially
        let bonus = Math.floor(monstersSlain/this.monsterThreshold) * this.attackSpeedBonus
        bonus = Math.min(bonus, this.bonusCap)

        // console.log(`Bonus cap: ${this.bonusCap}`)

        this.grantBonus(playerState, bonus)
    }

    private grantBonus(playerState: Player, bonus: number){
        if(bonus === this.prevBonus) return
        this.prevBonus = bonus

        // console.log(`Amplifier Artifact: Granting bonus ${bonus} attack speed percent`)

        // Remove existing bonus
        if(this.statEffectId){
            EffectManager.removeStatEffectFrom(playerState, this.statEffectId)
        }

        // Add new bonus
        let attackSpeedEffect = EffectFactory.createStatEffect({attackSpeedPercent: bonus})
        this.statEffectId = EffectManager.addStatEffectsTo(playerState, attackSpeedEffect)
    }

    public reduceMonsterThreshold(num: number){
        this.monsterThreshold -= num
        if(this.monsterThreshold <= 0) this.monsterThreshold = 1 
    }

    public increaseBonusCap(num: number){
        // console.log(`Amplifier Artifact: Increasing bonus attack speed percent cap by ${num}`)
        this.bonusCap += num
        this.bonusCap = Math.round(this.bonusCap)
        // console.log(`Amplifier Artifact: New bonus attack speed percent cap: ${this.bonusCap}`)

    }

}

