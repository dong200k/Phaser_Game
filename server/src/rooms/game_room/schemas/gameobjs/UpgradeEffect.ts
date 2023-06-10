import { Schema, type } from '@colyseus/schema';
import Cooldown from './Cooldown';

export default class UpgradeEffect extends Schema {
    // UpgradeEffects are assignable to any ArtifactUpgrade and WeaponUpgrade Tree nodes
    // They replace weapon logics and the effect correlating to effectId will be used whenever the artifact/weapon is used
    @type("string") effectId
    @type('boolean') doesStack // if two UpgradeEffects on one upgrade tree have the same collisionGroup and either one has doesStack === false, old one gets overwritten. Unless collisionGroup === -1 in that case no collision.
    @type("number") collisionGroup
    @type(Cooldown) cooldown

    /**
     * 
     * @param effectId id of upgade effect to use for attack or artifact logic
     * @param ms cooldown of artifact in miliseconds
     */
    constructor(effectId: string, ms: number, doesStack: boolean, collisionGroup = -1){
        super()
        this.effectId = effectId
        this.cooldown = new Cooldown(ms)
        this.doesStack = doesStack
        this.collisionGroup = collisionGroup
    }

    /**
     * Activates the effect correlating to effectId if cooldown isFinished and puts the effect on a cooldown.
     * If the effect does not exist uses the default effect
     */
    useEffect(){
        
    }
}