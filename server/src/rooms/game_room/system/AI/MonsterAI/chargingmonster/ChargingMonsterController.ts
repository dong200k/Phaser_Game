import Cooldown from "../../../../schemas/gameobjs/Cooldown";
import Monster from "../../../../schemas/gameobjs/monsters/Monster";
import MonsterController from "../simplemonster/MonsterController";
import Attack from "./states/Attack";
import Charge from "./states/Charge";
import Follow from "./states/Follow";

export interface ChargingMonsterControllerData {
    monster: Monster;
     /** The time in seconds it takes for a charge attack to complete. */ 
    chargeDuration: number;
     /** The percent of the attack cooldown before the charging starts. */
    chargeTriggerPercent: number;
    /** Speed multiplier while monster is charging. Ex: 2 means double the normal movement speed while charging. */
    chargeSpeedBoost: number;
    /** Cooldown in seconds before monster can charge again. */
    chargeCooldown: number;
}

export default class ChargingMonsterController extends MonsterController {

    private chargeCooldown!: Cooldown
    private chargeDuration: number = 2
    private chargeTriggerPercent = 0.7
    private chargeSpeedBoost = 2

    protected create(data: ChargingMonsterControllerData): void {
        super.create(data)

        this.chargeCooldown = new Cooldown(data.chargeCooldown ?? 5)
        this.chargeTriggerPercent = data.chargeTriggerPercent
        this.chargeSpeedBoost = data.chargeSpeedBoost
        this.chargeDuration = data.chargeDuration

        this.removeState("Attack")
        this.addState(new Attack("Attack", this))

        this.addState(new Charge("Charge", this))

        this.removeState("Follow")
        this.addState(new Follow("Follow", this))

        //Set initial state
        this.changeState("Idle");
    }

    public update(deltaT: number): void {
        super.update(deltaT)

        this.chargeCooldown.tick(deltaT)
    }

    public isChargeReady(){
        return this.chargeCooldown.isFinished
    }

    public turnOnCooldown(){
        this.chargeCooldown.reset()
    }

    public getChargeDuration(){
        return this.chargeDuration
    }

    public getChargeTriggerPercent(){
        return this.chargeTriggerPercent
    }

    public getChargeSpeedBoost(){
        return this.chargeSpeedBoost
    }

}