import Node from "./Node/Node";
import StatTree from "./StatTree";
import WeaponData from "./Node/Data/WeaponData";
import Player from "../gameobjs/Player";
import Effect from "../effects/Effect";
import { type, ArraySchema } from '@colyseus/schema';

/** Currently acts as a weapon upgrade and artifact upgrade tree */
export default class WeaponUpgradeTree extends StatTree<WeaponData>{
    @type('string') weaponId
    /** List of effects that are selected (not all of these are active, for active effects look on the entity who is equiping this tree) */
    @type([Effect]) effects = new ArraySchema<Effect>();

    owner!: Player

    constructor(owner?: Player, root?: Node<WeaponData>, name: string = "name", description: string = "description"){
        super(root, name, description)
        this.weaponId = root?.data.weaponId
        if(owner) this.setOwner(owner)
    }

    setWeapon(weaponId: string){
        this.weaponId = weaponId
    }

    setOwner(owner: Player){
        this.owner = owner
    }

    /** Resets the tree so it can be reused by the same player 
     * Note: this is mainly for Artifacts since every player only has 1 WeaponUpgrade Tree but multiple Artifact Upgrade trees
    */
    reset(){
        super.reset()
        this.weaponId = undefined
        while(this.effects) this.effects.pop()
        return this
    }
}