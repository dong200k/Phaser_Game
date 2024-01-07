import Matter from "matter-js";
import StateNode from "../../../../StateMachine/StateNode";
import DragonController from "../DragonController";
import { getFinalAttackCooldown, getFinalAttackRange } from "../../../../Formulas/formulas";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import MathUtil from "../../../../../../../util/MathUtil";

/**
 * The Attack state is entered when the monster is in attackRange of its aggroTarget.
 * The monster will then perform its attack on its aggroTarget.
 */
export default class MeleeAttack extends StateNode {

    /** The time it takes for a attack to complete. */ 
    protected defaultAttackCooldown: number = 1;

    /** The percent of the attack cooldown before the attack triggers. Ex. Monster slashes. */
    protected attackTriggerPercent: number = 0.7;

    /** The attack cooldown. Goes from defaultAttackCooldown to 0. */
    protected attackCooldown: number = 1;

    /** Has the attack been triggered. */
    protected attackTriggered: boolean = false;

    public onEnter(): void {
        // Setting the default attack cooldown for this monster.
        let stateMachine = this.getStateMachine<DragonController>();
        let monster = stateMachine.getMonster();
        this.defaultAttackCooldown = getFinalAttackCooldown(monster.stat);
        this.attackCooldown = this.defaultAttackCooldown;
        this.attackTriggered = false;
        // Stop movement
        Matter.Body.setVelocity(monster.getBody(), {x: 0, y: 0});
        monster.animation.playAnimation("attack_2", {
            loop: true
        })
        monster.sound.playSoundEffect("dragon_roar2")
    }

    public onExit(): void {
        
    }

    protected attack() {
        let stateMachine = this.getStateMachine<DragonController>();
        let monster = stateMachine.getMonster();
        let target = monster.getAggroTarget();

        if(target) {
            let offsetX = 60 * (target.x - monster.x > 0? 1 : -1)
            let offsetY = 60 * (target.y - monster.y > 0? 1 : -1)

            let projectileConfig: IProjectileConfig;
            projectileConfig = {
                sprite: "largecircle",
                stat: monster.stat,
                spawnX: monster.x + offsetX,
                spawnY: monster.y + offsetY,
                width: 120,
                height: 120,
                initialVelocity: MathUtil.getNormalizedSpeed(target.x - monster.x, target.y - monster.y, .1),
                collisionCategory: "MONSTER_PROJECTILE",
                activeTime: 1000,
                poolType: "demon_slimemonster_projectile",
                attackMultiplier: 1,
                magicMultiplier: 0,
                classType: "MeleeProjectile",
                data: {
                    attackDuration: 1,
                    triggerPercent: 0.2,
                    unTriggerPercent: 0
                }
            }
            // console.log(`spawning monster projectile at: (${projectileConfig.spawnX}, ${projectileConfig.spawnY})`);
            stateMachine.getPlayerManager().getGameManager().getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);
        }
    }

    public update(deltaT: number): void {
        let stateMachine = this.getStateMachine<DragonController>();
        let monster = stateMachine.getMonster();
        let attackRange = getFinalAttackRange(monster.stat, 1);

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
            let aggroTarget = monster.getAggroTarget();

            // If the aggroTarget is null change to the Idle state.
            if(aggroTarget == null) {
                stateMachine.changeState("Idle");
            } else {
                // Checks if this monster is still in range of the aggro target.
                if(MathUtil.distance(monster.x, monster.y, aggroTarget.x, aggroTarget.y) <= attackRange) {
                    this.resetAttack();
                } else {
                    // Switch to follow if not in range.
                    stateMachine.changeState("Follow");
                }
            }
        }
    }

    private resetAttack() {
        this.attackCooldown = this.defaultAttackCooldown;
        this.attackTriggered = false;
    }

}