import EffectManager from "../../../system/StateManagers/EffectManager";
import Entity from "../../gameobjs/Entity";
import TempEffect from "./TempEffect";

export default class CollisionImmuneEffect extends TempEffect {

    private prevMask?: number
    /**
     * Creates a effect to make entity immune to all collisions.
     * @param isTimed Is this effect timed or not.
     * @param totalTime The time that will pass before this effect is unapplied.
     */
    constructor(isTimed?:boolean, totalTime?:number) {
        super(isTimed, totalTime);
    }

    public applyEffect(entity:Entity): boolean {
        let body = entity.getBody()
        if(body){
            this.prevMask = body.collisionFilter.mask
            body.collisionFilter.mask = 0
        }
        return true;
    }

    protected unapplyEffect(entity:Entity): boolean {
        let body = entity.getBody()
        if(body && this.prevMask){
            body.collisionFilter.mask = this.prevMask
        }
        return true;
    }

    protected onAddToEntity(entity: Entity): void {
        super.onAddToEntity(entity)
        // Remove existing collision immune effects and extend this one 
        entity.effects.forEach(effect=>{
            if(effect instanceof CollisionImmuneEffect && effect !== this){
                this.extendTimeRemaining(effect.getDefaultTimeRemaining())
                EffectManager.removeEffectFrom(entity, effect)
            }
        })
    }
}