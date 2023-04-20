import Stat from "../../../gameobjs/Stat";
import BaseWeapon from "../../../gameobjs/BaseWeapon";
import { Data } from "./Data";
import {type} from "@colyseus/schema"

export default class WeaponData extends Data{
    @type(Stat) stat: Stat
    @type('string') name
    @type('string') description
    @type('string') weaponId?

    constructor(weaponId?: string, stat?: Stat, name: string = "Upgrade Name", description: string = "Upgrade Description"){
        super()
        this.stat = stat? stat : Math.random()<0.5? Stat.getZeroStat() : Stat.getDefaultPlayerStat()
        this.name = name
        this.description = description

        // ***TODO*** create weapon corresponding to this weaponId
        this.weaponId = weaponId
    }
}