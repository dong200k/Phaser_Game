import StateNode from "../../../../system/StateMachine/StateNode";
import Projectile from "../../Projectile";
import MeleeProjectileController from "./MeleeProjectileController";

/**
 * An melee projectile is in its idle state when it is just created and when 
 * it finishes its attack animation.
 */
export default class Idle extends StateNode {

    /** MeleeProjectileController StateMachine. */
    private controller!: MeleeProjectileController;
    /** Projectile controlled by this StateMachine. */
    private projectile!: Projectile;

    public onEnter(): void {
        this.controller = this.getStateMachine<MeleeProjectileController>();
        this.projectile = this.controller.getProjectile();
        this.projectile.disableCollisions();
    }

    public onExit(): void {

    }

    public update(deltaT: number): void {
        if(this.projectile.active) {
            this.controller.changeState("Attack");
        }
    }
    
}