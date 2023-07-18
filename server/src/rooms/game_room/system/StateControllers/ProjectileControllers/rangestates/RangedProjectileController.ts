import Projectile from "../../../../schemas/projectiles/Projectile";
import StateMachine from "../../../../system/StateMachine/StateMachine";


export interface RangedProjectileControllerData {
    projectile: Projectile;
}

/** The monster controller contains ai that allows a monster to follow a player, and attack a player. */
export default class RangedProjectileController extends StateMachine<RangedProjectileControllerData> {

    private projectile!: Projectile;

    protected create(data: RangedProjectileControllerData): void {
        this.projectile = data.projectile;

        // //Idle state
        // let idle = new Idle("Idle", this);
        // this.addState(idle);
        // //Follow state
        // let follow = new Follow("Follow", this);
        // this.addState(follow);
        // //Attack state
        // let attack = new Attack("Attack", this);
        // this.addState(attack);
        // //Death state
        // let death = new Death("Death", this);
        // this.addState(death);

        //Set initial state
        // this.changeState("Idle");
    }

    public postUpdate(deltaT: number): void {
        
    }

    public getProjectile() {
        return this.projectile;
    }
}