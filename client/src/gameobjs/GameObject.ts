

export default abstract class GameObject extends Phaser.Physics.Matter.Sprite
{
    serverX: number;
    serverY: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string|Phaser.Textures.Texture) {
        super(scene.matter.world, x, y, texture);
        this.setSensor(true);
        this.serverX = x;
        this.serverY = y;
    }
}