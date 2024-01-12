import Matter from "matter-js";
import StateNode from "../../../../StateMachine/StateNode";
import { getFinalAttackCooldown, getFinalAttackRange } from "../../../../Formulas/formulas";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import MathUtil from "../../../../../../../util/MathUtil";
import Entity from "../../../../../schemas/gameobjs/Entity";
import GameManager from "../../../../GameManager";
import DragonController from "../DragonController";

/**
 * The Attack state is entered when the monster is in attackRange of its aggroTarget.
 * The monster will then perform its attack on its aggroTarget.
 */
export default class FireBreath extends StateNode {

    /** The time it takes for a attack to complete. */ 
    protected defaultAttackCooldown: number = 5;

    /** The percent of the attack cooldown before the attack triggers. Ex. Monster slashes. */
    protected attackTriggerPercent: number = 0.95;

    /** The attack cooldown. Goes from defaultAttackCooldown to 0. */
    protected attackCooldown: number = 1;

    /** Has the attack been triggered. */
    protected attackTriggered: boolean = false;

    protected projectileSpeed =  10
    protected projectileCount = 100

    public onEnter(): void {
        // Setting the default attack cooldown for this monster.
        let stateMachine = this.getStateMachine<DragonController>();
        let monster = stateMachine.getMonster();
        // this.defaultAttackCooldown = getFinalAttackCooldown(monster.stat);
        this.attackCooldown = this.defaultAttackCooldown;
        this.attackTriggered = false;
        // Stop movement
        Matter.Body.setVelocity(monster.getBody(), {x: 0, y: 0});
        monster.animation.playAnimation("attack_3")
        monster.sound.playSoundEffect("dragon_roar")
    }

    public onExit(): void {
        
    }

    protected attack() {
        let stateMachine = this.getStateMachine<DragonController>();
        let monster = stateMachine.getMonster();
        // let target = monster.getAggroTarget();

        let projectileConfig: IProjectileConfig;
        projectileConfig = {
            sprite: "Fireball",
            stat: monster.stat,
            spawnX: monster.x,
            spawnY: monster.y,
            width: 16,
            height: 16,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "MONSTER_PROJECTILE",
            // range: 1000,
            activeTime: 2000,
            poolType: "firebreath_projectile",
            attackMultiplier: 1,
            magicMultiplier: 0,
            classType: "Projectile",
            spawnSound: "fireball_whoosh"
        }
        let target = monster.getAggroTarget()
        if(target)
            this.fireProjectile(monster, target, monster.gameManager, projectileConfig, this.projectileCount)
    }

    protected fireProjectile(entity: Entity, target: Entity, gameManager: GameManager, projectileConfig: IProjectileConfig, projectileCount: number){
        let maximumProjectileCount = Math.min(100, projectileCount)
        let rotationIncrement = 90/maximumProjectileCount
        let evenStartDeg = rotationIncrement * 0.5 + rotationIncrement * (maximumProjectileCount/2 - 1)
        let oddStartDeg = rotationIncrement * Math.floor(maximumProjectileCount/2)
        let rotationDeg = maximumProjectileCount %2 === 0? evenStartDeg : oddStartDeg
        let velX = target.x - entity.x
        let velY = target.y - entity.y

        // Spawns 1 or multiple projectiles
        for(let i=0;i<maximumProjectileCount;i++){
            setTimeout(()=>{
                // console.log(rotationDeg) 
                rotationDeg = (Math.random() * 90) * (Math.random()<0.5? 1 : -1)
                gameManager.getProjectileManager().spawnProjectile({
                    ...projectileConfig,
                    initialVelocity: MathUtil.getRotatedSpeed(velX, velY, this.projectileSpeed * Math.random() + 3, rotationDeg)
                })

                // rotationDeg -= rotationIncrement
            }, 1000 * this.attackCooldown/this.projectileCount * i)
        }
    }

    public update(deltaT: number): void {
        let stateMachine = this.getStateMachine<DragonController>();

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