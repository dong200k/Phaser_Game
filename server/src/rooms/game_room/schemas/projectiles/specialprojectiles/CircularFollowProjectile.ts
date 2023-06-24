import Matter from "matter-js";
import GameManager from "../../../system/GameManager";
import { IProjectileConfig } from "../../../system/interfaces";
import Projectile from "../Projectile";

/** Creates a Projectile that follows the entity */
export default class CircularFollowProjectle extends Projectile{
    private radius: number
    private startRadians: number
    private originalTime: number
    private cycleTime: number
    private timeOnCurrentCycle: number

    constructor(projectileConfig: IProjectileConfig, gameManager: GameManager){
        super(projectileConfig, gameManager)
        this.radius = projectileConfig.data.radius
        this.activeTime = this.activeTime? this.activeTime : 5000
        this.originalTime = this.activeTime
        this.startRadians = projectileConfig.data.startDegree * Math.PI / 180
        this.cycleTime = projectileConfig.data.cycleTime
        this.timeOnCurrentCycle = 0
    }

    public update(deltaT: number): void {
        super.update(deltaT)

        this.timeOnCurrentCycle += deltaT
        if(this.timeOnCurrentCycle > this.cycleTime) this.timeOnCurrentCycle = 0

        // Follow and circle entity
        if(this.activeTime){
            let radians = this.startRadians + (this.timeOnCurrentCycle / this.cycleTime) * 2 * Math.PI
            let circleX = this.radius * Math.cos(radians)
            let circleY = this.radius * Math.sin(radians)

            let body = this.entity?.getBody()
            let projBody = this.getBody()
            if(body && projBody){
                let x = body.position.x + circleX
                let y = body.position.y + circleY
                Matter.Body.setPosition(projBody, {x, y})
            }
        }
    }

    public setConfig(projectileConfig: IProjectileConfig): void {
        super.setConfig(projectileConfig)
        this.radius = projectileConfig.data.radius
        this.activeTime = this.activeTime? this.activeTime : 5000
        this.originalTime = this.activeTime
        this.startRadians = projectileConfig.data.startDegree * Math.PI / 180
        this.cycleTime = projectileConfig.data.cycleTime
        this.timeOnCurrentCycle = 0
    }
}