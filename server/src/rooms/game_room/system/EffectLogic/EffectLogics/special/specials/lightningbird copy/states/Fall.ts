import Matter from "matter-js";
import MathUtil from "../../../../../../../../../util/MathUtil";
import { getFinalSpeed } from "../../../../../../Formulas/formulas";
import StateNode from "../../../../../../StateMachine/StateNode";
import LightningBirdController from "../MeteorController";
import Entity from "../../../../../../../schemas/gameobjs/Entity";
import Monster from "../../../../../../../schemas/gameobjs/monsters/Monster";
import Player from "../../../../../../../schemas/gameobjs/Player";
import MeteorController from "../MeteorController";

/** In this state the projectile will fall from the top of the screen to the target while being immune to collisions. */
export default class Fall extends StateNode{
    /** Position where meteor will explode */
    private impactPosition?: {x: number, y: number}

    public onEnter(): void {
        this.impactPosition = undefined
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

        // Find position from random monster
        let stateMachine = (this.getStateMachine() as MeteorController);
        let projectile = stateMachine.getProjectile()
        let monsters: Monster[] = []
        projectile.gameManager.gameObjects.forEach((obj)=>{
            if(obj instanceof Monster){
                monsters.push(obj)
            }
        })
        
        let target: Entity | undefined
        if(monsters.length > 0){
            let choice = Math.round(Math.random() * monsters.length)
            target = monsters[choice]
        }else{
            target = projectile.getOriginEntity()
        }

        let pos: {x: number, y: number}
        if(Math.random()<0.2) pos = target? target.getBody().position : this.getRandomPositionAroundPlayer()
        else pos = this.getRandomPositionAroundPlayer()
        this.impactPosition = {...pos}
        // console.log("Impact pos:", this.impactPosition)
        // console.log(`has target: ${target !== undefined}`)

        return this.impactPosition
    }

    private getRandomPositionAroundPlayer(radius = 200){
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
        // let impactPosition = {x: 0, y: 0}

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