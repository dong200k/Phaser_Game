import StateNode from "../../StateMachine/StateNode";
import Player from "../../../schemas/gameobjs/Player";
import PlayerController from "./PlayerController";


export default class Dead extends StateNode {

    private player!: Player;

    public onEnter(): void {
        this.player = this.getStateMachine<PlayerController>().getPlayer();
        this.player.gameManager.getPlayerManager().disablePlayer(this.player);
        // console.log(`Player ${this.player.name} is dead.`);
    }

    public onExit(): void {
        this.player.gameManager.getPlayerManager().enablePlayer(this.player);
    }

    public update(deltaT: number): void {
        
    }
    
}