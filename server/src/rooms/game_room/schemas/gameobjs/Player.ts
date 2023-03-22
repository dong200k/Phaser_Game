import { Schema, type } from '@colyseus/schema';
import Entity from './Entity';

export default class Player extends Entity {
    @type('string') name;
    @type('string') role;

    constructor(name: string, role?: string) {
        super();
        this.name = name;
        this.role = role? role: "ranger"
    }
}