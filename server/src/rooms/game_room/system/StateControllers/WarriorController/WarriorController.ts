import GameManager from "../../GameManager";
import Attack from "../PlayerControllers/CommonStates/Attack";
import PlayerController, { PlayerControllerData } from "../PlayerControllers/PlayerController";
import DemoState from "./states/DemoState";

export default class WarriorController extends PlayerController {

    private gameManager!: GameManager

    protected create(data: PlayerControllerData): void {
        super.create(data)
        this.callStartAttackAnyways = true
        this.gameManager = this.getPlayer().gameManager;

        this.attackState.setConfig({
            canMove: false,
            triggerPercent: 0.3,
            attackDuration: 1
        })

        this.changeState("Idle");
    }

    public getGameManager() {
        return this.gameManager
    }

    update(deltaT: number){
        super.update(deltaT);
    }
}