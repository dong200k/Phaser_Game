import Entity from "../../gameobjs/Entity";
import Effect from "../Effect";
import { type, MapSchema, ArraySchema, Schema } from "@colyseus/schema";

/**
 * CompoundEffects are used if you want to group together effects in a map with a string key.
 * It also provides functionaliy to manage these grouped effects.
 */
export default class CompoundEffect extends Effect {
    
    /** The effects that are managed by this CompoundEffect. */
    @type({ map: Effect}) effects = new MapSchema<Effect>();

    constructor(name: string) {
        super();
        this.setName(name);
    }

    public update(deltaT: number): number {
        this.effects.forEach((effect) => {
            effect.update(deltaT);
        })
        return 0;
    }

    public addToEntity(entityOwner: Entity) {
        super.addToEntity(entityOwner);
        this.effects.forEach((effect) => {
            effect.addToEntity(entityOwner);
        })
    }

    public removeFromEntity() {
        if(this.getEntity()) {
            this.effects.forEach((effect) => {
                effect.removeFromEntity();
            })
            super.removeFromEntity();
        }
    }

    /**
     * Adds an effect to the compound effect with a specified key and effect.
     * If an effect with the same key already exist, then remove the previous effect. The previous effect
     * will have removeFromEntity() called on it.
     * @param key The key; used to query the effect later on.
     * @param effect The effect.
     */
    public addEffect(key:string, effect:Effect): void {
        let previousEffect = this.effects.get(key);
        if(previousEffect) previousEffect.removeFromEntity();
        this.effects.set(key, effect);
        let entity = this.getEntity();
        if(entity) effect.addToEntity(entity);
    }

    /**
     * Removes an effect from this CompoundEffect. The removed effect will have removeFromEntity()
     * called on it.
     * @param key The key.
     */
    public removeEffect(key:string): Effect | undefined {
        let effect = this.effects.get(key);
        if(effect) effect.removeFromEntity();
        this.effects.delete(key);
        return effect;
    }

    public applyEffect(entity: Entity): boolean {return false;}
    protected onComplete(): void {}
    protected onAddToEntity(entity: Entity): void {}
    protected onRemoveFromEntity(): void {}
    protected onReset(): void {
        //TODO
    }
}

