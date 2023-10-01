import Matter from "matter-js";
import GameManager from "../../../system/GameManager";
import { IProjectileConfig } from "../../../system/interfaces";
import Projectile from "../Projectile";
import Monster from "../../gameobjs/monsters/Monster";
import MathUtil from "../../../../../util/MathUtil";
import Cooldown from "../../gameobjs/Cooldown";
import { off } from "process";

/** Creates a Projectile that homes in on a target with an offset. */
export default class HomingProjectile extends Projectile{
    private target?: Monster
    private cooldown: Cooldown
    /**
     * @param x number representing x position of projectile
     * @param y number representing y position of projectile
     * Function that returns a target entity when called.
     */
    private getTarget?: Function
    /**
     * Function that returns a offset {x: number, y: number}
     */
    private getOffset?: Function

    constructor(projectileConfig: IProjectileConfig, gameManager: GameManager){
        super(projectileConfig, gameManager)
        if(projectileConfig.data?.cooldown){
            this.cooldown = new Cooldown(projectileConfig.data.cooldown)
        }else{ 
            this.cooldown = new Cooldown(200)
        }
        
        this.getTarget = projectileConfig.data.getTarget
        this.getOffset = projectileConfig.data.getOffset
    }

    public update(deltaT: number): void {
        super.update(deltaT)

        this.cooldown.tick(deltaT)
        if(!this.cooldown.isFinished) return
        this.cooldown.reset()
        
        if(!this.target || !this.target.active){
            this.getNextTarget()
        }else{
            // Update velocity to move in target's direction
            let body = this.getBody()
            let offset = this.getNextOffset()
            let targetX = this.target.getBody().position.x + offset.x
            let targetY = this.target.getBody().position.y + offset.y
            let projX = body.position.x
            let projY = body.position.y
            let velocity = MathUtil.getNormalizedSpeed(targetX - projX, targetY - projY, this.projectileSpeed)
            Matter.Body.setVelocity(body, velocity);
        }
    }

    public reset(): void {
        super.reset()
        this.target = undefined
    }

    public setConfig(projectileConfig: IProjectileConfig): void {
        super.setConfig(projectileConfig)
        if(projectileConfig.data?.cooldown){
            this.cooldown = new Cooldown(projectileConfig.data.cooldown)
        }else{ 
            this.cooldown = new Cooldown(200)
        }
        
        this.getTarget = projectileConfig.data.getTarget
        this.getOffset = projectileConfig.data.getOffset
    }

    public getNextTarget(){
        if(this.getTarget){
            let pos = this.getBody().position
            this.target = this.getTarget(pos.x, pos.y)
        }else{
            // Find nearest monster
            this.gameManager.state.gameObjects.forEach((gameObject, key)=>{
                if(gameObject instanceof Monster && this.target === gameObject){
                    this.target = gameObject
                }
            })
        }
    }

    public getNextOffset(){
        if(this.getOffset) return this.getOffset()
        return {x: 0, y:0}
    }
}