import {Schema, type} from "@colyseus/schema"
import { stat } from "fs"

export type status = "selected" | "skipped" | "none"

export class Data extends Schema{
    @type('string') status: status

    constructor(status: status = "none"){
        super()
        this.status = status
    }

    setStatus(status: status){
        this.status = status
    }
}
