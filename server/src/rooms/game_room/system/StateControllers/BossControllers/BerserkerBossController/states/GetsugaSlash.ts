import Matter from "matter-js";
import MathUtil from "../../../../../../../util/MathUtil";
import Entity from "../../../../../schemas/gameobjs/Entity";
import Monster from "../../../../../schemas/gameobjs/monsters/Monster";
import { CategoryType } from "../../../../Collisions/Category";
import { getFinalAttackSpeed } from "../../../../Formulas/formulas";
import GameManager from "../../../../GameManager";
import StateNode from "../../../../StateMachine/StateNode";
import { IProjectileConfig } from "../../../../interfaces";
import BerserkerBossController from "../BerserkerBossController";

export interface GetsugaConfig {
    /** Total attack time. Including windup(for animations) time and trigger time, for one set of slash. */
    attackDuration?: number;

    /** A percentage of attackDuration that passes before the attack triggers. E.g. if attackDuration=1 and 
     * triggerPercent=0.7, the attack will trigger at 0.7 seconds.
     */
    triggerPercent?: number;

    /** number of slashes to perform */
    slashCount?: number;
    /** time between the slashes in seconds excluding the animation time. First slash performed when state is entered. 
     * The actual time is timeBetweenSlashes + slash time.
    */
    timeBetweenSlashes?: number;
    /** number of getsugas fired each time */
    getsugaCount?: number;
    /** How fast the slashes travel */
    projectileSpeed?: number;
    /** multiplier for the getsugas */
    attackMultiplier?: number;

    categoryType?: CategoryType;
}

export default class GetsugaSlash extends StateNode{
    protected controller!: BerserkerBossController
    protected boss!: Monster;
    protected gameManager!: GameManager;
    protected target!: Entity

    private attackDuration = 1
    private triggerPercent = 0.8
    private slashCount = 3
    private timeBetweenSlashes = 1
    private getsugaCount = 1
    private projectileSpeed = 10
    private attackMultplier = 1

    private projectileCategory: CategoryType = "DAMAGE_ALL_PROJECTILE"
    private count = 0
    private timeSoFar = 0

    private targetPos: {x: number, y:number} = {x: 0, y: 0}

    private currentlyUsingAttack = false

    setConfig(config: GetsugaConfig){
        this.attackDuration = config.attackDuration ?? this.attackDuration
        this.triggerPercent = config.triggerPercent ?? this.triggerPercent
        this.slashCount = config.slashCount ?? this.slashCount
        this.timeBetweenSlashes = config.timeBetweenSlashes ?? this.timeBetweenSlashes
        this.getsugaCount = config.getsugaCount ?? this.getsugaCount
        this.projectileSpeed = config.projectileSpeed ?? this.projectileSpeed
        this.attackMultplier = config.attackMultiplier ?? this.attackMultplier
        this.projectileCategory = config.categoryType ?? this.projectileCategory
    }

    public onEnter(): void {
        this.controller = this.getStateMachine<BerserkerBossController>()
        this.boss = this.controller.getBoss()
        this.gameManager = this.controller.getGameManager()
        this.target = this.controller.getTarget() as Entity


        let attackSpeed = getFinalAttackSpeed(this.boss.stat)
        if(attackSpeed > 0){
            this.attackDuration /= attackSpeed
            if(this.attackDuration < 0.7) this.attackDuration = 0.7
        }

        if(!this.target) this.controller.changeState("Idle")
        this.timeSoFar = this.timeBetweenSlashes + this.attackDuration

        Matter.Body.setVelocity(this.boss.getBody(), {x: 0, y: 0});
    }
    public onExit(): void {
        this.count = 0
    }

    public update(deltaT: number): void {
        if(this.count >= this.slashCount){
            this.controller.changeState("Follow")
        }

        this.timeSoFar += deltaT
        // If previous attack finished and the time between slashes has passed then start next attack's animation
        if(!this.currentlyUsingAttack && this.timeSoFar >= this.timeBetweenSlashes + this.attackDuration){
            this.currentlyUsingAttack = true
            this.startAnimation()
            this.targetPos = this.target.getBody().position
            this.timeSoFar = 0
        }

        // If currently using an attack and the attack has not been triggered and the trigger time has passed then fire the attacks
        if(this.currentlyUsingAttack && this.timeSoFar >= this.triggerPercent * this.attackDuration){
            this.fireGetsugas()
            this.currentlyUsingAttack = false
        }
    }

    startAnimation(){
        this.boss.animation.playAnimation("Sp_atk_2",{
            duration: this.attackDuration,
            flip: this.boss.getBody().position.x > this.target.getBody().position.x
        })
    }

    fireGetsugas(){
        this.count++
        let maximumProjectileCount = this.getsugaCount
        let rotationIncrement = 30
        let evenStartDeg = rotationIncrement * 0.5 + rotationIncrement * (maximumProjectileCount/2 - 1)
        let oddStartDeg = rotationIncrement * Math.floor(maximumProjectileCount/2)
        let rotationDeg = maximumProjectileCount %2 === 0? evenStartDeg : oddStartDeg

        let targetPos = this.targetPos
        let bossPos = this.boss.getBody().position
        let velX = targetPos.x - this.boss.x
        let velY = targetPos.y - this.boss.y

        let projectileConfig: IProjectileConfig = {
            sprite: "GetsugaTenshou",
            stat: this.boss.stat,
            spawnX: bossPos.x,
            spawnY: bossPos.y,
            collisionCategory: this.projectileCategory,
            poolType: "Boss Getsuga Tenshou",
            activeTime: 2000,
            attackMultiplier: this.attackMultplier,
            magicMultiplier: 0,
            originEntityId: this.boss.getId(),
            width: 75,
            height: 75,
            dontDespawnOnObstacleCollision: true,
            classType: "MeleeProjectile",
            setInactiveCallback: this.controller.getGetsugaExplosionCallback(),
            onCollideCallback: this.controller.getGetsugaExplosionCallback(),
            spawnSound: "magic_slash",
            initialVelocity: {x: 0, y: 0}
        }

        // Spawns 1 or multiple projectiles
        for(let i=0;i<maximumProjectileCount;i++){
            this.controller.spawnProjectile({
                ...projectileConfig,
                initialVelocity: MathUtil.getRotatedSpeed(velX, velY, 10, rotationDeg)
            })
            rotationDeg -= rotationIncrement
        }
    }
}