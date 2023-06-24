import {Schema, type} from "@colyseus/schema"

export type status = "selected" | "skipped" | "none"

export class Data extends Schema{
    @type('string') status: status
    /** Order that this node was selected, zero indexed */
    @type('number') selectionTime?: number

    constructor(status: status = "none", selectionTime?: number){
        super()
        this.status = status
        this.selectionTime = selectionTime
    }

    /** sets status of the data and also sets the selectionTime, which can be used to replay/reselect the upgrades in the tree as the order matters in some cases. */
    setStatus(status: status){
        this.status = status

        if(status === "selected"){
            this.selectionTime = Date.now()
        }
    }
}
