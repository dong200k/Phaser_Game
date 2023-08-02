import Stat from "../../../gameobjs/Stat";
import { Data, status } from "./Data";
import {type} from "@colyseus/schema"

export default class SkillData extends Data{
    @type(Stat) stat: Stat
    @type('string') name
    @type('string') description
    @type('number') coinCost
 
    constructor(stat?: Stat, name: string = "Name", description: string = "Description", coinCost: number = 0, status: status="none"){
        super()
        this.stat = stat? stat : Stat.getZeroStat()
        this.name = name
        this.description = description
        this.coinCost = coinCost
        this.status = status
    }
}