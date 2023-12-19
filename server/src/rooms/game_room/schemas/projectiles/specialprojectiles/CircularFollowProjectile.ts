import Matter from "matter-js";
import GameManager from "../../../system/GameManager";
import { IProjectileConfig } from "../../../system/interfaces";
import Projectile from "../Projectile";
import MathUtil from "../../../../../util/MathUtil";

/** Creates a Projectile that follows the entity */
export default class CircularFollowProjectle extends Projectile{
    private radius: number
    private startAngle: number = 0
    private currentAngle: number = 0

    constructor(projectileConfig: IProjectileConfig, gameManager: GameManager){
        super(projectileConfig, gameManager)
        this.startAngle = projectileConfig.data.startAngle ?? 0
        this.radius = projectileConfig.data.radius ?? 100
        this.currentAngle = this.startAngle
        this.activeTime = this.activeTime? this.activeTime : 5000
    }


    public update(deltaT: number): void {
        super.update(deltaT)
        
        let distanceTraveled = this.projectileSpeed * deltaT/1000
        let circumference = 2 * Math.PI * this.radius
        let angleTraveled = distanceTraveled/circumference * 360
        // console.log(`circumference: ${circumference}, distance traveled: ${distanceTraveled}, deltaT: ${deltaT}, speed: ${this.projectileSpeed}`)
        this.currentAngle += angleTraveled
        this.currentAngle %= 360
        // console.log(` angle traveled: ${angleTraveled}, current angle: ${this.currentAngle}`)

        let entityBody = this.getOriginEntity()?.getBody()
        let projBody = this.getBody()

        if(entityBody){
            let x = entityBody.position.x + this.radius * Math.cos(this.toRadians(this.currentAngle))
            let y = entityBody.position.y + this.radius * Math.sin(this.toRadians(this.currentAngle))
            Matter.Body.setPosition(projBody, {x, y})
        }
        
    }

    public toRadians(degrees: number){
        return degrees * Math.PI / 180
    }

    public setConfig(projectileConfig: IProjectileConfig): void {
        super.setConfig(projectileConfig)
        this.radius = projectileConfig.data.radius
        this.activeTime = this.activeTime? this.activeTime : 5000
    }
}