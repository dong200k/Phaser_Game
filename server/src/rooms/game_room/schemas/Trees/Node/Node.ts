import { Schema, ArraySchema, type } from "@colyseus/schema";
import { Data } from "./Data/Data";

export default class Node<DataType> extends Schema{
    @type([Node]) children = new ArraySchema<Node<DataType>>();
    @type(Data) data;

    constructor(data: DataType){
        super()
        this.data = data;
    }
}