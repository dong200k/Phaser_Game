import Matter from "matter-js";
import MathUtil from "../../../../../../../util/MathUtil";
import Entity from "../../../../../schemas/gameobjs/Entity";
import Monster from "../../../../../schemas/gameobjs/monsters/Monster";
import { CategoryType } from "../../../../Collisions/Category";
import GameManager from "../../../../GameManager";
import StateNode from "../../../../StateMachine/StateNode";
import { IProjectileConfig } from "../../../../interfaces";
import BerserkerBossController from "../BerserkerBossController";

type FinalAttackConfig = {
    getsugaCount?: number,
    attackMultiplier?: number,
    attackDuration?: number,
    /** Duration until attacks start going off */
    warningDuration?: number,
    projectileSpeed?: number,
}

export default class FinalAttack extends StateNode{
    protected controller!: BerserkerBossController
    protected boss!: Monster;
    protected gameManager!: GameManager;

    private attackDuration: number = 5
    private timePassed: number = 0
    private projectileCategory: CategoryType = "DAMAGE_ALL_PROJECTILE"
    private attackMultiplier = 1
    private getsugaCount = 100
    private timeBetweenSlashes = 0
    private timeBetweenSlashesSoFar = 0
    private fireCount = 0
    private projectileSpeed = 5
    private warningDuration = 1


    setConfig(config: FinalAttackConfig){
        this.getsugaCount = config.getsugaCount ?? this.getsugaCount
        this.attackDuration = config.attackDuration ?? this.attackDuration
        this.attackMultiplier = config.attackMultiplier ?? this.attackMultiplier
        this.warningDuration = config.warningDuration ?? this.warningDuration
        this.projectileSpeed = config.projectileSpeed ?? this.projectileSpeed
    }

    public onEnterHelper(){
        this.controller = this.getStateMachine<BerserkerBossController>()
        this.boss = this.controller.getBoss()
        this.gameManager = this.controller.getGameManager()
    }

    public onEnter(): void {
        this.onEnterHelper()
        this.timeBetweenSlashes = this.attackDuration/this.getsugaCount
        this.boss.animation.playAnimation("Spin_Attack",{
            duration: 0.3,
            loop: true
        })
        Matter.Body.setVelocity(this.boss.getBody(), {x: 0, y:0})
    }

    public onExit(): void {
        this.timePassed = 0
        this.timeBetweenSlashesSoFar = 0
    }

    public update(deltaT: number): void {
        this.timePassed += deltaT
        if(this.timePassed >= this.warningDuration){
            this.timeBetweenSlashesSoFar += deltaT
            if(this.timePassed >= this.attackDuration + this.warningDuration){
                this.controller.changeState("Follow")
            }
    
            if(this.timeBetweenSlashesSoFar >= this.timeBetweenSlashes){
                this.timeBetweenSlashesSoFar = 0
                this.fireSlashProjectile()
                this.fireCount++
            }
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
            poolType: "Boss Getsuga Tenshou Final 2",
            activeTime: 1000,
            attackMultiplier: this.attackMultiplier,
            magicMultiplier: 0,
            originEntityId: this.boss.getId(),
            width: 75,
            height: 75,
            dontDespawnOnObstacleCollision: true,
            classType: "MeleeProjectile",
            spawnSound: "clean_slash_attack",
            setInactiveCallback: this.controller.getGetsugaExplosionCallback(),
            onCollideCallback: this.controller.getGetsugaExplosionCallback(),
            initialVelocity: {x: 0, y: 0}
        }

        this.spawnRotatedProjectile(projectileConfig, Math.random() * 360)
    }

    spawnRotatedProjectile(projectileConfig: IProjectileConfig, rotationDegree: number){
        let velX = 1
        let velY = 1
        let initialVelocity = MathUtil.getRotatedSpeed(velX, velY, this.projectileSpeed, rotationDegree)
        
        let offsetX = this.boss.width/2
        let offsetY = this.boss.height/2

        if(initialVelocity.x < 0) offsetX *= -1
        if(initialVelocity.y < 0) offsetY *= -1

        this.controller.spawnProjectile({
            ...projectileConfig,
            spawnX: projectileConfig.spawnX + offsetX,
            spawnY: projectileConfig.spawnY + offsetY,
            initialVelocity
        })
    }

}