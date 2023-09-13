import WeaponUpgradeTree from "../../Trees/WeaponUpgradeTree";
import Entity from "../../gameobjs/Entity";
import Player from "../../gameobjs/Player";
import TempEffect from "./TempEffect";

export default class PiercingEffect extends TempEffect {

    private piercing: number
    private tree: WeaponUpgradeTree
    /**
     * Creates a effect to make player's artifact/weapons projectiles pierce targets by modifying weapon's pierce stat.
     * @param isTimed Is this effect timed or not.
     * @param totalTime The time that will pass before this effect is unapplied.
     */
    constructor(tree: WeaponUpgradeTree, isTimed?:boolean, totalTime?:number, piercing: number = 2) {
        super(isTimed, totalTime);
        this.piercing = piercing
        this.tree = tree
    }

    public applyEffect(player: Player): boolean {
        // console.log("applying piercing effect", this.piercing)
        this.tree.addPiercing(this.piercing)
        return true;
    }

    /** Note: can cause issues if piercing is modified by external source such as an weapon upgrade */
    protected unapplyEffect(player: Player): boolean {
        // console.log("unapplying piercing effect", this.piercing)
        this.tree.addPiercing(-this.piercing)
        return true;
    }
}