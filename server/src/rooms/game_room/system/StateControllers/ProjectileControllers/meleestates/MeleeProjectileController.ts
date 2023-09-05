import StateMachine from "../../../StateMachine/StateMachine";
import Projectile from "../../../../schemas/projectiles/Projectile";
import Attack from "./Attack";
import Idle from "./Idle";


export interface MeleeProjectileControllerData {
    projectile: Projectile;
}

/** The monster controller contains ai that allows a monster to follow a player, and attack a player. */
export default class MeleeProjectileController extends StateMachine<MeleeProjectileControllerData> {
    
    private projectile!: Projectile;
    private attackDuration: number = 1;
    private triggerPercent: number = 0.8;
    private unTriggerPercent: number = 0.6;

    protected create(data: MeleeProjectileControllerData): void {
        this.projectile = data.projectile;

        // Idle state
        let idle = new Idle("Idle", this);
        this.addState(idle);
        
        // Attack state
        let attack = new Attack("Attack", this);
        this.addState(attack);

        //Set initial state
        this.changeState("Idle");
    }

    public postUpdate(deltaT: number): void {
        
    }

    public getProjectile() {
        return this.projectile;
    }

    public getAttackDuration() {
        return this.attackDuration;
    }

    public getTriggerPercent() {
        return this.triggerPercent;
    }

    public getUntriggerPercent() {
        return this.unTriggerPercent;
    }

    /** Reset this controller to its original state. */
    public reset() {
        this.changeState("Idle");
    }
}