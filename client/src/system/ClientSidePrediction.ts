import MatterJS from "matter";
import Player from "../gameobjs/Player";

interface PlayerInput {

}

/**
 * The ClientSidePrediction class will manage the prediction of player1 to match that of the server's.
 * Its main purpose would be movement prediction. Which would consist of the following:
 *  - Movement from WASD
 *  - Movement blocked by obstacles
 *  - Animations from movement
 * 
 * To accomplish this updates on both the client and server would need to be deterministic.
 */
export default class ClientSidePrediction {
    
    private player1: Player;
    private history: MatterJS.World[] = [];
    private historyStartTick: number = 0;

    constructor(player1: Player) {
        MatterJS.Engine
        this.player1 = player1;
    }

    public update(playerMovementData: number[]) {
        // let {playerBody, playerState} = this.getPlayerStateAndBody(playerId)
        
        // if(!playerBody || !playerState) return console.log("player does not exist")

        // //calculate new player velocity
        // let speed = this.player1.getVelocity();
        // let x = 0;
        // let y = 0;
        // if(playerMovementData[0]) y -= 1;
        // if(playerMovementData[1]) y += 1;
        // if(playerMovementData[2]) x -= 1;
        // if(playerMovementData[3]) x += 1;
        // let velocity = MathUtil.getNormalizedSpeed(x, y, speed)
        // Matter.Body.setVelocity(playerBody, velocity);
    }

    public processTick() {

    }

    public serverReconciliation() {

    }
}