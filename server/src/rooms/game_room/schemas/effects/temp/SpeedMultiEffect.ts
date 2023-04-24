import Entity from "../../gameobjs/Entity";
import { type } from "@colyseus/schema";
import TempEffect from "./TempEffect";

export default class SpeedMultiEffect extends TempEffect {

    /** The speed multipler is applied to the entity. */
    @type('number') private speedMultiplier;

    /**
     * Creates a speed multiplier effect.
     * @param speedMultiplier The speed multipler that will be applied to the entity.
     * @param isTimed Is this effect timed or not.
     * @param totalTime The time that will pass before this effect is unapplied.
     */
    constructor(speedMultiplier:number, isTimed?:boolean, totalTime?:number) {
        super(isTimed, totalTime);
        if(speedMultiplier <= 0) throw new Error("speedMultipler out of range, must be greater than 0.");
        this.speedMultiplier = speedMultiplier;
    }

    public applyEffect(entity?: Entity | undefined): boolean {
        if(entity) {
            entity.stat.speed *= this.speedMultiplier;
            return true;
        }
        return false;
    }

    protected unapplyEffect(entity?: Entity | undefined): boolean {
        if(entity) {
            entity.stat.speed *= 1 / this.speedMultiplier;
            return true;
        }
        return false;
    }
}