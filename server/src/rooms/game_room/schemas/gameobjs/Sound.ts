import { Schema, type } from '@colyseus/schema';

export default class Sound extends Schema {
    /** The sound count. Used to ping the client of a new sound. */
    @type('number') count: number = 0;

    /** The key of the sound. */
    @type('string') key: string = "";

    /** Play's a sound effect on the clinet side. */
    public playSoundEffect(key: string) {
        this.count += 1;
        if(this.count === 100) this.count = 0;
        this.key = key;
    }
}