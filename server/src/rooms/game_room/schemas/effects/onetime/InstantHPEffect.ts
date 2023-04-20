import Entity from "../../gameobjs/Entity";
import OneTimeEffect from "./OneTimeEffect";
import { type } from '@colyseus/schema';

export default class InstantHPEffect extends OneTimeEffect {

    @type("number") hp: number = 10;

    constructor(hp?: number) {
        super();
        this.name = "InstantHealEffect";
        this.description = "Immediatly grants an entity some hp";
        if(hp !== undefined) this.hp = hp;
    }

    public applyEffect(entity?: Entity | undefined): boolean {
        if(entity) {
            // Basic hp inc. Should add checks for max hp.
            entity.stat.hp += this.hp;
            return true;
        } 
        return false;
    }

    public toString(): string {
        return `${super.toString()}(hp: ${this.hp})`;
    }
}