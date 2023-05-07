import Entity from "./Entity";
export default class Player extends Entity
{
    private playerState: any;

    constructor(scene:Phaser.Scene,playerState:any) {
        super(scene, playerState.x, playerState.y, "demo_hero");
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