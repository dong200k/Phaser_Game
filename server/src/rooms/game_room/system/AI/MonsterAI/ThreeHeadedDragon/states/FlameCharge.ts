
import Matter from "matter-js";
import StateNode from "../../../../StateMachine/StateNode";
import { getFinalAttackCooldown, getFinalAttackRange, getFinalSpeed } from "../../../../Formulas/formulas";
import MathUtil from "../../../../../../../util/MathUtil";
import { SpawnPoint } from "../../../../../schemas/dungeon/Dungeon";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import DragonController from "../DragonController";
import GameManager from "../../../../GameManager";
import Entity from "../../../../../schemas/gameobjs/Entity";

/**
 * The Summon state is entered periodically. In this state the monster will charge at the player.
 */
export default class FlameCharge extends StateNode {

    /** The time it takes for a attack to complete. */ 
    protected defaultAttackCooldown: number = 3;

    /** The percent of the attack cooldown before the attack triggers. Ex. Monster slashes. */
    protected attackTriggerPercent: number = 0.7;

    /** The attack cooldown. Goes from defaultAttackCooldown to 0. */
    protected attackCooldown: number = 3;

    /** Has the attack been triggered. */
    protected attackTriggered: boolean = false;

    private chargeSpeedBoost = 3
    private chargeDirection?: {x: number, y: number}
    private timeSoFar = 0
    private attackTime = 0.5
    private projectileSpeed = 6

    public onEnter(): void {
        let stateMachine = this.getStateMachine<DragonController>();

        // Setting the default attack cooldown for this monster.
        let monster = stateMachine.getMonster();
        this.attackCooldown = this.defaultAttackCooldown;
        this.attackTriggered = false;
        // Stop movement
        Matter.Body.setVelocity(monster.getBody(), {x: 0, y: 0});
        
        // Play charge windup animation here
        monster.animation.playAnimation("walk", {
            loop: true
        })
        monster.sound.playSoundEffect("dragon_roar")
    }

    public onExit(): void {
        
    }

    protected charge(deltaT: number) {
        let stateMachine = this.getStateMachine<DragonController>();
        let monster = stateMachine.getMonster();
        let body = monster.getBody();

        if(this.chargeDirection){
            let speed = getFinalSpeed(monster.stat) * deltaT * this.chargeSpeedBoost;
            let velocity = MathUtil.getNormalizedSpeed(this.chargeDirection.x, this.chargeDirection.y, speed);
            if(body) Matter.Body.setVelocity(body, velocity);
        }
    }

    public update(deltaT: number): void {
        let stateMachine = this.getStateMachine<DragonController>();
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
                this.attackTriggered = true;
                monster.animation.playAnimation("walk", {loop: true});
                if(aggroTarget){
                    let speed = getFinalSpeed(monster.stat) * this.chargeSpeedBoost * deltaT;
                    this.chargeDirection = {x: aggroTarget.x - monster.x, y: aggroTarget.y - monster.y}
                }
                
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

        if(this.attackTriggered){
            this.timeSoFar += deltaT
            if(this.attackTime <= this.timeSoFar) {
                this.timeSoFar = 0
                this.attack()
            }
        }
    }

    private resetAttack() {
        this.attackCooldown = this.defaultAttackCooldown;
        this.attackTriggered = false;
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
            activeTime: 4000,
            poolType: "nercromancer_projectile",
            attackMultiplier: 1,
            magicMultiplier: 0,
            spawnSound: "fireball_whoosh",
            classType: "Projectile",
        }
        this.fireProjectile(monster, monster.gameManager, projectileConfig, 10)
        
    }

    protected fireProjectile(entity: Entity, gameManager: GameManager, projectileConfig: IProjectileConfig, projectileCount: number){
        let maximumProjectileCount = Math.min(60, projectileCount)
        let rotationIncrement = 360/maximumProjectileCount
        let evenStartDeg = rotationIncrement * 0.5 + rotationIncrement * (maximumProjectileCount/2 - 1)
        let oddStartDeg = rotationIncrement * Math.floor(maximumProjectileCount/2)
        let rotationDeg = maximumProjectileCount %2 === 0? evenStartDeg : oddStartDeg
        let velX = 1
        let velY = 1

        // Spawns 1 or multiple projectiles
        for(let i=0;i<maximumProjectileCount;i++){
            // console.log(rotationDeg) 
            gameManager.getProjectileManager().spawnProjectile({
                ...projectileConfig,
                initialVelocity: MathUtil.getRotatedSpeed(velX, velY, this.projectileSpeed, rotationDeg)
            })
            
            rotationDeg -= rotationIncrement
        }
    }
}