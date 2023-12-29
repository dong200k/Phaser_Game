import Player from "../../../../schemas/gameobjs/Player";
import StateNode from "../../../StateMachine/StateNode";
import TutorialController from "../TutorialController";

export default class EndTutorialState extends StateNode {

    private tutorialController!: TutorialController;

    public onEnter(): void {
        this.tutorialController = this.getStateMachine();
        this.tutorialController.getTutorialDungeon().setConquered(true);
    }

    public onExit(): void {
        
    }

    public update(deltaT: number): void {
        
    }
    
}
