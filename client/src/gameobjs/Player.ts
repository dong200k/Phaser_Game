import Entity from "./Entity";

export default class Player extends Entity
{
    private playerState: any;

    constructor(scene:Phaser.Scene,playerState:any) {
        super(scene,0,0,"");
        this.playerState = playerState;
        this.initializeListeners();
    }

    private initializeListeners() {
        
    }

}