import Player from "../../../../schemas/gameobjs/Player";
import StateNode from "../../../StateMachine/StateNode";
import PlayerController from "../PlayerController";

export default class Move extends StateNode {

    private playerController!: PlayerController;
    private player!: Player;

    public onEnter(): void {
        this.playerController = this.getStateMachine<PlayerController>();
        this.player = this.playerController.getPlayer();
        this.player.animation.playAnimation("walk", {loop: true});
    }

    public onExit(): void {
    
    }
    
    public update(deltaT: number): void {
        if(this.player.velocity.x === 0 && this.player.velocity.y === 0) {
            this.playerController.changeState("Idle");
        }
    }
    
}