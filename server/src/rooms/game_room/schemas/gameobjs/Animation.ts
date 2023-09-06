import { Schema, type } from '@colyseus/schema';

export default class Animation extends Schema {
    /** Used to tell if there is an new animation to be played. Changed automatically.*/
    @type('number') count: number = 0;

    /** The key of the animation that should be played. */
    @type('string') key: string = "";

    /** Is the animation looping or not. */
    @type('boolean') loop: boolean = false;

    /**
     * Plays the animation with the specified key.
     * This is used if you want an gameobject to play an animation on the client side.
     * @param key The key of the animation.
     * @param loop If the animation loops or not.
     */
    public playAnimation(key: string, loop?: boolean) {
        this.count += 1;
        if(this.count === 100) this.count = 0;
        this.key = key;
        if(loop !== undefined) this.loop = loop;
    }
}