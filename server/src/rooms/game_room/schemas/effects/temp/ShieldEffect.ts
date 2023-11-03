import Entity from "../../gameobjs/Entity";
import { type } from "@colyseus/schema";
import TempEffect from "./TempEffect";
import Stat from "../../gameobjs/Stat";

export default class ShieldEffect extends TempEffect {

    /** Health of the shield */
    @type('number') private shieldHealth: number;

    private speedGained = 0

    /**
     * Creates a shield effect.
     * @param shieldHealth The health of the shield
     * @param isTimed Is this effect timed or not.
     * @param totalTime The time that will pass before this effect is unapplied (in secs).
     */
    constructor(shieldHealth: number, isTimed?:boolean, totalTime?:number) {
        super(isTimed, totalTime);
        this.shieldHealth = shieldHealth
    }

    public applyEffect(entity:Entity): boolean {
        entity.stat.add(new Stat({shieldHp: this.shieldHealth, shieldMaxHp: this.shieldHealth}))
        return true;
    }

    /** When shield is removed shieldMaxHp reduced and shieldHp is reduced if there is an overflow. This is to account for multiple shields. */
    protected unapplyEffect(entity:Entity): boolean {
        entity.stat.sub(new Stat({shieldMaxHp: this.shieldHealth}))
        return true;
    }
}