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
                for(let i = gameObject.effects.length - 1; i >= 0; i--) {
                    let effect = gameObject.effects.at(i);
                    effect.update(deltaT, gameObject);
                    if(effect.isCompleted()) gameObject.effects.deleteAt(i);
                }
            }
        })
    }

    public addEffectsTo(entity: Entity, effect: Effect) {
        entity.effects.push(effect);
    }
}