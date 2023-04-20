import Entity from "../../gameobjs/Entity";
import Effect from "../Effect";
import { type } from '@colyseus/schema';

export default class ContinuousEffect extends Effect {
    /** The total time that is left before this effect completes. */
    @type('number') timeRemaining: number = 0;
    /** The number of seconds before the effect is applied again. */
    @type('number') tickRate: number = 1;
    /** The number of seconds before the next tick. */
    @type('number') timeUntilNextTick: number = 0;
    /** The ticks that have not been processed. This number will increment everytime timeUntilNextTick reaches zero. */
    ticksQueued: number = 0;

    constructor() {
        super();
        this.name = "ContinuousEffect";
        this.description = "Effect that apply continuously";
    }

    /**
     * Updates this continuous effect. This Effect will modify the entity in stages.
     * If no entity is provided it will queue up the effects to be applied later. 
     * This effect will be flagged as completed if timeRemaining reaches zero.
     */
    public update(deltaT: number, entity?: Entity | undefined): void {
        this.timeRemaining -= deltaT;
        this.timeUntilNextTick -= deltaT;
        // Queue up the effect.
        if(this.timeUntilNextTick <= 0 && !this.completed) {
            this.timeUntilNextTick += this.tickRate;
            this.ticksQueued++;
        }
        if(entity) {
            // Apply the effect if it is queued.
            if(this.ticksQueued > 0) {
                if(this.applyEffect(entity)) {
                    this.ticksQueued--;
                }
            }
        }
        if(this.timeRemaining <= 0) this.completed = true;
    }
}
