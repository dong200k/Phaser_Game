import Entity from "../../gameobjs/Entity";
import { type } from "@colyseus/schema";
import TempEffect from "./TempEffect";

export default class SpeedMultiEffect extends TempEffect {

    /** The speed multipler is applied to the entity. */
    @type('number') private speedMultiplier;

    private speedGained = 0

    /**
     * Creates a speed multiplier effect.
     * @param speedMultiplier The speed multipler that will be applied to the entity.
     * @param isTimed Is this effect timed or not.
     * @param totalTime The time that will pass before this effect is unapplied (in secs).
     */
    constructor(speedMultiplier:number, isTimed?:boolean, totalTime?:number) {
        super(isTimed, totalTime);
        if(speedMultiplier <= 0) throw new Error("speedMultipler out of range, must be greater than 0.");
        this.speedMultiplier = speedMultiplier;
    }

    public applyEffect(entity:Entity): boolean {
        this.speedGained = entity.stat.speed * this.speedMultiplier - entity.stat.speed
        entity.stat.speed += this.speedGained;
        // Slowed entity will display a status icon.
        if(this.speedGained < 0) {
            // entity.statusIcon.showStatusIcon("slow_icon", this.timeRemaining);
        }
        return true;
    }

    protected unapplyEffect(entity:Entity): boolean {
        entity.stat.speed -= this.speedGained
        return true;
    }
}