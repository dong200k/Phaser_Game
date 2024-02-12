import Entity from "./Entity";
import type PlayerState from "../../../server/src/rooms/game_room/schemas/gameobjs/Player";

export default class Player extends Entity
{
    private playerState: PlayerState;
    running: boolean;
    serverLevel: number;
    snapCameraToPlayerIndicator: boolean;

    constructor(scene:Phaser.Scene,playerState:PlayerState) {
        super(scene, playerState.x, playerState.y, playerState.role, playerState);
        this.playerState = playerState;
        this.running = false;
        this.serverLevel = 1;
        // Generate animations for this player.
        scene.anims.createFromAseprite(playerState.role, undefined, this);
        this.snapCameraToPlayerIndicator = playerState.snapCameraToPlayerIndicator;
    }

    // /**Add listeners to connect to the server's player*/
    // public initializeListeners(playerState:any) {
    //     playerState.onChange = (changes:any) => {
    //         changes.forEach(({field, value}: any) => {
    //             switch(field) {
    //                 case "x": this.x = value; break;
    //                 case "y": this.y = value; break;
    //             }
    //         })
    //     }
    // }

    public getPlayerState() {
        return this.playerState;
    }

    public setFlip(x: boolean, y: boolean): this {
        super.setFlip(x, y);

        if(x === false) {
            this.positionOffsetX = 5;
            this.positionOffsetY = -10;
        } else {
            this.positionOffsetX = -5;
            this.positionOffsetY = -10;
        }

        return this;
    }

    /**
     * @description The animation only plays when the player is not dead.
     */
    public play(key: string | Phaser.Animations.Animation | Phaser.Types.Animations.PlayAnimationConfig, ignoreIfPlaying?: boolean | undefined): this {
        if(this.playerState.playerController.stateName !== "Dead")
            super.play(key, ignoreIfPlaying);
        return this;
    }

    /**
     * The same as play. But the animation will run even if the player is dead.
     * Used to play the player death animation.
     */
    public forcePlay(key: string | Phaser.Animations.Animation | Phaser.Types.Animations.PlayAnimationConfig, ignoreIfPlaying?: boolean | undefined): this {
        return super.play(key, ignoreIfPlaying);
    }

}