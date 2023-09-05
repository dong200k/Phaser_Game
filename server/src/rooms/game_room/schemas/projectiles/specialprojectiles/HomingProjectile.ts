import Matter from "matter-js";
import GameManager from "../../../system/GameManager";
import { IProjectileConfig } from "../../../system/interfaces";
import Projectile from "../Projectile";
import Monster from "../../gameobjs/monsters/Monster";
import MathUtil from "../../../../../util/MathUtil";
import Cooldown from "../../gameobjs/Cooldown";

/** Creates a Projectile that homes in on a monster in the direction the bullet is traveling */
export default class HomingProjectile extends Projectile{
    private target?: Monster
    private cooldown: Cooldown
    private position: {x: number, y: number}

    constructor(projectileConfig: IProjectileConfig, gameManager: GameManager){
        super(projectileConfig, gameManager)
        if(projectileConfig.data?.cooldown){
            this.cooldown = new Cooldown(projectileConfig.data.cooldown)
        }else{
            this.cooldown = new Cooldown(1000)
        }
        
        this.position = projectileConfig.data.position
    }

    public update(deltaT: number): void {
        super.update(deltaT)

        this.cooldown.tick(deltaT)
        if(!this.cooldown.isFinished) return
        this.cooldown.reset()
        
        if(!this.target || !this.target.active){
            // Select target to track if no target
            let closestTarget: Monster | undefined
            let closestDistance = Infinity
            this.gameManager.state.gameObjects.forEach((gameObject, key)=>{
                if(gameObject instanceof Monster){
                    // if(this.targ)
                    let monsterX = gameObject.getBody().position.x
                    let monsterY = gameObject.getBody().position.y
                    let playerX = this.position.x
                    let playerY = this.position.y
                    console.log(playerX, playerY)
                    let distance = Math.sqrt((monsterX - playerX) ** 2 + (monsterY - playerY) ** 2)
                    // console.log(`distance: ${distance}`)
                    if(distance < closestDistance){
                        closestDistance = distance
                        closestTarget = gameObject
                    }
                }
            })

            this.target = closestTarget
            // console.log(`target locked, ${this.target}`)
        }else{
            // Update velocity to move in target monster's direction
            this.gameManager.state.gameObjects.forEach((gameObject, key)=>{
                if(gameObject instanceof Monster && this.target === gameObject){
                    let body = this.getBody()
                    let monsterX = this.target.getBody().position.x
                    let monsterY = this.target.getBody().position.y
                    let projX = body.position.x
                    let projY = body.position.y
                    let velocity = MathUtil.getNormalizedSpeed(monsterX - projX, monsterY - projY, this.projectileSpeed)
                    Matter.Body.setVelocity(body, velocity);
                }
            })
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
            this.cooldown = new Cooldown(1000)
        }
        
        this.position = projectileConfig.data.position
    }
}