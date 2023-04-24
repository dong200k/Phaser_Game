import Entity from "../../gameobjs/Entity";
import ContinuousEffect from "./ContinuousEffect";
import { type } from "@colyseus/schema";

export default class ContinuousHPEffect extends ContinuousEffect {
    @type("number") private hpPerTick = 1;
    private totalHp: number;


    constructor(timeRemaining?:number, tickCount?:number, totalHp:number=100) {
        super(timeRemaining, tickCount);
        this.setName("ContinuousHPEffect");
        this.setDescription("Continuous changes hp over time.");
        this.totalHp = totalHp;
        this.hpPerTick = totalHp / this.getTickCount();
    }

    public applyEffect(entity: Entity): boolean {
        entity.stat.hp += this.hpPerTick;
        return true;
    }

    public toString(): string {
        return `${super.toString()}(hpPerTick: ${this.hpPerTick})`;
    }
}
