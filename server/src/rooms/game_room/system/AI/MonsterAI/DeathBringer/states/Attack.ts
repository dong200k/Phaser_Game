import Matter from "matter-js";
import StateNode from "../../../../StateMachine/StateNode";
import { getFinalAttackCooldown, getFinalAttackRange } from "../../../../Formulas/formulas";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import MathUtil from "../../../../../../../util/MathUtil";
import Entity from "../../../../../schemas/gameobjs/Entity";
import GameManager from "../../../../GameManager";
import DeathBringerController from "../DeathBringerController";

/**
 * The Attack state is entered when the monster is in attackRange of its aggroTarget.
 * The monster will then perform its attack on its aggroTarget.
 */
export default class Attack extends StateNode {

    /** The time it takes for a attack to complete. */ 
    protected defaultAttackCooldown: number = 1;

    /** The percent of the attack cooldown before the attack triggers. Ex. Monster slashes. */
    protected attackTriggerPercent: number = 0.95;

    /** The attack cooldown. Goes from defaultAttackCooldown to 0. */
    protected attackCooldown: number = 1;

    /** Has the attack been triggered. */
    protected attackTriggered: boolean = false;

    protected projectileSpeed =  8

    public onEnter(): void {
        // Setting the default attack cooldown for this monster.
        let stateMachine = this.getStateMachine<DeathBringerController>();
        let monster = stateMachine.getMonster();
        this.defaultAttackCooldown = getFinalAttackCooldown(monster.stat);
        this.attackCooldown = this.defaultAttackCooldown;
        this.attackTriggered = false;
        // Stop movement
        Matter.Body.setVelocity(monster.getBody(), {x: 0, y: 0});
        monster.animation.playAnimation("attack")
    }

    public onExit(): void {
        
    }

    protected attack() {
        let stateMachine = this.getStateMachine<DeathBringerController>();
        let monster = stateMachine.getMonster();
        let target = monster.getAggroTarget();

        if(target) {
            let velocity = MathUtil.getNormalizedSpeed(target.x - monster.x, target.y - monster.y, 0.01)
            Matter.Body.setVelocity(monster.getBody(), velocity)
            let offSetX = 50 * velocity.x > 0? 1: -1
            let projectileConfig: IProjectileConfig;
            projectileConfig = {
                sprite: "Invisible",
                stat: monster.stat,
                spawnX: monster.x + offSetX,
                spawnY: monster.y,
                width: 50,
                height: 50,
                initialVelocity: {x: 0, y: 0},
                collisionCategory: "MONSTER_PROJECTILE",
                activeTime: 1000,
                poolType: "deathbringer_slash",
                attackMultiplier: 1,
                magicMultiplier: 0,
                classType: "MeleeProjectile",
            }
            stateMachine.getGameManager().getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig)
        }
    }

    public update(deltaT: number): void {
        let stateMachine = this.getStateMachine<DeathBringerController>();

        this.attackCooldown -= deltaT;

        if(!this.attackTriggered) {
            if(this.attackCooldown <= this.defaultAttackCooldown * (this.attackTriggerPercent)) {
                // Trigger an attack.
                // monster.animation.playAnimation("death", false);
                this.attack()                
                this.attackTriggered = true;
            }
        }
        
        if(this.attackCooldown <= 0) {
            stateMachine.changeState("Idle");
        }
    }

    private resetAttack() {
        this.attackCooldown = this.defaultAttackCooldown;
        this.attackTriggered = false;
    }

}