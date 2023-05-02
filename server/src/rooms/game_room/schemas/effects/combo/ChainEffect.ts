import Entity from "../../gameobjs/Entity";
import Effect from "../Effect";
import { type, ArraySchema } from '@colyseus/schema';

/** Chain effects are used to run effects one after another. E.g. drinking two regen potion will cause one potion's effect to 
 * run and after that finishes, the next potion's effect will run.
 */
export default class ChainEffect extends Effect{
    
    
    @type([Effect]) effects = new ArraySchema<Effect>();

    constructor(effect?: Effect | Effect[]) {
        super();
        this.addEffect(effect);
    }

    public addEffect(effect?: Effect | Effect[]) {
        let entity = this.getEntity();
        if(effect) {
            if(Array.isArray(effect)) {
                effect.forEach((e) => { 
                    this.effects.push(e);
                    if(entity) e.addToEntity(entity);
                });
            }
            else {
                this.effects.push(effect);
                if(entity) effect.addToEntity(entity);
            }
        }
    }

    public addToEntity(entityOwner: Entity) {
        super.addToEntity(entityOwner);
        this.effects.forEach((e) => {
            e.addToEntity(entityOwner);
        })
    }

    public removeFromEntity() {
        if(this.getEntity()) {
            this.effects.forEach((e) => {
                e.removeFromEntity();
            })
            super.removeFromEntity();
        }
    }

    public update(deltaT: number): number {
        let timeRemaining = deltaT;
        //chain run effects until all the timeRemaining has been used.
        while(timeRemaining > 0 && this.effects.length > 0) {
            let currentEffect = this.effects.at(0);
            timeRemaining = currentEffect.update(timeRemaining);
            if(currentEffect.isCompleted()) this.effects.shift();
        }
        //check if the effects is empty at the end.
        if(this.effects.length === 0) this.setAsCompleted();
        return Math.max(timeRemaining, 0);
    }

    public applyEffect(entity: Entity): boolean {return false;}
    protected onComplete(): void {}
    protected onAddToEntity(entity: Entity): void {}
    protected onRemoveFromEntity(): void {}
    protected onReset(): void {
        //TODO
    }
}
