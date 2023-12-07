import FountainState from "../../../server/src/rooms/game_room/schemas/gameobjs/Fountain";
import GameObject from "./GameObject";
export default class Fountain extends GameObject
{
    
    private fountainState: FountainState;
    /** Is the walking animation playing or not. */
    walking: boolean = false;

    // static count: number = 0;

    constructor(scene:Phaser.Scene, fountainState: FountainState) {
        super(scene, fountainState.x, fountainState.y, "wood", fountainState);
        this.fountainState = fountainState
        
        scene.anims.createFromAseprite("healing_fountain", undefined, this);
        this.play({key:"play", repeat: -1});
    }
}