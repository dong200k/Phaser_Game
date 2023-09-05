import StateNode from "../../../StateMachine/StateNode";
import Projectile from "../../../../schemas/projectiles/Projectile";
import MeleeProjectileController from "./MeleeProjectileController";


export default class Attack extends StateNode {

    /** MeleeProjectileController StateMachine. */
    private controller!: MeleeProjectileController;
    /** Projectile controlled by this StateMachine. */
    private projectile!: Projectile;
    /** Total attack time. Including windup(for animations) time and trigger time. */
    private attackDuration!: number;
    /** The percent of attackDuration when this projectile is collidable. */
    private triggerPercent!: number;
    /** Has the projectile been set to collidable. This is used so that this state wont set the 
     * projectile to collidable multiple times. */
    private triggered!: boolean;

    /** The percent of attackDuration when this projectile is not collidable. */
    private unTriggerPercent!: number;

    public onEnter(): void {
        this.controller = this.getStateMachine<MeleeProjectileController>();
        this.projectile = this.controller.getProjectile();
        this.projectile.disableCollisions();
        this.attackDuration = this.controller.getAttackDuration();
        this.triggerPercent = this.controller.getTriggerPercent();
        this.unTriggerPercent = this.controller.getUntriggerPercent();
        this.triggered = false;
    }

    public onExit(): void {

    }

    public update(deltaT: number): void {
        this.attackDuration -= deltaT;

        /** Disable collisions after the trigger time ends. */
        if(this.triggered && this.attackDuration < this.controller.getAttackDuration() * this.unTriggerPercent) {
            this.projectile.disableCollisions();
        }

        /** Enable collisions when the trigger time starts. */
        if(this.attackDuration < this.controller.getAttackDuration() * this.triggerPercent && !this.triggered) {
            // Enable collisions
            this.projectile.enableCollisions();
            this.triggered = true;
        }
 
        if(this.attackDuration < 0) {
            this.projectile.setActive(false);
            this.projectile.disableCollisions();
            this.getStateMachine().changeState("Idle");
        }
    }
    
}
