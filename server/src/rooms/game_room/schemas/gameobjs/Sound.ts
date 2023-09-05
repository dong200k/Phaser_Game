import { Schema, type } from '@colyseus/schema';

export default class Sound extends Schema {
    @type('number') count: number = 0;
    @type('string') key: string = "";

    public playSoundEffect(key: string) {
        this.count += 1;
        if(this.count === 1000) this.count = 0;
        this.key = key;
    }
}