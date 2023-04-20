import { Schema, type } from "@colyseus/schema";
import Node from "./Node/Node";
import BaseWeapon from "../gameobjs/BaseWeapon";
import Stat from "../gameobjs/Stat";
import Tree from "./Tree";
import WeaponData from "./Node/Data/WeaponData";

export default class WeaponUpgradeTree extends Tree<WeaponData>{
    @type('string') currentWeaponId?: string
    @type(Stat) totalStat?: Stat

    constructor(root?: Node<WeaponData>, weaponId: string = "demo_hero"){
        super(root)
    }

    // setRoot(root: Node<WeaponData>){
    //     this.root = root
    //     this.totalStat = Object.assign({}, root.data.stat)
    //     this.root.data.status = "selected"

    //     // ***TODO*** create weapon corresponding to this weaponId
    //     this.currentWeaponId = root.data.weaponId
    // }
}