import Entity from "../../gameobjs/Entity";
import OneTimeEffect from "./OneTimeEffect";
import { type } from '@colyseus/schema';

export default class InstantHPEffect extends OneTimeEffect {

    @type("number") private hp: number = 10;

    constructor(hp?: number) {
        super();
        this.setName("InstantHealEffect");
        this.setDescription("Immediatly grants an entity some hp");
        if(hp !== undefined) this.hp = hp;
    }

    public applyEffect(entity: Entity): boolean {
        // Basic hp inc. Should add checks for max hp.
        entity.stat.hp += this.hp;
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