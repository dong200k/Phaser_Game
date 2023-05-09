import { Schema, type } from "@colyseus/schema";
import Node from "./Node/Node";
import Stat from "../gameobjs/Stat";

export default class StatTree<DataType> extends Schema{
    @type(Node) root
    @type(Stat) totalStat: Stat
    @type('string') name

    constructor(root?: Node<DataType>, name: string = "name", description: string = "description"){
        super()
        this.root = root
        this.totalStat = Stat.getZeroStat()
        this.name = name
    }
}