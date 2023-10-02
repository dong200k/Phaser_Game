import GameManager from "../../GameManager";
import PlayerController, { PlayerControllerData } from "../PlayerControllers/PlayerController";
import DemoState from "./states/DemoState";

export default class WarriorController extends PlayerController {

    private gameManager!: GameManager

    protected create(data: PlayerControllerData): void {
        super.create(data)
        this.callStartAttackAnyways = true
        this.gameManager = this.getPlayer().gameManager;

        let demoState = new DemoState("DemoState", this);
        this.addState(demoState);

        this.changeState("Idle");
    }

    public getGameManager() {
        return this.gameManager
    }

    update(deltaT: number){
        super.update(deltaT);
    }
}