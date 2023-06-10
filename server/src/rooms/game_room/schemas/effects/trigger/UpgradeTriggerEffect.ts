import MathUtil from "../../../../../util/MathUtil";
import Cooldown from "../../gameobjs/Cooldown";
import Entity from "../../gameobjs/Entity";
import Effect from "../Effect";
import { type } from '@colyseus/schema';
import TriggerEffect from "./TriggerEffect";
import EffectLogicManager from "../../../system/EffectLogic/EffectLogicManager";

/** TriggerEffect, but with cooldown. Used for Weapon Upgrade and Artifact Upgrade trees logics that are triggered by player input. */
export default class UpgradeTriggerEffect extends TriggerEffect {
    
    /** Cooldown of the effectLogic */
    private cooldown: Cooldown
    /** Id of effectLogic to use */
    private effectLogicId: string
    /** Whether the UpgradeTriggerEffect stacks with other UpgradeTriggerEffects on a single Entity with the same collisionGroup besides a collisionGroup of -1*/
    private doesStack: boolean
    /** holds collision info, if any pair of UpgradeTriggerEffect on a single Entity has doesStack = false,
     * if either collisionGroup === -1 or they are different nothing happens,
     * if their collisionGroups are the same the old one is removed from the Entity,
    */
    private collisionGroup: number

    constructor(effectLogicId: string, cooldown:number=1000, type: string, doesStack: boolean, collisionGroup: number) {
        super(type);
        this.setName("UpgradeTriggerEffect");
        this.setDescription("TriggerEffect but with a cooldown. Used for Weapon/Artifact Upgrade logic that are triggered by player input. ");
        this.cooldown = new Cooldown(cooldown)
        this.effectLogicId = effectLogicId
        this.doesStack = doesStack
        this.collisionGroup = collisionGroup
    }

    /**
     * Updates this UpgradeTriggerEffect's cooldown
     */
    public update(deltaT: number): number {
        this.cooldown.tick(deltaT)
        return 0
    }

    /** Uses the effect referenced by effectLogicId if cooldown is finished */
    public onTrigger(entity: Entity, ...args: any): boolean {
        // cooldown not finished return
        if(!this.cooldown.isFinished) return false

        // restart cooldown and use corresponding effect logic
        this.cooldown.reset()
        return EffectLogicManager.getManager().useEffect(this.effectLogicId, entity, ...args)
    }

    public toString(): string {
       return `${super.toString()}(cooldown finished?: ${this.cooldown.isFinished}, original time: ${this.cooldown.time}, time remaining: ${this.cooldown.remainingTime})`;
    }

    public applyEffect(entity: Entity): boolean {
        throw new Error("Method not implemented.");
    }
}