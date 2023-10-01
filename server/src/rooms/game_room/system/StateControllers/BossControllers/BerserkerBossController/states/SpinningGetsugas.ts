import Matter from "matter-js";
import Monster from "../../../../../schemas/gameobjs/monsters/Monster";
import { CategoryType } from "../../../../Collisions/Category";
import GameManager from "../../../../GameManager";
import StateNode from "../../../../StateMachine/StateNode";
import { IProjectileConfig } from "../../../../interfaces";
import BerserkerBossController from "../BerserkerBossController";

type SpinningGetsugaConfig = {
    // attackDuration?: number,
    timeBetweenSlashes?: number,
    slashCount?: number,
    projectileSpeed?: number,
    initialWarningTime?: number,
    /** Active time of the getsugas in milliseconds */
    projectileActiveTime?: number,
    attackMultiplier?: number,
    projectileCategory?: CategoryType,
    radius?: number
}

export default class SpinningGetsuga extends StateNode{
    protected controller!: BerserkerBossController
    protected boss!: Monster;
    protected gameManager!: GameManager;

    // private attackDuration = 10
    private timeBetweenSlashes = 1
    private slashCount = 3
    private projectileSpeed = 10
    private initialWarningTime = 1
    private projectileActiveTime = 10000
    private piercing = 1
    private attackMultiplier = 0.5
    private projectileCategory: CategoryType = "DAMAGE_ALL_PROJECTILE"
    private radius = 100

    private count = 0
    private timePassed = 0
    private timeBetweenSlashesSoFar = 0


    setConfig(config: SpinningGetsugaConfig){
        // this.attackDuration = config.attackDuration ?? this.attackDuration
        this.slashCount = config.slashCount ?? this.slashCount
        this.projectileActiveTime = config.projectileActiveTime ?? this.projectileActiveTime
        this.attackMultiplier = config.attackMultiplier ?? this.attackMultiplier
        this.timeBetweenSlashes = config.timeBetweenSlashes ?? this.timeBetweenSlashes
        this.initialWarningTime = config.initialWarningTime ?? this.initialWarningTime
        this.projectileCategory = config.projectileCategory ?? this.projectileCategory
        this.projectileSpeed = config.projectileSpeed ?? this.projectileSpeed
        this.radius = config.radius ?? this.radius
    }

    public onEnter(): void {
        this.controller = this.getStateMachine<BerserkerBossController>()
        this.boss = this.controller.getBoss()
        this.gameManager = this.controller.getGameManager()

        this.boss.animation.playAnimation("defend", {
            duration: this.initialWarningTime,
        })
        Matter.Body.setVelocity(this.boss.getBody(), {x: 0, y:0})
        this.timeBetweenSlashesSoFar = this.timeBetweenSlashes
    }

    public onExit(): void {
        this.count = 0
    }

    public update(deltaT: number): void {
        this.timePassed += deltaT
        if(this.count >= this.slashCount){
            return this.controller.changeState("Follow")
        }

        if(this.timePassed >= this.initialWarningTime){
            this.timeBetweenSlashesSoFar += deltaT
            if(this.timeBetweenSlashesSoFar >= this.timeBetweenSlashes){
                this.timeBetweenSlashesSoFar = 0
                this.count++ 
                this.fireSpinningGetsuga()
            }
        }
    }

    private fireSpinningGetsuga(){
        let bossPos = this.boss.getBody().position
        let projectileConfig: IProjectileConfig = {
            sprite: "GetsugaTenshou",
            stat: this.boss.stat,
            spawnX: bossPos.x,
            spawnY: bossPos.y,
            collisionCategory: this.projectileCategory,
            poolType: "Boss Getsuga Tenshou spinning",
            activeTime: this.projectileActiveTime,
            attackMultiplier: this.attackMultiplier,
            magicMultiplier: 0,
            originEntityId: this.boss.getId(),
            width: 75,
            height: 75,
            dontDespawnOnObstacleCollision: true,
            classType: "CircularFollowProjectile",
            // spawnSound: "sword_schwing",
            piercing: -1,
            initialVelocity: {x: 0, y: 0},
            projectileSpeed: this.projectileSpeed,
            setInactiveCallback: this.controller.getGetsugaExplosionCallback(),
            onCollideCallback: this.controller.getGetsugaExplosionCallback(),
            data: {
                radius: this.radius
            }
        }

        this.controller.spawnProjectile(projectileConfig)
    }
}