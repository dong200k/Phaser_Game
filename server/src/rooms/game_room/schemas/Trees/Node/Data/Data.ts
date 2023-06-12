import {Schema, type} from "@colyseus/schema"
import StatTree from "../../StatTree"

export type status = "selected" | "skipped" | "none"

export class Data extends Schema{
    @type('string') status: status
    /** Order that this node was selected, zero indexed */
    @type('number') selectionIndex?: number

    constructor(status: status = "none"){
        super()
        this.status = status
    }

    /** sets status of the data and also increments selectionIndex properly if the node is selected */
    setStatus(status: status){
        this.status = status

        if(status === "selected"){
            this.selectionIndex = StatTree.selectionCounter
            StatTree.selectionCounter += 1
        }
    }
}
