import Matter from "matter-js";
import GameManager from "../../../system/GameManager";
import { IProjectileConfig } from "../../../system/interfaces";
import Projectile from "../Projectile";
import MathUtil from "../../../../../util/MathUtil";

/** Creates a Projectile that follows the entity */
export default class CircularFollowProjectle extends Projectile{
    private radius: number
    private wayPoints: {x: number, y:number}[] = []
    private currentWayPoint = 0

    constructor(projectileConfig: IProjectileConfig, gameManager: GameManager){
        super(projectileConfig, gameManager)
        this.radius = projectileConfig.data.radius
        this.activeTime = this.activeTime? this.activeTime : 5000
        this.wayPoints = this.generateWayPoints()
    }

    private generateWayPoints(){
        let count = 15
        let radians = 0
        let increment = 2 * Math.PI/count
        let wayPoints = []

        for(let i=0;i<count;i++){
            radians+= increment
            let x = this.radius * Math.cos(radians)
            let y = this.radius * Math.sin(radians)
            wayPoints.push({x, y})
        }
        return wayPoints
    }

    private getWayPoint(){
        if(this.currentWayPoint >= this.wayPoints.length) this.currentWayPoint = 0
        return this.wayPoints[this.currentWayPoint]
    }

    public update(deltaT: number): void {
        super.update(deltaT)
        
        let body = this.getOriginEntity()?.getBody()
        let projBody = this.getBody()
        if(body && projBody){
            let wayPoint = this.getWayPoint()
            let wayPointX = wayPoint.x + body.position.x
            let wayPointY = wayPoint.y + body.position.y

            let distanceToWayPoint = MathUtil.distance(wayPointX, wayPointY, projBody.position.x, projBody.position.y)
            // console.log(this.currentWayPoint, distanceToWayPoint)
            if(distanceToWayPoint < 10){
                Matter.Body.setPosition(projBody, {x: wayPointX, y: wayPointY})
                this.currentWayPoint++
            }else{
                let velocity = MathUtil.getNormalizedSpeed(wayPointX - projBody.position.x, wayPointY - projBody.position.y, this.projectileSpeed)
                Matter.Body.setVelocity(projBody, velocity)
            }
        }
    }

    public setConfig(projectileConfig: IProjectileConfig): void {
        super.setConfig(projectileConfig)
        this.radius = projectileConfig.data.radius
        this.activeTime = this.activeTime? this.activeTime : 5000
        this.wayPoints = this.generateWayPoints()
    }
}