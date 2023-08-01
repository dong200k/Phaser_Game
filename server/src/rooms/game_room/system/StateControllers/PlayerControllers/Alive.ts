import StateNode from "../../StateMachine/StateNode";
import Player from "../../../schemas/gameobjs/Player";
import PlayerController from "./PlayerController";

/**
 * The player alive state is the main state the player will be in while playing the game.
 * This state will keep track of the player's hp and change the player state to dead 
 * when the player's hp reaches zero.
 */
export default class Alive extends StateNode {

    private player!: Player;

    public onEnter(): void {
        this.player = this.getStateMachine<PlayerController>().getPlayer();
    }

    public onExit(): void {

    }

    public update(deltaT: number): void {
        if(this.player.stat.hp <= 0) {
            this.getStateMachine().changeState("Dead");
        }
    }
    
}