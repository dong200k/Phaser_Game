import { Schema, type } from "@colyseus/schema";
import Node from "./Node/Node";
import Stat from "../gameobjs/Stat";

export default class StatTree<DataType> extends Schema{
    @type(Node) root
    @type(Stat) totalStat: Stat

    constructor(root?: Node<DataType>){
        super()
        this.root = root
        this.totalStat = Stat.getZeroStat()
    }
}