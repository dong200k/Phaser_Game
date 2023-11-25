import Entity from "../../gameobjs/Entity";
import CollisionImmuneEffect from "./CollisionImmuneEffect";

export default class PhantomEffect extends CollisionImmuneEffect {

    private prevAlpha = 1
    /**
     * Creates a effect to make entity immune to all collisions and make them transparent.
     * @param isTimed Is this effect timed or not.
     * @param totalTime The time that will pass before this effect is unapplied.
     */
    constructor(isTimed?:boolean, totalTime?:number) {
        super(isTimed, totalTime);
    }

    public applyEffect(entity:Entity): boolean {
        super.applyEffect(entity)
        this.prevAlpha = entity.alpha
        entity.alpha = 0.1

        return true
    }

    protected unapplyEffect(entity:Entity): boolean {
        super.unapplyEffect(entity)
        entity.alpha = this.prevAlpha

        return true;
    }
}