import Phaser from "phaser";

export default abstract class Entity extends Phaser.Physics.Matter.Sprite
{
    serverX: number;
    serverY: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string|Phaser.Textures.Texture) {
        super(scene.matter.world, x, y, texture);
        this.setSensor(true);
        this.serverX = x;
        this.serverY = y;
    }

    // public initializeListeners(entityState:any) {
    //     entityState.onChange = (changes:any) => {
    //         // changes.forEach(({field, value}: any) => {
    //         //     switch(field) {
    //         //         case "x": this.x = value; break;
    //         //         case "y": this.y = value; break;
    //         //     }
    //         // })
    //         this.serverX = entityState.x;
    //         this.serverY = entityState.y;
    //     }
    // }
}