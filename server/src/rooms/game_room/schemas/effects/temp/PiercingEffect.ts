import Entity from "../../gameobjs/Entity";
import Player from "../../gameobjs/Player";
import TempEffect from "./TempEffect";

export default class PiercingEffect extends TempEffect {

    private piercing: number
    private originalPiercing: number
    /**
     * Creates a effect to make player's projectiles pierce targets by modifying weapon's pierce stat.
     * @param isTimed Is this effect timed or not.
     * @param totalTime The time that will pass before this effect is unapplied.
     */
    constructor(isTimed?:boolean, totalTime?:number, piercing: number = 2, originalPiercing: number = 1) {
        super(isTimed, totalTime);
        this.piercing = piercing
        this.originalPiercing = originalPiercing
    }

    public applyEffect(player: Player): boolean {
        player.weaponUpgradeTree.setPiercing(10)
        return true;
    }

    /** Note: can cause issues if piercing is modified by external source such as an weapon upgrade */
    protected unapplyEffect(player: Player): boolean {
        player.weaponUpgradeTree.setPiercing(this.originalPiercing)
        return true;
    }
}