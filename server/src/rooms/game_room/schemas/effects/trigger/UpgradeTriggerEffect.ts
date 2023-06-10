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

    constructor(effectLogicId: string, cooldown:number=1000, type: string) {
        super(type);
        this.setName("UpgradeTriggerEffect");
        this.setDescription("TriggerEffect but with a cooldown. Used for Weapon/Artifact Upgrade logic that are triggered by player input. ");
        this.cooldown = new Cooldown(cooldown)
        this.effectLogicId = effectLogicId
    }

    /**
     * Updates this UpgradeTriggerEffect's cooldown
     */
    public update(deltaT: number): number {
        this.cooldown.tick(deltaT)
        return 0
    }

    /** Uses the effect referenced by effectLogicId if cooldown is finished*/
    public onTrigger(entity: Entity, ...args: any): boolean {
        if(!this.cooldown.isFinished) return false
        return EffectLogicManager.getManager().useEffect(this.effectLogicId, entity, ...args)
    }

    public toString(): string {
       return `${super.toString()}(cooldown finished?: ${this.cooldown.isFinished}, original time: ${this.cooldown.time}, time remaining: ${this.cooldown.remainingTime})`;
    }

    public applyEffect(entity: Entity): boolean {
        throw new Error("Method not implemented.");
    }
}