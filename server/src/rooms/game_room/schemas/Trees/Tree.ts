import { Schema, type } from "@colyseus/schema";
import Node from "./Node/Node";

export default class Tree<DataType> extends Schema{
    @type(Node) root

    constructor(root?: Node<DataType>){
        super()
        this.root = root
    }
}