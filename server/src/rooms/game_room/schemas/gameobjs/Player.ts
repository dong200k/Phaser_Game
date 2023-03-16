import { Schema, type } from '@colyseus/schema';
import Entity from './Entity';

export default class Player extends Entity {
    @type('string') name;
    

    constructor(name: string, isOwner: boolean) {
        super();
        this.name = name;
    }
}