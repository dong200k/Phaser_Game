import Matter from "matter-js";
import MathUtil from "../../../../../../../../../util/MathUtil";
import { getFinalSpeed } from "../../../../../../Formulas/formulas";
import StateNode from "../../../../../../StateMachine/StateNode";
import LightningBirdController from "../MeteorController";
import Entity from "../../../../../../../schemas/gameobjs/Entity";
import Monster from "../../../../../../../schemas/gameobjs/monsters/Monster";
import Player from "../../../../../../../schemas/gameobjs/Player";
import MeteorController from "../MeteorController";
import { GameEvents, IProjectileConfig } from "../../../../../../interfaces";

/** In this state the projectile will fall from the top of the screen to the target while being immune to collisions. */
export default class Fall extends StateNode{
    /** Position where meteor will explode */
    private impactPosition?: {x: number, y: number}
    private meteorTriggered = false

    public onEnter(): void {
        this.impactPosition = undefined
        this.meteorTriggered = false
        let stateMachine = (this.getStateMachine() as MeteorController);
        let projectile = stateMachine.getProjectile()
        projectile.animation.playAnimation("play", {
            loop: true
        })
    }
    public onExit(): void {
    }
    /** Returns position to target, if none will find the nearest monster or the player */
    protected getTargetPosition(): {x: number, y: number} {
        if(this.impactPosition) return this.impactPosition

        let target: Entity | undefined
        let stateMachine = (this.getStateMachine() as MeteorController);
        let projectile = stateMachine.getProjectile()
        if(target && projectile.getOriginEntity() instanceof Player){
            target = this.getMonsterTarget()
        }else{
            target = projectile.getOriginEntity()
        }

        let pos: {x: number, y: number}
        if(Math.random()<0.2) pos = target? target.getBody().position : this.getRandomPositionAroundOwner()
        else pos = this.getRandomPositionAroundOwner()
        this.impactPosition = {...pos}
        // console.log("Impact pos:", this.impactPosition)
        // console.log(`has target: ${target !== undefined}`)

        return this.impactPosition
    }

    private getMonsterTarget(){
        let stateMachine = (this.getStateMachine() as MeteorController);
        let projectile = stateMachine.getProjectile()
        // Find position from random monster
        let monsters: Monster[] = []
        projectile.gameManager.gameObjects.forEach((obj)=>{
            if(obj instanceof Monster){
                monsters.push(obj)
            }
        })

        let choice = Math.round(Math.random() * monsters.length)
        return monsters[choice]
    }

    private getRandomPositionAroundOwner(radius = 300){
        let stateMachine = (this.getStateMachine() as MeteorController);
        let projectile = stateMachine.getProjectile()

        let owner = projectile.getOriginEntity()

        if(!owner) return {x: 0, y: 0}

        let offsetX = Math.random() * radius
        let offsetY = Math.random() * radius

        if(Math.random()<0.5) offsetX *= -1
        if(Math.random()<0.5) offsetY *= -1

        return {x: owner.x + offsetX, y: owner.y + offsetY}
    }

    protected follow(deltaT: number){
        let stateMachine = (this.getStateMachine() as MeteorController);
        let projectile = stateMachine.getProjectile()
        let impactPosition = this.getTargetPosition()
        let owner = projectile.getOriginEntity()
        // let impactPosition = {x: 0, y: 0}
        if(!this.meteorTriggered && owner){
            this.meteorTriggered = true
            let projectileConfig: IProjectileConfig = {
                sprite: "largecircle",
                stat: owner.stat,
                spawnX: impactPosition.x,
                spawnY: impactPosition.y,
                width: 120,
                height: 120,
                initialVelocity: {x: 0, y:0},
                collisionCategory: "NONE",
                activeTime: 1000,
                poolType: "circle_indicator_monster_projectile",
                attackMultiplier: 1,
                magicMultiplier: 0,
                classType: "Projectile",
            }
            // console.log(`spawning monster projectile at: (${projectileConfig.spawnX}, ${projectileConfig.spawnY})`);
            projectile.gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);
        }

        let speed = projectile.projectileSpeed * deltaT;

        let body = projectile.getBody()
        if(body) {
            let distanceToImpactPos = MathUtil.distance(impactPosition.x, impactPosition.y, projectile.x, projectile.y)
            if(distanceToImpactPos < 20){
                return stateMachine.changeState("Impact")
            }
            let velocity = MathUtil.getNormalizedSpeed(impactPosition.x - body.position.x, impactPosition.y - body.position.y, speed)
            Matter.Body.setVelocity(body, velocity);
        }
    }

    public update(deltaT: number): void {
        this.follow(deltaT)
    }
}