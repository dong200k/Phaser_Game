import Entity from "../gameobjs/Entity";
import { Schema, type } from '@colyseus/schema';

export default class Effect extends Schema {

    @type('string') name:string = "Effect";
    @type('string') description:string = "Base Effect";
    @type('boolean') completed:boolean = false;

    /**
     * Updates this effect by deltaT. Providing an entity will allow this effect to modify the entity directly.
     * @param deltaT The time that passed since the last update
     * @param entity The entity that will be modified
     */
    public update(deltaT: number, entity?: Entity | undefined): void {
        this.completed = true;
    }

    /**
     * Applies the effect to the entity. This will be called automatically by the update method.
     * @param entity The entity that will be modified
     * @returns True if the effect is applied, false otherwise
     */
    public applyEffect(entity?:Entity | undefined): boolean {
        return false;
    }

    /**
     * Checks if this effect has been marked as completed.
     * @returns is completed
     */
    public isCompleted() {
        return this.completed;
    }

    public toString(): string {
        return `Effect [name: ${this.name}]`;
    }
}
