import Entity from "./Entity";

export default class Player extends Entity
{
    private playerState: any;

    constructor(scene:Phaser.Scene,playerState:any) {
        super(scene,0,0,"demo_hero");
        this.playerState = playerState;
    }

    /**Add listeners to connect to the server's player*/
    public initializeListeners(playerState:any) {
        playerState.onChange = (changes:any) => {
            changes.forEach((change:any) => {
                let field = change.field as string;
                let value = change.value;
                switch(field) {
                    case "x": this.x = value; break;
                    case "y": this.y = value; break;
                }
            })
        }
    }

}