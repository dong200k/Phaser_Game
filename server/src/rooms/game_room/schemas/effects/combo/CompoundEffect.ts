import Entity from "../../gameobjs/Entity";
import Effect from "../Effect";
import { type, MapSchema, ArraySchema, Schema } from "@colyseus/schema";

export class EffectGroup extends Schema {
    @type([Effect]) effects = new ArraySchema<Effect>();
}

/**
 * CompoundEffects are used if you want to group together to organize them better. 
 * It also provides functionaliy to manage these grouped effects.
 */
export default class CompoundEffect extends Effect {
    
    @type({ map: EffectGroup}) effectGroups = new MapSchema<EffectGroup>();

    constructor(name: string) {
        super();
        this.name = name;
    }

    public update(deltaT: number, entity?: Entity | undefined): number {
        this.effectGroups.forEach((effectGroup) => {
            effectGroup.effects.forEach((effect) => {
                effect.update(deltaT, entity);
            })
        })
        return 0;
    }

    public addEffect(key:string, effect:Effect) {
        if(!this.effectGroups.has(key)) this.effectGroups.set(key, new EffectGroup());
        this.effectGroups.get(key)?.effects.push(effect);
    }

}

