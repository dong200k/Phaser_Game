import GameObject from "./GameObject";

export default class Tile extends GameObject
{

    constructor(scene:Phaser.Scene, tileState: any) {
        super(scene, tileState.x, tileState.y, "", tileState);
        this.width = 16;
        this.height = 16;
    }

}