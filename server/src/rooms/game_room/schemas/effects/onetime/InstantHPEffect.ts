import Entity from "../../gameobjs/Entity";
import OneTimeEffect from "./OneTimeEffect";
import { type } from '@colyseus/schema';

/**
 * This effect will update the entity's hp by the specified amount on the next
 * effectManager update. The entity's hp will not go below 0 and above maxHp.
 */
export default class InstantHPEffect extends OneTimeEffect {

    @type("number") private hp: number = 10;

    /** The entity that created this effect. (The entity that did the damage.) */
    private originEntityId?: string; 

    constructor(hp?: number, originEntityId?: string) {
        super();
        this.setName("InstantHealEffect");
        this.setDescription("Immediatly grants an entity some hp");
        if(hp !== undefined) this.hp = hp;
        this.originEntityId = originEntityId;
    }

    public applyEffect(entity: Entity): boolean {
        // Basic hp inc. Should add checks for max hp.
        entity.stat.hp += Math.round((this.hp + Number.EPSILON) *10)/10;

        if(this.originEntityId !== undefined && this.hp < 0) {
            entity.setLastToDamage(this.originEntityId);
        }

        // Clamp the entity's hp between 0 and maxHp.
        if(entity.stat.hp < 0) {
            entity.stat.hp = 0;
        } else if(entity.stat.hp > entity.stat.maxHp) {
            entity.stat.hp = entity.stat.maxHp;
        }

        return true;
    }

    public toString(): string {
        return `${super.toString()}(hp: ${this.hp})`;
    }

    /**
     * Sets the hp that will be applied to the entity.
     * @param hp The hp.
     */
    public setHp(hp: number) {
        this.hp = hp;
    }

    public getHp() {
        return this.hp;
    }
}