import Matter from "matter-js";
import WerewolfController from "../WerewolfController";
import StateNode from "../../../../StateMachine/StateNode";
import { getFinalAttackCooldown, getFinalAttackRange } from "../../../../Formulas/formulas";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import MathUtil from "../../../../../../../util/MathUtil";

/**
 * The Attack state is entered when the monster is in attackRange of its aggroTarget.
 * The monster will then perform its attack on its aggroTarget.
 */
export default class Attack extends StateNode {

    /** The time it takes for a attack to complete. */ 
    protected defaultAttackCooldown: number = 1;

    /** The percent of the attack cooldown before the attack triggers. Ex. Monster slashes. */
    protected attackTriggerPercent: number = 0.5;

    /** The attack cooldown. Goes from defaultAttackCooldown to 0. */
    protected attackCooldown: number = 1;

    /** Has the attack been triggered. */
    protected attackTriggered: boolean = false;

    public onEnter(): void {
        // Setting the default attack cooldown for this monster.
        let stateMachine = this.getStateMachine<WerewolfController>();
        let monster = stateMachine.getMonster();
        this.defaultAttackCooldown = getFinalAttackCooldown(monster.stat);
        this.attackCooldown = this.defaultAttackCooldown;
        this.attackTriggered = false;
        // Stop movement
        Matter.Body.setVelocity(monster.getBody(), {x: 0, y: 0});
        monster.animation.playAnimation(this.getAnimation(), {
            duration: this.attackCooldown
        })
    }

    public onExit(): void {
        
    }

    protected attack() {
        let stateMachine = this.getStateMachine<WerewolfController>();
        let monster = stateMachine.getMonster();
        let target = monster.getAggroTarget();

        if(target) {
            let projectileConfig: IProjectileConfig;
            projectileConfig = {
                sprite: "TinyZombieAttack",
                stat: monster.stat,
                spawnX: monster.x,
                spawnY: monster.y,
                width: 16,
                height: 16,
                initialVelocity: MathUtil.getNormalizedSpeed(target.x - monster.x, target.y - monster.y, .1),
                collisionCategory: "MONSTER_PROJECTILE",
                range: 100,
                activeTime: 500,
                poolType: "monster_projectile",
                attackMultiplier: 1,
                magicMultiplier: 0,
                classType: "MeleeProjectile",
            }
            // console.log(`spawning monster projectile at: (${projectileConfig.spawnX}, ${projectileConfig.spawnY})`);
            stateMachine.getPlayerManager().getGameManager().getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);
        }
    }

    public update(deltaT: number): void {
        let stateMachine = this.getStateMachine<WerewolfController>();
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
    private getAnimation() {
        let stateMachine = (this.getStateMachine() as WerewolfController);
        if(!stateMachine.isEnraged()) return "attack"
        return "attack_rage"
    }

}