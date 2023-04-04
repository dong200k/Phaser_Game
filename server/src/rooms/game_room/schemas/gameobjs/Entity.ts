import { Schema, type } from '@colyseus/schema';
import GameObject from './GameObject';
import Stat from './Stat';

export default class Entity extends GameObject {
    @type(Stat) stat

    constructor() {
        super(0, 0);
        this.stat = new Stat()
    }
}