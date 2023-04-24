import { Schema, type } from "@colyseus/schema";
import Node from "./Node/Node";
import BaseWeapon from "../gameobjs/Weapon";
import Stat from "../gameobjs/Stat";
import Tree from "./Tree";
import WeaponData from "./Node/Data/WeaponData";

export default class WeaponUpgradeTree extends Tree<WeaponData>{
    @type(Stat) totalStat: Stat

    constructor(root?: Node<WeaponData>){
        super(root)
        this.totalStat = Stat.getZeroStat()
    }
}