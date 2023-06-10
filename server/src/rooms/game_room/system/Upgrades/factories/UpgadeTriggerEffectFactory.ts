import UpgradeTriggerEffect from "../../../schemas/effects/trigger/UpgradeTriggerEffect";
import UpgradeEffect from "../../../schemas/gameobjs/UpgradeEffect";

export default class UpgradeTriggerEffectFactory{
    /**
     * Creates a new UpgradeTriggerEffect with the effectLogic corresponding to effectLogicId
     * @param effectLogicId effect's logic to use, must be initialized in EffectLogicManager
     * @param ms cooldown in miliseconds
     * @param doesStack if two UpgradeEffects on one upgrade tree have the same collisionGroup and either one has doesStack === false, old one gets overwritten. Unless collisionGroup === -1 in that case no collision.
     * @param collisionGroup number that represents collision group, not the same collision logic as CollisionManager read does stack param for how it works.
     * @param type string that represents the type of the TriggerEffect. 
     * @returns 
     */
    static createUpgradeEffect(effectLogicId: string, ms: number = 1000, doesStack: boolean = true, collisionGroup: number = -1, type=""){
        return new UpgradeTriggerEffect(effectLogicId, ms, type)
    }
}