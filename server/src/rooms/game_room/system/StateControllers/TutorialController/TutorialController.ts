import TutorialDungeon from "../../../schemas/dungeon/TutorialDungeon";
import GameManager from "../../GameManager";
import StateMachine from "../../StateMachine/StateMachine";
import EndTutorialState from "./states/EndTutorialState";
import MonsterAttackState from "./states/MonsterAttackState";
import MoveState from "./states/MoveState";
import SafeWaveState from "./states/SafeWaveState";

interface ControllerData {
    tutorialDungeon: TutorialDungeon;
    gameManager: GameManager;
}

/** 
 * The tutorial controller will manage the state of the tutorial dungeon.
 * The movement tutorial state where the player learns how to move.
 * The special tutorial where the player learns how to use thier special ability.
 * The charge attack tutorial where the player learns charge attacks.
 * The monster attack tutorial where the player gets to fight some monsters.
 * The safe wave tutorial where the player learns about the safe wave.
 * A final wave of monster where the player fights a few more monsters. At any point 
 * the player may leave the tutorial through the main menu.
 */
export default class TutorialController extends StateMachine<ControllerData> {

    private gameManager!: GameManager;
    private tutorialDungeon!: TutorialDungeon;

    protected create(data: ControllerData): void {
        this.gameManager = data.gameManager;
        this.tutorialDungeon = data.tutorialDungeon;

        let moveState = new MoveState("MoveState", this);
        this.addState(moveState);

        let monsterAttackState = new MonsterAttackState("MonsterAttackState", this);
        this.addState(monsterAttackState);

        let safeWaveState = new SafeWaveState("SafeWaveState", this);
        this.addState(safeWaveState);

        let endTutorialState = new EndTutorialState("EndTutorialState", this);
        this.addState(endTutorialState);

        this.changeState("MoveState");
    }

    protected postUpdate(deltaT: number): void {
        
    }

    public getTutorialDungeon() {
        return this.tutorialDungeon;
    }

    public getGameManager() {
        return this.gameManager;
    }
    
}
