import Node from "./Node/Node";
import StatTree from "./StatTree";
import WeaponData from "./Node/Data/WeaponData";
import Player from "../gameobjs/Player";
import Effect from "../effects/Effect";
import { type, ArraySchema } from '@colyseus/schema';
import GameManager from "../../system/GameManager";

/** Currently acts as a weapon upgrade and artifact upgrade tree */
export default class WeaponUpgradeTree extends StatTree<WeaponData>{
    @type('string') weaponId
    /** List of effects that are selected (not all of these are active, for active effects look on the entity who is equiping this tree) */
    @type([Effect]) effects = new ArraySchema<Effect>();
    @type('string') imageKey = ""
    /** Describes what kind of weapon/artifact it is. 
     * 
     * Look at the my-app effectTypes file usageTypes variable to see possible usages. Or just edit a weapon/artifact on my-app and use the ui dropdown. */
    @type('string') usage = ""

    owner?: Player

    /** Amount of enemies the weapon's projectiles can hit before being inactive */
    public piercing: number = 1

    constructor(gameManager?: GameManager, owner?: Player, root?: Node<WeaponData>, name: string = "name", description: string = "description"){
        super(gameManager, root, name, description)
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
        this.owner = undefined;
        while(this.effects.length > 0) this.effects.pop()
        return this
    }

    /** Sets piercing which is the number of targets this weapon's projectiles will hit before going inactive.
     * Careful using this as it may overwrite piercing when you may not want it to
     */
    setPiercing(piercing: number){
        this.piercing = piercing
        // console.log("setting piercing", piercing)
        // console.log(`piercing on weapon is now: ${piercing}`)
    }

    addPiercing(piercing: number){
        this.piercing += piercing
        // console.log(`Adding ${piercing}, piercing is now ${this.piercing}`)
    }

    getPiercing(){
        return this.piercing
    }
}