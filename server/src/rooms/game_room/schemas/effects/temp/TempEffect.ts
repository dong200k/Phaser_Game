import Entity from "../../gameobjs/Entity";
import Effect from "../Effect";
import { type } from "@colyseus/schema";

type EffectStateType = "Haven't Applied" | "Currently Applying" | "Done Applying And Reverted";

export default class TempEffect extends Effect {
    /** Timed effect are ended by a timer. Non timed effect are ended manually. */
    @type("boolean") isTimed;
    /** The time that is remaining before this effect ends. */
    @type("number") timeRemaining;
    /** The state the effect is in. Either the effect hasn't been applied, it is currently being applied, or it has finished applied and is reverted. */
    @type("string") effectState: EffectStateType = "Haven't Applied";

    appliedEntity: Entity | undefined;

    /**
     * Creates a temp effect.
     * @param isTimed Is this effect timed or not. Non timed effects needs to be reverted manually, by calling setAsCompleted().
     * @param totalTime The time before this effect automatically reverts. Must be an positive integer (decimals will be rounded).   
     */
    constructor(isTimed:boolean=true, totalTime:number=5) {
        super();
        this.isTimed = isTimed;
        this.timeRemaining = Math.max(1, Math.round(totalTime));
    }

    public update(deltaT: number, entity?: Entity | undefined): number {
        // Apply the effect once in the beginning.
        if(this.effectState === "Haven't Applied") {
            if(this.applyEffect(entity)) {
                this.effectState = "Currently Applying";
                this.appliedEntity = entity;
            }
        }
        // Timed effects will automatically end when timeRemaining reaches zero.
        if(this.effectState === "Currently Applying" && this.isTimed) {
            this.timeRemaining -= deltaT;
            if(this.timeRemaining < 0) {
                this.setAsCompleted();
                return Math.abs(this.timeRemaining);
            }
        }
        return deltaT;
    }

    /** Sets this effect as completed and unapply this effect from the entity. This should be called manually if this effect is not timed. */
    public setAsCompleted(): void {
        if(!this.completed) {
            super.setAsCompleted();
            if(this.effectState === 'Currently Applying') this.unapplyEffect(this.appliedEntity);
            this.effectState = "Done Applying And Reverted";
        }
    }

    /** Unapply the effect that was applied at the beginning. This should not be called manually to unapply this effect, call setAsCompleted() instead.
     * @param entity The entity that will be reverted.
     * @returns True if the effect is unapplied. False otherwise.
     */
    protected unapplyEffect(entity?: Entity | undefined): boolean {
        return false;
    }
}