import Player from "../../../schemas/gameobjs/Player";
import { getFinalAttackSpeed } from "../../Formulas/formulas";
import GameManager from "../../GameManager";
import StateMachine from "../../StateMachine/StateMachine";
import EffectManager from "../../StateManagers/EffectManager";
import PlayerController, { PlayerControllerData } from "../PlayerControllers/PlayerController";

export default class BerserkerComboController extends PlayerController {

    private gameManager!: GameManager

    protected create(data: PlayerControllerData): void {
        super.create(data)
        this.callStartAttackAnyways = true
        this.gameManager = this.getPlayer().gameManager;

        this.changeState("Idle")
    }

    public getGameManager() {
        return this.gameManager
    }

    update(deltaT: number){
        super.update(deltaT);
    }
}