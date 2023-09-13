import Matter from "matter-js";
import Projectile from "../../../../../../schemas/projectiles/Projectile";
import StateNode from "../../../../../StateMachine/StateNode";
import ArrowRainProjectileController from "../ArrowRainProjectileController";

type ExplodeConfig = {
    /** Number of targets this projectile can hit */
    piercing?: number,
    attackMultiplier?: number,
    /** Duration this projectile lasts */
    duration?: number,
}

/** Used for the arrow explosion logic when the arrow rain arrows finally impact */
export default class Explode extends StateNode {

    private arrowRainProjectileController!: ArrowRainProjectileController
    private projectile!: Projectile
    private exploded = false

    private piercing = 10
    private attackMultiplier = 5
    private duration = 1000
    private timePassed: number = 0

    public setConfig(config: ExplodeConfig){
        this.piercing = config.piercing ?? 10
        this.attackMultiplier = config.attackMultiplier ?? 5
        this.duration = config.duration ?? 1000
    }

    public onEnter(): void {
        this.arrowRainProjectileController = this.getStateMachine<ArrowRainProjectileController>()
        this.projectile = this.arrowRainProjectileController.getProjectile()
    }

    public onExit(): void {
        this.exploded = false
        this.timePassed = 0
    }

    public update(deltaT: number): void {
        this.timePassed += deltaT

        if(this.timePassed >= this.duration){
            // console.log("setting inactive")
            this.projectile.setActive(false)
            return
        }

        if(!this.exploded) {
            this.exploded = true
            Matter.Body.setVelocity(this.projectile.getBody(), {x: 0, y: 0})
            this.projectile.piercing = this.piercing
            this.projectile.attackMultiplier = this.attackMultiplier
            this.projectile.setCollision("PLAYER_PROJECTILE")
            this.projectile.animation.playAnimation("play", {
                // flip: true,
                loop: false
            })
        }

        
    }
}