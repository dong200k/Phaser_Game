import Entity from "../../gameobjs/Entity";
import ContinuousEffect from "./ContinuousEffect";
import { type } from "@colyseus/schema";

export default class ContinuousHPEffect extends ContinuousEffect {
    @type("number") hpPerTick = 1;

    constructor(timeRemaining?:number, hpPerTick?:number, tickRate?:number) {
        super(timeRemaining, tickRate);
        this.name = "ContinuousHPEffect";
        this.description = "Continuous changes hp over time.";
        if(hpPerTick !== undefined) {
            this.hpPerTick = hpPerTick;
        };
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
