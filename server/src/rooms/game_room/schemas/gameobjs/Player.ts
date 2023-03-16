import { Schema, type } from '@colyseus/schema';

export default class Player extends Schema {
    @type('string') name;
    @type('boolean') isOwner;

    constructor(name: string, isOwner: boolean) {
        super();
        this.name = name;
        this.isOwner = isOwner;
    }
}