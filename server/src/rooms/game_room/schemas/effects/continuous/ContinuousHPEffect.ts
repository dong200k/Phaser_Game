import Entity from "../../gameobjs/Entity";
import ContinuousEffect from "./ContinuousEffect";
import { type } from "@colyseus/schema";

export default class ContinuousHPEffect extends ContinuousEffect {
    @type("number") hpPerTick = 1;
    totalHp;


    constructor(timeRemaining?:number, tickCount?:number, totalHp:number=100) {
        super(timeRemaining, tickCount);
        this.name = "ContinuousHPEffect";
        this.description = "Continuous changes hp over time.";
        this.totalHp = totalHp;
        this.hpPerTick = totalHp / this.tickCount;
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
