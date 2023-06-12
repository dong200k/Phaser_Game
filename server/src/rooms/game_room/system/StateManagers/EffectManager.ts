import Effect from "../../schemas/effects/Effect";
import CompoundEffect from "../../schemas/effects/combo/CompoundEffect";
import StatEffect from "../../schemas/effects/temp/StatEffect";
import Entity from "../../schemas/gameobjs/Entity";
import GameManager from "../GameManager";
import MathUtil from "../../../../util/MathUtil";
import TriggerEffect from "../../schemas/effects/trigger/TriggerEffect";
import Player from "../../schemas/gameobjs/Player";
import UpgradeTriggerEffect from "../../schemas/effects/trigger/UpgradeTriggerEffect";
import ContinuousUpgradeEffect from "../../schemas/effects/continuous/ContinuousUpgradeEffect";

const statCompoundEffectName = "!Entity Stat Compound Effect!";

export default class EffectManager {
    
    private gameManager: GameManager

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager
    }   

    /**
     * Updates this EffectManager, which updates all effects on entities.
     * @param deltaT The time that passed in seconds.
     */
    public update(deltaT: number): void {
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
     * @param deltaT The time that is used to step forward the effects in seconds.
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
     * uses all the TriggerEffects in the effects array on an entity with the corresponding type. 
     * @param entity The entity that should be updated.
     * @param args Any extra args/data needed
     */
    public static useTriggerEffectsOn(type: string, entity: Entity, ...args: any) {
        entity.effects.map(effect=>{
            if(effect instanceof TriggerEffect && effect.type === type){
                effect.onTrigger(entity, ...args)
            }
        })
    }

    /**
     * Adds an UpgradeTriggerEffect | ContinuousUpgradeEffect or Array<UpgradeTriggerEffect | ContinuousUpgradeEffect> to the entity
     * Removes all UpgradeTriggerEffect | ContinuousUpgradeEffect on the entity that collides with the effect to add.
     * Note: if effect is an Array, effects will be applied starting from the front of the array.
     * @param entity The entity.
     * @param effect A effect or an array or effects.
     */
    public static addUpgradeEffectsTo(entity: Entity, effect: UpgradeTriggerEffect | ContinuousUpgradeEffect | Array<UpgradeTriggerEffect | ContinuousUpgradeEffect>) {
        /**
         * Takes in 2 effects and checks if there is a collision between them and only one of them can exist on an Entity at once.
         * If either effect is not an UpgradeTriggerEffect | ContinuousUgpradeEffect there is no collision
         * If either effect has a collision group of -1 there is no collision and both can exist.
         * If they both have the same collision group then if either does stack is false then there is a collision
         * else no collision
         * @param effect1
         * @param effect2 
         * @returns true if there is a collision else false
         */
        function collides(effect1: Effect, effect2: Effect){
            if((effect1 instanceof UpgradeTriggerEffect || effect1 instanceof ContinuousUpgradeEffect) && (effect2 instanceof UpgradeTriggerEffect || effect2 instanceof ContinuousUpgradeEffect)){
                return effect1.collisionGroup === effect2.collisionGroup 
                && effect1.collisionGroup !== -1 && (!effect1.doesStack || !effect2.doesStack)
            }

            return false
        }

        /** Adds one upgrade effect to the entity and replaces any upgrade effect that collides with this effect*/
        function addOneUpgradeEffect(effect: UpgradeTriggerEffect | ContinuousUpgradeEffect){
            // remove old effects the collide with new effect
            entity.effects.forEach(oldEffect=>{
                if(collides(oldEffect, effect)){
                    EffectManager.removeEffectFrom(entity, oldEffect)
                } 
            })
            
            // add new effect
            EffectManager.addEffectsTo(entity, effect)
        }
        
        if(Array.isArray(effect)) {
            effect.forEach((e) => {
                addOneUpgradeEffect(e)
            })
        } else {
            addOneUpgradeEffect(effect)
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