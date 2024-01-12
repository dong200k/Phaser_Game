import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree"
import Player from "../../../../schemas/gameobjs/Player"
import Stat from "../../../../schemas/gameobjs/Stat"
import GameManager from "../../../GameManager"
import { ITriggerType } from "../../../interfaces"
import EffectLogic from "../../EffectLogic"

export class DashEffectLogic extends EffectLogic{
    effectLogicId = "Dash" 
    // triggerType: ITriggerType = "player dash"

    protected attackMultiplier = 1
    /** Multiplied by the attackMultiplier to get the final multiplier. */
    protected bonusAttackMultiplier = 1

    protected area = 1
    /** Multiplied by the area to get the final multiplier. */
    protected bonusAreaMultiplier = 1

    /** Determines amount of projectiles fired */
    protected amount = 1
    protected amountCap = 3

    /** Width and height of the attack */
    protected width = 50
    protected height = 50

    /** Used by some dash effects such as poison and frost dash */
    protected duration = 0


    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Matter.Body){
    }

    public increaseBonusAttackMultiplier(num: number){
        this.bonusAttackMultiplier += num
    }
    
    public increaseBonusArea(num: number){
        this.bonusAreaMultiplier += num
    }

    public increaseAmount(num: number){
        this.amount += num
    }

    public increaseDuration(num: number){
        this.duration += num
    }

    /** Returns the final width after taking into account area */
    protected getFinalWidth(){
        return this.width * Math.sqrt(this.getFinalArea())
    }

    /** Returns the final height after taking into account area */
    protected getFinalHeight(){
        return this.height * Math.sqrt(this.getFinalArea())
    }

    private getFinalArea(){
        return this.area * this.bonusAreaMultiplier
    }

    /**
     * 
     * @returns The total attack multiplier
     */
    public getMult(){
        return this.attackMultiplier * this.bonusAttackMultiplier
    }

    /**
     * 
     * @returns The amount of projectiles fired each time taking into account player stat and amountCap
     */
    public getAmount({amount}: Stat){
        let finalAmount = amount + this.amount
        return Math.min(finalAmount, this.amountCap)
    }
}


