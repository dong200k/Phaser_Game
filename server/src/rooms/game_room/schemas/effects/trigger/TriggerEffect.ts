import MathUtil from "../../../../../util/MathUtil";
import Entity from "../../gameobjs/Entity";
import Effect from "../Effect";
import { type } from '@colyseus/schema';

/** Special Effect that is triggered by an external call to EffectManager.updateTriggerEffect. For example if a player clicks attack button, or a player presses spacebar, or even when a trap is activated etc. the corresponding onTrigger methods will be called for that Entity*/
export default abstract class TriggerEffect extends Effect {

    /** Type of the trigger. If multiple TriggerEffect is on an entity, all triggers of the same type will have their onTrigger called. */
    public type: string

    constructor(type: string) {
        super();
        this.setName("TriggerEffect");
        this.setDescription("Effect that triggers based on some external event");
        this.type = type
    }

    public abstract onTrigger(entity: Entity, ...args: any): boolean

    public abstract applyEffect(entity: Entity): boolean;
    protected onComplete(): void {}
    protected onAddToEntity(entity: Entity): void {}
    protected onRemoveFromEntity(): void {
        this.setAsCompleted();
    }
    protected onReset(): void {
        //TODO
    }
}