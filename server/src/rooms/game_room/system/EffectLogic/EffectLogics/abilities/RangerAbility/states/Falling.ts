import Matter from "matter-js";
import Projectile from "../../../../../../schemas/projectiles/Projectile";
import StateNode from "../../../../../StateMachine/StateNode";
import ArrowRainProjectileController from "../ArrowRainProjectileController";

/** State for the projectile from the arrow rain. Used to track when to switch to the explode state */
export default class Falling extends StateNode {

    private arrowRainProjectileController!: ArrowRainProjectileController
    private projectile!: Projectile
    private explodeThresholdY!: number

    public onEnter(): void {
        this.arrowRainProjectileController = this.getStateMachine<ArrowRainProjectileController>()
        this.projectile = this.arrowRainProjectileController.getProjectile()
        this.explodeThresholdY = this.arrowRainProjectileController.getExplodeThresholdY()
    }

    public onExit(): void {
    }

    public update(deltaT: number): void {
        // Arrows falled passed the explosion threshold y line
        let projBody = this.projectile.getBody()
        if(projBody.position.y >= this.explodeThresholdY){
            this.arrowRainProjectileController.changeState("Explode")
        }
    }
}