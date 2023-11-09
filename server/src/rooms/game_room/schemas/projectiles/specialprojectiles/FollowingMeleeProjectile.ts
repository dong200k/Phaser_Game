import GameManager from "../../../system/GameManager";
import { IProjectileConfig } from "../../../system/interfaces";
import Projectile from "../Projectile";
import Matter from "matter-js";
import Entity from "../../gameobjs/Entity";
import { type } from '@colyseus/schema';

/** A melee projectile has the MeleeProjectileController. This controller
 * lets the projectile have a windup time and a trigger. This is used so that it will seem like
 * the projectile hits the target when the projectile animation hits the target.
 */
export default class FollowingMeleeProjectile extends Projectile {

    private owner: Entity
    private offsetX: number = 0
    private offsetY: number = 0

    constructor(projectileConfig: IProjectileConfig, gameManager: GameManager) {
        super(projectileConfig, gameManager);
        this.owner = projectileConfig.data.owner
        this.offsetX = projectileConfig.data.offsetX ?? 0
        this.offsetY = projectileConfig.data.offsetY ?? 0
        this.dontDespawnOnObstacleCollision = true
        this.name = "FollowingMeleeProjectile"
        this.ownerId = this.owner.id
    }

    public reset(): void {
        super.reset();
    }

    public setConfig(projectileConfig: IProjectileConfig): void {
        super.setConfig(projectileConfig)
        this.owner = projectileConfig.data.owner
        this.offsetX = projectileConfig.data.offsetX ?? 0
        this.offsetY = projectileConfig.data.offsetY ?? 0
        this.ownerId = this.owner.id
    }

    public update(deltaT: number): void {
        super.update(deltaT)
        let body = this.owner.getBody()
        let newPos = {
            x: body.position.x + this.offsetX,
            y: body.position.y + this.offsetY
        }
        // console.log(`x: ${newPos.x}, y: ${newPos.y}, entity x: ${body.position.x}, y: ${body.position.y}`)
        if(body) Matter.Body.setPosition(this.getBody(), newPos)
    }
}