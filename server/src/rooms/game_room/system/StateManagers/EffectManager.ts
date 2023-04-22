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

    public static addEffectsTo(entity: Entity, effect: Effect | Effect[]) {
        if(Array.isArray(effect)) {
            effect.forEach((e) => {
                entity.effects.push(e);
            })
        } else {
            entity.effects.push(effect);
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
            effect.update(deltaT, entity);
            if(effect.isCompleted()) entity.effects.deleteAt(i);
        }
    }
}