import GameManager from "../../system/GameManager";
import TutorialController from "../../system/StateControllers/TutorialController/TutorialController";
import StateMachine from "../../system/StateMachine/StateMachine";
import Dungeon from "./Dungeon";

/**
 * The tutoral dungeon is used for the player to learn about the game.
 * It will be ran the first time the player plays the game. It can also
 * be accessed throught the dungeon menu in the waiting room. See TutorialController
 * (location: system -> StateControllers -> TutorialController)
 * for information about the logic of this dungeon.
 */
export default class TutorialDungeon extends Dungeon {
    
    private controller: TutorialController;

    constructor(gameManager: GameManager, dungeonName: string) {
        super(gameManager, dungeonName);
        this.controller = new TutorialController({
            gameManager: gameManager,
            tutorialDungeon: this,
        })
    }

    /**
     * Updates the tutorial dungeon.
     * @param deltaT The time passed in seconds.
     */
    public update(deltaT: number) {
        this.controller.update(deltaT);
    }

}