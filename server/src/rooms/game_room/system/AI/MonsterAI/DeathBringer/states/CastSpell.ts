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
export default class CastSpell extends StateNode {

    /** The time it takes for a attack to complete. */ 
    protected defaultAttackCooldown: number = 1;

    /** The percent of the attack cooldown before the attack triggers. Ex. Monster slashes. */
    protected attackTriggerPercent: number = 0.95;

    /** The attack cooldown. Goes from defaultAttackCooldown to 0. */
    protected attackCooldown: number = 1;

    /** Has the attack been triggered. */
    protected attackTriggered: boolean = false;

    protected projectileSpeed =  8
    protected projectileWidth = 50
    protected projectileHeight = 50

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
        let horizontalCount = 10
        let verticalCount = 10

        if(target) {
            let endX = Math.floor(horizontalCount/2)
            let startX = -endX
            let endY = Math.floor(verticalCount/2)
            let startY = -endY
            for(let x=startX;x<endX;x++){
                for(let y=startY;y<endY;y++){
                    let spawnX = x * this.projectileWidth + target.x
                    let spawnY = y * this.projectileHeight + target.y
                    this.fireProjectile(monster, target.gameManager, spawnX, spawnY)
                }
            }
        }
    }

    protected fireProjectile(entity: Entity, gameManager: GameManager, spawnX: number, spawnY: number){
        let projectileConfig: IProjectileConfig;
        projectileConfig = {
            sprite: "TinyZombieAttack",
            stat: entity.stat,
            spawnX,
            spawnY,
            width: this.projectileWidth,
            height: this.projectileHeight,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "MONSTER_PROJECTILE",
            activeTime: 1000,
            poolType: "nercromancer_projectile",
            attackMultiplier: 1,
            magicMultiplier: 0,
            classType: "MeleeProjectile",
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