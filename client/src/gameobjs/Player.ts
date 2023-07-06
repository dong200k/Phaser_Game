import Entity from "./Entity";
import type PlayerState from "../../../server/src/rooms/game_room/schemas/gameobjs/Player";

export default class Player extends Entity
{
    private playerState: PlayerState;

    constructor(scene:Phaser.Scene,playerState:PlayerState) {
        super(scene, playerState.x, playerState.y, playerState.role, playerState);
        this.playerState = playerState;
    }

    // /**Add listeners to connect to the server's player*/
    // public initializeListeners(playerState:any) {
    //     playerState.onChange = (changes:any) => {
    //         changes.forEach(({field, value}: any) => {
    //             switch(field) {
    //                 case "x": this.x = value; break;
    //                 case "y": this.y = value; break;
    //             }
    //         })
    //     }
    // }

    public getPlayerState() {
        return this.playerState;
    }

}