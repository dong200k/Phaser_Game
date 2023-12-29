import Wave from "../../../../schemas/dungeon/wave/Wave";
import Player from "../../../../schemas/gameobjs/Player";
import StateNode from "../../../StateMachine/StateNode";
import TutorialController from "../TutorialController";

export default class SafeWaveState extends StateNode {

    private tutorialController!: TutorialController;
    private safeWave!: Wave;

    public onEnter(): void {
        this.tutorialController = this.getStateMachine();

        // Start the safe wave.
        this.tutorialController.getTutorialDungeon().startNextWave();
        this.safeWave = this.tutorialController.getTutorialDungeon().getCurrentWaveObject();

        let playerManager = this.tutorialController.getGameManager().getPlayerManager();
        let players = playerManager.getAllPlayers();
        players.forEach((player) => {
            playerManager.sendClientDialog(player.id, {
                dialogItems: [
                    {speaker: "Instructor", text: "Well done! You have completed a wave."},
                    {speaker: "Instructor", text: "Between every wave is a safe time. Use this time to upgrade your weapons, buy artifacts, and heal your health."},
                ]
            });
        });
    }

    public onExit(): void {
        
    }

    public update(deltaT: number): void {
        let waveCompleted = this.safeWave.update(deltaT);
        if(waveCompleted) {
            this.tutorialController.getTutorialDungeon().waveEnded = true;
            this.getStateMachine().changeState("EndTutorialState");
        }
    }
    
}
