import Phaser from "phaser";

export default abstract class Entity extends Phaser.GameObjects.Sprite
{

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, "");
    }

}