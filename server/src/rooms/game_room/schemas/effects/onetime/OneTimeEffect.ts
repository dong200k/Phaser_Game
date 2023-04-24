import Entity from "../../gameobjs/Entity";
import Effect from "../Effect";

/**
 * A one time effect will apply its effect to the entity once. 
 * If no entity is provided or if the effect is not applied for any other reason, this effect will not be marked as completed.
 */
export default abstract class OneTimeEffect extends Effect {
    
    constructor() {
        super();
        this.setName("OneTimeEffect");
        this.setDescription("One Time Effect");
    }

    public update(deltaT: number): number {
        let entity = this.getEntity();
        if(deltaT > 0 && entity && this.applyEffect(entity))
            this.setAsCompleted();
        return deltaT;
    }

    public abstract applyEffect(entity: Entity): boolean;
    protected onComplete(): void {}
    protected onAddToEntity(entity: Entity): void {}
    protected onRemoveFromEntity(): void {}
}