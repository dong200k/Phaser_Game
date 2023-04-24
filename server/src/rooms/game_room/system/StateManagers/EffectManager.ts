import Effect from "../../schemas/effects/Effect";
import Entity from "../../schemas/gameobjs/Entity";
import GameManager from "../GameManager";

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
     * Remove the effect object from the entity array.
     * @param entity The entity to remove the effect from.
     * @param effect The effect.
     */
    public static removeEffectFrom(entity: Entity, effect: Effect) {
        for(let i = entity.effects.length - 1; i >=0; i--) {
            if(entity.effects.at(i) === effect) {
                entity.effects.at(i).removeFromEntity();
                entity.effects.deleteAt(i);
            }
        }
    }

    /**
     * Updates the effects array on an entity. Any completed effects will be automatically removed.
     * @param entity The entity that should be updated.
     * @param deltaT The time that is used to step forward the effects.
     */
    public static updateEffectsOn(entity: Entity, deltaT: number) {
        for(let i = entity.effects.length - 1; i >= 0; i--) {
            let effect = entity.effects.at(i);
            effect.update(deltaT);
            if(effect.isCompleted()) entity.effects.deleteAt(i);
        }
    }
}