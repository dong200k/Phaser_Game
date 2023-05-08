import Entity from "../../gameobjs/Entity";
import Effect from "../Effect";
import { type } from "@colyseus/schema";

type EffectStateType = "Haven't Applied" | "Currently Applying" | "Done Applying And Reverted";

export default abstract class TempEffect extends Effect {
    
    /** Timed effect are ended by a timer. Non timed effect are ended manually. */
    @type("boolean") private isTimed;
    /** The time that is remaining before this effect ends. */
    @type("number") private timeRemaining;
    /** The state the effect is in. Either the effect hasn't been applied, it is currently being applied, or it has finished applied and is reverted. */
    @type("string") private effectState: EffectStateType = "Haven't Applied";

    private defaultTimeRemaining: number;
    private defaultIsTimed: boolean;

    /**
     * Creates a temp effect.
     * @param isTimed Is this effect timed or not. Non timed effects needs to be reverted manually, by calling setAsCompleted().
     * @param totalTime The time before this effect automatically reverts. Must be an positive integer (decimals will be rounded).   
     */
    constructor(isTimed:boolean=true, totalTime:number=5) {
        super();
        this.isTimed = isTimed;
        this.timeRemaining = Math.max(1, Math.round(totalTime));
        this.defaultTimeRemaining = this.timeRemaining;
        this.defaultIsTimed = this.isTimed;
    }

    public update(deltaT: number): number {
        let entity = this.getEntity();
        // Apply the effect once in the beginning.
        if(this.effectState === "Haven't Applied" && entity) {
            if(this.applyEffect(entity)) {
                this.effectState = "Currently Applying";
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
        if(!this.isCompleted()) {
            super.setAsCompleted();
            let entity = this.getEntity();
            if(this.effectState === 'Currently Applying') {
                if(entity)
                    this.unapplyEffect(entity);
                else 
                    console.log("ERROR: entity should not be empty in TempEffect.");
            } 
            this.effectState = "Done Applying And Reverted";
        }
    }

    /** Unapply the effect that was applied at the beginning. This should not be called manually to unapply this effect, call setAsCompleted() instead.
     * @param entity The entity that will be reverted.
     * @returns True if the effect is unapplied. False otherwise.
     */
    protected abstract unapplyEffect(entity: Entity): boolean;

    public reset(): boolean {
        if(this.getEntity() !== null) return false;
        this.timeRemaining = this.defaultTimeRemaining;
        this.isTimed = this.defaultIsTimed;
        this.effectState = "Haven't Applied";
        super.reset();
        return true;
    }

    protected onComplete(): void {}
    protected onAddToEntity(entity: Entity): void {}
    protected onRemoveFromEntity(): void {
        if(!this.isCompleted()) {
            this.setAsCompleted();
        }
    }
    protected onReset(): void {}
}