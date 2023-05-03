import { Cloneable } from "../../../../util/PoolUtil";
import Entity from "../gameobjs/Entity";
import { Schema, type } from '@colyseus/schema';

/**
 * Effect are used to manipulate the Entity object. Effects themselves contain the logic to 
 * manipluate the entity; they are updated via the update() method.
 */
export default abstract class Effect extends Schema implements Cloneable {
    @type('string') private name:string = "Effect";
    @type('string') private description:string = "Base Effect";
    @type('boolean') private completed:boolean = false;

    private entity: Entity | null = null;

    /**
     * Updates this effect by deltaT. Providing an entity will allow this effect to modify the entity directly.
     * @param deltaT The time that passed since the last update in seconds.
     * @returns The deltaT that was not used to process this effect. (E.g. If a regen effect has only 0.003s left but deltaT was 0.016s, then 0.013s is returned.)
     */
    public abstract update(deltaT: number): number;

    /**
     * Applies the effect to the entity. This will be called automatically by the update method.
     * @param entity The entity that will be modified
     * @returns True if the effect is applied, false otherwise
     */
    public abstract applyEffect(entity:Entity): boolean;

    /**
     * Initialize this effect to prep it for updates on an entity.
     * Note: This should be called by the EffectManager (you can also call this if you know what you are doing). Afterwards the update
     * method will be repeatly called.
     * @param entityOwner The entity that this effect will be added to.
     */
    public addToEntity(entityOwner: Entity) {
        this.entity = entityOwner;
        this.onAddToEntity(this.entity);
    }

    /**
     * Called to remove this effect from its assigned entity (this is the entity that was used when calling addToEntity()). 
     * Doing so, setAsCompleted() and onRemoveFromEntity() would be called automatically.
     * Note: This should be called by the EffectManager. 
     */
    public removeFromEntity() {
        if(this.entity !== null) {
            this.onRemoveFromEntity();
            this.entity = null;
        }
    }

    /**
     * Checks if this effect has been completed or not.
     * Completed effects can be safely removed with the EffectsManager.
     * @returns is completed
     */
    public isCompleted() {
        return this.completed;
    }

    /** Sets this effect as completed. */
    public setAsCompleted() {
        this.completed = true;
        this.onComplete();
    }

    public setName(name: string) {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public getEntity(): Entity | null {
        return this.entity;
    }

    public setDescription(description: string) {
        this.description = description;
    }

    public getDescription(): string {
        return this.description;
    }

    /**
     * Called when you want to reuse an effect. Only works if this effect has no entity assigned to it.
     * 
     * Resets this effect to its original state. removeFromEntity() is automatically called 
     * to remove the entity this effect is connected to. The completed flag will reset to false.
     * @returns True if this effect has been sucessfully reset. False otherwise.
     */
    public reset(): boolean {
        if(this.entity !== null) return false;
        this.completed = false;
        this.onReset();
        return true;
    }

    // -------- Effect lifecycle methods -------- //
    /** Called when this effect is completed. */
    protected abstract onComplete(): void;
    /** Called when this effect is added to an entity. */
    protected abstract onAddToEntity(entity: Entity): void;
    /** Called just before this effect is removed from an entity. */
    protected abstract onRemoveFromEntity(): void;
    /** Called after this effect has been reset and its entity has been removed. */
    protected abstract onReset(): void;


    public toString(): string {
        return `Effect [name: ${this.name}, completed: ${this.completed}]`;
    }
}
