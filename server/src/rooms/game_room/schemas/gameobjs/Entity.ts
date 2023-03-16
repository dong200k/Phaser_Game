import { Schema, type } from '@colyseus/schema';

export default class Entity extends Schema {
    @type('number') hp;
    @type('number') speed;
    @type('number') armor;
    @type('number') x;
    @type('number') y;
    @type('number') level;

    constructor() {
        super();
        this.hp = 0;
        this.speed = 1;
        this.armor = 0;
        this.x = 0;
        this.y = 0;
        this.level = 1;
    }
}