import Player from "../../../../schemas/gameobjs/Player";
import StateNode from "../../../StateMachine/StateNode";
import TutorialController from "../TutorialController";

export default class MoveState extends StateNode {

    private tutorialController!: TutorialController;

    private playersLearnedMovement!: boolean; // flag for when the player completes this tutorial.
    private playerSent!: boolean; // flag for when the player receives the instructions.

    public onEnter(): void {
        this.tutorialController = this.getStateMachine();
        this.playersLearnedMovement = false;
        this.playerSent = false;
    }

    public onExit(): void {
        
    }

    public update(deltaT: number): void {
        if(this.playersLearnedMovement === true) {
            this.tutorialController.changeState("MonsterAttackState");
        }

        if(this.playerSent === false) {
            let playerManager = this.tutorialController.getGameManager().getPlayerManager();
            let players = playerManager.getAllPlayers();
            if(players.length !== 0) {
                players.forEach((player) => {
                    playerManager.sendClientDialog(player.id, {
                        dialogItems: [
                            {speaker: "Instructor", text: "To move use the WASD key."},
                            {speaker: "Instructor", text: "To perform a basic attack click your left mouse button."},
                            {speaker: "Instructor", text: "To perform a special attack press the space key."}
                        ]
                    });
                });
                this.playerSent = true;

                setTimeout(() => {
                    this.playersLearnedMovement = true;
                }, 10000);
            } 
        } else {
            // Check if the player completed the movements.
        }
    }
    
}
