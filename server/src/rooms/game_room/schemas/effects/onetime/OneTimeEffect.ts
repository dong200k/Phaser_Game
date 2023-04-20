import Entity from "../../gameobjs/Entity";
import Effect from "../Effect";

/**
 * A one time effect will apply its effect to the entity once. 
 * If no entity is provided or if the effect is not applied for any other reason, this effect will not be marked as completed.
 */
export default class OneTimeEffect extends Effect {

    constructor() {
        super();
        this.name = "OneTimeEffect";
        this.description = "One Time Effect";
    }

    public update(deltaT: number, entity?: Entity | undefined): number {
        if(this.applyEffect(entity))
            this.setAsCompleted();
        return deltaT;
    }
}