import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import StateMachine from "../../../../StateMachine/StateMachine";
import ArrowFly from "./states/ArrowFly";
import ArrowRain from "./states/ArrowRain";
import Inactive from "./states/Inactive";

export interface RangerAbilityControllerData {
    player: Player;
    gameManager: GameManager;
}

export default class RangerAbilityController extends StateMachine<RangerAbilityControllerData> {

    private player!: Player;
    private gameManager!: GameManager
    private arrowFlyX: number = 0
    private arrowFlyY: number = 0

    protected create(data: RangerAbilityControllerData): void {
        this.player = data.player;
        this.gameManager = data.gameManager

        //Add States
        let arrowFly = new ArrowFly("Arrow Fly", this)
        arrowFly.setConfig({
            timeTilChangeState: 100,
            attackDuration: 400,
            triggerPercent: 0.3,
            projectileSpeed: 15,
            spawnSound: "shoot_arrow",
            arrowCount: 20,
            width: 50
        })
        this.addState(arrowFly)

        let arrowRain = new ArrowRain("Arrow Rain", this)
        arrowRain.setConfig({
            projectileSpeed: 5,
            spawnSound: "shoot_arrow",
            arrowCount: 50,
            fallWidthOffset: 150,
            timeBetweenWaves: 50,
            fallHeightOffset: 200,
            impactRangeY: 150,
            width: 50,
            height: 50
        })
        this.addState(arrowRain)

        let inactive = new Inactive("Inactive", this)
        this.addState(inactive)

        this.changeState("Inactive")
    }

    public postUpdate(deltaT: number): void {
        let currentState = this.getState();
    }

    public getPlayer() {
        return this.player;
    }

    /** Called when arrow fly is used to remember the origin(player position) when the arrows were shot. */
    public setArrowFlyOrigin(x: number, y: number){
        this.arrowFlyX = x
        this.arrowFlyY = y
    }

    public getArrowFlyOrigin(){
        return {x: this.arrowFlyX, y: this.arrowFlyY}
    }

    public getGameManager() {
        return this.gameManager
    }

    /** 
     * Changes this player's state to using ability
     */
    public startAbility() {
        if(this.stateName !== "Arrow Rain" && this.stateName  !== "Arrow Fly"){
            this.changeState("Arrow Fly")
        }
        
    }
}