import EffectLogicManager from "../../../system/EffectLogic/EffectLogicManager";
import Entity from "../../gameobjs/Entity";
import ContinuousEffectUntimed from "./ContinuousEffectUntimed";

/** Extends ContinuousEffectUntimed, it is connected to an effectLogic through effectLogicId with the purpose of
 *  continously calling the effectLogic's effect. This is similar to the old weaponLogic and can be used in artifact/weapon ugprades trees and even 
 *  for monsters.
 */
export default class ContinuousLogicEffect extends ContinuousEffectUntimed{
    
    /** id that references an effectLogic which replaces the old weapon logic */
    effectLogicId: string

    constructor(effectLogicId: string, tickRate: number){
        super(tickRate)
        this.setName("Logic Effect")
        this.setDescription("Type of ContinuousEffecftUntime that repeatedly calls the effectLogic referenced by effectLogicId")
        this.effectLogicId = effectLogicId
    }

    public applyEffect(entity: Entity): boolean {
        try{
            // use effect that effectLogicId references
            return EffectLogicManager.getManager().useEffect(this.effectLogicId, entity)
        }catch(e: any){
            console.log(e?.message)
            return false
        }
    }

}