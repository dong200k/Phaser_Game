import Wave from "../../../../schemas/dungeon/wave/Wave";
import Player from "../../../../schemas/gameobjs/Player";
import StateNode from "../../../StateMachine/StateNode";
import TutorialController from "../TutorialController";

export default class MonsterAttackState extends StateNode {

    private tutorialController!: TutorialController;
    private slimeWave!: Wave;

    public onEnter(): void {
        this.tutorialController = this.getStateMachine();
        let dungeonManager = this.tutorialController.getGameManager().getDungeonManager();

        // Used only to update the wave number. The waves are manually updated by this State.
        this.tutorialController.getTutorialDungeon().startNextWave();
        // The slimeWave is the first wave. It will be updated in the update method below.
        this.slimeWave = this.tutorialController.getTutorialDungeon().getCurrentWaveObject();

        let playerManager = this.tutorialController.getGameManager().getPlayerManager();
        let players = playerManager.getAllPlayers();
        players.forEach((player) => {
            playerManager.sendClientDialog(player.id, {
                dialogItems: [
                    {speaker: "Instructor", text: "Watch out! Slimes! Use your attacks!"},
                ]
            });
        });
        
    }

    public onExit(): void {
        
    }

    public update(deltaT: number): void {
        let waveCompleted = this.slimeWave.update(deltaT);
        let dungeonManager = this.tutorialController.getGameManager().getDungeonManager();
        if(waveCompleted && !dungeonManager.checkActiveMonsters()) {
            // Change to next state.
            this.tutorialController.getTutorialDungeon().waveEnded = true;
            this.getStateMachine().changeState("SafeWaveState");
        }
    }
    
}
