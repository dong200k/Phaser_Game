import { Schema, type } from '@colyseus/schema';

interface AnimationConfig {
    /** Is the animation looping or not. */
    loop?: boolean;
    /** The total time it will take to go through all frames in an animation. (in seconds)
     * This will change the frame rate of the image on the client side. 
     * If the duration is -1 the default 24 frames per second will be used.
     */
    duration?: number;
    /** flips the sprite horizontally. */
    flip?: boolean;
}

export default class Animation extends Schema {
    /** Used to tell if there is an new animation to be played. Changed automatically.*/
    @type('number') count: number = 0;

    /** The key of the animation that should be played. */
    @type('string') key: string = "";

    /** Is the animation looping or not. */
    @type('boolean') loop: boolean = false;

    /** The total time it will take to go through all frames in an animation(in seconds).
     * This will change the frame rate of the image on the client side. 
     * If the duration is -1 the default 24 frames per second will be used.
     */
    @type('number') duration: number = -1;

    /** flips the sprite horizontally. */
    @type('boolean') flip: boolean = false;

    /** Lets the client know if the filp should be set to the flip field. */
    @type('boolean') filpOverride: boolean = false;

    /**
     * Plays the animation with the specified key.
     * This is used if you want an gameobject to play an animation on the client side.
     * @param key The key of the animation.
     * @param loop If the animation loops or not.
     */
    public playAnimation(key: string, config?: AnimationConfig) {
        this.count += 1;
        if(this.count === 100) this.count = 0;
        this.key = key;
        this.loop = config?.loop ?? false;
        this.duration = config?.duration ?? -1;
        if(config && config.flip !== undefined) {
            this.flip = config.flip;
            this.filpOverride = true;
        } else {
            this.filpOverride = false; 
        }
    }
}