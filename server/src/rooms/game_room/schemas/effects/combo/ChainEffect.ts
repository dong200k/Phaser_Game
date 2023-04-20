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
        if(effect) {
            if(Array.isArray(effect)) 
                effect.forEach((e) => this.effects.push(e));
            else 
                this.effects.push(effect);
        }
    }

    public update(deltaT: number, entity?: Entity | undefined): number {
        let timeRemaining = deltaT;
        //chain run effects until all the timeRemaining has been used.
        while(timeRemaining > 0 && this.effects.length > 0) {
            let currentEffect = this.effects.at(0);
            timeRemaining = currentEffect.update(timeRemaining, entity);
            if(currentEffect.isCompleted()) this.effects.shift();
        }
        //check if the effects is empty at the end.
        if(this.effects.length === 0) this.completed = true;
        return Math.max(timeRemaining, 0);
    }
}
