import ForgeState from "../../../server/src/rooms/game_room/schemas/gameobjs/Forge";
import GameObject from "./GameObject";

export default class Forge extends GameObject
{
    private forgeState: ForgeState;
    /** Is the walking animation playing or not. */
    walking: boolean = false;

    // static count: number = 0;

    constructor(scene:Phaser.Scene, forgeState: ForgeState) {
        super(scene, forgeState.x, forgeState.y, "wood", forgeState);
        this.forgeState = forgeState;
        scene.anims.createFromAseprite("upgrade_forge", undefined, this);
        this.play({key: "play", repeat: -1});
    }
}