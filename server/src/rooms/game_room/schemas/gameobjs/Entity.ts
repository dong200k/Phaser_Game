import { Schema, type, ArraySchema } from '@colyseus/schema';
import GameObject from './GameObject';
import Stat from './Stat';
import Effect from '../effects/Effect';

export default class Entity extends GameObject {
    @type(Stat) stat
    @type([Effect]) effects = new ArraySchema<Effect>();

    constructor() {
        super(0, 0);
        this.stat = new Stat()
    }
}