import { ArraySchema, Schema, type } from "@colyseus/schema";
import Node from "./Node/Node";
import Stat from "../gameobjs/Stat";
import Effect from "../effects/Effect";

export default class StatTree<DataType> extends Schema{
    /** Used to track order nodes were selected. 
     *  @description Note: this is Static because only relative order matters, so as long as later selected nodes 
     *  have higher selectionIndex its all good. This allows the counter to be used for multiple trees */
    static selectionCounter = 0

    @type(Node) root
    @type(Stat) totalStat: Stat
    @type('string') name
    @type('string') description
    /** Id of StatEffects so they can be removed when the tree is unequipped */
    statEffectIds: string[] = []
    
    constructor(root?: Node<DataType>, name: string = "name", description: string = "description"){
        super()
        this.root = root
        this.totalStat = Stat.getZeroStat()
        this.name = name
        this.description = description
    }

    /** Resets the tree so it can be reused */
    reset(){
        this.root = undefined
        /** Inplace multiplication */
        this.totalStat.mul(0)
        this.name = "name"
        this.description = "description"
        while(this.statEffectIds) this.statEffectIds.pop()
    }
}