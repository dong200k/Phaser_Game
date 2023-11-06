import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import { StatConfig } from "../../../../../schemas/effects/temp/StatEffect";
import Player from "../../../../../schemas/gameobjs/Player";
import Stat from "../../../../../schemas/gameobjs/Stat";
import GameManager from "../../../../GameManager";
import EffectManager from "../../../../StateManagers/EffectManager";
import { ITriggerType } from "../../../../interfaces";
import EffectLogic from "../../../EffectLogic";

/** 
 * This artifact will give player a random stat buff. Buff is increased if there are other players alive.
*/
export class PowerOfFriendship extends EffectLogic{
    effectLogicId = "POF" 
    triggerType: ITriggerType = "none"

    /** Base bonus given */
    private baseBonus = 0.1
    /** Extra bonus per every other player alive */
    private bonusPerPlayer = 0.05

    private statEffectId?: string

    public useEffect(playerState: Player, gameManager: GameManager, tree?: WeaponUpgradeTree){
        console.log(`pof artifact game manager undefined is ${gameManager === undefined}`)
        let playerCount = -1
        gameManager.gameObjects.forEach(gameObj=>{
            if(gameObj instanceof Player && gameObj.playerController.stateName !== "Dead"){
                playerCount += 1
            }
        })
        if(playerCount < 0) playerCount = 0
        let bonus = this.baseBonus + playerCount * this.bonusPerPlayer 
        this.grantBonus(playerState, bonus)
    }

    private grantBonus(playerState: Player, bonusRatio: number){
        // Pick random stat
        let statObj = Stat.defaultStatObject
        let statList: Array<keyof StatConfig> = []
        Object.entries(statObj).forEach(([key, val]) => {
            statList.push(key as keyof StatConfig)
        });
        let choice = Math.floor(Math.random() * statList.length)
        let attribute = statList[choice]

        // Remove existing bonus
        if(this.statEffectId){
            EffectManager.removeStatEffectFrom(playerState, this.statEffectId)
        }

        // calculate bonus
        let bonus = playerState.stat[attribute as keyof Stat] as number * bonusRatio

        // Add bonus
        let obj: any = {}
        obj[attribute] = bonus
        let statEffect = EffectFactory.createStatEffect(obj)
        this.statEffectId = EffectManager.addStatEffectsTo(playerState, statEffect)

        console.log(`Power of Friendship Artifact: Granting bonus ${bonus} ${attribute}`)
    }

    public increaseBaseBonus(num: number){
        this.baseBonus += num
    }

    public increasePlayerBonus(num: number){
        this.bonusPerPlayer += num
    }
}

