import { Schema, type, ArraySchema } from '@colyseus/schema';
import Tile from './Tile';

export default class Layer extends Schema {
    @type("number") width: number;
    @type("number") height: number;
    @type("string") name: string;
    @type([Tile]) tiles = new ArraySchema<Tile>();

    constructor(name:string, width:number, height:number) {
        super();
        this.width = width;
        this.height = height;
        this.name = name;
    }

    public populateTiles(tileWidth: number, tileHeight: number, tileIdArray: number[]) {
        tileIdArray.forEach((tileId) => {
            this.tiles.push(new Tile(tileId, tileWidth, tileHeight));
        })
    }
}