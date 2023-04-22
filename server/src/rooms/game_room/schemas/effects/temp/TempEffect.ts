import Entity from "../../gameobjs/Entity";
import Effect from "../Effect";
import { type } from "@colyseus/schema";

type EffectStateType = "Haven't Applied" | "Currently Applying" | "Done Applying And Reverted";

export default class TempEffect extends Effect {
    /** Timed effect are ended by a timer. Non timed effect are ended manually. */
    @type("boolean") isTimed = true;
    /** The time that is remaining before this effect ends. */
    @type("number") timeRemaining = 5;
    /** The state the effect is in. Either the effect hasn't been applied, it is currently being applied, or it has finished applied and is reverted. */
    @type("string") effectState: EffectStateType = "Haven't Applied";

    public update(deltaT: number, entity?: Entity | undefined): number {
        // Apply the effect once in the beginning.
        if(this.effectState === "Haven't Applied") {
            this.applyEffect(entity);
            this.effectState = "Currently Applying";
        }
        // Timed effects will automatically end when timeRemaining reaches zero.
        if(this.isTimed) {
            this.timeRemaining -= deltaT;
            if(this.timeRemaining < 0) {
                if(this.effectState === "Currently Applying") {
                    this.unapplyEffect(entity);
                    this.effectState = "Done Applying And Reverted";
                    this.setAsCompleted();
                }
                return Math.abs(this.timeRemaining);
            }
        }
        return 0;
    }

    /** Unapply the effect that was applied at the beginning. This will be called automatically if this TempEffect is timed, otherwise it should be 
     * called manually when this effect is completed. 
     * @param entity The entity that will be reverted.
     */
    public unapplyEffect(entity?: Entity | undefined) {}
}