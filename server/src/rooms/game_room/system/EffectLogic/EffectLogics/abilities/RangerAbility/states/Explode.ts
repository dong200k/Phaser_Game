import Matter from "matter-js";
import Projectile from "../../../../../../schemas/projectiles/Projectile";
import StateNode from "../../../../../StateMachine/StateNode";
import ArrowRainProjectileController from "../ArrowRainProjectileController";

/** Used for the arrow explosion logic when the arrow rain arrows finally impact */
export default class Explode extends StateNode {

    private arrowRainProjectileController!: ArrowRainProjectileController
    private projectile!: Projectile

    public onEnter(): void {
        this.arrowRainProjectileController = this.getStateMachine<ArrowRainProjectileController>()
        this.projectile = this.arrowRainProjectileController.getProjectile()
    }

    public onExit(): void {
    }

    public update(deltaT: number): void {
        Matter.Body.setVelocity(this.projectile.getBody(), {x: 0, y: 0})
    }
}