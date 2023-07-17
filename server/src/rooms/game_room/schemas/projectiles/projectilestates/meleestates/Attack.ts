import StateNode from "../../../../system/StateMachine/StateNode";
import Projectile from "../../Projectile";
import MeleeProjectileController from "./MeleeProjectileController";


export default class Attack extends StateNode {

    /** MeleeProjectileController StateMachine. */
    private controller!: MeleeProjectileController;
    /** Projectile controlled by this StateMachine. */
    private projectile!: Projectile;
    /** Total attack time. Including windup(for animations) time and trigger time. */
    private attackDuration!: number;
    /** The percent for attackDuration when this projectile is collidable. */
    private triggerPercent!: number;
    /** Has the projectile been set to collidable. This is used so that this state wont set the 
     * projectile to collidable multiple times.
     */
    private triggered!: boolean;

    public onEnter(): void {
        this.controller = this.getStateMachine<MeleeProjectileController>();
        this.projectile = this.controller.getProjectile();
        this.projectile.disableCollisions();
        this.attackDuration = this.controller.getAttackDuration();
        this.triggerPercent = this.controller.getTriggerPercent();
        this.triggered = false;
        console.log("MeleeProjectile enter");
    }

    public onExit(): void {

    }

    public update(deltaT: number): void {
        this.attackDuration -= deltaT;
        if(this.attackDuration < this.controller.getAttackDuration() * this.triggerPercent && !this.triggered) {
            // Enable collisions
            console.log("Enable collisions");
            this.projectile.enableCollisions();
            this.triggered = true;
        }

        if(this.attackDuration < 0) {
            this.projectile.setActive(false);
            this.getStateMachine().changeState("Idle");
        }
    }
    
}
