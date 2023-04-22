import Entity from "../../gameobjs/Entity";
import { type } from "@colyseus/schema";
import ContinuousEffectUntimed from "./ContinuousEffectUntimed";

export default class ContinuousHPEffectUntimed extends ContinuousEffectUntimed {
    @type("number") hpPerTick;

    /**
     * Creates a continusous hp effect that will have to be stopped manually through setAsCompleted().
     * @param tickRate The time in seconds it will take to apply the effect once. This number must be at least 0.05.
     * @param hpPerTick The hp change that will be applied to an entity pertick. Default to 1.
     */
    constructor(tickRate?:number, hpPerTick:number=1) {
        super(tickRate);
        this.name = "ContinuousHPEffect";
        this.description = "Continuous changes hp over time.";
        this.hpPerTick = hpPerTick;
    }

    public applyEffect(entity?: Entity | undefined): boolean {
        if(entity) {
            entity.stat.hp += this.hpPerTick;
            return true;
        } 
        return false;
    }

    public toString(): string {
        return `${super.toString()}(hpPerTick: ${this.hpPerTick})`;
    }
}
