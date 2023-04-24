import MathUtil from "../../../../../util/MathUtil";
import Entity from "../../gameobjs/Entity";
import Effect from "../Effect";
import { type } from '@colyseus/schema';

export default abstract class ContinuousEffectUntimed extends Effect {
    
    /** The number of seconds before the effect is applied again. */
    @type('number') private tickRate: number;
    /** The number of seconds before the next tick. */
    @type('number') private timeUntilNextTick: number = 1;
    /** The ticks that have not been processed. This number will increment everytime timeUntilNextTick reaches zero. */
    private ticksQueued: number = 0;

    /**
     * Creates a continuous effect that will apply its effect based on a tickRate until manually stopped through the setAsCompleted() method.
     * @param tickRate The time in seconds it will take to apply the effect once. This number must be at least 0.05. 
     */
    constructor(tickRate:number=1) {
        super();
        this.setName("ContinuousEffect");
        this.setDescription("Effect that apply continuously");
        if(tickRate < 0.05) throw new RangeError("tickRate out of range, must be >= 0.05");
        this.tickRate = tickRate;
        this.timeUntilNextTick = this.tickRate;
    }

    /**
     * Updates this continuous effect. This Effect will modify the entity in stages.
     * If no entity is provided it will queue up the effects to be applied later. 
     * This effect will be flagged as completed if timeRemaining reaches zero.
     */
    public update(deltaT: number): number {
        this.timeUntilNextTick -= deltaT;
        let entity = this.getEntity();
        // Queue up the effect.
        while(this.timeUntilNextTick <= 0 && !this.isCompleted()) {
            this.timeUntilNextTick += this.tickRate;
            this.ticksQueued++;
        }
        if(entity) {
            // Apply the effect if it is queued.
            while(this.ticksQueued > 0) {
                this.applyEffect(entity);
                this.ticksQueued--;
            }
        }
        return 0;
    }

    public toString(): string {
       return `${super.toString()}(tickRate: ${this.tickRate}, timeTillNextTick: ${MathUtil.roundDecimal(this.timeUntilNextTick, 2)})`;
    }

    public abstract applyEffect(entity: Entity): boolean;
    protected onComplete(): void {}
    protected onAddToEntity(entity: Entity): void {}
    protected onRemoveFromEntity(): void {
        this.setAsCompleted();
    }
}