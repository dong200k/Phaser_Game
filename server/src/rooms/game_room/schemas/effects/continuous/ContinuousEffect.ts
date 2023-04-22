import MathUtil from "../../../../../util/MathUtil";
import Entity from "../../gameobjs/Entity";
import Effect from "../Effect";
import { type } from '@colyseus/schema';

export default class ContinuousEffect extends Effect {
    /** The total time that is left before this effect completes. */
    @type('number') timeRemaining: number;
    /** The number of seconds before the effect is applied again. */
    @type('number') tickRate: number = 1;
    /** The number of seconds before the next tick. */
    @type('number') timeUntilNextTick: number = 1;
    /** The amount of times this effect will tick. */
    @type('number') tickCount: number;
    /** The ticks that have not been processed. This number will increment everytime timeUntilNextTick reaches zero. */
    ticksQueued: number = 0;

    /**
     * Creates a continuous effect that will apply its effect over a period of time. 
     * @param timeRemaining Time it will take for this effect to complete. Must be an positive integer (decimals will be rounded).                 
     * @param tickCount The amount of times this effect will tick. Must be an positve integer (decimals will be rounded).
     */
    constructor(timeRemaining:number=5, tickCount:number=10) {
        super();
        this.name = "ContinuousEffect";
        this.description = "Effect that apply continuously";
        this.timeRemaining = Math.max(1, Math.round(timeRemaining));
        this.tickCount = Math.max(1, Math.round(tickCount));
        // Calculate tick rate 
        this.tickRate = this.calculateTickRate(this.timeRemaining, this.tickCount);
        this.timeUntilNextTick = this.tickRate;
    }

    /**
     * Calculates the tickRate based on the total time and tick count.
     * @param totalTime The total time.
     * @param tickCount The amount of ticks that will occur during the provided total time.
     */
    private calculateTickRate(totalTime: number, tickCount: number) {
        return totalTime / tickCount;
    }

    /**
     * Updates this continuous effect. This Effect will modify the entity in stages.
     * If no entity is provided it will queue up the effects to be applied later. 
     * This effect will be flagged as completed if timeRemaining reaches zero.
     */
    public update(deltaT: number, entity?: Entity | undefined): number {
        this.timeRemaining -= deltaT;
        this.timeUntilNextTick -= deltaT;
        // Queue up the effect.
        while(this.timeUntilNextTick <= 0 && !this.completed) {
            this.timeUntilNextTick += this.tickRate;
            this.ticksQueued++;
        }
        if(entity) {
            // Apply the effect if it is queued.
            while(this.ticksQueued > 0) {
                this.applyEffect(entity);
                this.ticksQueued--;
                this.tickCount--;
            }
        }
        // If the effect has finished, perform any remaining ticks and mark this effect as completed.
        if(this.timeRemaining <= 0) {
            if(entity) {
                while(this.tickCount > 0) {
                    this.tickCount--;
                    this.applyEffect(entity);
                }
            }
            this.setAsCompleted();
        }
        if(this.timeRemaining < 0) return Math.abs(this.timeRemaining);
        else return 0;
    }

    public toString(): string {
       return `${super.toString()}(tickRate: ${this.tickRate}, timeLeft: ${MathUtil.roundDecimal(this.timeRemaining, 2)}, timeTillNextTick: ${MathUtil.roundDecimal(this.timeUntilNextTick, 2)})`;
    }
}
