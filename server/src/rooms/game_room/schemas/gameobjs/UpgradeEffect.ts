import { Schema, type } from '@colyseus/schema';
import Cooldown from './Cooldown';
import EffectFactory from '../effects/EffectFactory';

/** Holds database effect information */
export default class UpgradeEffect extends Schema {
    @type("string") effectLogicId
    @type('boolean') doesStack
    @type("number") collisionGroup
    @type("number") cooldown
    @type("string") type

    /**
     * Creates a new Database Upgrade Effect from effect information from database/react front-end.
     * @param effectId id of upgade effect to use for attack or artifact logic
     * @param ms cooldown of artifact in miliseconds
     * @param doesStack whether the effect stacks or not
     * @param collisionGroup if the collision group is -1 everything will stack, else if collisionGroup of 2 effects is the same and one effect's doesStack is false older one is replaced.
     * @param type type of effect used to determine whether to use UpgradeTriggerEffect or ContinuousLogicEffect
     */
    constructor(effectLogicId: string, ms: number, doesStack: boolean, collisionGroup = -1, type: string){
        super()
        this.effectLogicId = effectLogicId
        this.cooldown = ms
        this.doesStack = doesStack
        this.collisionGroup = collisionGroup
        this.type = type
    }
}