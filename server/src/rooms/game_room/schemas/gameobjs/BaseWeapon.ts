import { Schema, type } from '@colyseus/schema';
import Stat from './Stat';

export default class BaseWeapon extends Schema {
    @type(Stat) stat
    @type("string") name
    @type("string") description

    constructor(name: string, description: string) {
        super(0, 0);
        this.stat = new Stat()
        this.name = name
        this.description = description
    }
}