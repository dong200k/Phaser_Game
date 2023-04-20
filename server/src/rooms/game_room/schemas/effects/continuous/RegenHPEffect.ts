import ContinuousEffect from "./ContinuousEffect";
import { type } from "@colyseus/schema";

export default class RegenHPEffect extends ContinuousEffect {
    @type("number") hpPerTick = 1;

    constructor(hpPerTick?:number) {
        super();
        this.name = "RegenHPEffect";
        this.description = "Regenerates hp over time.";
        if(hpPerTick !== undefined) this.hpPerTick = hpPerTick;
    }

}
