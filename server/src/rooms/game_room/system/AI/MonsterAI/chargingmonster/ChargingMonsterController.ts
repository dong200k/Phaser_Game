import Cooldown from "../../../../schemas/gameobjs/Cooldown";
import { ChestRarity } from "../../../../schemas/gameobjs/chest/Chest";
import Monster from "../../../../schemas/gameobjs/monsters/Monster";
import MonsterController from "../simplemonster/MonsterController";
import Attack from "./states/Attack";
import Charge from "./states/Charge";
import Follow from "./states/Follow";

export interface ChargingMonsterControllerData {
    monster: Monster;
     /** The time in seconds it takes for a charge attack to complete. */ 
    chargeDuration?: number;
     /** The percent of the attack cooldown before the charging starts. */
    chargeTriggerPercent?: number;
    /** Speed multiplier while monster is charging. Ex: 2 means double the normal movement speed while charging. */
    chargeSpeedBoost?: number;
    /** Cooldown in seconds before monster can charge again. */
    chargeCooldown?: number;
    /** animation key for animation played when monster is charging*/
    chargeKey?: string;
    /** animation key for animation played when monster is getting ready to charge*/
    chargeWindupKey?: string;
    /** Ranged when monster starts charging */
    chargeRange?: number;
    /** animation key for the animation played when monster attacks */
    attackKey?: string;
    /** Describes the hit box and offset of the attack performed */
    monsterProjectileHitbox?: IMonsterProjectileHitbox
}

/** Describes the hit box and offset of the attack performed */
export interface IMonsterProjectileHitbox {
    /** Width of the attack hitbox*/
    width: number,
    /** height of the attack hitbox */
    height: number,
    /** offset horizontally of the attack hitbox from the monster. Positive means it will be shifted towards the aggro target. */
    offsetX: number,
    /** offset vertically of the attack hitbox from the monster. Positive means it will be shifted towards the aggro target. */
    offsetY: number,
}

export default class ChargingMonsterController extends MonsterController {

    private chargeCooldown!: Cooldown
    private chargeDuration: number = 2
    private chargeTriggerPercent = 0.8
    private chargeSpeedBoost = 2
    /** animation key for animation played when monster is charging*/
    private chargeKey = "charge"
    /** animation key for animation played when monster is getting ready to charge*/
    private chargeWindupKey = "charge_warning"
    private chargeRange = 200
    /** animation key for the animation played when monster attacks */
    private attackKey = "attack"
    /** Describes the hit box and offset of the attack performed */
    private monsterProjectileHitbox: IMonsterProjectileHitbox = {
        width: 50,
        height: 50,
        offsetX: 0,
        offsetY: 0
    }

    protected deathChestRarity?: ChestRarity | undefined = "iron"

    constructor(data: ChargingMonsterControllerData){
        super(data)
    }

    protected create(data: ChargingMonsterControllerData): void {
        super.create(data)

        this.chargeCooldown = new Cooldown(data.chargeCooldown ?? 7)
        this.chargeTriggerPercent = data.chargeTriggerPercent ?? this.chargeTriggerPercent
        this.chargeSpeedBoost = data.chargeSpeedBoost ?? this.chargeSpeedBoost
        this.chargeDuration = data.chargeDuration ?? this.chargeDuration
        this.chargeKey = data.chargeKey ?? this.chargeKey
        this.chargeWindupKey = data.chargeWindupKey ?? this.chargeWindupKey
        this.chargeRange = data.chargeRange ?? this.chargeRange
        this.attackKey = data.attackKey ?? this.attackKey
        this.monsterProjectileHitbox = data.monsterProjectileHitbox ?? this.monsterProjectileHitbox

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

    public getChargeKey(){
        return this.chargeKey
    }

    public getChargeWindupKey(){
        return this.chargeWindupKey
    }

    public getChargeRange(){
        return this.chargeRange
    }

    public getAttackKey(){
        return this.attackKey
    }

    public getMonsterProjectileHitbox(){
        return this.monsterProjectileHitbox
    }
}