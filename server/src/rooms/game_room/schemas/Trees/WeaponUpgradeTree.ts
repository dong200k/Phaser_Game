import { type } from "@colyseus/schema";
import Node from "./Node/Node";
import StatTree from "./StatTree";
import WeaponData from "./Node/Data/WeaponData";

export default class WeaponUpgradeTree extends StatTree<WeaponData>{
    @type('string') weaponId

    constructor(root?: Node<WeaponData>, name: string = "name", description: string = "description"){
        super(root, name, description)
        this.weaponId = root?.data.weaponId
    }

    setWeapon(weaponId: string){
        this.weaponId = weaponId
    }
}