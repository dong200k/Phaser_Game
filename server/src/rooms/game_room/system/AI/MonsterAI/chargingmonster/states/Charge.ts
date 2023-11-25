
import Matter from "matter-js";
import StateNode from "../../../../StateMachine/StateNode";
import { getFinalAttackCooldown, getFinalAttackRange, getFinalSpeed } from "../../../../Formulas/formulas";
import MathUtil from "../../../../../../../util/MathUtil";
import { SpawnPoint } from "../../../../../schemas/dungeon/Dungeon";
import ChargingMonsterController from "../ChargingMonsterController";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";

/**
 * The Summon state is entered periodically. In this state the monster will charge at the player.
 */
export default class Charge extends StateNode {

    /** The time it takes for a attack to complete. */ 
    protected defaultAttackCooldown: number = 2;

    /** The percent of the attack cooldown before the attack triggers. Ex. Monster slashes. */
    protected attackTriggerPercent: number = 0.7;

    /** The attack cooldown. Goes from defaultAttackCooldown to 0. */
    protected attackCooldown: number = 2;

    /** Has the attack been triggered. */
    protected attackTriggered: boolean = false;

    private chargeSpeedBoost = 1.5
    private chargeDirection?: {x: number, y: number}

    public onEnter(): void {
        let stateMachine = this.getStateMachine<ChargingMonsterController>();
        this.defaultAttackCooldown = stateMachine.getChargeDuration()
        this.chargeSpeedBoost = stateMachine.getChargeSpeedBoost()
        this.attackTriggerPercent = stateMachine.getChargeTriggerPercent()

        // Setting the default attack cooldown for this monster.
        let monster = stateMachine.getMonster();
        this.attackCooldown = this.defaultAttackCooldown;
        this.attackTriggered = false;
        // Stop movement
        Matter.Body.setVelocity(monster.getBody(), {x: 0, y: 0});
        
        // Play charge windup animation here
        monster.animation.playAnimation("death", {
            duration: this.attackCooldown - this.attackTriggerPercent * this.attackCooldown
        })
    }

    public onExit(): void {
        
    }

    protected charge(deltaT: number) {
        let stateMachine = this.getStateMachine<ChargingMonsterController>();
        let monster = stateMachine.getMonster();
        let body = monster.getBody();

        if(this.chargeDirection){
            let speed = getFinalSpeed(monster.stat) * deltaT * this.chargeSpeedBoost;
            let velocity = MathUtil.getNormalizedSpeed(this.chargeDirection.x, this.chargeDirection.y, speed);
            if(body) Matter.Body.setVelocity(body, velocity);
        }
    }

    protected spawnChargeProjectile() {
        let stateMachine = this.getStateMachine<ChargingMonsterController>();
        let monster = stateMachine.getMonster();
        let projectileConfig: IProjectileConfig;
        projectileConfig = {
            sprite: "invisible",
            stat: monster.stat,
            spawnX: monster.x,
            spawnY: monster.y,
            width: monster.width,
            height: monster.height,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "MONSTER_PROJECTILE",
            activeTime: 1000 * (this.defaultAttackCooldown * this.attackTriggerPercent),
            poolType: "monster charge invisible",
            attackMultiplier: 1,
            magicMultiplier: 0,
            piercing: -1,
            classType: "FollowingMeleeProjectile",
            data:{
                owner: monster
            }
        }
        stateMachine.getPlayerManager().getGameManager().getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);
    }

    public update(deltaT: number): void {
        let stateMachine = this.getStateMachine<ChargingMonsterController>();
        let monster = stateMachine.getMonster();
        let attackRange = getFinalAttackRange(monster.stat, 1);
        let aggroTarget = monster.getAggroTarget();

        this.attackCooldown -= deltaT;
        if(this.attackTriggered){
            this.charge(deltaT)             
        }

        if(!this.attackTriggered) {
            if(this.attackCooldown <= this.defaultAttackCooldown * (this.attackTriggerPercent)) {
                // Trigger an attack.
                // monster.animation.playAnimation("death", false);
                stateMachine.turnOnCooldown()   
                this.attackTriggered = true;
                monster.animation.playAnimation("walk", {loop: true});
                if(aggroTarget){
                    let speed = getFinalSpeed(monster.stat) * this.chargeSpeedBoost * deltaT;
                    this.chargeDirection = {x: aggroTarget.x - monster.x, y: aggroTarget.y - monster.y}
                }
                this.spawnChargeProjectile()
            }
        }
        
        if(this.attackCooldown <= 0) {
            let aggroTarget = monster.getAggroTarget();
            this.resetAttack()
            // If the aggroTarget is null change to the Idle state.
            if(aggroTarget == null) {
                stateMachine.changeState("Idle");
            } else {
                // Switch to follow if not in range.
                stateMachine.changeState("Follow");
            }
        }
    }

    private resetAttack() {
        this.attackCooldown = this.defaultAttackCooldown;
        this.attackTriggered = false;
    }

}