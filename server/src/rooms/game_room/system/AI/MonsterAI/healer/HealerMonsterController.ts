import Cooldown from "../../../../schemas/gameobjs/Cooldown";
import Monster from "../../../../schemas/gameobjs/monsters/Monster";
import { getFinalAttackCooldown, getFinalAttackRange } from "../../../Formulas/formulas";
import RangedMonsterController from "../rangemonster/RangedMonsterController";
import MonsterController from "../simplemonster/MonsterController";
import Heal from "./states/Heal";
import HealerIdle from "./states/HealerIdle";

export interface HealerMonsterControllerData {
    monster: Monster;
    healAmount?: number;
    /** Cooldown of the heal in seconds */
    healCooldown?: number;
    /** Max distance from other monster to the healer where they can still be healed. */
    healRange?: number;
}

/**
 * This controller controls the healer monster. This monster will occasionally enter the heal state to heal nearby monsters. 
 */
export default class HealerMonsterController extends MonsterController {

    private healAmount = 50
    /** Cooldown of the heal in seconds */
    private healCooldown!: Cooldown
    /** Max distance from other monster to the healer where they can still be healed. */
    private healRange = 100
    private timeSoFar = 0

    protected create(data: HealerMonsterControllerData): void {
        super.create(data)

        this.healRange = data.healRange ?? getFinalAttackRange(this.monster.stat, 1)
        console.log('heal cooldown',getFinalAttackCooldown(this.monster.stat))
        this.healCooldown = new Cooldown(data.healCooldown ?? getFinalAttackCooldown(this.monster.stat))

        this.removeState("Attack")
        this.addState(new Heal("Attack", this))

        this.removeState("Idle")
        this.addState(new HealerIdle("Idle", this))

        //Set initial state
        this.changeState("Idle");
    }

    public update(deltaT: number): void {
        super.update(deltaT)

        this.healCooldown.tick(deltaT)
        if(this.isHealReady()){
            this.resetHealCooldown()
            this.changeState("Heal")
        }
    }

    public getHealAmount(){
        return this.healAmount
    }

    public isHealReady(){
        return this.healCooldown.isFinished
    }

    /** Renews the cooldown of heal so there is a wait time before it can be used again. */
    public resetHealCooldown(){
        this.healCooldown.reset()
    }

    public getHealRange(){
        return this.healRange
    }
}