import Effect from "../../schemas/effects/Effect";
import CompoundEffect from "../../schemas/effects/combo/CompoundEffect";
import StatEffect from "../../schemas/effects/temp/StatEffect";
import Entity from "../../schemas/gameobjs/Entity";
import GameManager from "../GameManager";
import MathUtil from "../../../../util/MathUtil";

const statCompoundEffectName = "!Entity Stat Compound Effect!";

export default class EffectManager {
    
    private gameManager: GameManager

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager
    }  

    update(deltaT: number): void {
        // loop through gameManager's gameObjects.
        this.gameManager.state.gameObjects.forEach((gameObject, key)=>{
            if(gameObject instanceof Entity){
                EffectManager.updateEffectsOn(gameObject, deltaT);
            }
        })
    }

    /**
     * Adds an effect or an array of effect to an entity.
     * @param entity The entity.
     * @param effect A effect or an array or effects.
     */
    public static addEffectsTo(entity: Entity, effect: Effect | Effect[]) {
        if(Array.isArray(effect)) {
            effect.forEach((e) => {
                entity.effects.push(e);
                e.addToEntity(entity);
            })
        } else {
            entity.effects.push(effect);
            effect.addToEntity(entity);
        }
    }

    /**
     * Adds a StatEffect to the entity. Call this method if you wish to remove the effect later by an key. 
     * Note: This is a helper method that uses CompoundEffect to store the StatEffect.
     * @param entity The entity.
     * @param statEffect The statEffect.
     * @returns A uuid key that is used to reference the added StatEffect.
     */
    public static addStatEffectsTo(entity: Entity, statEffect: StatEffect): string {
        let compoundEffect = EffectManager.getStatCompoundEffectFrom(entity);
        let newUUID = MathUtil.uid();
        compoundEffect.addEffect(newUUID, statEffect);
        return newUUID;
    }

    /**
     * Removes a StatEffect from the entity.
     * Note: This is a helper method that uses CompoundEffect to store the StatEffect.
     * @param entity The entity.
     * @param key The key.
     * @returns A StatEffect or undefined if the key doesn't exist.
     */
    public static removeStatEffectFrom(entity: Entity, key: string): StatEffect | undefined {
        let compoundEffect = EffectManager.getStatCompoundEffectFrom(entity);
        let statEffect = compoundEffect.removeEffect(key) as StatEffect;
        statEffect.reset();
        return statEffect;
    }

    /**
     * Remove the effect object from the entity array. When the effect is removed it is reseted.
     * @param entity The entity to remove the effect from.
     * @param effect The effect.
     */
    public static removeEffectFrom(entity: Entity, effect: Effect) {
        for(let i = entity.effects.length - 1; i >=0; i--) {
            if(entity.effects.at(i) === effect) {
                entity.effects.at(i).removeFromEntity();
                entity.effects.at(i).reset();
                entity.effects.deleteAt(i);
            }
        }
    }

    /**
     * Updates the effects array on an entity. Any completed effects will be automatically removed and reseted.
     * @param entity The entity that should be updated.
     * @param deltaT The time that is used to step forward the effects.
     */
    public static updateEffectsOn(entity: Entity, deltaT: number) {
        for(let i = entity.effects.length - 1; i >= 0; i--) {
            let effect = entity.effects.at(i);
            effect.update(deltaT);
            if(effect.isCompleted()) {
                entity.effects.deleteAt(i);
                effect.removeFromEntity();
                effect.reset();
            }
        }
    }

    /**
     * Returns the compound effect from this entity that is responsible for grouping together StatComponents.
     * If no such compound effect is found it is created, added to the entity, and returned.
     * @param entity The entity.
     * @returns A CompoundEffect.
     */
    private static getStatCompoundEffectFrom(entity: Entity): CompoundEffect {
        for(let i = 0; i < entity.effects.length; i++) {
            let effect = entity.effects.at(i);
            if(effect.getName() === statCompoundEffectName) {
                return effect as CompoundEffect;
            }
        }
        let compoundEffect = new CompoundEffect(statCompoundEffectName);
        entity.effects.unshift(compoundEffect);
        compoundEffect.addToEntity(entity);
        return compoundEffect;
    }
}