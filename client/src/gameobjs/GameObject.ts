import type GameObjectState from "../../../server/src/rooms/game_room/schemas/gameobjs/GameObject";

export default abstract class GameObject extends Phaser.GameObjects.Sprite
{
    serverX: number;
    serverY: number;
    serverVisible: boolean;
    gameObjectState: GameObjectState;

    // Adjust the sprites position.
    positionOffsetX: number;
    positionOffsetY: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, gameObjectState: GameObjectState) {
        super(scene, x, y, texture);
        this.serverX = x;
        this.serverY = y;
        this.positionOffsetX = 0;
        this.positionOffsetY = 0;
        this.serverVisible = true;
        this.gameObjectState = gameObjectState;
        
        // Generate animations for this game object.
        scene.anims.createFromAseprite(texture, undefined, this);
    }

    // public setServerState(serverState: GameObjectState) {
    //     this.gameObjectState = serverState;
    // }
}