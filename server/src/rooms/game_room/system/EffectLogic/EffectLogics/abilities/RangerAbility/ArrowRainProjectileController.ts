import Player from "../../../../../schemas/gameobjs/Player";
import Projectile from "../../../../../schemas/projectiles/Projectile";
import GameManager from "../../../../GameManager";
import StateMachine from "../../../../StateMachine/StateMachine";
import Explode from "./states/Explode";
import Falling from "./states/Falling";

export interface ArrowRainProjectileControllerData {
    player: Player;
    gameManager: GameManager;
    projectile: Projectile;
    /** Y line that once the projectile hits/passes will change the state to explode */
    explodeThresholdY: number
    /** */
}

/** Controls the arrows in the ranger's arrow rain ability when they fall down */
export default class ArrowRainProjectileController extends StateMachine<ArrowRainProjectileControllerData> {

    private player!: Player;
    private gameManager!: GameManager
    /** Projectile controlled by this controller */
    private projectile!: Projectile
    private explodeThresholdY!: number

    protected create(data: ArrowRainProjectileControllerData): void {
        this.player = data.player;
        this.gameManager = data.gameManager
        this.projectile = data.projectile
        this.explodeThresholdY = data.explodeThresholdY

        let explode = new Explode("Explode", this)
        explode.setConfig({
            piercing: 100,
            attackMultiplier: 5,
            duration: 1000,
        })
        this.addState(explode)

        let falling = new Falling("Falling", this)
        this.addState(falling)

        this.changeState("Falling")
    }

    protected postUpdate(deltaT: number): void {
    }

    public getProjectile(){
        return this.projectile
    }

    public getExplodeThresholdY(){
        return this.explodeThresholdY
    }

    public getPlayer() {
        return this.player;
    }

    public getGameManager() {
        return this.gameManager
    }

    /** Resets config so that the projectile this controller is controlling can be reused */
    public resetConfig(data: Partial<ArrowRainProjectileControllerData>){
        if(data.explodeThresholdY) this.explodeThresholdY = data.explodeThresholdY
        this.changeState("Falling")
    }
}