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

    /** Transparency of the gameobject */
    alphaValue: number;
    
    sprite?: Phaser.GameObjects.Sprite

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, gameObjectState: GameObjectState) {
        super(scene, x, y, texture);
        this.serverX = x;
        this.serverY = y;
        this.positionOffsetX = 0;
        this.positionOffsetY = 0;
        this.serverVisible = gameObjectState.visible;
        this.serverActive = gameObjectState.active;
        this.gameObjectState = gameObjectState;
        this.alphaValue = gameObjectState.alpha

        this.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        // this.scale = gameObjectState.width/this.width
        // this.setScale(gameObjectState.width/this.width, gameObjectState.height/this.height)
        // this.setScale(1, 1)  
        // this.setDisplaySize(gameObjectState.width, gameObjectState.height)
        
        // let obj = gameObjectState as any
        // console.log("client obj info: ", obj.type, obj.name, obj.monsterName, obj.sprite, this.width, this.height)
        // console.log("gameObjectState width height:", gameObjectState.width, gameObjectState.height)
    }

    // public returnSprite(){
    //     this.sprite = undefined
    //     return this.sprite
    // }

    // public setSprite(sprite: Phaser.GameObjects.Sprite){
        
    // }

    // public setServerState(serverState: GameObjectState) {
    //     this.gameObjectState = serverState;
    // }
}