import { Schema, type } from '@colyseus/schema';

export default class Player extends Schema {
    @type('number') level;
    @type('string') name;
    @type('boolean') isLeader;
    @type('boolean') isReady;
    @type('number') role;
    @type('number') pet;

    constructor(name: string, isLeader: boolean, level: number, role?: number, pet?: number) {
        super();
        this.level = level;
        this.name = name;
        this.isLeader = isLeader;
        this.isReady = false;
        this.role = role ?? 0;
        this.pet = pet ?? 0;
    }
}