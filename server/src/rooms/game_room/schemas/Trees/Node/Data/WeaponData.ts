import Effect from "../../../effects/Effect";
import Stat from "../../../gameobjs/Stat";
import { Data } from "./Data";
import {type} from "@colyseus/schema"

export default class WeaponData extends Data{
    @type(Stat) stat: Stat
    @type('string') name
    @type('string') description
    @type('string') weaponId?
    /** Effect of the node, could be a weapon's attack or other logic like passive */
    @type(Effect) effect?: Effect  

    constructor(weaponId?: string, stat?: Stat, name: string = "Upgrade Name", description: string = "Upgrade Description"){
        super()
        this.stat = stat? stat : Stat.getZeroStat()
        this.name = name
        this.description = description

        // ***TODO*** create weapon corresponding to this weaponId
        this.weaponId = weaponId
    }
}