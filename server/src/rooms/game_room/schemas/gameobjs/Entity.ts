import { Schema, type, ArraySchema } from '@colyseus/schema';
import GameObject from './GameObject';
import Stat from './Stat';
import Effect from '../effects/Effect';
import GameManager from '../../system/GameManager';

export default class Entity extends GameObject {
    @type(Stat) stat: Stat;
    @type([Effect]) effects = new ArraySchema<Effect>();

    constructor(gameManager: GameManager) {
        super(gameManager, 0, 0);
        this.stat = new Stat()
    }

    /** Checks this entity's hp to see if it is dead or not (hp <= 0). */
    public isDead() {
        return this.stat.hp <= 0;
    }
}