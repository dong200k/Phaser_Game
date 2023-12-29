import Wave from "../../../../schemas/dungeon/wave/Wave";
import Player from "../../../../schemas/gameobjs/Player";
import StateNode from "../../../StateMachine/StateNode";
import TutorialController from "../TutorialController";

export default class EndTutorialState extends StateNode {

    private tutorialController!: TutorialController;
    private finalWave!: Wave;

    public onEnter(): void {
        this.tutorialController = this.getStateMachine();
        

        // Start the final wave.
        this.tutorialController.getTutorialDungeon().startNextWave();
        this.finalWave = this.tutorialController.getTutorialDungeon().getCurrentWaveObject();

        let playerManager = this.tutorialController.getGameManager().getPlayerManager();
        let players = playerManager.getAllPlayers();
        players.forEach((player) => {
            playerManager.sendClientDialog(player.id, {
                dialogItems: [
                    {speaker: "Instructor", text: "Be prepared! A final wave is approaching!"},
                ]
            });
        });
    }

    public onExit(): void {
        
    }

    public update(deltaT: number): void {
        let waveCompleted = this.finalWave.update(deltaT);
        if(waveCompleted && !this.tutorialController.getTutorialDungeon().hasMonsterAlive()) {
            this.tutorialController.getTutorialDungeon().setConquered(true);
        }
    }
    
}
