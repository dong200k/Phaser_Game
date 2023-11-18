import type ChestState from "../../../server/src/rooms/game_room/schemas/gameobjs/chest/Chest";
import GameObject from "./GameObject";

export default class Chest extends GameObject
{
    private chestState: ChestState;
    /** Is the walking animation playing or not. */
    walking: boolean = false;

    // static count: number = 0;

    constructor(scene:Phaser.Scene, chestState:ChestState) {
        super(scene, chestState.x, chestState.y, chestState.rarity, chestState);
        this.chestState = chestState;
        let animationKey = "wood_chest";
        switch(chestState.rarity) {
            case "wood": animationKey = "wood_chest"; break;
            case "iron": animationKey = "iron_chest"; break;
            case "gold": animationKey = "gold_chest"; break;
        }
        // Generate animations for this chest.
        scene.anims.createFromAseprite(animationKey, undefined, this);
    }

}