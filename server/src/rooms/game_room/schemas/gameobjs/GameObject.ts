import { Schema, type } from '@colyseus/schema';

export default class GameObject extends Schema {
    @type('number') x;
    @type('number') y;
    @type('string') id;
    @type('string') ownerId

    constructor(x: number, y: number, ownerId?: string) {
        super();
        this.id = Math.floor(Math.random()* 1000000).toString()
        this.x = x;
        this.y = y;
        this.ownerId = ownerId
    }
}