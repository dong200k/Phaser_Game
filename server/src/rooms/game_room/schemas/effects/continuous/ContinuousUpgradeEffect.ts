import EffectLogicManager from "../../../system/EffectLogic/EffectLogicManager";
import Entity from "../../gameobjs/Entity";
import ContinuousEffectUntimed from "./ContinuousEffectUntimed";

/** Extends ContinuousEffectUntimed, it is connected to an effectLogic through effectLogicId with the purpose of
 *  continously calling the effectLogic's effect. This is similar to the old weaponLogic and can be used in artifact/weapon ugprades trees and even 
 *  for monsters.
 */
export default class ContinuousUpgradeEffect extends ContinuousEffectUntimed{
    
    /** id that references an effectLogic which replaces the old weapon logic */
    effectLogicId: string
    /** Whether the UpgradeTriggerEffect stacks with other UpgradeTriggerEffects on a single Entity with the same collisionGroup besides a collisionGroup of -1*/
    doesStack: boolean
    /** holds collision info, if any pair of UpgradeTriggerEffect on a single Entity has doesStack = false,
     * if either collisionGroup === -1 or they are different nothing happens,
     * if their collisionGroups are the same the old one is removed from the Entity*/
    collisionGroup: number

    constructor(effectLogicId: string, cooldown: number, type: string, doesStack: boolean, collisionGroup: number){
        super(cooldown)
        this.setName("Continuous Upgrade Effect")
        this.setDescription("Type of ContinuousEffecftUntime that repeatedly calls the effectLogic referenced by effectLogicId")
        this.effectLogicId = effectLogicId
        this.doesStack = doesStack
        this.collisionGroup = collisionGroup
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