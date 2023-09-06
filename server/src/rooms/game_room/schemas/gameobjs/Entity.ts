import { Schema, type, ArraySchema } from '@colyseus/schema';
import GameObject from './GameObject';
import Stat from './Stat';
import Effect from '../effects/Effect';
import GameManager from '../../system/GameManager';

export default class Entity extends GameObject {
    @type(Stat) stat: Stat;
    // Note: Using Schema will break effects. Causing projectiles to spawn faster over time.
    //@type([Effect]) effects = new ArraySchema<Effect>();
    effects = new Array<Effect>();

    /** The last entity that damaged this entity. 
     * Can be used to assign xp to the player that killed the monster. */ 
    private lastToDamage?: string;

    /** Flag for if this entity can move. */
    @type("boolean") canMove: boolean = true;

    projectileSpawnOffsetX: number = 0;
    projectileSpawnOffsetY: number = 0;

    constructor(gameManager: GameManager) {
        super(gameManager, 0, 0);
        this.stat = new Stat()
    }

    /** Checks this entity's hp to see if it is dead or not (hp <= 0). */
    public isDead() {
        return this.stat.hp <= 0;
    }

    /**
     * Sets the id of the entity that has last damaged this entity.
     * @param entityId The id of the entity that damaged this entity.
     */
    public setLastToDamage(entityId: string) {
        this.lastToDamage = entityId;
    }

    /**
     * Gets the entity that last damaged this entity.
     * @returns EntityId or undefined.
     */
    public getLastToDamage() {
        return this.lastToDamage;
    }
}