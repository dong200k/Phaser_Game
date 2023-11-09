import Monster from "../../../../../schemas/gameobjs/monsters/Monster";
import { CategoryType } from "../../../../Collisions/Category";
import GameManager from "../../../../GameManager";
import StateNode from "../../../../StateMachine/StateNode";
import { IProjectileConfig } from "../../../../interfaces";
import BerserkerBossController from "../BerserkerBossController";

type FollowingGetsugaConfig = {
    // attackDuration?: number,
    timeBetweenSlashes?: number,
    slashCount?: number,
    getsugaCount?: number,
    minProjectileSpeed?: number,
    maxProjectileSpeed?: number,
    initialWarningTime?: number,
    /** Active time of the getsugas in milliseconds */
    projectileActiveTime?: number,
    piercing?: number,
    attackMultiplier?: number,
    projectileCategory?: CategoryType
}

export default class FollowingGetsuga extends StateNode{
    protected controller!: BerserkerBossController
    protected boss!: Monster;
    protected gameManager!: GameManager;

    // private attackDuration = 10
    private timeBetweenSlashes = 1
    private slashCount = 3
    private getsugaCount = 2
    private minProjectileSpeed = 3
    private maxProjectileSpeed = 5
    private initialWarningTime = 1
    private projectileActiveTime = 5000
    private piercing = 1
    private attackMultiplier = 1
    private projectileCategory: CategoryType = "MONSTER_PROJECTILE"

    private count = 0
    private timePassed = 0
    private timeBetweenSlashesSoFar = 0


    setConfig(config: FollowingGetsugaConfig){
        // this.attackDuration = config.attackDuration ?? this.attackDuration
        this.slashCount = config.slashCount ?? this.slashCount
        this.getsugaCount = config.getsugaCount ?? this.getsugaCount
        this.minProjectileSpeed = config.minProjectileSpeed ?? this.minProjectileSpeed
        this.maxProjectileSpeed = config.maxProjectileSpeed ?? this.maxProjectileSpeed
        this.projectileActiveTime = config.projectileActiveTime ?? this.projectileActiveTime
        this.piercing = config.piercing ?? this.piercing
        this.attackMultiplier = config.attackMultiplier ?? this.attackMultiplier
        this.timeBetweenSlashes = config.timeBetweenSlashes ?? this.timeBetweenSlashes
        this.initialWarningTime = config.initialWarningTime ?? this.initialWarningTime
        this.projectileCategory = config.projectileCategory ?? this.projectileCategory
    }

    public onEnter(): void {
        this.controller = this.getStateMachine<BerserkerBossController>()
        this.boss = this.controller.getBoss()
        this.gameManager = this.controller.getGameManager()

        this.boss.animation.playAnimation("Point_sky", {
            duration: 1
        })

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
                for(let i=0;i<this.getsugaCount;i++)
                    this.fireHomingGetsuga()
            }
        }
    }

    private fireHomingGetsuga(){
        let bossPos = this.boss.getBody().position
        let projectileConfig: IProjectileConfig = {
            sprite: "GetsugaTenshou",
            stat: this.boss.stat,
            spawnX: bossPos.x,
            spawnY: bossPos.y,
            collisionCategory: this.projectileCategory,
            poolType: "Boss Getsuga Tenshou homing",
            activeTime: this.projectileActiveTime,
            attackMultiplier: this.attackMultiplier,
            magicMultiplier: 0,
            originEntityId: this.boss.getId(),
            width: 75,
            height: 75,
            dontDespawnOnObstacleCollision: true,
            classType: "HomingProjectile",
            spawnSound: "sword_schwing",
            piercing: this.piercing,
            initialVelocity: {x: 0, y: 0},
            projectileSpeed: this.getProjectileSpeed(),
            setInactiveCallback: this.controller.getGetsugaExplosionCallback(),
            onCollideCallback: this.controller.getGetsugaExplosionCallback(),
            data: {
                cooldown: 500,
                getOffset: ()=> ({x: Math.random() * 100, y: Math.random() * 100}),
                getTarget: (x: number = 0, y: number = 0)=> this.gameManager.getPlayerManager().getNearestAlivePlayer(x, y)
            }
        }

        this.controller.spawnProjectile(projectileConfig)
    }

    /**
     * 
     * @returns projectile speed based on how many sets of slashes were already sent out. First slash is the fastest.
     */
    getProjectileSpeed(){
        let offset = (this.maxProjectileSpeed - this.minProjectileSpeed) * (this.count/this.slashCount)
        return this.maxProjectileSpeed - offset
    }
}