import Matter from "matter-js";
import MathUtil from "../../../../../../../../../util/MathUtil";
import { getFinalSpeed } from "../../../../../../Formulas/formulas";
import StateNode from "../../../../../../StateMachine/StateNode";
import LightningBirdController from "../LightningBirdController";
import Entity from "../../../../../../../schemas/gameobjs/Entity";
import Monster from "../../../../../../../schemas/gameobjs/monsters/Monster";
import Player from "../../../../../../../schemas/gameobjs/Player";

/** In this state the projectile will follow either its owner or a target */
export default class Follow extends StateNode{
    private currentTarget?: Monster

    public onEnter(): void {
        let stateMachine = (this.getStateMachine() as LightningBirdController);
        let projectile = stateMachine.getProjectile()
        projectile.animation.playAnimation("play", {
            loop: true
        })
    }
    public onExit(): void {
    }

    protected clearTarget(){
        this.currentTarget = undefined
    }

    /** Finds a target monster to follow and returns it if any. */
    protected getTarget(): Entity | undefined{
        if(this.currentTarget && this.currentTarget.active && this.currentTarget.controller.stateName !== "Death") return this.currentTarget

        let stateMachine = (this.getStateMachine() as LightningBirdController);
        let projectile = stateMachine.getProjectile()
        let target: Monster | undefined
        let minDistance = Infinity
        let owner = projectile.getOriginEntity()

        // Prioritizes monsters by closest distance to owner or projectile then if nothing the target will be undefined
        projectile.gameManager.gameObjects.forEach((obj)=>{
            if(obj instanceof Monster){
                let distance: number = Infinity
                if(owner){
                    distance = MathUtil.distance(obj.x, obj.y, owner.x, owner.y)
                } else{
                    distance = MathUtil.distance(obj.x, obj.y, projectile.x, projectile.y)
                }
                if(Math.random() < 0.5 && distance < minDistance){
                    minDistance = distance
                    target = obj
                }
            }
        })

        this.currentTarget = target
        return target
    }

    protected follow(deltaT: number){
        let stateMachine = (this.getStateMachine() as LightningBirdController);
        let projectile = stateMachine.getProjectile()
        let target = this.getTarget() ?? projectile.getOriginEntity()
        if(!target) {
            return console.log("no target")
        }

        // Flipping the projectile
        projectile.flipX = target.x < projectile.x
        projectile.flipY = false

        let body = projectile.getBody();
        let speed = projectile.projectileSpeed * deltaT;
        let velocity: {x: number, y: number} 
        if(target instanceof Player) {
            let offsetX = Math.random()*10 + 50
            let offsetY = Math.random()*10 + 50
            if(Math.random()<0.5) offsetX *= -1
            if(Math.random()<0.5) offsetY *= -1
            velocity = MathUtil.getNormalizedSpeed(offsetX + target.x - projectile.getBody().position.x, offsetY + target.y - projectile.getBody().position.y, speed);
        }else{
            velocity = MathUtil.getNormalizedSpeed(target.x - projectile.getBody().position.x, target.y - projectile.getBody().position.y, speed);
        }
        if(body) {
            if(MathUtil.distance(target.x, target.y, projectile.x, projectile.y) < projectile.width/2){
                Matter.Body.setVelocity(body, {x: 0, y: 0});
            }
            else{
                Matter.Body.setVelocity(body, velocity);
            }
        }
    }

    public update(deltaT: number): void {
        this.follow(deltaT)
    }
}