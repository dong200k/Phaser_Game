import Effect from "../../../effects/Effect";
import Stat from "../../../gameobjs/Stat";
import UpgradeEffect from "../../../gameobjs/UpgradeEffect";
import { Data } from "./Data";
import {type} from "@colyseus/schema"

export default class WeaponData extends Data{
    @type(Stat) stat: Stat
    @type('string') name
    @type('string') description
    @type('string') weaponId?
    /** Holds effect logic data of node from the react-frontend */
    @type(UpgradeEffect) upgradeEffect?

    constructor(weaponId?: string, stat?: Stat, upgradeEffect?: UpgradeEffect, name: string = "Upgrade Name", description: string = "Upgrade Description"){
        super()
        this.stat = stat? stat : Stat.getZeroStat()
        this.name = name
        this.description = description
        this.upgradeEffect = upgradeEffect

        // ***TODO*** create weapon corresponding to this weaponId
        this.weaponId = weaponId
    }
}