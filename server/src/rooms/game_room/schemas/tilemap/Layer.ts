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
        tileIdArray.forEach((tileId, idx) => {
            this.tiles.push(new Tile(tileId, tileWidth, tileHeight,(idx % this.width) * tileWidth, Math.floor(idx / this.height) * tileHeight));
        })
    }

    public getTileAt(tileX:number,tileY:number):Tile|null {
        if(tileX < 0 || tileX >= this.width || tileY < 0 || tileY >= this.height) return null;
        return this.tiles[(tileY * this.width) + tileX];
    }
}