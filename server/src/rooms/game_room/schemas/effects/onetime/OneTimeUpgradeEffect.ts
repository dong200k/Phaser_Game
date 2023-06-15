import EffectLogicManager from "../../../system/EffectLogic/EffectLogicManager";
import Entity from "../../gameobjs/Entity";
import OneTimeEffect from "./OneTimeEffect";

export default class OneTimeUpgradeEffect extends OneTimeEffect {

    /** Id of effectLogic to use */
    private effectLogicId: string
    /** Whether the UpgradeTriggerEffect stacks with other UpgradeTriggerEffects on a single Entity with the same collisionGroup besides a collisionGroup of -1*/
    doesStack: boolean
    /** holds collision info, if any pair of UpgradeTriggerEffect on a single Entity has doesStack = false,
     * if either collisionGroup === -1 or they are different nothing happens,
     * if their collisionGroups are the same the old one is removed from the Entity */
    collisionGroup: number

    constructor(effectLogicId: string, cooldown:number=1000, doesStack: boolean, collisionGroup: number) {
        super()
        this.setName("OneTimeUpgradeEffect");
        this.setDescription("Immediately uses the effect logic referenced by effectLogicId");
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

    public toString(): string {
        return `${super.toString()}(effectLogicId: ${this.effectLogicId}, does stack?: ${this.doesStack}, collisionGroup: ${this.collisionGroup})`;
    }
}