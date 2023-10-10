import Matter from "matter-js";
import MathUtil from "../../../../../../../util/MathUtil";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import SpeedMultiEffect from "../../../../../schemas/effects/temp/SpeedMultiEffect";
import Entity from "../../../../../schemas/gameobjs/Entity";
import Monster from "../../../../../schemas/gameobjs/monsters/Monster";
import { getFinalAttackSpeed, getFinalSpeed } from "../../../../Formulas/formulas";
import GameManager from "../../../../GameManager";
import StateNode from "../../../../StateMachine/StateNode";
import EffectManager from "../../../../StateManagers/EffectManager";
import BerserkerBossController from "../BerserkerBossController";
import { IProjectileConfig } from "../../../../interfaces";
import { CategoryType } from "../../../../Collisions/Category";

type TornadoSpinConfig = {
    attackDuration?: number,
    /** Multiplier for the spinning motion/attack */
    spinAttackMultiplier?: number,
    /** Multiplier for the slashes(getsugas) coming out */
    slashAttackMultiplier?: number,
    speedBoostDuration?: number,
    speedBoostMult?: number,
    /** Whether to use speed boost or not */
    withSpeedBoost?: boolean,
    /** Time til the getsugas get slashed out */
    timeBetweenSlashes?: number,
    categoryType?: CategoryType,
    getsugaCount?: number
}

export default class TornadoSpin extends StateNode {

    protected controller!: BerserkerBossController
    protected boss!: Monster;
    protected gameManager!: GameManager;
    protected target!: Entity

    private attackDuration: number = 4
    private timePassed: number = 0
    private speedBoostDuration: number = 0.5
    private speedBoostMult: number = 2
    private speedMultiEffect?: SpeedMultiEffect
    private spinAttackMultiplier = 0.2
    private timeBetweenSlashes = 1
    private timeBetweenSlashSoFar = 0
    private projectileCategory: CategoryType = "DAMAGE_ALL_PROJECTILE"
    private slashAttackMultiplier = 1
    private withSpeedBoost = true
    private getsugaCount = 1

    setConfig(config?: TornadoSpinConfig){
        this.projectileCategory = config?.categoryType ?? this.projectileCategory
        this.attackDuration = config?.attackDuration ?? this.attackDuration
        this.speedBoostDuration = config?.speedBoostDuration ?? this.speedBoostDuration
        this.speedBoostMult = config?.speedBoostMult ?? this.speedBoostMult
        this.withSpeedBoost = config?.withSpeedBoost ?? this.withSpeedBoost
        this.slashAttackMultiplier = config?.slashAttackMultiplier ?? this.slashAttackMultiplier
        this.spinAttackMultiplier = config?.spinAttackMultiplier ?? this.spinAttackMultiplier
        this.timeBetweenSlashes = config?.timeBetweenSlashes ?? this.timeBetweenSlashes
        this.getsugaCount = config?.getsugaCount ?? this.getsugaCount
    }

    public onEnter(): void {
        // console.log(`tornado spin: duration: ${this.attackDuration}, timeBewtweenSlashes: ${this.timeBetweenSlashes}, getsugaCount: ${this.getsugaCount}`)
        this.controller = this.getStateMachine<BerserkerBossController>()
        this.boss = this.controller.getBoss()
        this.gameManager = this.controller.getGameManager()
        let target = this.controller.getTarget()

        if(!target){
            this.controller.changeState("Idle")
            return
        }

        this.target = target
        this.boss.animation.playAnimation("Spin_Attack", {
            duration: 1 / getFinalAttackSpeed(this.boss.stat),
            loop: true
        });

        this.boss.sound.playSoundEffect("sword_schwing")

        if(this.withSpeedBoost){
            this.speedMultiEffect = EffectFactory.createSpeedMultiplierEffectTimed(this.speedBoostMult, this.speedBoostDuration)
            EffectManager.addEffectsTo(this.boss, this.speedMultiEffect)
            this.initSpinProjectile()
        }
    }

    public onExit(): void {
        this.timePassed = 0
        this.timeBetweenSlashSoFar = 0
        if(this.speedMultiEffect) {
            EffectManager.removeEffectFrom(this.boss, this.speedMultiEffect)
            this.speedMultiEffect = undefined
        }
    }

    public update(deltaT: number): void {
        this.timePassed += deltaT
        this.timeBetweenSlashSoFar += deltaT
        if(this.timePassed >= this.attackDuration){
            this.controller.changeState("Follow")
        }

        if(this.target){
            let bossBody = this.boss.getBody()
            let {x: bossX, y: bossY} = bossBody.position;
            let {x: targetX, y: targetY} = this.target.getBody().position;
    
            let speed = getFinalSpeed(this.boss.stat) * deltaT;
            let velocity = MathUtil.getNormalizedSpeed(targetX - bossX, targetY - bossY, speed);
            if(bossBody) Matter.Body.setVelocity(bossBody, velocity);
        }

        // console.log(this.timeBetweenSlashSoFar)
        if(this.timeBetweenSlashSoFar > this.timeBetweenSlashes){
            this.timeBetweenSlashSoFar = 0
            for(let i=0;i<this.getsugaCount;i++)
                this.fireSlashProjectile()
        }
    }
    
    private fireSlashProjectile(){
        let projectileConfig: IProjectileConfig
        let bossPos = this.boss.getBody().position
        projectileConfig = {
            sprite: "GetsugaTenshou",
            stat: this.boss.stat,
            spawnX: bossPos.x,
            spawnY: bossPos.y,
            collisionCategory: this.projectileCategory,
            poolType: "Boss Getsuga Tenshou",
            activeTime: 2000,
            attackMultiplier: this.slashAttackMultiplier,
            magicMultiplier: 0,
            originEntityId: this.boss.getId(),
            width: 100,
            height: 100,
            dontDespawnOnObstacleCollision: true,
            classType: "MeleeProjectile",
            spawnSound: "clean_slash_attack",
            initialVelocity: {x: 0, y: 0}
        }

        this.spawnRotatedProjectile(projectileConfig, Math.random() * 360)
    }

    spawnRotatedProjectile(projectileConfig: IProjectileConfig, rotationDegree: number){
        let targetPos = this.target.getBody().position
        let bossPos = this.boss.getBody().position
        let velX = targetPos.x - this.boss.x
        let velY = targetPos.y - this.boss.y

        this.controller.spawnProjectile({
            ...projectileConfig,
            initialVelocity: MathUtil.getRotatedSpeed(velX, velY, 10, rotationDegree)
        })
    }

    private initSpinProjectile(){
        let bossX = this.boss.getBody().position.x
        let bossY = this.boss.getBody().position.y
        let offsetX = 10
        let offsetY = -5

        let projectileConfig: IProjectileConfig = {
            sprite: "invisible",
            stat: this.boss.stat,
            spawnX: bossX + offsetX,
            spawnY: bossY + offsetY,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: this.projectileCategory,
            poolType: "Berserker Boss Combo 2",
            activeTime: this.attackDuration * 1000,
            attackMultiplier: this.spinAttackMultiplier,
            magicMultiplier: 0,
            originEntityId: this.boss.getId(),
            width: 140,
            height: 55,
            visible: false,
            classType: "FollowingMeleeProjectile",
            dontDespawnOnObstacleCollision: true,
            piercing: -1,
            setInactiveCallback: this.controller.getGetsugaExplosionCallback(),
            onCollideCallback: this.controller.getGetsugaExplosionCallback(),
            data: {
                owner: this.boss,
                offsetX,
                offsetY
            },
        }

        this.controller.spawnProjectile(projectileConfig)
    }
}