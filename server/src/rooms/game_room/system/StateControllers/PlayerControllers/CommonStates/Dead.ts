import Player from "../../../../schemas/gameobjs/Player";
import StateNode from "../../../StateMachine/StateNode";
import PlayerController from "../PlayerController";


export default class Dead extends StateNode {

    private playerController!: PlayerController;
    private player!: Player;

    public onEnter(): void {
        this.playerController = this.getStateMachine<PlayerController>();
        this.player = this.playerController.getPlayer();
        this.player.animation.playAnimation("death");
        this.player.canMove = false;
    }

    public onExit(): void {
        this.player.canMove = true;
    }

    public update(deltaT: number): void {
        
    }
    
}