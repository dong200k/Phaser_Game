import type GameObjectState from "../../../server/src/rooms/game_room/schemas/gameobjs/GameObject";

export default abstract class GameObject extends Phaser.GameObjects.Sprite
{
    serverX: number;
    serverY: number;
    serverVisible: boolean; // controls the visibility of the GameObject
    serverActive: boolean; // controls the visibility and active state of the GameObject
    gameObjectState: GameObjectState;

    // Adjust the sprites position, to match the server's Matter.Body.
    positionOffsetX: number;
    positionOffsetY: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, gameObjectState: GameObjectState) {
        super(scene, x, y, texture);
        this.serverX = x;
        this.serverY = y;
        this.positionOffsetX = 0;
        this.positionOffsetY = 0;
        this.serverVisible = gameObjectState.visible;
        this.serverActive = gameObjectState.active;
        this.gameObjectState = gameObjectState;

        this.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    }

    // public setServerState(serverState: GameObjectState) {
    //     this.gameObjectState = serverState;
    // }
}