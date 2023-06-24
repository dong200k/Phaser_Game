

export default abstract class GameObject extends Phaser.GameObjects.Sprite
{
    serverX: number;
    serverY: number;
    serverVisible: boolean;
    serverState: any;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string|Phaser.Textures.Texture) {
        super(scene, x, y, texture);
        this.serverX = x;
        this.serverY = y;
        this.serverVisible = true;
    }

    public setServerState(serverState: any) {
        this.serverState = serverState;
    }
}