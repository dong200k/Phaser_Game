import { Schema, type } from '@colyseus/schema';

export default class Animation extends Schema {
    @type('number') count: number = 0;
    @type('string') key: string = "";
    @type('boolean') loop: boolean = false;

    public playAnimation(key: string, loop?: boolean) {
        this.count += 1;
        if(this.count === 1000) this.count = 0;
        this.key = key;
        if(loop !== undefined) this.loop = loop;
    }
}