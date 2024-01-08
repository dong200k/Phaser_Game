import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import Cooldown from "../../../../../schemas/gameobjs/Cooldown";
import Entity from "../../../../../schemas/gameobjs/Entity";
import GameManager from "../../../../GameManager";
import EffectLogic from "../../../EffectLogic";

export default class GemFlip extends EffectLogic{
    effectLogicId: string = "GemFlip"
    private cooldown = new Cooldown(10)
    private firstTime = true
    private entity?: Entity
    private expRateChange = 0
    private expRateMultiplier = 10
    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        if(this.firstTime){
            this.firstTime = false
            this.entity = entity
        }
    }

    public update(deltaT: number): void {
        this.cooldown.tick(deltaT)
        if(this.cooldown.isFinished && this.entity){
            this.cooldown.reset()
            let result = Math.random()<0.5
            // undo the exp change
            this.entity.stat.expRate -= this.expRateChange

            let expMult: number
            if(result){
                expMult = 10
            }else{
                expMult = 0.1
            }

            let newExpRate = this.entity.stat.expRate * expMult
            this.expRateChange = newExpRate - this.entity.stat.expRate
            this.entity.stat.expRate = newExpRate
        }
    }
}