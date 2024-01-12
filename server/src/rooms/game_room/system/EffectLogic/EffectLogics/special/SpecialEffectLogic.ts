import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree"
import Cooldown from "../../../../schemas/gameobjs/Cooldown"
import Player from "../../../../schemas/gameobjs/Player"
import Stat from "../../../../schemas/gameobjs/Stat"
import GameManager from "../../../GameManager"
import EffectLogic from "../../EffectLogic"

/** TODO make player area stat apply here, maybe other stats too */
export class SpecialEffectLogic extends EffectLogic{
    effectLogicId = "Special" 

    protected attackMultiplier = 1
    /** Multiplied by the attackMultiplier to get the final multiplier. */
    protected bonusAttackMultiplier = 1

    protected area = 1
    /** Multiplied by the area to get the final multiplier. */
    protected bonusAreaMultiplier = 1

    /** Determines amount of projectiles fired */
    protected amount = 1
    protected amountCap = 8

    /** Width and height of the attack */
    protected width = 50
    protected height = 50

    /** Used by some effects */
    protected duration = 0
    protected bonusDurationMultiplier = 1

    protected piercing = 1

    /** Used to track cooldown of the special or you can set the cooldown in my-app and overwrite the useEffect method. Note if cooldown is shorter than 
     * the role's ability cooldown the special will still need to wait for the role's ability cooldown
     */
    protected cooldown?: Cooldown

    public update(deltaT: number): void {
        this.cooldown?.tick(deltaT/1000)
    }

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Matter.Body){
        if(!this.cooldown) this.cooldown = new Cooldown(this.getDuration() + 1, true)
        if(this.cooldown.isFinished){
            this.cooldown.reset()
            this.useSpecial(playerState, gameManager)
        }
    }

    /** Called when the cooldown of the special is up and when useEffect is called */
    protected useSpecial(playerState: Player, gameManager: GameManager){

    }

    public increaseBonusAttackMultiplier(num: number){
        this.bonusAttackMultiplier += num
    }
    
    public increaseBonusArea(num: number){
        this.bonusAreaMultiplier += num
    }

    public increaseAmount(num: number){
        // console.log(`Amount increase by ${num}`)
        this.amount += num
        // console.log(`new amount: ${this.amount}`)
    }

    public increaseBonusDurationMult(num: number){
        this.bonusDurationMultiplier += num
    }

    public increasePiercing(num: number){
        this.piercing += num
    }

    protected getDuration(){
        return this.duration * this.bonusDurationMultiplier
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
        // console.log(`get amount final amount: ${finalAmount}, amount: ${this.amount}, playerAmount: ${amount}, returned amount: ${Math.min(finalAmount, this.amountCap)}`)
        return Math.min(finalAmount, this.amountCap)
    }

    public getPiercing(){
        return this.piercing
    }
}


