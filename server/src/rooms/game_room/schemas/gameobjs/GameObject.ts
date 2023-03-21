import { Schema, type } from '@colyseus/schema';

export default class GameObject extends Schema {
    @type('number') x;
    @type('number') y;

    constructor(x: number, y: number) {
        super();

        this.x = x;
        this.y = y;
    }
}